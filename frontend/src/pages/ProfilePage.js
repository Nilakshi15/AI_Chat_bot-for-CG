import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { User, MessageCircle, Map, Mail, Calendar } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function ProfilePage() {
  const { user } = useOutletContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/profile`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>
          <p className="text-zinc-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="profile-page" className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-zinc-900 mb-2">Your Profile</h1>
          <p className="text-zinc-500 text-lg">Manage your account and track your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit"
          >
            <div className="text-center">
              <img
                src={user?.picture || 'https://via.placeholder.com/120'}
                alt={user?.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-indigo-100"
              />
              <h2 className="text-2xl font-semibold text-zinc-900 mb-1">{user?.name}</h2>
              <p className="text-zinc-500 mb-4">{user?.email}</p>
              
              <div className="inline-flex items-center gap-2 bg-lime-50 text-lime-700 px-4 py-2 rounded-full text-sm font-medium">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date(user?.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <MessageCircle className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-zinc-900 mb-1">{profile?.stats?.total_chats || 0}</p>
                <p className="text-zinc-500 font-medium">Chat Messages</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Map className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-zinc-900 mb-1">{profile?.stats?.total_roadmaps || 0}</p>
                <p className="text-zinc-500 font-medium">Learning Roadmaps</p>
              </motion.div>
            </div>

            {/* Career Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <h3 className="text-xl font-semibold text-zinc-900 mb-4">Career Profile</h3>
              
              {profile?.career_profile ? (
                <div className="space-y-4">
                  {profile.career_profile.interests?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-zinc-500 mb-2">INTERESTS</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.career_profile.interests.map((interest, i) => (
                          <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.career_profile.skills?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-zinc-500 mb-2">SKILLS</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.career_profile.skills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-zinc-500 mb-2">EXPERIENCE LEVEL</p>
                    <span className="inline-block px-3 py-1 bg-lime-50 text-lime-700 text-sm rounded-full capitalize">
                      {profile.career_profile.experience_level}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                  <p className="text-zinc-500">No career profile yet. Chat with the mentor to get started!</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
