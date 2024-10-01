import { BsThreeDotsVertical } from 'react-icons/bs';
import { formatDate } from '../../utils/helpers';
import Menus from '../../ui/Menus';
import { HiEye } from 'react-icons/hi2';
import Modal from '../../ui/Modal';
import { useNavigate } from 'react-router-dom';

function InventoryRow({ index, elements }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'in stock':
        return 'bg-green-100 text-green-600 border-green-300';
      case 'low stock':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'out of stock':
        return 'bg-red-100 text-red-600 border-red-300';
      default:
        return '';
    }
  };

  const navigate = useNavigate();
  return (
    <tr className="tracking-medium items-center text-sm">
      <td className="whitespace-nowrap px-5 py-4">{index}</td>
      <td className="whitespace-nowrap px-5 py-4">{elements.itemName}</td>
      <td className="whitespace-nowrap px-5 py-4">{elements.category}</td>
      <td className="whitespace-nowrap px-5 py-4">{elements.currentStock}</td>
      {/* <td className="whitespace-nowrap px-5 py-4">{elements.expiryDate}</td> */}
      {/* <td className="whitespace-nowrap px-5 py-4">{elements.status}</td> */}
      <td className="whitespace-nowrap py-4 pr-5">
        <span
          className={`inline-block w-full max-w-xs border px-0.5 py-0.5 text-center font-medium ${getStatusClass(
            elements.stockStatus,
          )}`}
          style={{ borderRadius: '15px', minWidth: '90px' }}
        >
          {elements.stockStatus}
        </span>
      </td>
      <td className="whitespace-nowrap px-5 py-4">{elements.supplierName} </td>
      {/* <td className="whitespace-nowrap px-5 py-4">{elements.status}</td>
      <td className="whitespace-nowrap px-5 py-4">
        {formatDate(elements.appointmentDate)}
      </td> */}
      <td className="whitespace-nowrap px-6 py-2">
        <Modal>
          <Menus>
            <Menus.Toggle
              id={elements.id}
              icon={BsThreeDotsVertical}
              className="outline-2px h-9 w-9 cursor-pointer rounded border-none bg-transparent p-2.5 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-slate-900"
            />
            <Menus.List id={elements.id} positionX={2} positionY={-13}>
              <Menus.Button
                icon={<HiEye />}
                onClick={() => navigate(`/appointments/${elements.id}`)}
              >
                See Details
              </Menus.Button>
            </Menus.List>
          </Menus>
        </Modal>
      </td>
    </tr>
  );
}

export default InventoryRow;
