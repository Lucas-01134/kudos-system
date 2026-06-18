import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { kudosAPI } from '../utils/api';
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

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await kudosAPI.getReceivedKudos().catch(() => ({ data: { kudos: [] } }));
      // For now, we'll just set empty users list - in production, get from auth API
      setUsers([]);
    } catch (err) {
      console.error('Error fetching users:', err);
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
      setError(err.response?.data?.message || 'Failed to send kudos');
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
            <input
              type="text"
              name="to"
              placeholder="Enter recipient ID or username"
              value={formData.to}
              onChange={handleChange}
              className="input"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Use the recipient's user ID</p>
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
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Send Kudos
          </button>
        </form>
      </div>
    </div>
  );
}
