import { Link } from 'react-router-dom';
function Issue() {
  return (
    <Link to="/issues">
      <p className="fixed bottom-4 right-4 z-[10000000] flex items-center gap-x-3 rounded-r-full rounded-t-full bg-red-500 p-2 px-3 font-medium tracking-wider text-grey-300 drop-shadow-xl">
        🤔 Emergency?
      </p>
    </Link>
  );
}

export default Issue;
