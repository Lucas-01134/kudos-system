import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { kudosAPI, authAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SendKudosPage() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    to: '',
    message: '',
    category: 'other',
    isPublic: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentUserId = String(user?._id || user?.id || '');
  const currentUserIds = new Set([
    currentUserId,
    String(user?.username || '').toLowerCase(),
    String(user?.email || '').toLowerCase()
  ]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getAllUsers();
      const normalizedUsers = response.data.map((u) => ({
        ...u,
        _id: String(u._id || u.id || ''),
        id: String(u.id || u._id || ''),
        username: String(u.username || ''),
        email: String(u.email || '')
      }));

      const filtered = normalizedUsers.filter((u) => {
        const userId = u.id;
        const username = u.username.toLowerCase();
        const email = u.email.toLowerCase();
        return (
          !currentUserIds.has(userId) &&
          !currentUserIds.has(username) &&
          !currentUserIds.has(email)
        );
      });

      console.log('SendKudosPage fetchUsers', {
        currentUserIds: Array.from(currentUserIds),
        allUsers: normalizedUsers.map((u) => ({ id: u.id, username: u.username, email: u.email })),
        filtered: filtered.map((u) => ({ id: u.id, username: u.username }))
      });

      setUsers(filtered);
      if (filtered.length > 0) {
        setFormData((prev) => ({
          ...prev,
          to: prev.to || filtered[0].id
        }));
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('SendKudosPage submit', { currentUserId, to: formData.to, message: formData.message });
      await kudosAPI.sendKudos(
        formData.to,
        formData.message,
        formData.category,
        formData.isPublic
      );
      setSuccess('Kudos sent successfully!');
      setFormData({ to: '', message: '', category: 'other', isPublic: true });
      setTimeout(() => navigate('/feed'), 1500);
    } catch (err) {
      console.error('SendKudosPage send error', err);
      setError(err.response?.data?.message || err.message || 'Failed to send kudos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6">Send Kudos 🎉</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Recipient</label>
            {users.length > 0 ? (
              <select
                name="to"
                value={formData.to}
                onChange={handleChange}
                className="input"
                required
              >
                {users.map((recipient) => {
                  const recipientId = String(recipient._id || recipient.id || '');
                  return (
                    <option key={recipientId} value={recipientId}>
                      {recipient.username} ({recipient.firstName} {recipient.lastName})
                    </option>
                  );
                })}
              </select>
            ) : (
              <input
                type="text"
                name="to"
                placeholder="Enter recipient user ID, username, or email"
                value={formData.to}
                onChange={handleChange}
                className="input"
                required
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              Select a recipient from the list or enter a valid username/email/user ID.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="input resize-none"
              rows="4"
              placeholder="What do you want to recognize them for?"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="input">
              <option value="other">Other</option>
              <option value="leadership">Leadership</option>
              <option value="teamwork">Teamwork</option>
              <option value="innovation">Innovation</option>
              <option value="support">Support</option>
              <option value="excellence">Excellence</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              <span className="text-sm font-medium">Make this kudos public</span>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Uncheck to send this kudos privately. Private kudos are shown in the feed only with a private marker.
            </p>
            {!formData.isPublic && (
              <div className="mt-2 text-sm text-yellow-800 bg-yellow-100 p-2 rounded">
                This kudos will be private and only visible to you and the recipient.
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Send Kudos
          </button>
        </form>
      </div>
    </div>
  );
}
