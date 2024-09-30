import { BsThreeDotsVertical } from 'react-icons/bs';
import Menus from '../../ui/Menus';
import AppointmentTableFooter from '../appointments/AppointmentTableFooter';
import TableHeader from '../appointments/TableHeader';
import InventoryRow from './InventoryRow';

function InventoryTable() {
  const InventoryData = [
    {
      id: 1,
      name: 'Paracetamol',
      expiryDate: '12/12/2022',
      status: 'out of stock',
      supplier: 'ABC@gmail.com',
    },

    {
      id: 2,
      name: 'Dolo',
      expiryDate: '12/12/2022',
      status: 'low stock',
      supplier: 'ABC',
    },

    {
      id: 3,
      name: 'Crocin',
      expiryDate: '12/12/2022',
      status: 'in stock',
      supplier: 'ABC',
    },

    {
      id: 4,
      name: 'Saridon',
      expiryDate: '12/12/2022',
      status: 'low stock',
      supplier: 'ABC',
    },

    {
      id: 5,
      name: 'Combiflam',
      expiryDate: '12/12/2022',
      status: 'in stock',
      supplier: 'ABC',
    },

    // {
    //   id: 6,
    //   name: 'Disprin',
    //   expiryDate: '12/12/2022',
    //   status: 'Available',
    //   supplier: 'ABC',
    // },

    // {
    //   id: 7,
    //   name: 'Aspirin',
    //   expiryDate: '12/12/2022',
    //   status: 'Available',
    //   supplier: 'ABC',
    // },

    // {
    //   id: 8,
    //   name: 'Cetirizine',
    //   expiryDate: '12/12/2022',
    //   status: 'Available',
    //   supplier: 'ABC',
    // },

    // {
    //   id: 9,
    //   name: 'Avil',
    //   expiryDate: '12/12/2022',
    //   status: 'Available',
    //   supplier: 'ABC',
    // },

    // {
    //   id: 10,
    //   name: 'Allegra',
    //   expiryDate: '12/12/2022',
    //   status: 'Available',
    //   supplier: 'ABC',
    // },
  ];

  return (
    <Menus>
      <div className="mt-6 flex flex-col font-mono">
        <div className="my-2 overflow-x-auto rounded-sm border-b  border-grey-100 shadow-2xl  shadow-slate-200 dark:border-gray-600 dark:shadow-slate-800 sm:mx-3 lg:mx-4">
          <div className="inline-block min-w-full align-middle ">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-grey-300 dark:bg-slate-900">
                  <tr>
                    <TableHeader key={1} heading="Sr.No." />
                    <TableHeader key={1} heading="Name" />
                    <TableHeader key={1} heading="Expiry Date" />
                    <TableHeader key={1} heading="Status" />
                    <TableHeader key={1} heading="Supplier" />

                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className=" divide-y divide-gray-400 bg-grey-0 text-slate-600 dark:bg-slate-800 dark:text-grey-100">
                  {InventoryData.map((content, index) => (
                    <InventoryRow
                      key={content.id}
                      index={index + 1}
                      elements={content}
                    />
                  ))}
                </tbody>
              </table>
              <AppointmentTableFooter count={10} />
            </div>
          </div>
        </div>
      </div>
    </Menus>
  );
}

export default InventoryTable;
