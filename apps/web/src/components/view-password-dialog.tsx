import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { Password } from "@/schema/password";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeletePassword } from "@/services/mutations/password";

interface ViewPasswordDialogProps {
  password: Password;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewPasswordDialog({ password, isOpen, onClose }: ViewPasswordDialogProps) {
  const queryClient = useQueryClient();
  const deletePasswordMutation = useDeletePassword();

  const handleDelete = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        deletePasswordMutation.mutate(
          { id: password.id },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["passwords"] });
              onClose();
              resolve("Password deleted successfully!");
            },
            onError: (error) => {
              reject(error.message || "Failed to delete password.");
            },
          },
        );
      }),
      {
        loading: "Deleting password...",
        success: (data) => data,
        error: (error) => error,
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{password.name}</DialogTitle>
          <DialogDescription>{password.url}</DialogDescription>
        </DialogHeader>
        <div>
          <p>
            <strong>Username:</strong> {password.username}
          </p>
          <p>
            <strong>Password:</strong> {password.password}
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deletePasswordMutation.isPending}
          >
            {deletePasswordMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
