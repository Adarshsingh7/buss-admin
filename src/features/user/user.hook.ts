import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "./user.methods";
import { UserType } from "@/types";
import { toast } from "sonner";
import { AxiosError } from "axios";

const useCreteUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (body: Partial<UserType>) => userService.createUser(body),
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err: AxiosError) => {
      toast.error(
        (err.response?.data as { message?: string })?.message ||
          "Failed to update user",
      );
    },
  });

  return { createUser: mutate, isPending };
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (body: Partial<UserType>) =>
      userService.updateUser(body._id || "", body),
    onSuccess: () => {
      toast.success("User update successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err: AxiosError) => {
      toast.error(
        (err.response?.data as { message?: string })?.message ||
          "Failed to update User",
      );
    },
  });
  return { updateUser: mutate, isPending };
};

const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => userService.deleteUsers(id),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err: AxiosError) => {
      toast.error(
        (err.response?.data as { message?: string })?.message ||
          "Failed to delete User",
      );
    },
  });

  return { deleteUser: mutate, isPending };
};

export { useCreteUser, useUpdateUser, useDeleteUser };
