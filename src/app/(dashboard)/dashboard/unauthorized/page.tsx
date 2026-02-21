import Link from "next/link"
import { ShieldX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                    <ShieldX size={28} className="text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                <p className="text-zinc-400 text-sm max-w-sm mx-auto mb-8">
                    You don't have permission to access this area. Please contact your administrator.
                </p>
                <Link href="/">
                    <Button className="rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold">
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    )
}