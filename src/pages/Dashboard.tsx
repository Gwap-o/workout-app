import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Kinobody Greek God 2.0
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/workout"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-4">💪</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Log Workout
            </h2>
            <p className="text-gray-600 text-sm">
              Track your sets, reps, and weights with intelligent progression
            </p>
          </Link>

          <Link
            to="/history"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Workout History
            </h2>
            <p className="text-gray-600 text-sm">
              View past workouts and track your progression over time
            </p>
          </Link>

          <div className="bg-gray-100 rounded-lg shadow p-6 opacity-60">
            <div className="text-3xl mb-4">🍽️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Nutrition
            </h2>
            <p className="text-gray-600 text-sm">
              Coming in Week 3
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Week 2 Features - Now Live
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">✓ Workout Logging</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                <li>Log workouts with RPT auto-calculation</li>
                <li>Track all exercise sets and reps</li>
                <li>Save notes for each workout</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">✓ Double Progression</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                <li>Automatic progression calculations</li>
                <li>Expected performance displayed</li>
                <li>Hit/missed progression tracking</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">✓ Plateau Detection</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                <li>Alerts after 2+ stagnant workouts</li>
                <li>Deload suggestions</li>
                <li>Rotation recommendations</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">✓ Workout History</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                <li>View all past workouts</li>
                <li>Filter by type and date</li>
                <li>Delete unwanted sessions</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
