import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldXIcon, HomeIcon } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <ShieldXIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Akses Ditolak
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator sistem untuk mendapatkan akses yang diperlukan.
          </p>
          
          <div className="pt-4">
            <Button asChild className="w-full">
              <Link href="/" className="flex items-center justify-center gap-2">
                <HomeIcon className="w-4 h-4" />
                Kembali ke Dashboard
              </Link>
            </Button>
          </div>
          
          <div className="pt-2 text-sm text-gray-500 dark:text-gray-400">
            <p>Kode Error: 403 - Forbidden</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 