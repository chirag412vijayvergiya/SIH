import { useQuery } from '@tanstack/react-query';
import { getHospitals } from '../../services/apiHospitals';

export function useGetNearhospitals(latitude, longitude) {
  const { isPending, data: hospitals } = useQuery({
    queryKey: ['Nearest-hospitals', latitude, longitude],
    queryFn: () => getHospitals({ latitude, longitude }),
    retry: 0,
    enabled: !!latitude && !!longitude,
  });

  return { isPending, hospitals };
}
