"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon, LucideIcon } from "lucide-react";

function Input({
  className,
  type,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  toggleablePassword,
  ...props
}: React.ComponentProps<"input"> & {
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  toggleablePassword?: boolean;
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPasswordType = type === "password" && toggleablePassword;

  return (
    <div className="relative flex w-full min-w-0">
      {LeftIcon && (
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <LeftIcon className="!size-4" />
        </div>
      )}
      <input
        type={isPasswordType ? (showPassword ? "text" : "password") : type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          LeftIcon && "peer ps-9",
          (RightIcon || toggleablePassword) && "peer pe-9",
          className
        )}
        {...props}
      />
      {toggleablePassword ? (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="!w-9.5 text-muted-foreground flex justify-center items-center focus-visible:ring-ring/50 absolute inset-y-0 end-0 rounded-s-none hover:bg-transparent"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOffIcon className="!size-4" />
          ) : (
            <EyeIcon className="!size-4" />
          )}
        </button>
      ) : (
        RightIcon && (
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
            <RightIcon className="!size-4" />
          </div>
        )
      )}
    </div>
  );
}

export { Input };
