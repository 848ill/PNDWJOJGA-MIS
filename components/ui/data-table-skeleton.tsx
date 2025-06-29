import { Skeleton } from "@/components/ui/skeleton"

export function DataTableSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="rounded-md border">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-6 rounded-sm" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 flex-1" />
          </div>
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
             <div key={i} className="flex items-center space-x-4">
               <Skeleton className="h-5 w-5 rounded-sm" />
               <Skeleton className="h-5 flex-1" />
               <Skeleton className="h-5 flex-1" />
               <Skeleton className="h-5 flex-1" />
               <Skeleton className="h-5 flex-1" />
             </div>
          ))}
        </div>
      </div>
       <div className="flex items-center justify-end space-x-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
} 