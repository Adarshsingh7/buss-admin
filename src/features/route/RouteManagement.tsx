import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDialog } from "@/context/DialogContext";
import { RouteType } from "@/types";
import { CustomDialog } from "@/components/CustomDialog";
import RichTable from "@/components/RichTable";
import { RouteForm } from "@/features/route/RouteForm";
import { useCreateRoute, useDeleteRoute, useUpdateRoute } from "./route.hook";

const RouteManagement: FC = () => {
  const { openDeleteDialog } = useDialog();

  const { data } = useQuery<RouteType[]>({ queryKey: ["route"] });

  const { createRoute } = useCreateRoute();
  const { updateRoute } = useUpdateRoute();
  const { deleteRoute } = useDeleteRoute();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeEditElement, setActiveEditElement] = useState<RouteType | null>(
    null,
  );

  const mapping = [
    { label: "SNO.", field: "sno" },
    { label: "ID", field: "id" },
    { label: "Name", field: "name" },
    { label: "Status", field: "status" },
    { label: "Stops", field: "stops" },
  ];

  const handleDelete = (id: string) => {
    deleteRoute(id);
  };

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
  const handleSubmit = (body: RouteType) => {
    console.log(body);
    if (body._id) {
      updateRoute(body);
    } else {
      createRoute(body);
    }
    setEditDialogOpen(false);
    setActiveEditElement(null);
  };

  if (!data) return null;

  // this is used to filter the record to show in the table
  const filteredData = data.map((el, i) => ({
    sno: i + 1,
    id: el._id,
    name: el.routeName,
    status: el.status,
    stops: el.stops.length,
  }));

  return (
    <div className="flex flex-col gap-10">
      <CustomDialog
        width={85}
        dialoagOpen={editDialogOpen}
        label="Edit Routes"
        onOpenChange={setEditDialogOpen}
      >
        <RouteForm
          onSubmit={handleSubmit}
          initialData={
            activeEditElement
              ? {
                  _id: activeEditElement._id,
                  routeNumber: activeEditElement.routeNumber,
                  routeName: activeEditElement.routeName,
                  status: activeEditElement.status,
                  stops: activeEditElement.stops,
                }
              : undefined
          }
        />
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

export default RouteManagement;
