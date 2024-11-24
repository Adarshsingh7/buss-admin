import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDialog } from "@/context/DialogContext";
import { UserType } from "@/types";
import { CustomDialog } from "@/components/CustomDialog";
import RichTable from "@/components/RichTable";
import { UserForm } from "./UserForm";
import { useCreteUser, useDeleteUser, useUpdateUser } from "./user.hook";
// import { useCreateRoute, useDeleteRoute, useUpdateRoute } from "./route.hook";

const UserManagement: FC = () => {
  const { openDeleteDialog } = useDialog();

  const { data: users } = useQuery<UserType[]>({ queryKey: ["user"] });
  const { createUser } = useCreteUser();
  const { updateUser } = useUpdateUser();
  const { deleteUser } = useDeleteUser();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeEditElement, setActiveEditElement] = useState<UserType | null>(
    null,
  );

  const handleDelete = (id: string) => {
    deleteUser(id);
  };

  // used to edit the routes
  const handleEdit = (id: string) => {
    setEditDialogOpen(true);
    const user = users?.find((user) => user._id === id);
    if (user) {
      setActiveEditElement(user);
    }
  };

  // used to add new routes
  const handleAddRecord = () => {
    setEditDialogOpen(true);
    setActiveEditElement(null);
  };

  // final submit function for the form
  const handleSubmit = (body: Partial<UserType>) => {
    if (body._id) {
      const data = updateUser(body);
      console.log(data);
    } else {
      const data = createUser(body);
      console.log(data);
    }
  };

  if (!users) return null;

  // this is used to filter the record to show in the table
  const filteredData = users.map((el, i) => ({
    sno: i + 1,
    id: el._id,
    name: el.name,
    email: el.email,
    role: el.role,
    phone: el.phone,
  }));

  const mapping = [
    { label: "SNO.", field: "sno" },
    { label: "Name", field: "name" },
    { label: "Email", field: "email" },
    { label: "Role", field: "role" },
    { label: "Phone", field: "phone" },
  ];

  return (
    <div className="flex flex-col gap-10">
      <CustomDialog
        width={55}
        dialoagOpen={editDialogOpen}
        label="Edit Routes"
        onOpenChange={setEditDialogOpen}
      >
        <UserForm initialData={activeEditElement} onSubmit={handleSubmit} />
      </CustomDialog>
      <RichTable
        onAddRecord={handleAddRecord}
        initialData={filteredData}
        mapping={mapping}
        onDelete={(id) => openDeleteDialog(() => handleDelete(id))}
        label="Employee List"
        onEdit={handleEdit}
      />
    </div>
  );
};

export default UserManagement;
