import type { VariantProps } from "class-variance-authority";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

function ToastViewport({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> & {
  ref?: React.RefObject<React.ElementRef<typeof ToastPrimitives.Viewport> | null>;
}) {
  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className
      )}
      {...props}
    />
  );
}
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Toast({
  ref,
  className,
  variant,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
  VariantProps<typeof toastVariants> & {
    ref?: React.RefObject<React.ElementRef<typeof ToastPrimitives.Root> | null>;
  }) {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
}
Toast.displayName = ToastPrimitives.Root.displayName;

function ToastAction({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> & {
  ref?: React.RefObject<React.ElementRef<typeof ToastPrimitives.Action> | null>;
}) {
  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        "hover:bg-secondary focus:ring-ring group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
ToastAction.displayName = ToastPrimitives.Action.displayName;

function ToastClose({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close> & {
  ref?: React.RefObject<React.ElementRef<typeof ToastPrimitives.Close> | null>;
}) {
  return (
    <ToastPrimitives.Close
      ref={ref}
      className={cn(
        "text-foreground/50 hover:text-foreground absolute right-1 top-1 rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
        className
      )}
      toast-close=""
      {...props}
    >
      <X className="h-4 w-4" />
    </ToastPrimitives.Close>
  );
}
ToastClose.displayName = ToastPrimitives.Close.displayName;

function ToastTitle({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> & {
  ref?: React.RefObject<React.ElementRef<typeof ToastPrimitives.Title> | null>;
}) {
  return (
    <ToastPrimitives.Title
      ref={ref}
      className={cn("text-sm font-semibold [&+div]:text-xs", className)}
      {...props}
    />
  );
}
ToastTitle.displayName = ToastPrimitives.Title.displayName;

function ToastDescription({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description> & {
  ref?: React.RefObject<React.ElementRef<typeof ToastPrimitives.Description> | null>;
}) {
  return (
    <ToastPrimitives.Description
      ref={ref}
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  );
}
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  Toast,
  ToastAction,
  type ToastActionElement,
  ToastClose,
  ToastDescription,
  type ToastProps,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};
