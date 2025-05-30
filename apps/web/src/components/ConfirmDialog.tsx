import { cn } from "@/lib/utils";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import LoadingSpinner from "./ui/loadingSpinner";

interface Props {
    title: string;
    description: string;
    variant:
        | "link"
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost";
    onClick: () => void;
    isPending?: boolean;
}

export default function ConfirmDialog(props: Props) {
    const { title, description, variant, onClick, isPending } = props;
    const { open, setOpen } = useStore(
        useShallow((state) => ({
            open: state.openDeletePasswordDialog,
            setOpen: state.setOpenDeletePasswordDialog,
        }))
    );
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className={cn(
                            variant === "destructive"
                                ? "w-16 bg-red-700"
                                : "w - 16"
                        )}
                        variant={variant}
                        onClick={onClick}
                        disabled={isPending}
                    >
                        {isPending ? <LoadingSpinner /> : "Yes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
