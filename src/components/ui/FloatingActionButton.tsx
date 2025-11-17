import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';

export function FloatingActionButton() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <button
      onClick={() => navigate('/workout')}
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#20808D] dark:bg-[#1FB8CD] hover:bg-[#1A6B76] dark:hover:bg-[#1AA1B8] text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-all duration-200 hover:scale-105 active:scale-95"
      aria-label="Log Workout"
    >
      <Plus className="w-7 h-7" strokeWidth={2.5} />
    </button>
  );
}
