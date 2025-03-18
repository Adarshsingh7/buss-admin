import { useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolService } from "./school.methods";
import { SchoolType } from "@/types";
import { toast } from "sonner";
import { AxiosError } from "axios";

const useCreateSchool = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (body: Partial<SchoolType>) => schoolService.createSchool(body),
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["school"] });
    },
    onError: (err: AxiosError) => {
      toast.error(
        (err.response?.data as { message?: string })?.message ||
          "Failed to update school",
      );
    },
  });

  return { createSchool: mutate, isPending };
};

const useUpdateSchool = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (body: Partial<SchoolType>) =>
      schoolService.updateSchool(body._id || "", body),
    onSuccess: () => {
      toast.success("School update successfully");
      queryClient.invalidateQueries({ queryKey: ["school"] });
    },
    onError: (err: AxiosError) => {
      toast.error(
        (err.response?.data as { message?: string })?.message ||
          "Failed to update School",
      );
    },
  });
  return { updateSchool: mutate, isPending };
};

const useDeleteSchool = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => schoolService.deleteSchool(id),
    onSuccess: () => {
      toast.success("School deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["school"] });
    },
    onError: (err: AxiosError) => {
      toast.error(
        (err.response?.data as { message?: string })?.message ||
          "Failed to delete School",
      );
    },
  });

  return { deleteSchool: mutate, isPending };
};

export { useCreateSchool, useUpdateSchool, useDeleteSchool };
