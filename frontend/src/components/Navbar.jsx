import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container flex justify-between items-center py-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          🎉 Kudos
        </Link>
        <div className="flex gap-4">
          {user ? (
            <>
              <Link to="/feed" className="hover:text-blue-600">Feed</Link>
              <Link to="/send-kudos" className="hover:text-blue-600">Send Kudos</Link>
              <Link to="/profile" className="hover:text-blue-600">Profile</Link>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-secondary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
