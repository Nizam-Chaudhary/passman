import { Link } from "@tanstack/react-router";

import { getInitials } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

interface Props {
  name?: string;
  id: string;
  url: string;
  username: string;
  faviconUrl?: string;
}

export function PasswordRow({ name, id, url, username, faviconUrl }: Props) {
  return (
    <Link from="/" to="." search={(prev) => ({ ...prev, p: Number.parseInt(id) })}>
      <div className="ml-1 flex cursor-pointer items-center justify-center p-2">
        <div className="flex w-8 cursor-pointer items-center justify-center">
          <Avatar className="h-10 w-10 rounded-lg">
            <AvatarImage loading="lazy" src={faviconUrl} alt="Icon" />
            <AvatarFallback>
              {name ? getInitials(name) : url ? getInitials(url) : ""}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-4 flex flex-1 cursor-pointer flex-col justify-center">
          <Label className="block cursor-pointer text-nowrap text-base font-bold">{url}</Label>
          <Label className="block cursor-pointer text-nowrap text-sm text-gray-400">
            {username}
          </Label>
        </div>
      </div>
      <div className="mx-2 my-1">
        <Separator />
      </div>
    </Link>
  );
}
