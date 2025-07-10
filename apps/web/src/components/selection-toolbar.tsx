import { useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { useDeleteMultiplePasswords } from "@/services/mutations/password";
import { useStore } from "@/stores";

export function SelectionToolbar() {
  const queryClient = useQueryClient();
  const { selectedPasswords, clearSelectedPasswords } = useStore(
    useShallow((state) => ({
      selectedPasswords: state.selectedPasswords,
      clearSelectedPasswords: state.clearSelectedPasswords,
    })),
  );

  const deleteMultiplePasswordsMutation = useDeleteMultiplePasswords();

  const handleDelete = () => {
    deleteMultiplePasswordsMutation.mutate(selectedPasswords, {
      onSuccess: () => {
        clearSelectedPasswords();
        queryClient.invalidateQueries({ queryKey: ["passwords"] });
      },
    });
  };

  if (selectedPasswords.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-10 rounded-lg bg-gray-800 p-4 shadow-lg">
      <div className="flex items-center gap-4">
        <p className="text-white">{selectedPasswords.length} selected</p>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleteMultiplePasswordsMutation.isPending}
        >
          {deleteMultiplePasswordsMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
        <Button onClick={clearSelectedPasswords}>Cancel</Button>
      </div>
    </div>
  );
}
