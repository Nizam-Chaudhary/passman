import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { useStore } from "@/stores";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

function RecoveryKeyDialog() {
  const [buttonType, setButtonType] = useState<"copy" | "okay">("copy");
  const { open, onOpenChange, recoveryKey } = useStore(
    useShallow((state) => ({
      open: state.openRecoveryKeyDialog,
      onOpenChange: state.setOpenRecoveryKeyDialog,
      recoveryKey: state.recoveryKey,
    })),
  );
  const navigate = useNavigate();
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recovery Key</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Save this recovery key somewhere safe. This key will be required to recover your account.
        </DialogDescription>
        <Input value={recoveryKey ?? ""} onChange={() => {}} />
        <DialogFooter>
          {buttonType === "copy" ? (
            <Button
              onClick={() => {
                navigator.clipboard.writeText(recoveryKey ?? "");
                setButtonType("okay");
                toast.success("Copied to clipboard");
              }}
            >
              Copy
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={() => {
                onOpenChange(false);
                setButtonType("copy");
                navigate({ to: "/master-password/verify" });
              }}
            >
              Okay
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RecoveryKeyDialog;
