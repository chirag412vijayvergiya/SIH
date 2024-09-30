import InventoryTable from '../features/Inventory/InventoryTable';
import Button from '../ui/Button';
import SEO from '../ui/SEO';

function InventoryMana() {
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
          <div className="mt-4 rounded-lg border-l-4 border-yellow-500 bg-blue-100 p-1 shadow-md dark:bg-slate-800">
            <div className="relative">
              <div className="h-6 overflow-hidden">
                <p className="animate-slide-left text-sm font-semibold text-red-800 dark:text-red-300">
                  ⚠️ Alert: Inventory updated successfully!
                </p>
              </div>
            </div>
          </div>
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
