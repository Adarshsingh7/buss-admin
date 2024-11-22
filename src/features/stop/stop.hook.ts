import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stop } from "./stop.methods";
import { StopType } from "@/types";
import { toast } from "sonner";
import { AxiosError } from "axios";

const useGetAllStop = () => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: stop.getAllStops,
  });

  return { fetchAllStop: mutate, stops: data, isPending };
};

const useUpdateStop = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (body: StopType) => stop.updateStop(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stop"] });
      toast.success("The Stop updated successfully");
    },
    onError: (err: AxiosError) => {
      toast.error(
        (err.response?.data as { message?: string })?.message ||
          "Failed to update route",
      );
    },
  });
  return { updateStop: mutate, isPending };
};

const useCreateStop = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (body: StopType) => stop.createStop(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stop"] });
      toast.success("The Stop created successfully");
    },
    onError: (err: AxiosError) => {
      toast.error(
        (err.response?.data as { message?: string })?.message ||
          "Failed to create stop",
      );
    },
  });
  return { createStop: mutate, isPending };
};

const useDeleteStop = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => stop.deleteStop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stop"] });
      toast.success("The Stop deleted successfully");
    },
    onError: (err: AxiosError) => {
      toast.error(
        (err.response?.data as { message?: string })?.message ||
          "Failed to delete stop",
      );
    },
  });
  return { deleteStop: mutate, isPending };
};

export { useGetAllStop, useCreateStop, useUpdateStop, useDeleteStop };
