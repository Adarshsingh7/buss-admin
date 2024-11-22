import { useState } from "react";
import { ArrowUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useGetUnAllocatedStops } from "@/utils/useGetUnAllocatedStops";
import { useQuery } from "@tanstack/react-query";
import { RouteType, StopType } from "@/types";

interface RouteFormProps {
  initialData?: RouteType;
  onSubmit: (data: RouteType) => void;
}

export function RouteForm({ initialData, onSubmit }: RouteFormProps) {
  const { remainingStops } = useGetUnAllocatedStops();
  const { data: stops } = useQuery<StopType[]>({ queryKey: ["stop"] });

  const [routeNumber, setRouteNumber] = useState<number>(
    initialData?.routeNumber || 0,
  );
  const [routeName, setRouteName] = useState<string>(
    initialData?.routeName || "",
  );
  const [status, setStatus] = useState<"arrival" | "return">(
    initialData?.status || "arrival",
  );
  const [totalStops, setTotalStops] = useState<string[]>(
    initialData?.stops || [],
  );
  const [unSelectedStops, setUnSelectedStops] = useState<StopType[]>(
    remainingStops || [],
  );

  const handleAddStop = (stopId: string) => {
    if (stopId && !totalStops.includes(stopId)) {
      setTotalStops((curr) => [...curr, stopId]);
      setUnSelectedStops((curr) => curr.filter((stop) => stop._id !== stopId));
    }
  };

  const handleRemoveStop = (index: number) => {
    const updatedStops = [...totalStops];
    const removedStop = updatedStops.splice(index, 1)[0];
    setTotalStops(updatedStops);
    setUnSelectedStops((curr) => {
      const stopToAdd = stops?.find((stop) => stop._id === removedStop);
      if (stopToAdd) {
        return [...curr, stopToAdd];
      }
      return curr;
    });
  };

  const handleSwapStops = (indexA: number, indexB: number) => {
    const updatedStops = [...totalStops];
    [updatedStops[indexA], updatedStops[indexB]] = [
      updatedStops[indexB],
      updatedStops[indexA],
    ];
    setTotalStops(updatedStops);
  };

  const formSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const data: RouteType = {
      _id: initialData?._id || "",
      routeNumber,
      routeName,
      stops: totalStops,
      status,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={formSubmit} className="flex flex-col md:flex-row gap-4 p-4">
      {/* Route Details */}
      <Card className="flex-1">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Route Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="routeNumber">Route Number</Label>
                <Input
                  id="routeNumber"
                  type="number"
                  value={routeNumber}
                  onChange={(e) => setRouteNumber(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="routeName">Route Name</Label>
                <Input
                  id="routeName"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value: "arrival" | "return") =>
                  setStatus(value)
                }
                defaultValue={status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arrival">Arrival</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Save Route
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Manage Stops */}
      <Card className="flex-1">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Manage Stops</h2>
          <ScrollArea className="h-[300px] border border-zinc-200 rounded-md p-2 dark:border-zinc-800">
            <ul className="space-y-2">
              {totalStops.map((stopId, index) => (
                <li
                  key={stopId}
                  className="flex items-center justify-between p-2 bg-zinc-100 rounded-md dark:bg-zinc-800"
                >
                  <span>
                    {stops?.find((stop) => stop._id === stopId)?.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSwapStops(index, index - 1)}
                        className="h-8 w-8"
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveStop(index)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
          <div className="mt-4">
            <Select onValueChange={handleAddStop} value="">
              <SelectTrigger>
                <SelectValue placeholder="Add stop" />
              </SelectTrigger>
              <SelectContent>
                {unSelectedStops
                  ?.filter((stop) => !totalStops.includes(stop._id))
                  .map((stop) => (
                    <SelectItem key={stop._id} value={stop._id}>
                      {stop.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
