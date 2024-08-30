import { Outlet } from 'react-router-dom';
import Form from './Form';

function SidebarHos() {
  return (
    <div className="flex h-[calc(100vh-6rem)] w-full flex-col items-center bg-grey-300 p-[3rem_1rem_2rem_1rem] dark:bg-slate-800 md:w-1/2 md:p-[3rem_5rem_2rem_5rem]">
      <h1 className="font-mono text-2xl font-bold tracking-wider text-indigo-800 underline dark:text-indigo-400">
        Find nearest hospitals
      </h1>
      <div className="h-full w-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default SidebarHos;
