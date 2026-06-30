import React, { useState } from 'react';
import { AutoMatch } from './AutoMatch';

export const FindFriends: React.FC<{ onMatched: (friendName: string) => void }> = ({ onMatched }) => {
  const [mode, setMode] = useState<'selection' | 'auto' | 'manual'>('selection');
  const [friendIdInput, setFriendIdInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [interestFilter, setInterestFilter] = useState('All');

  const INTERESTS = ['Reading', 'Travel', 'Coding', 'Board Games', 'Cooking', 'Gardening'];

  const MOCK_MANUAL_USERS = [
    { name: 'Jens', country: 'Denmark', lang: 'Danish, English', interests: ['Board Games', 'Travel', 'Reading'], avatar: '🧑‍💻', bio: 'Let\'s talk about design, books and life in Scandinavia!' },
    { name: 'Yuki', country: 'Japan', lang: 'Japanese, English', interests: ['Coding', 'Cooking'], avatar: '👩‍🎨', bio: 'AI researcher based in Tokyo. Looking for nice conversations!' },
    { name: 'Carlos', country: 'Spain', lang: 'Spanish, English', interests: ['Travel', 'Cooking', 'Gardening'], avatar: '👨‍🌾', bio: 'A chef who loves travel, gardening and learning cultures.' }
  ];

  const filteredUsers = MOCK_MANUAL_USERS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInterest = interestFilter === 'All' || user.interests.includes(interestFilter);
    return matchesSearch && matchesInterest;
  });

  return (
    <div className="bg-[#FAFAF7] py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {mode !== 'selection' && (
          <button
            onClick={() => setMode('selection')}
            className="text-[#13294B]/60 hover:text-[#13294B] text-sm font-bold flex items-center gap-1 mb-2"
          >
            &larr; Back to options
          </button>
        )}

        {mode === 'selection' && (
          <div className="space-y-6 bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            <div className="text-center space-y-4 max-w-md mx-auto">
              <div className="w-48 h-48 mx-auto bg-[#F4B400]/15 rounded-full flex items-center justify-center text-5xl">
                🌍
              </div>
              <h2 className="text-3xl font-[family-name:var(--font-letters-serif)] font-bold text-[#13294B]">Ready to meet a new pal?</h2>
              <p className="text-[#13294B]/60 text-sm">
                Start connecting with the world at a slower, more deliberate pace.
              </p>
            </div>

            <div className="space-y-3 pt-6 max-w-sm mx-auto">
              <button
                onClick={() => setMode('auto')}
                className="w-full bg-[#F4B400] hover:bg-yellow-500 text-[#13294B] font-bold py-3.5 px-6 rounded-full shadow-md transition"
              >
                Auto-match
              </button>
              <button
                onClick={() => setMode('manual')}
                className="w-full bg-[#13294B] hover:bg-[#13294B]/95 text-white font-bold py-3.5 px-6 rounded-full shadow-md transition"
              >
                Explore Manually
              </button>
            </div>

            <div className="border-t border-[#E8E6E1] pt-6 flex flex-col items-center gap-2 max-w-sm mx-auto">
              <label className="text-xs uppercase text-[#13294B]/50 tracking-wider font-bold">Add Friend By Slowly ID</label>
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  placeholder="Enter ID (e.g. FRIEND-998)"
                  value={friendIdInput}
                  onChange={(e) => setFriendIdInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-full text-sm outline-none bg-[#FAFAF7] focus:ring-1 focus:ring-[#F4B400]"
                />
                <button
                  onClick={() => {
                    if (friendIdInput.trim()) onMatched(friendIdInput);
                  }}
                  className="px-5 py-2 bg-[#E8E6E1] text-[#13294B] rounded-full hover:bg-[#E8E6E1]/80 transition text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === 'auto' && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            <AutoMatch onMatched={onMatched} />
          </div>
        )}

        {mode === 'manual' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-xl font-[family-name:var(--font-letters-serif)] font-bold text-[#13294B]">Explore Profiles</h3>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search by name or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-full border border-[#E5E7EB] text-sm outline-none focus:ring-1 focus:ring-[#F4B400]"
                />
                <select
                  value={interestFilter}
                  onChange={(e) => setInterestFilter(e.target.value)}
                  className="px-4 py-2 rounded-full border border-[#E5E7EB] text-sm outline-none bg-white text-[#13294B]"
                >
                  <option value="All">All Interests</option>
                  {INTERESTS.map(int => (
                    <option key={int} value={int}>{int}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredUsers.map((user, idx) => (
                <div key={idx} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-[#FAFAF7] flex items-center justify-center text-2xl border border-[#E5E7EB] flex-shrink-0">
                      {user.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#13294B] flex items-center gap-2">
                        {user.name}
                        <span className="text-xs px-2 py-0.5 bg-[#E8E6E1] rounded text-[#13294B]/60">{user.country}</span>
                      </h4>
                      <p className="text-xs text-[#13294B]/50 mt-0.5">Speaks: {user.lang}</p>
                      <p className="text-sm text-[#13294B]/80 mt-2 font-[family-name:var(--font-letters-serif)] italic">"{user.bio}"</p>

                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        {user.interests.map(int => (
                          <span key={int} className="text-[10px] bg-[#FAFAF7] px-2.5 py-1 border border-[#E5E7EB] rounded-full text-[#13294B] font-bold">
                            {int}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onMatched(user.name)}
                    className="w-full md:w-auto px-6 py-2.5 bg-[#F4B400] hover:bg-yellow-500 text-[#13294B] font-bold rounded-full text-sm shadow-sm transition"
                  >
                    Select Friend
                  </button>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-[#13294B]/40 italic">
                  No compatible friends found with current search or filters.
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
