// app/(dashboard)/it-support/page.tsx
import { Card, CardContent } from "@/components/ui/card";
import { MotionDiv } from "@/components/shared/MotionDiv";
import { Wrench } from "lucide-react";

// IMPORTANT: This page should only be accessible by 'system_admin' and 'it_support' roles.
export default function ITSupportPage() {
  return (
    <MotionDiv
        className="h-full flex-1 flex-col space-y-8 p-8 md:flex"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex items-center justify-between space-y-2">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-800">Dukungan IT</h2>
                <p className="text-muted-foreground">
                    Alat dan utilitas untuk personel dukungan teknis.
                </p>
            </div>
        </div>

        <Card variant="glass" className="flex-grow">
            <CardContent className="h-full flex flex-col items-center justify-center p-6">
                <div className="text-center text-muted-foreground">
                    <Wrench className="mx-auto h-20 w-20 text-blue-500/30 mb-6" />
                    <h3 className="text-2xl font-semibold text-gray-700">Segera Hadir</h3>
                    <p className="mt-2 max-w-md">
                        Area ini sedang dalam pengembangan dan akan segera berisi berbagai alat diagnostik, log sistem, dan utilitas manajemen untuk tim dukungan IT.
                    </p>
                </div>
            </CardContent>
        </Card>
    </MotionDiv>
  );
}