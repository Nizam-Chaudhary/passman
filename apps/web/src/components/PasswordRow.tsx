import { useSearchParams } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { getInitials } from "@/lib/utils";

interface Props {
    name?: string;
    id: string;
    url: string;
    username: string;
    faviconUrl?: string;
}

export function PasswordRow({ name, id, url, username, faviconUrl }: Props) {
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <div
            onClick={() => {
                searchParams.set("p", id);
                setSearchParams(searchParams);
            }}
        >
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
                                : faviconUrl
                                  ? getInitials(faviconUrl)
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
        </div>
    );
}
