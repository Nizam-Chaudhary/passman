import { getInitials } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
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
        <Link from="/" to="." search={{ p: parseInt(id) }}>
            <div className="flex ml-1 items-center justify-center p-2 cursor-pointer">
                <div className="flex items-center justify-center w-8 cursor-pointer">
                    <Avatar className="w-10 h-10 rounded-lg">
                        <AvatarImage
                            loading="lazy"
                            src={faviconUrl}
                            alt="Icon"
                        />
                        <AvatarFallback>
                            {name
                                ? getInitials(name)
                                : url
                                  ? getInitials(url)
                                  : ""}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex flex-1 ml-4 justify-center flex-col cursor-pointer">
                    <Label className="block text-base text-nowrap font-bold cursor-pointer">
                        {url}
                    </Label>
                    <Label className="block text-sm text-nowrap text-gray-400 cursor-pointer">
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
