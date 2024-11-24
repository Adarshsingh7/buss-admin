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
  width: number;
}

export function CustomDialog({
  width,
  dialoagOpen,
  label,
  children,
  onOpenChange,
}: CustomDialogProps) {
  return (
    <Dialog open={dialoagOpen} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          minWidth: "425px",
          maxWidth: `${width}vw`,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
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
