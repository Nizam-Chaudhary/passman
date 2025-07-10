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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeletePassword } from "@/services/mutations/password";

interface EditPasswordDialogProps {
  password: Password;
  isOpen: boolean;
  onClose: () => void;
}

export function EditPasswordDialog({ password, isOpen, onClose }: EditPasswordDialogProps) {
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
          <DialogTitle>Edit Password</DialogTitle>
          <DialogDescription>
            Make changes to your password here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={password.name} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value={password.username} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input id="password" value={password.password} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deletePasswordMutation.isPending}
          >
            {deletePasswordMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
