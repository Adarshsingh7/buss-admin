import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDialog } from "@/context/DialogContext";
import { SchoolType } from "@/types";
import { CustomDialog } from "@/components/CustomDialog";
import RichTable from "@/components/RichTable";
import { SchoolForm } from "./SchoolForm";
import {
  useCreateSchool,
  useDeleteSchool,
  useUpdateSchool,
} from "./school.hook";
import { BackdropLoader } from "@/components/BackdropLoader";
// import { School } from "lucide-react";

const SchoolManagement: FC = () => {
  const { openDeleteDialog } = useDialog();

  const { data, isLoading } = useQuery<SchoolType[]>({ queryKey: ["school"] });
  const { createSchool } = useCreateSchool();
  const { updateSchool } = useUpdateSchool();
  const { deleteSchool } = useDeleteSchool();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeEditElement, setActiveEditElement] = useState<SchoolType | null>(
    null,
  );

  // used to edit the routes
  const handleEdit = (id: string) => {
    setEditDialogOpen(true);
    const toBeEditedData = data?.find((el) => el._id === id);
    if (toBeEditedData) setActiveEditElement(toBeEditedData);
  };

  // used to add new routes
  const handleAddRecord = () => {
    setEditDialogOpen(true);
    setActiveEditElement(null);
  };

  // final submit function for the form
  const handleSubmit = (body: SchoolType) => {
    if (body._id) {
      updateSchool(body);
    } else {
      createSchool(body);
    }
    setEditDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteSchool(id);
  };

  if (isLoading) return <BackdropLoader isLoading={isLoading} />;
  if (!data) return null;

  // this is used to filter the record to show in the table
  const filteredData = data.map((el, i) => ({
    sno: i + 1,
    id: el._id,
    address: el.address.slice(0, 40) + (el.address.length > 40 ? "..." : ""),
    phone: el.phone,
    email: el.email,
    logo: el.logo,
    schoolCode: el.schoolCode,
    name: el.name,
  }));

  const mapping = [
    { label: "SNO.", field: "sno" },
    // { label: "Phone", field: "phone" },
    // { label: "Email", field: "email" },
    { label: "Logo", field: "logo" },
    { label: "Name", field: "name" },
    { label: "School Code", field: "schoolCode" },
    { label: "Address", field: "address" },
  ];

  return (
    <div className="flex flex-col gap-10">
      <CustomDialog
        width={30}
        dialoagOpen={editDialogOpen}
        label="Edit Routes"
        onOpenChange={setEditDialogOpen}
      >
        <SchoolForm initialData={activeEditElement} onSubmit={handleSubmit} />
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

export default SchoolManagement;
