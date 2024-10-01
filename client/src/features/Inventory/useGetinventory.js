import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getInventory } from '../../services/apiInventory';
import { PAGE_SIZE } from '../../utils/constants';

export function useGetinventory() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const sortByRaw = searchParams.get('sortBy') || 'Date-desc';
  const [field, direction] = sortByRaw.split('-');
  const sortBy = { field, direction };

  const page = !searchParams.get('page') ? 1 : Number(searchParams.get('page'));

  const {
    data: { data: inventory, count } = {},
    error,
    isPending: isLoading,
  } = useQuery({
    queryKey: ['inventory', page, sortBy],
    queryFn: () => getInventory({ page, sortBy }),
  });

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ['inventory', page + 1, sortBy],
      queryFn: () => getInventory({ page: page + 1, sortBy }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ['inventory', page - 1, sortBy],
      queryFn: () => getInventory({ page: page - 1, sortBy }),
    });

  return { inventory, error, isLoading, count };
}
