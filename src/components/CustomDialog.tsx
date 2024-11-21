import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomDialogProps {
  dialoagOpen: boolean;
  label: string;
  children: React.ReactNode;
  onOpenChange: (el: boolean) => void;
}

export function CustomDialog({
  dialoagOpen,
  label,
  children,
  onOpenChange,
}: CustomDialogProps) {
  return (
    <Dialog open={dialoagOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-[425px] max-w-[60vw]">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            {/* Make changes to your profile here. Click save when you're done. */}
          </DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          {/* <Button type="button" onClick={onSave}>
            Save changes
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
