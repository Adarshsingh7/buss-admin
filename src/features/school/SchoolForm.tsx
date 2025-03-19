import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SchoolType } from "@/types";
import { toast } from "sonner";

interface SchoolFormProps {
  initialData?: SchoolType | null;
  onSubmit: (data: SchoolType) => void;
}

export function SchoolForm({ initialData, onSubmit }: SchoolFormProps) {
  const [formData, setFormData] = useState<SchoolType>(
    initialData || {
      _id: "",
      name: "",
      address: "",
      phone: "",
      email: "",
      logo: "",
      schoolCode: "",
      isActive: true,
    },
  );

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(formData);
    toast.success(
      `The Stop ${formData._id ? "Updated" : "Created"} successfully`,
    );
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit School" : "Create New School"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <div className="mt-1">
              <Input
                name="name"
                autoComplete="off"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="mt-1">
              <Input
                name="address"
                autoComplete="off"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <div className="mt-1">
              <Input
                name="phone"
                autoComplete="off"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1">
              <Input
                type="email"
                name="email"
                autoComplete="off"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Logo URL
            </label>
            <div className="mt-1">
              <Input
                name="logo"
                autoComplete="off"
                placeholder="Enter logo URL"
                value={formData.logo}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              School Code
            </label>
            <div className="mt-1">
              <Input
                name="schoolCode"
                autoComplete="off"
                placeholder="Enter school code"
                value={formData.schoolCode}
                onChange={handleChange}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            {initialData ? "Update School" : "Create School"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
