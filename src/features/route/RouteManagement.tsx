import { CustomDialog } from "@/components/CustomDialog";
import RichTable from "@/components/RichTable";
import { RouteForm } from "@/features/route/RouteForm";
import { useDialog } from "@/context/DialogContext";
import { RouteType } from "@/types";
import { useQuery } from "@tanstack/react-query";

import { FC, useState } from "react";
import { useCreateRoute, useDeleteRoute, useUpdateRoute } from "./route.hook";

const RouteManagement: FC = () => {
  const { openDeleteDialog } = useDialog();

  const { createRoute } = useCreateRoute();
  const { updateRoute } = useUpdateRoute();
  const { deleteRoute } = useDeleteRoute();

  const { data } = useQuery<RouteType[]>({ queryKey: ["route"] });
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

  if (!data) return null;
  const filteredData = data.map((el, i) => ({
    sno: i + 1,
    id: el._id,
    name: el.routeName,
    status: el.status,
    stops: el.stops.length,
  }));

  const handleDelete = (id: string) => {
    deleteRoute(id);
  };

  const handleEdit = (id: string) => {
    setEditDialogOpen(true);
    const toBeEditedData = data.find((el) => el._id === id);
    if (toBeEditedData) setActiveEditElement(toBeEditedData);
  };

  const handleAddRecord = () => {
    setEditDialogOpen(true);
    setActiveEditElement(null);
  };

  const handleSubmit = function (body: RouteType) {
    if (body._id) {
      updateRoute(body);
    } else {
      createRoute(body);
    }
    setEditDialogOpen(false);
    setActiveEditElement(null);
  };

  return (
    <div className="flex flex-col gap-10">
      <CustomDialog
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
