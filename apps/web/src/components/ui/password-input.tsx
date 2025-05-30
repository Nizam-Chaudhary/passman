import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { forwardRef, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

const PasswordInput = forwardRef<HTMLInputElement, ComponentProps<"input">>(
    ({ className, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    ref={ref}
                    className={cn("hide-password-toggle", className)}
                    {...props}
                />
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowPassword((prev) => !prev);
                    }}
                    className="absolute right-0 top-0 h-full hover:bg-transparent"
                >
                    {showPassword ? (
                        <EyeOffIcon className="size-4" aria-hidden="true" />
                    ) : (
                        <EyeIcon className="size-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                    </span>
                </Button>

                {/* hides browsers password toggles */}
                <style>
                    {`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}
                </style>
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
