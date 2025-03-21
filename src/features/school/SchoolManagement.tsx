import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDialog } from "@/context/DialogContext";
import { SchoolType, UserType } from "@/types";
import { CustomDialog } from "@/components/CustomDialog";
import RichTable from "@/components/RichTable";
import { SchoolForm } from "./SchoolForm";
import {
  useCreateSchool,
  useDeleteSchool,
  useUpdateSchool,
} from "./school.hook";
import { BackdropLoader } from "@/components/BackdropLoader";

const SchoolManagement: FC = () => {
  const { openDeleteDialog } = useDialog();

  const { data: schools, isLoading } = useQuery<SchoolType[]>({
    queryKey: ["schools"],
  });
  const { data: currentUser, isLoading: isUserLoading } = useQuery<UserType>({
    queryKey: ["auth"],
  });
  const { createSchool } = useCreateSchool();
  const { updateSchool } = useUpdateSchool();
  const { deleteSchool } = useDeleteSchool();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeEditElement, setActiveEditElement] = useState<SchoolType | null>(
    null,
  );

  const handleDelete = (id: string) => {
    deleteSchool(id);
  };

  // used to edit the routes
  const handleEdit = (id: string) => {
    setEditDialogOpen(true);
    const school = schools?.find((school) => school._id === id);
    if (school) {
      setActiveEditElement(school);
    }
  };

  // used to add new routes
  const handleAddRecord = () => {
    setEditDialogOpen(true);
    setActiveEditElement(null);
  };

  // final submit function for the form
  const handleSubmit = (body: Partial<SchoolType>) => {
    if (body._id) {
      const data = updateSchool(body);
      console.log(data);
    } else {
      const data = createSchool(body);
      console.log(data);
    }
  };

  if (!schools)
    return <BackdropLoader isLoading={isLoading || isUserLoading} />;

  // this is used to filter the record to show in the table

  if (currentUser?.role === "admin") return null;

  const filteredData = schools.map((el, i) => ({
    sno: i + 1,
    id: el._id,
    name: el.name,
    email: el.email,
    schoolCode: el.schoolCode,
    phone: el.phone,
    logo: el.logo,
    address: el.address,
    isActive: el.isActive,
  }));

  const mapping = [
    { label: "SNO.", field: "sno" },
    { label: "Name", field: "name" },
    { label: "School Code", field: "schoolCode" },
    { label: "Email", field: "email" },
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
        <SchoolForm
          defaultValues={activeEditElement}
          onSubmit={handleSubmit}
          isUpdateMode={true}
        />
      </CustomDialog>
      <RichTable
        onAddRecord={handleAddRecord}
        initialData={filteredData}
        mapping={mapping}
        onDelete={(id) => openDeleteDialog(() => handleDelete(id))}
        label="School  List"
        onEdit={handleEdit}
      />
    </div>
  );
};

export default SchoolManagement;
