import InventoryAlerts from '../features/Inventory/InventoryAlerts';
import InventoryTable from '../features/Inventory/InventoryTable';
import MainAlert from '../features/Inventory/MainAlert';
import Button from '../ui/Button';
import SEO from '../ui/SEO';

function InventoryMana() {
  const dummyAlerts = [
    {
      type: 'Low Stock',
      itemName: 'Paracetamol',
      currentStock: 150,
      minimumStock: 160,
      recipient: '5c8a1d5b0190b214360dc057',
    },
    {
      type: 'Near Expiry',
      itemName: 'Ibuprofen',
      batchNumber: 'BATCH002',
      expiryDate: '2024-11-01T00:00:00.000Z',
      recipient: '66d4167ded9cde6ea37f7bb0',
    },
    {
      type: 'Low Stock',
      itemName: 'Aspirin',
      currentStock: 90,
      minimumStock: 120,
      recipient: '6c2a1b3d0190c214460db027',
    },
    {
      type: 'Near Expiry',
      itemName: 'Amoxicillin',
      batchNumber: 'BATCH003',
      expiryDate: '2024-12-15T00:00:00.000Z',
      recipient: '7d341a5a0190d314560fb067',
    },
  ];

  return (
    <>
      <SEO
        title="Inventory Management"
        description="This is the inventory management page of the website."
        keywords="inventory, management, page, keywords"
        author="Chirag Vijayvergiya"
      />
      <div className="my-[2vh] ml-[0.4rem] mr-[0.4rem] mt-7 flex h-[86vh] flex-col justify-between rounded-xl border-r border-r-grey-200 bg-slate-200 p-4 tracking-wider shadow-md shadow-blue-200 dark:border-r-grey-800 dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-900 dark:shadow-blue-900 md:m-[2vh] ">
        <div className="items-center justify-between overflow-hidden">
          {/* <InventoryAlerts alertsData={dummyAlerts} /> */}
          <MainAlert medicine={0} equipment={2} />

          <div className="mb-7 flex flex-col items-center justify-between md:flex-row">
            <h1 className="m-5 text-lg font-semibold">Inventory Management</h1>
            <div className="flex items-center justify-center space-x-4">
              <Button type="addInventory">Add Inventory</Button>
              <Button type="checkInventory">Check Inventory</Button>
            </div>
          </div>
          <InventoryTable />
        </div>
      </div>
    </>
  );
}

export default InventoryMana;
