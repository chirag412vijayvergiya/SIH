import { BsThreeDotsVertical } from 'react-icons/bs';
import Menus from '../../ui/Menus';
import AppointmentTableFooter from '../appointments/AppointmentTableFooter';
import TableHeader from '../appointments/TableHeader';
import InventoryRow from './InventoryRow';
import { useGetinventory } from './useGetinventory';
import DefaultSpinner from '../../ui/DefaultSpinner';
import { useSearchParams } from 'react-router-dom';
import Empty from '../../ui/Empty';

function InventoryTable() {
  const [searchParams] = useSearchParams();
  const currentPage = !searchParams.get('page')
    ? 1
    : Number(searchParams.get('page'));
  const { inventory, isLoading, error, count } = useGetinventory();

  if (isLoading) return <DefaultSpinner />;
  if (!inventory?.length) return <Empty resourceName="Inventory" />;
  // console.log(inventory);

  const headerContent = [
    'Sr.No.',
    'Name',
    'Category',
    'Quantity',
    // 'Expiry Date',
    'Status',
    'Supplier',
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
                    {headerContent.map((content) => (
                      <TableHeader key={content} heading={content} />
                    ))}

                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className=" divide-y divide-gray-400 bg-grey-0 text-slate-600 dark:bg-slate-800 dark:text-grey-100">
                  {inventory.map((content, index) => (
                    <InventoryRow
                      key={content.id}
                      index={index + 1}
                      elements={content}
                    />
                  ))}
                </tbody>
              </table>
              <AppointmentTableFooter count={count} />
            </div>
          </div>
        </div>
      </div>
    </Menus>
  );
}

export default InventoryTable;
