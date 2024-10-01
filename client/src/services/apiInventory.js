import { PAGE_SIZE } from '../utils/constants';
import customFetch from '../utils/customFetch';
import Cookies from 'js-cookie';

export async function getInventory({ page, sortBy }) {
  try {
    let role = Cookies.get('userRole');
    console.log(role);

    if (role === 'patient') {
      console.log('Patient detected. API call will not be made.');
      return {};
    }

    if (role === 'admin') role = 'doctor';

    const response = await customFetch.get(`/inventory/my-inventory-${role}`);
    // console.log(response.data);
    // return response.data;

    let inventory = response.data.data.inventory;

    //  Apply pagination
    let paginatedinventory = inventory;
    if (page) {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE;
      paginatedinventory = inventory.slice(from, to);

      return { data: paginatedinventory, count: inventory.length };
    }
  } catch (error) {
    console.error('Error fetching Inventory: ', error);
    throw new Error('Failed to fetch Inventory');
  }
}
