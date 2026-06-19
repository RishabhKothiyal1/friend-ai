import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use Google Auth Provider with the Gmail scopes requested
export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/gmail.modify');

// Cash access token in memory as required by the security policy
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Authenticate session initialization list
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Start custom popup Google auth flow
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google access token from Authorization flow.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('OAuth Sign In failed:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Retrieve in-memory cached token
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// Log out active Firebase Auth session
export const logoutGmail = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// Gmail Types interface
export interface GmailMessage {
  id: string;
  threadId: string;
  from: string;
  fromEmail: string;
  subject: string;
  snippet: string;
  date: string;
  timestamp: number;
  body: string;
  isStarred: boolean;
  labelIds: string[];
}

// Base64url safely decode email payloads
const decodeBase64 = (base64UrlStr: string): string => {
  if (!base64UrlStr) return '';
  let base64 = base64UrlStr.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  try {
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    try {
      return atob(base64);
    } catch {
      return 'Could not safely decode message payload data.';
    }
  }
};

// Extract message body text
const getMessageBody = (payload: any): string => {
  if (!payload) return '';
  if (payload.body && payload.body.data) {
    return decodeBase64(payload.body.data);
  }
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body && part.body.data) {
        return decodeBase64(part.body.data);
      }
    }
    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' && part.body && part.body.data) {
        return decodeBase64(part.body.data);
      }
    }
    for (const part of payload.parts) {
      if (part.parts) {
        const nestedBody = getMessageBody(part);
        if (nestedBody) return nestedBody;
      }
    }
  }
  return '';
};

// Fetch list of matching emails with contents
export const fetchGmailEmails = async (
  token: string,
  filter: 'all' | 'inbox' | 'sent' | 'starred' = 'all',
  searchQuery: string = ''
): Promise<GmailMessage[]> => {
  try {
    let q = searchQuery || '';
    if (filter === 'inbox') {
      q = q ? `${q} label:INBOX` : 'label:INBOX';
    } else if (filter === 'sent') {
      q = q ? `${q} label:SENT` : 'label:SENT';
    } else if (filter === 'starred') {
      q = q ? `${q} label:STARRED` : 'label:STARRED';
    }

    const listUrl = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
    listUrl.searchParams.append('maxResults', '15');
    if (q) {
      listUrl.searchParams.append('q', q);
    }

    const listRes = await fetch(listUrl.toString(), {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!listRes.ok) {
      const errText = await listRes.text();
      throw new Error(`Gmail API List failed: ${listRes.status} -> ${errText}`);
    }

    const listData = await listRes.json();
    if (!listData.messages || listData.messages.length === 0) {
      return [];
    }

    // Load detailed contents in parallel
    const detailPromises = listData.messages.map(async (msgStub: { id: string }) => {
      try {
        const detailRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgStub.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!detailRes.ok) return null;
        const msgDetail = await detailRes.json();

        const headers = msgDetail.payload?.headers || [];
        const fromHeader = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
        const subjectHeader = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const dateHeader = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

        // Safely extract email inside brackets if present (e.g., "John Doe <john@gmail.com>")
        let fromEmail = fromHeader;
        const emailMatch = fromHeader.match(/<([^>]+)>/);
        if (emailMatch && emailMatch[1]) {
          fromEmail = emailMatch[1];
        }

        const dateObj = new Date(dateHeader);
        const formattedDate = !isNaN(dateObj.getTime())
          ? dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : dateHeader;

        return {
          id: msgDetail.id,
          threadId: msgDetail.threadId,
          from: fromHeader,
          fromEmail,
          subject: subjectHeader,
          snippet: msgDetail.snippet || '',
          date: formattedDate,
          timestamp: !isNaN(dateObj.getTime()) ? dateObj.getTime() : Date.now(),
          body: getMessageBody(msgDetail.payload),
          isStarred: msgDetail.labelIds?.includes('STARRED') || false,
          labelIds: msgDetail.labelIds || []
        } as GmailMessage;
      } catch (err) {
        console.error(`Error loading details for message ${msgStub.id}`, err);
        return null;
      }
    });

    const results = await Promise.all(detailPromises);
    return results.filter((m): m is GmailMessage => m !== null).sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('fetchGmailEmails action failed:', error);
    throw error;
  }
};

// Base64url encode helper for sending
const makeRawEmailString = (to: string, subject: string, bodyText: string): string => {
  const emailLines = [
    `To: ${to}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    bodyText
  ];
  const email = emailLines.join('\r\n');
  return btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Send a raw message using Gmail send endpoint
export const sendGmailEmail = async (
  token: string,
  to: string,
  subject: string,
  body: string
): Promise<any> => {
  const rawBase64 = makeRawEmailString(to, subject, body);
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: rawBase64 })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gmail API Send failed: ${res.status} -> ${errText}`);
  }
  return res.json();
};

// Create a draft message in Gmail
export const createGmailDraft = async (
  token: string,
  to: string,
  subject: string,
  body: string
): Promise<any> => {
  const rawBase64 = makeRawEmailString(to, subject, body);
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: {
        raw: rawBase64
      }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gmail API draft creation failed: ${res.status} -> ${errText}`);
  }
  return res.json();
};

// Move message to trash
export const trashGmailEmail = async (token: string, messageId: string): Promise<any> => {
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gmail API trash action failed: ${res.status} -> ${errText}`);
  }
  return res.json();
};
