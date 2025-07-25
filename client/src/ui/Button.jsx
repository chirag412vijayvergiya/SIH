import { Link } from 'react-router-dom';
function Button({ children, type, disabled, onClick }) {
  const base =
    'p-small flex items-center justify-center rounded-full font-medium';
  const styles = {
    primary: `${base} bg-indigo-400 px-6 py-2 text-grey-50 dark:bg-indigo-500`,
    secondary: `${base} bg-slate-800 px-6 py-2 text-grey-50 dark:bg-grey-200 dark:text-slate-800 `,
    third: `${base} px-6 py-[0.7rem] bg-slate-800 mx-auto text-sm text-grey-50 dark:bg-grey-200 dark:text-slate-800 `,
    reset: `p-small flex items-center font-sans tracking-wider justify-center text-sm rounded-md font-medium px-3 md:px-6 py-2 text-grey-50 dark:bg-slate-800 bg-indigo-800 `,
    update: `p-small flex items-center tracking-wider justify-center rounded-md text-sm font-medium bg-slate-800 px-3 md:px-6 py-2 text-grey-50 bg-indigo-400 dark:bg-indigo-500 font-sans`,
    danger: `p-small flex items-center tracking-wider justify-center rounded-md text-sm font-medium px-3 md:px-6 py-2 text-grey-50 bg-red-700 font-sans`,
    addInventory: `rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75`,
    checkInventory: `rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75`,
    sidebar:
      'font-medium text-base subpixel-antialiased tracking-wide flex flex-row items-center gap-2',
    position:
      'font-mono tracking-wider font-bold absolute z-[1000] text-sm bottom-16 left-1/2 transform -translate-x-1/2 bg-indigo-800 shadow-[0_0.4rem_1.2rem_rgba(36,42,46,0.16)] text-inherit uppercase py-2 px-4 font-inherit text-sm border-none rounded-[5px] cursor-pointer text-white',
  };
  return (
    <button className={styles[type]} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
