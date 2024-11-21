import { RouteType, StopType } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useGetUnAllocatedStops = () => {
  const { data: stops } = useQuery<StopType[]>({
    queryKey: ["stop"],
  });
  const { data: routes } = useQuery<RouteType[]>({
    queryKey: ["route"],
  });

  const remainingStops = stops?.filter(
    (stop) => !routes?.some((route) => route.stops.includes(stop._id)),
  );

  return {
    remainingStops,
  };
};

export { useGetUnAllocatedStops };
