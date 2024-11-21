import React, {
  createContext,
  useState,
  useContext,
  useRef,
  ReactNode,
} from "react";

interface DialogContextProps {
  isDeleteDialogOpen: boolean;
  openDeleteDialog: (onDelete: () => void) => void;
  closeDeleteDialog: () => void;
  onDeleteRef: React.MutableRefObject<(() => void) | null>;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const onDeleteRef = useRef<(() => void) | null>(null);

  const openDeleteDialog = (onDelete: () => void) => {
    onDeleteRef.current = onDelete; // Store the callback in a ref
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    onDeleteRef.current = null; // Clear the ref
  };

  return (
    <DialogContext.Provider
      value={{
        isDeleteDialogOpen,
        openDeleteDialog,
        closeDeleteDialog,
        onDeleteRef,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
