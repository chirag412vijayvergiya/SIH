import { Route, Routes } from 'react-router-dom';
import Map from '../features/MapForDocPat/Map';
import SidebarHos from '../features/MapForDocPat/SidebarHos';
import Form from '../features/MapForDocPat/Form';
import { useUrlPosition } from '../hooks/useUrlPosition';
import { useGetNearhospitals } from '../features/MapForDocPat/useGetNearhospitals';

function Issues() {
  const [lat, lng] = useUrlPosition();
  const { isPending, hospitals } = useGetNearhospitals(lat, lng);
  return (
    <div className="relative my-[1vh] mt-7 flex h-[100vh] flex-col overscroll-none p-6 md:mt-[3.2rem] md:h-[86vh] md:flex-row">
      {/* // <div className="relative flex h-[86vh] overscroll-none p-6 md:mt-[3.2rem]"> */}
      <div className="rotate-150 absolute -left-11 top-0 z-[100] hidden h-80 w-80 rounded-full bg-blue-600 opacity-40 blur-[120px] dark:opacity-30 md:block"></div>
      <div className="absolute bottom-0 right-10 z-[100] hidden h-80 w-80 rounded-full bg-green-600 opacity-40 blur-[120px] selection:m-0 dark:opacity-20 md:block"></div>
      {/* <SidebarHos /> */}

      <Routes>
        <Route path="/" element={<SidebarHos />} />
        <Route path="nearest-hospitals/clinic" element={<SidebarHos />}>
          <Route path="" element={<Form />} />
        </Route>
      </Routes>
      <Map hospitals={hospitals} />
    </div>
  );
}

export default Issues;
