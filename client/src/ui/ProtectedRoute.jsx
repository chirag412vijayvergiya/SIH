// import { useNavigate } from 'react-router-dom';
// import { useUser } from '../features/authentication/Patients/useUser';
// import { useEffect } from 'react';
// import DefaultSpinner from './DefaultSpinner';

// function ProtectedRoute({ children }) {
//   const navigate = useNavigate();

//   //1. Load the authenticated user
//   const { isPending, isAuthenticated } = useUser();

//   //2. If there no authenticated user, redirect to the /login page
//   useEffect(
//     function () {
//       if (!isAuthenticated && !isPending) {
//         navigate('/login');
//       }
//     },
//     [isAuthenticated, isPending, navigate],
//   );

//   //3. While Loading, show a spinner
//   if (isPending) {
//     return (
//       <div className="flex h-[100vh] items-center justify-center bg-gray-50 dark:bg-slate-800">
//         <DefaultSpinner />
//       </div>
//     );
//   }

//   if (isAuthenticated) return children;
// }

// export default ProtectedRoute;

import { useNavigate } from 'react-router-dom';
import { useUser } from '../features/authentication/Patients/useUser';
import { useEffect } from 'react';
import DefaultSpinner from './DefaultSpinner';

function ProtectedRoute({ children, roles = [] }) {
  const navigate = useNavigate();

  //1. Load the authenticated user
  const { isPending, isAuthenticated, user } = useUser();

  //2. If there no authenticated user, redirect to the /login page
  useEffect(
    function () {
      // Check if user is authenticated and the roles are loaded
      if (!isAuthenticated && !isPending) {
        navigate('/login');
      } else if (
        isAuthenticated &&
        !isPending &&
        roles.length > 0 &&
        !roles.includes(user?.data?.data?.role)
      ) {
        // Redirect if the user's role does not match the allowed roles
        navigate('/dashboard'); // Or any other route, e.g., navigate('/dashboard')
      }
    },
    [isAuthenticated, isPending, user?.data?.data?.role, roles, navigate],
  );

  //3. While Loading, show a spinner
  if (isPending) {
    return (
      <div className="flex h-[100vh] items-center justify-center bg-gray-50 dark:bg-slate-800">
        <DefaultSpinner />
      </div>
    );
  }

  if (
    isAuthenticated &&
    (!roles.length || roles.includes(user?.data?.data?.role))
  )
    return children;
}

export default ProtectedRoute;
