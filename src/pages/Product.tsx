import RichTable from "@/components/RichTable";
import { useDialog } from "@/context/DialogContext";

import { FC } from "react";
import { toast } from "sonner";

const Product: FC = () => {
  const { openDeleteDialog } = useDialog();
  const initialData = [
    {
      id: 1,
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      role: "Developer",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 28,
      email: "jane@example.com",
      role: "Designer",
    },
    {
      id: 3,
      name: "Bob Johnson",
      age: 35,
      email: "bob@example.com",
      role: "Manager",
    },
    {
      id: 4,
      name: "Alice Brown",
      age: 26,
      email: "alice@example.com",
      role: "Developer",
    },
    {
      id: 5,
      name: "Charlie Wilson",
      age: 32,
      email: "charlie@example.com",
      role: "Designer",
    },
    {
      id: 6,
      name: "Eva Davis",
      age: 29,
      email: "eva@example.com",
      role: "Manager",
    },
    {
      id: 7,
      name: "Frank Miller",
      age: 31,
      email: "frank@example.com",
      role: "Developer",
    },
  ];

  const mapping = [
    { label: "ID", field: "id" },
    { label: "Name", field: "name" },
    { label: "Age", field: "age" },
    { label: "Email", field: "email" },
    { label: "Role", field: "role" },
  ];

  const handleDelete = () => {
    toast.success("Employee deleted successfully!");
  };

  const handleEdit = (id: number | string) => {
    console.log(`Edit item with id: ${id}`);
  };

  return (
    <div className="flex flex-col gap-10">
      <RichTable
        initialData={initialData}
        mapping={mapping}
        onDelete={() => openDeleteDialog(handleDelete)}
        label="Employee List"
        // onEdit={handleEdit}
        onAddRecord={() => {}}
        onEdit={(id) => handleEdit(id)}
      />
    </div>
  );
};

export default Product;
