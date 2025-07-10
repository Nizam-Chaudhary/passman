import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import type { Password } from "@/schema/password";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "@/stores";

import { EditPasswordDialog } from "./edit-password-dialog";
import { ViewPasswordDialog } from "./view-password-dialog";

interface PasswordCardProps {
  password: Password;
}

export function PasswordCard({ password }: PasswordCardProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { selectedPasswords, toggleSelectPassword } = useStore(
    useShallow((state) => ({
      selectedPasswords: state.selectedPasswords,
      toggleSelectPassword: state.toggleSelectPassword,
    })),
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{password.name}</CardTitle>
          <Checkbox
            checked={selectedPasswords.includes(password.id)}
            onCheckedChange={() => toggleSelectPassword(password.id)}
          />
        </CardHeader>
        <CardContent>
          <p>{password.username}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setIsViewOpen(true)}>View</Button>
          <Button onClick={() => setIsEditOpen(true)}>Edit</Button>
        </CardFooter>
      </Card>
      <ViewPasswordDialog
        password={password}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />
      <EditPasswordDialog
        password={password}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}
