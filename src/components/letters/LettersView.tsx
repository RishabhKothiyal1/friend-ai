import React, { useState } from 'react';
import { Dashboard } from './Dashboard';
import { Inbox } from './Inbox';
import { FindFriends } from './FindFriends';
import { Compose } from './Compose';
import { StampAlbum } from './StampAlbum';
import { AvatarCreator, Avatar, AvatarConfig } from './AvatarCreator';
import { LetterReader } from './LetterReader';

export function LettersView() {
  const [activeTab, setActiveTab] = useState<'home' | 'inbox' | 'find' | 'write' | 'profile'>('home');

  const [readingLetter, setReadingLetter] = useState<any | null>(null);

  const [composeTargetFriend, setComposeTargetFriend] = useState<string>('Jens');

  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    animal: 'pig',
    bg: '#FF57B2'
  });
  const [nickname, setNickname] = useState('New Penpal');
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
    <div className="font-[family-name:var(--font-letters-sans)]">
      <div className="bg-[#FAFAF7] dark:bg-gray-950 rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-gray-800">
        {/* Top Tab Navigation */}
        <div className="bg-white dark:bg-gray-900 border-b border-[#E5E7EB] dark:border-gray-800 flex items-center justify-around px-2 py-2">
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
        <div className="relative">
          {activeTab === 'home' && (
            <Dashboard
              onNavigateToWrite={() => setActiveTab('write')}
              onNavigateToInbox={() => setActiveTab('inbox')}
              onOpenDemoLetter={() => setReadingLetter({
                title: 'First Greeting from Denmark',
                body: 'Hej! (This is hello in Danish!) I\'m Jens from Copenhagen, Denmark. I\'m 24 and I work as a designer. I really love writing physical letters because it forces us to express ourselves with detail instead of one-line chat bubbles.\n\nTell me about your city! What hobbies do you enjoy?\n\nLooking forward to your response.\n\nWarmly,\nJens',
                senderName: 'Jens',
                avatar: '🧑‍💻',
                country: 'Denmark',
                stampImage: '🧜‍♀️',
                date: 'Mar 2, 2026'
              })}
            />
          )}

          {activeTab === 'inbox' && (
            <Inbox
              onOpenLetter={(letter) => setReadingLetter({
                title: letter.title,
                body: letter.body,
                senderName: letter.senderId === 'mock_sender' ? 'Jens' : 'Little penpal',
                avatar: letter.senderId === 'mock_sender' ? '🧑‍💻' : '🤠',
                country: letter.senderId === 'mock_sender' ? 'Denmark' : 'Sweden',
                stampImage: letter.stampImage,
                date: 'Mar 1, 2026'
              })}
              onReply={(friendName) => handleMatchedFriend(friendName)}
            />
          )}

          {activeTab === 'find' && (
            <FindFriends onMatched={handleMatchedFriend} />
          )}

          {activeTab === 'write' && (
            <Compose
              preselectedFriend={composeTargetFriend}
              onLetterSent={() => setActiveTab('inbox')}
            />
          )}

          {activeTab === 'profile' && (
            <div className="bg-[#FAFAF7] dark:bg-gray-950 px-4 py-8 space-y-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
                  <Avatar config={avatarConfig} className="w-32 h-32" />
                  <div className="space-y-3 text-center md:text-left flex-1">
                    <div>
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="text-2xl font-[family-name:var(--font-letters-serif)] font-bold text-[#13294B] dark:text-gray-100 outline-none border-b border-transparent hover:border-[#E8E6E1] dark:hover:border-gray-700 focus:border-[#F4B400] bg-transparent py-0.5"
                      />
                      <p className="text-[#13294B]/50 dark:text-gray-400 text-xs mt-1">Slowly ID: FRIEND-5942</p>
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
          <div className="fixed inset-0 z-50 overflow-hidden bg-[#FAFAF7] dark:bg-gray-950">
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
