import * as React from "react";

import { cn } from "@/lib/utils";

function Card({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={ref}
      className={cn("bg-card text-card-foreground rounded-xl border shadow", className)}
      {...props}
    />
  );
}
Card.displayName = "Card";

function CardHeader({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
  return <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}
CardHeader.displayName = "CardHeader";

function CardTitle({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={ref}
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}
CardTitle.displayName = "CardTitle";

function CardDescription({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
  return <div ref={ref} className={cn("text-muted-foreground text-sm", className)} {...props} />;
}
CardDescription.displayName = "CardDescription";

function CardContent({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
  return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />;
}
CardContent.displayName = "CardContent";

function CardFooter({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
  return <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
