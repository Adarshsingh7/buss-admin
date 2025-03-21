import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDialog } from "@/context/DialogContext";
import { SchoolType, StopType } from "@/types";
import { CustomDialog } from "@/components/CustomDialog";
import RichTable from "@/components/RichTable";
import { StopForm } from "./StopForm";
import { useCreateStop, useDeleteStop, useUpdateStop } from "./stop.hook";
import { BackdropLoader } from "@/components/BackdropLoader";

const StopManagement: FC = () => {
  const { openDeleteDialog } = useDialog();
  const { data: schools } = useQuery<SchoolType>({ queryKey: ["schools"] });
  const { data, isLoading } = useQuery<StopType[]>({ queryKey: ["stop"] });
  const { createStop } = useCreateStop();
  const { updateStop } = useUpdateStop();
  const { deleteStop } = useDeleteStop();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeEditElement, setActiveEditElement] = useState<StopType | null>(
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
  const handleSubmit = (body: StopType) => {
    if (body._id) {
      updateStop(body);
    } else {
      createStop({ ...body, school: schools?._id });
    }
    setEditDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteStop(id);
  };

  if (isLoading) return <BackdropLoader isLoading={isLoading} />;
  if (!data) return null;

  // this is used to filter the record to show in the table
  const filteredData = data.map((el, i) => ({
    sno: i + 1,
    id: el._id,
    address: el.address.slice(0, 40) + (el.address.length > 40 ? "..." : ""),
    lat: el.latitude.toFixed(5),
    lng: el.longitude.toFixed(5),
    name: el.name,
  }));

  const mapping = [
    { label: "SNO.", field: "sno" },
    { label: "Lat", field: "lat" },
    { label: "Lng", field: "lng" },
    { label: "Name", field: "name" },
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
        <StopForm initialData={activeEditElement} onSubmit={handleSubmit} />
      </CustomDialog>
      <RichTable
        onAddRecord={handleAddRecord}
        initialData={filteredData}
        mapping={mapping}
        onDelete={(id) => openDeleteDialog(() => handleDelete(id))}
        label="Stop List"
        onEdit={handleEdit}
      />
    </div>
  );
};

export default StopManagement;
