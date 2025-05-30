import { Skeleton } from "../ui/skeleton";

function NavUserSkeleton() {
    return (
        <div className="flex items-center space-x-3 p-2 w-full">
            <Skeleton className="h-8 w-8 rounded-lg" /> {/* Avatar skeleton */}
            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-24" /> {/* Username skeleton */}
                <Skeleton className="h-3 w-32" /> {/* Email skeleton */}
            </div>
            <Skeleton className="h-4 w-4 ml-auto" />{" "}
            {/* ChevronsUpDown icon skeleton */}
        </div>
    );
}

export default NavUserSkeleton;
