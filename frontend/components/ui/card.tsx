import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        glass:
          "bg-white/60 backdrop-blur-xl border-white/20 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
        premium: 
          "bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border border-white/30 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl hover:bg-gradient-to-br hover:from-white/95 hover:to-white/80",
        floating:
          "bg-white/80 backdrop-blur-md border border-indigo-100/50 shadow-lg shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/20",
        neon:
          "bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/40 hover:border-cyan-400/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
))
Card.displayName = "Card"

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-2/3 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-4 rounded-full bg-muted animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-1/3 rounded-md bg-muted animate-pulse" />
      </CardContent>
    </Card>
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardSkeleton,
}
