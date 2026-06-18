import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      window.location.href = '/feed';
    }
  }, [user]);

  return (
    <div className="container mx-auto py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">🎉 Kudos</h1>
        <p className="text-xl text-gray-600 mb-8">
          A platform to recognize and celebrate your team's achievements
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8 mt-12">
          <div className="card">
            <div className="text-4xl mb-4">👏</div>
            <h3 className="text-xl font-bold mb-2">Send Kudos</h3>
            <p className="text-gray-600">Recognize and appreciate your colleagues' great work</p>
          </div>
          
          <div className="card">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">View Stats</h3>
            <p className="text-gray-600">Track your kudos and see your impact</p>
          </div>
          
          <div className="card">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-xl font-bold mb-2">Build Culture</h3>
            <p className="text-gray-600">Foster a positive and appreciative workplace</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
