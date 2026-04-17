import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Package,
  ArrowLeft,
  Phone,
  Clock,
  CheckCircle2,
  Navigation,
  FileText,
  Upload,
} from "lucide-react"

export default async function CarrierCurrentJobPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/auth/login')

  // Fetch the current active job for this carrier
  const { data: activeJob, error } = await supabase
    .from('shipments')
    .select(`
      *,
      commercant:profiles!shipments_commercant_id_fkey(full_name, company_name, phone)
    `)
    .eq('camionneur_id', user.id)
    .not('status', 'in', '("delivered","cancelled")')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) console.error('Error fetching current job:', error)

  if (!activeJob) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">No Active Jobs</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          You don't have any assigned shipments at the moment. Browse the dashboard to find available loads.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/dashboard/camionneur">Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/camionneur">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Assignment</h1>
          <p className="text-muted-foreground">Detailed route and cargo information for your current job</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Job Info */}
        <Card className="md:col-span-2 border-none shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  {activeJob.reference_number || activeJob.id.slice(0, 8)}
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  {activeJob.cargo_type} • {activeJob.weight_kg} kg
                </CardDescription>
              </div>
              <Badge className="bg-white text-primary hover:bg-white/90">
                {activeJob.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Route */}
            <div className="relative pl-8 space-y-8">
               <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-muted-foreground/30" />
               
               <div className="relative">
                  <div className="absolute -left-9 top-1 h-3 w-3 rounded-full border-2 border-primary bg-background shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.1)]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Origin</p>
                    <p className="font-bold text-lg text-foreground">{activeJob.origin_city}, {activeJob.origin_wilaya}</p>
                    <p className="text-sm text-muted-foreground">{activeJob.origin_address}</p>
                  </div>
               </div>

               <div className="relative">
                  <div className="absolute -left-9 top-1 h-3 w-3 rounded-full border-2 border-accent bg-background shadow-[0_0_0_4px_rgba(var(--accent-rgb),0.1)]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Destination</p>
                    <p className="font-bold text-lg text-foreground">{activeJob.destination_city}, {activeJob.destination_wilaya}</p>
                    <p className="text-sm text-muted-foreground">{activeJob.destination_address}</p>
                  </div>
               </div>
            </div>

            {/* Merchant Info */}
            <div className="rounded-xl bg-muted/30 p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Navigation className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Merchant Contact</p>
                    <p className="font-bold text-foreground">{activeJob.commercant?.company_name || activeJob.commercant?.full_name}</p>
                  </div>
               </div>
               <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${activeJob.commercant?.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </a>
               </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Update Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start overflow-hidden relative group h-12" variant="outline">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                Mark as Picked Up
                <div className="absolute inset-0 bg-green-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform" />
              </Button>
              <Button className="w-full justify-start overflow-hidden relative group h-12" variant="outline">
                <Navigation className="mr-2 h-4 w-4 text-primary" />
                In Transit
                <div className="absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform" />
              </Button>
              <Button className="w-full justify-start overflow-hidden relative group h-12" variant="default">
                <Package className="mr-2 h-4 w-4" />
                Delivered
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-start h-auto py-3 border-2 border-dashed border-accent/20 hover:border-accent/40" asChild>
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-5 w-5 text-accent" />
                  <span className="text-xs font-bold uppercase">Upload Proof</span>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
