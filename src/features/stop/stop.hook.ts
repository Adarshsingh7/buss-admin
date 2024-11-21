import { useMutation } from "@tanstack/react-query";
import { stop } from "./stop.methods";

const useGetAllStop = () => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: stop.getAllStops,
  });

  return { fetchAllStop: mutate, stops: data, isPending };
};

export { useGetAllStop };
