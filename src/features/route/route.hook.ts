import { useMutation, useQueryClient } from "@tanstack/react-query";
import { route } from "./route.methods";
import { RouteType } from "@/types";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useUpdateRoute = function () {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (body: RouteType) => route.updateRoute(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["route"] });
      toast.success("Route updated successfully");
    },
    onError: (err: AxiosError) => {
      toast.error(
        (err.response?.data as { message?: string })?.message ||
          "Failed to update route",
      );
    },
  });

  return { updateRoute: mutate, isPending };
};

export const useCreateRoute = function () {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (body: RouteType) => route.createRoute(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["route"] });
      toast.success("Route updated successfully");
    },
    onError: (err: AxiosError) => {
      toast.error(
        (err.response?.data as { message?: string })?.message ||
          "Failed to update route",
      );
    },
  });
  return {
    createRoute: mutate,
    isPending,
  };
};

export const useDeleteRoute = function () {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => route.deleteRoute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["route"] });
      toast.success("Route deleted successfully");
    },
    onError: (err: AxiosError) => {
      toast.error(
        (err.response?.data as { message?: string })?.message ||
          "Failed to delete route",
      );
    },
  });

  return { deleteRoute: mutate, isPending };
};
