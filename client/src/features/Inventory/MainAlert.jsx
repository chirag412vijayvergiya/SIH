function MainAlert({ medicine, equipment }) {
  return (
    <div className="mt-4 rounded-lg border-l-4 border-yellow-500 bg-blue-100 p-1 shadow-md dark:bg-slate-800">
      <div className="relative">
        <div className="h-6 overflow-hidden">
          <p className="animate-slide-left text-sm font-semibold text-red-800 dark:text-red-300">
            ⚠️ Alert Summary: <span className="font-bold">{medicine}</span>{' '}
            Medicine(s) and <span className="font-bold">{equipment}</span>{' '}
            Equipment(s) need attention 🚨
            <button className="ml-2 text-blue-400 underline hover:text-blue-600">
              View Details
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainAlert;
