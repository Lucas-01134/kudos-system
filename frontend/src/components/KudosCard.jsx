import { useState } from 'react';
import { kudosAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function KudosCard({ kudos, onUpdate }) {
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(kudos.likes?.includes(currentUserId));

  const handleLike = async () => {
    try {
      setLoading(true);
      await kudosAPI.likeKudos(kudos._id);
      setIsLiked(!isLiked);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error liking kudos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this kudos?')) return;
    try {
      setLoading(true);
      await kudosAPI.deleteKudos(kudos._id);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting kudos:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryEmoji = {
    leadership: '👔',
    teamwork: '🤝',
    innovation: '💡',
    support: '🤗',
    excellence: '⭐',
    other: '👏'
  };

  return (
    <div className="card mb-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{kudos.from.firstName || kudos.from.username}</span>
            {' '}→{' '}
            <span className="font-semibold">{kudos.to.firstName || kudos.to.username}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm">
              {categoryEmoji[kudos.category]} {kudos.category}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${kudos.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {kudos.isPublic ? '🌐 Public' : '🔒 Private'}
            </span>
          </div>
        </div>
        {currentUserId === kudos.from._id && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn btn-danger text-sm"
          >
            Delete
          </button>
        )}
      </div>
      
      <p className="text-gray-700 mb-3">{kudos.message}</p>
      
      <div className="flex gap-4 text-sm text-gray-600">
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-1 ${isLiked ? 'text-red-600' : ''}`}
        >
          {isLiked ? '❤️' : '🤍'} {kudos.likes?.length || 0}
        </button>
        <span>{new Date(kudos.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
