import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { kudosAPI } from '../utils/api';
import KudosCard from '../components/KudosCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [receivedKudos, setReceivedKudos] = useState([]);
  const [sentKudos, setSentKudos] = useState([]);
  const [stats, setStats] = useState({ received: 0, sent: 0, likes: 0 });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: ''
  });

  const userId = user?._id || user?.id;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      bio: user.bio || ''
    });
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [received, sent, kudosStats] = await Promise.all([
        kudosAPI.getReceivedKudos(1, 5),
        kudosAPI.getSentKudos(1, 5),
        kudosAPI.getKudosStats(userId)
      ]);
      setReceivedKudos(received.data.kudos);
      setSentKudos(sent.data.kudos);
      setStats(kudosStats.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="md:col-span-1">
          <div className="card">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                {user.firstName?.charAt(0) || user.username?.charAt(0)}
              </div>
              {!editMode && (
                <>
                  <h2 className="text-2xl font-bold">
                    {user.firstName || user.username} {user.lastName || ''}
                  </h2>
                  <p className="text-gray-600">@{user.username}</p>
                  {user.bio && <p className="text-sm text-gray-500 mt-2">{user.bio}</p>}
                  <button
                    onClick={() => setEditMode(true)}
                    className="btn btn-secondary mt-4 w-full"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>

            {editMode && (
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="input mb-2"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="input mb-2"
                />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Bio"
                  className="input mb-4"
                  rows="3"
                ></textarea>
                <button onClick={handleSave} className="btn btn-primary w-full mb-2">
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="btn btn-secondary w-full"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="mt-6 pt-6 border-t space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.received}</div>
                <div className="text-sm text-gray-600">Kudos Received</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
                <div className="text-sm text-gray-600">Kudos Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.likes}</div>
                <div className="text-sm text-gray-600">Likes Received</div>
              </div>
            </div>
          </div>
        </div>

        {/* Kudos Lists */}
        <div className="md:col-span-2">
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Kudos Received</h3>
            {receivedKudos.length === 0 ? (
              <p className="text-gray-500">No kudos received yet</p>
            ) : (
              receivedKudos.map((k) => (
                <KudosCard key={k._id} kudos={k} onUpdate={fetchProfile} />
              ))
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Kudos Sent</h3>
            {sentKudos.length === 0 ? (
              <p className="text-gray-500">No kudos sent yet</p>
            ) : (
              sentKudos.map((k) => (
                <KudosCard key={k._id} kudos={k} onUpdate={fetchProfile} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
