import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RouteType, StopType, UserType } from "@/types";
import { useQuery } from "@tanstack/react-query";

const formCreateSchema = z
  .object({
    _id: z.string().optional(),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email.",
    }),
    phone: z.string().min(10, {
      message: "Phone number must be at least 10 digits.",
    }),
    role: z.enum(["student", "driver", "admin"]),
    route: z.string().min(1, {
      message: "Please select a route.",
    }),
    stop: z.string().optional(),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

// const formUpdateSchema = z.object({
//   _id: z.string().optional(),
//   name: z
//     .string()
//     .min(2, {
//       message: "Name must be at least 2 characters.",
//     })
//     .optional(),
//   email: z
//     .string()
//     .email({
//       message: "Please enter a valid email.",
//     })
//     .optional(),
//   phone: z
//     .string()
//     .min(10, {
//       message: "Phone number must be at least 10 digits.",
//     })
//     .optional(),
//   role: z.enum(["student", "driver", "admin"]).optional(),
//   route: z.string().optional(),
//   stop: z.string().optional(),
//   password: z
//     .string()
//     .min(8, {
//       message: "Password must be at least 8 characters.",
//     })
//     .optional(),
//   passwordConfirm: z.string().optional(),
// });

interface UserFormTypes {
  initialData: UserType | null;
  onSubmit: (data: Partial<UserType>) => void;
}

export function UserForm({ initialData, onSubmit }: UserFormTypes) {
  const [role, setRole] = useState<"student" | "driver">("student");
  const { data: routes } = useQuery<RouteType[]>({ queryKey: ["route"] });
  const { data: stops } = useQuery<StopType[]>({ queryKey: ["stop"] });

  const createForm = useForm<z.infer<typeof formCreateSchema>>({
    resolver: zodResolver(formCreateSchema),
    defaultValues: {
      _id: "",
      name: "",
      email: "",
      phone: "",
      role: "student",
      route: "",
      stop: "",
      password: "",
      passwordConfirm: "",
    },
  });
  // const updateForm = useForm<z.infer<typeof formUpdateSchema>>({
  //   resolver: zodResolver(formUpdateSchema),
  //   defaultValues: {
  //     _id: initialData?._id,
  //     name: initialData?.name,
  //     email: initialData?.email,
  //     phone: initialData?.phone,
  //     role: initialData?.role,
  //     route: initialData?.route || "",
  //     stop: initialData?.stop || "",
  //     password: "",
  //     passwordConfirm: "",
  //   },
  // });

  const form = createForm;

  function handleSubmit(values: Partial<UserType>) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 grid gap-4"
        autoComplete="autoComplete"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@example.com"
                    {...field}
                    autoComplete="autoComplete"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1234567890"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={(value: "student" | "driver") => {
                    field.onChange(value);
                    setRole(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {routes?.length && (
            <FormField
              control={form.control}
              name="route"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a route" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route._id} value={route._id}>
                          {route.routeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {role === "student" && routes && stops && (
            <FormField
              control={form.control}
              name="stop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stop</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!form.watch("route")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a stop" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {routes
                        .find((el) => el._id === form.getValues().route)
                        ?.stops.map((stop) => (
                          <SelectItem key={stop} value={stop}>
                            {stops.find((el) => stop === el?._id)?.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          {initialData ? "Update User" : "Create User"}
        </Button>
      </form>
    </Form>
  );
}
