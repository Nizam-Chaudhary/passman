import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useToast } from "@/hooks/use-toast";
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
    }))
  );
  const { toast } = useToast();
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
                toast({
                  title: "Copied to clipboard",
                  description: "Recovery key copied to clipboard",
                  className: "bg-green-700",
                });
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
