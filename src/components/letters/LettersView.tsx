import React, { useState } from 'react';
import { Dashboard } from './Dashboard';
import { Inbox } from './Inbox';
import { FindFriends } from './FindFriends';
import { Compose } from './Compose';
import { StampAlbum } from './StampAlbum';
import { AvatarCreator, Avatar, AvatarConfig } from './AvatarCreator';
import { LetterReader } from './LetterReader';
import { useAuth } from '../../contexts/AuthContext';

interface LettersViewProps {
  userId?: string;
}

export function LettersView({ userId }: LettersViewProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'inbox' | 'find' | 'write' | 'profile'>('home');

  const [readingLetter, setReadingLetter] = useState<any | null>(null);

  const [composeTargetFriend, setComposeTargetFriend] = useState<string>('');

  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    animal: 'pig',
    bg: '#FF57B2'
  });

  const [editAvatar, setEditAvatar] = useState(false);

  const handleMatchedFriend = (friendName: string) => {
    setComposeTargetFriend(friendName);
    setActiveTab('write');
  };

  const tabs = [
    { id: 'home', label: 'Letters', icon: '🏠' },
    { id: 'inbox', label: 'Inbox', icon: '✉' },
    { id: 'find', label: 'Find Friends', icon: '➕' },
    { id: 'write', label: 'Write', icon: '🖋' },
    { id: 'profile', label: 'Profile', icon: '☰' },
  ] as const;

  return (
    <div className="font-[family-name:var(--font-letters-sans)] h-full flex flex-col">
      <div className="bg-[#FAFAF7] dark:bg-gray-950 rounded-2xl border border-[#E5E7EB] dark:border-gray-800 flex flex-col flex-1 min-h-0">
        {/* Top Tab Navigation */}
        <div className="bg-white dark:bg-gray-900 border-b border-[#E5E7EB] dark:border-gray-800 flex items-center justify-around px-2 py-2 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'text-[#F4B400] dark:text-amber-400 scale-105 font-bold'
                  : 'text-[#13294B]/60 dark:text-gray-400 hover:text-[#13294B] dark:hover:text-gray-100'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-y-auto min-h-0">
          {activeTab === 'home' && (
            <Dashboard
              onNavigateToWrite={() => setActiveTab('write')}
              onNavigateToInbox={() => setActiveTab('inbox')}
            />
          )}

          {activeTab === 'inbox' && (
            <Inbox
              onOpenLetter={(letter) => setReadingLetter({
                title: letter.title,
                body: letter.body,
                senderName: letter.receiverName || 'Someone',
                avatar: '🧑‍💻',
                country: '',
                stampImage: letter.stampImage,
                date: letter.createdAt ? new Date(letter.createdAt.seconds * 1000).toLocaleDateString() : ''
              })}
              onReply={(friendName) => handleMatchedFriend(friendName)}
            />
          )}

          {activeTab === 'find' && (
            <FindFriends onMatched={handleMatchedFriend} userId={userId} />
          )}

          {activeTab === 'write' && (
              <Compose
              preselectedFriend={composeTargetFriend}
              onLetterSent={() => setActiveTab('inbox')}
              userId={userId}
            />
          )}

          {activeTab === 'profile' && (
            <div className="bg-[#FAFAF7] dark:bg-gray-950 px-4 py-8 space-y-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
                  <Avatar config={avatarConfig} className="w-32 h-32" />
                  <div className="space-y-3 text-center md:text-left flex-1">
                    <div>
                      <p className="text-2xl font-[family-name:var(--font-letters-serif)] font-bold text-[#13294B] dark:text-gray-100">
                        {profile?.displayName || 'Anonymous'}
                      </p>
                      <p className="text-[#13294B]/50 dark:text-gray-400 text-xs mt-1">UID: {userId || 'anonymous'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <button
                        onClick={() => setEditAvatar(!editAvatar)}
                        className="px-4 py-2 bg-[#13294B] dark:bg-gray-800 text-white text-xs font-bold rounded-full hover:bg-[#13294B]/95 dark:hover:bg-gray-700 transition"
                      >
                        {editAvatar ? 'Close Editor' : 'Customize Avatar'}
                      </button>
                    </div>
                  </div>
                </div>

                {editAvatar && (
                  <div className="mt-6">
                    <AvatarCreator
                      initialConfig={avatarConfig}
                      onSave={(config) => {
                        setAvatarConfig(config);
                        setEditAvatar(false);
                      }}
                    />
                  </div>
                )}

                <div className="mt-6">
                  <StampAlbum />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Letter Reader Overlay */}
        {readingLetter && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FAFAF7] dark:bg-gray-950">
            <LetterReader
              title={readingLetter.title}
              content={readingLetter.body}
              senderName={readingLetter.senderName}
              avatar={readingLetter.avatar}
              country={readingLetter.country}
              stampImage={readingLetter.stampImage}
              date={readingLetter.date}
              onClose={() => setReadingLetter(null)}
              onReply={(friendName) => handleMatchedFriend(friendName)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
