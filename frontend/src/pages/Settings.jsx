import React, { useState } from 'react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };
   
  const handleSave = (e) => {
    e.preventDefault();
    alert('Changes saved successfully (frontend only)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-cyan-400 text-black text-center py-6 px-6 rounded-t-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight">Account Settings</h1>
          <p className="text-sm mt-1 text-black">Manage your profile, security, and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-6 bg-indigo-50 px-6 py-4">
          {['general', 'security', 'photo'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize px-5 py-2 rounded-2xl font-semibold tracking-wide transition ${
                activeTab === tab
                  ? 'bg-cyan-400 text-black shadow-lg'
                  : 'bg-white text-black border border-cyan-900 hover:bg-green-200'
              }`}
            >
              {tab === 'general' && 'General'}
              {tab === 'security' && 'Security'}
              {tab === 'photo' && 'Profile Photo'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSave} className="p-8 space-y-8">
          {activeTab === 'general' && (
            <>
              <div>
                <label className="block text-black font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-5 py-3 border border-cyan-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-800 transition"
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-3 border border-cyan-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-800 transition"
                />
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <div>
              <label className="block text-black font-semibold mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 border border-cyan-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-800 transition"
              />
              <p className="text-sm text-black mt-2">Leave blank if you don't want to change it.</p>
            </div>
          )}

          {activeTab === 'photo' && (
            <div className="text-center">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-32 h-32 mx-auto rounded-full object-cover mb-5 border-4 border-cyan-900 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 mx-auto rounded-full bg-indigo-100 flex items-center justify-center mb-5 text-blue-300 text-lg font-semibold">
                  No Image
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className=" ml-2  text-black   text-lg  "

              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-400 text-black py-3 rounded-2xl font-bold text-lg hover:bg-cyan-800 shadow-md transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
