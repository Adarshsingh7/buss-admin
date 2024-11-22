import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { MapPin } from 'lucide-react'
import { StopType } from "@/types";
import { CustomDialog } from "@/components/CustomDialog";
import InteractiveMap from "@/pages/InteractiveMap";
import { toast } from "sonner";

interface StopFormProps {
  initialData?: StopType | null;
  onSubmit: (data: StopType) => void;
}

export function StopForm({ initialData, onSubmit }: StopFormProps) {
  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState<StopType>(
    initialData || {
      _id: "",
      latitude: 0,
      longitude: 0,
      address: "",
      stopNumber: 1,
    },
  );

  async function handleFetchFromMap(body: {
    latitude: number;
    longitude: number;
    address: string;
  }) {
    setFormData({
      _id: formData._id,
      stopNumber: formData.stopNumber,
      address: body.address,
      latitude: body.latitude,
      longitude: body.longitude,
    });
    setIsFetching(false);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(formData);
    toast.success(
      `The Route ${formData._id ? "Updated" : "Created"} successfully`,
    );
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "latitude" || name === "longitude" || name === "stopNumber"
          ? parseFloat(value)
          : value,
    }));
  }

  return (
    <Card className="w-full max-w-md">
      <CustomDialog
        dialoagOpen={isFetching}
        label="Select Location From Map"
        onOpenChange={setIsFetching}
        width={90}
      >
        <InteractiveMap onAddressChange={handleFetchFromMap} />
      </CustomDialog>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Stop" : "Create New Stop"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => setIsFetching(true)}
          className="w-full mb-4"
          disabled={isFetching}
        >
          {isFetching ? "Fetching..." : "📍 Fetch from Map"}
        </Button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <div className="mt-1">
                <Input
                  type="number"
                  step="any"
                  name="latitude"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <div className="mt-1">
                <Input
                  type="number"
                  step="any"
                  name="longitude"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="mt-1">
              <Input
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stop Number
            </label>
            <div className="mt-1">
              <Input
                type="number"
                name="stopNumber"
                placeholder="Stop number"
                value={formData.stopNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            {initialData ? "Update Stop" : "Create Stop"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
