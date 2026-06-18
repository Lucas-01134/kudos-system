import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { kudosAPI } from '../utils/api';
import KudosCard from '../components/KudosCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export default function FeedPage() {
  const [kudos, setKudos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchFeed();
  }, [page, user, navigate]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await kudosAPI.getKudosFeed(page);
      setKudos(response.data.kudos);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Kudos Feed</h1>
      
      {kudos.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-500 text-lg">No kudos yet. Be the first to send some! 🎉</p>
        </div>
      ) : (
        <>
          {kudos.map((k) => (
            <KudosCard key={k._id} kudos={k} onUpdate={fetchFeed} />
          ))}

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="btn btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
