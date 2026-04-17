import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MapPin,
  Package,
  Truck,
  User,
  Building2,
  Phone,
  Mail,
  FileText,
  Download,
  Clock,
  Navigation,
  Scale,
  CheckCircle2,
  Star,
} from "lucide-react"
import { redirect } from "next/navigation"
import { acceptCarrier } from "@/lib/actions/shipment"

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  created: { label: "Created", color: "text-muted-foreground", bgColor: "bg-muted" },
  pending: { label: "Pending", color: "text-amber-700", bgColor: "bg-amber-100" },
  assigned: { label: "Assigned", color: "text-blue-700", bgColor: "bg-blue-100" },
  picked_up: { label: "Picked Up", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  in_transit: { label: "In Transit", color: "text-primary", bgColor: "bg-primary/10" },
  arrived: { label: "Arrived", color: "text-green-700", bgColor: "bg-green-100" },
  delivered: { label: "Delivered", color: "text-green-700", bgColor: "bg-green-100" },
  cancelled: { label: "Cancelled", color: "text-destructive", bgColor: "bg-destructive/10" },
}

export default async function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Authenticated User
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Fetch Shipment with profiles
  const { data: shipment, error } = await supabase
    .from('shipments')
    .select(`
      *,
      commercant:profiles!shipments_commercant_id_fkey(full_name, company_name, phone, email, company_address),
      camionneur:profiles!shipments_camionneur_id_fkey(full_name, phone, email),
      vehicle:vehicles(*)
    `)
    .eq('id', id)
    .single()

  if (error || !shipment) {
    return redirect('/dashboard')
  }

  // 2. Fetch Events
  const { data: events } = await supabase
    .from('shipment_events')
    .select('*')
    .eq('shipment_id', id)
    .order('created_at', { ascending: false })

  // 3. Fetch Documents
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('shipment_id', id)

  // 4. Fetch Applications (If user is the owner)
  const isOwner = user?.id === shipment.commercant_id
  let applications = []
  if (isOwner && shipment.status === 'pending') {
    const { data: apps } = await supabase
      .from('shipment_applications')
      .select('*, carrier:profiles!shipment_applications_camionneur_id_fkey(full_name, phone, rating:ratings!ratings_rated_user_fkey(rating))')
      .eq('shipment_id', id)
    applications = apps || []
  }

  const status = statusConfig[shipment.status] || statusConfig.created

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header Banner */}
      <div className={`${status.bgColor} border-b`}>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="shrink-0">
                <Link href="/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Shipment #{shipment.reference_number || id.slice(0, 8)}</h1>
                <p className="text-sm text-muted-foreground">Created {new Date(shipment.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <Badge className={`${status.bgColor} ${status.color} border-0 px-4 py-1.5 text-sm font-semibold`}>
              {status.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* Applications Section (Only for Merchant when status is pending) */}
            {isOwner && shipment.status === 'pending' && applications.length > 0 && (
               <Card className="border-2 border-accent/20 bg-accent/5 overflow-hidden">
                  <CardHeader className="bg-accent/10 border-b border-accent/10">
                    <CardTitle className="text-xl flex items-center gap-2 text-accent-foreground">
                       <CheckCircle2 className="h-5 w-5" />
                       Carrier Applications ({applications.length})
                    </CardTitle>
                    <CardDescription>Review and accept a carrier for this shipment</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                       {applications.map((app) => (
                          <div key={app.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/50 transition-colors">
                             <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent">
                                   {app.carrier?.full_name?.charAt(0)}
                                </div>
                                <div>
                                   <p className="font-bold text-lg">{app.carrier?.full_name}</p>
                                   <div className="flex items-center gap-2 mt-1">
                                      <div className="flex items-center text-amber-500">
                                         <Star className="h-3 w-3 fill-current" />
                                         <span className="text-xs font-bold ml-1">4.8</span>
                                      </div>
                                      <Separator orientation="vertical" className="h-3" />
                                      <p className="text-xs text-muted-foreground">Price: <span className="text-foreground font-bold">{app.proposed_price || 'Standard'} DZD</span></p>
                                   </div>
                                </div>
                             </div>
                             <form action={async () => {
                                'use server'
                                await acceptCarrier(shipment.id, app.id, app.camionneur_id, app.vehicle_id)
                             }}>
                                <Button type="submit" size="sm" className="bg-accent hover:bg-accent/90">
                                   Accept Carrier
                                </Button>
                             </form>
                          </div>
                       ))}
                    </div>
                  </CardContent>
               </Card>
            )}

            {/* Route Information */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  Route Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Origin</p>
                        <p className="font-bold text-foreground">{shipment.origin_city}, {shipment.origin_wilaya}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{shipment.origin_address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                        <MapPin className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Destination</p>
                        <p className="font-bold text-foreground">{shipment.destination_city}, {shipment.destination_wilaya}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{shipment.destination_address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-4 text-sm font-medium">
                   <div className="flex items-center gap-2">
                    <Box className="h-4 w-4 text-primary" />
                    <span>Type: {shipment.cargo_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    <span>Weight: {shipment.weight_kg} kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Reference: {shipment.reference_number}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parties Involved */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Parties Involved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Shipper */}
                  <div className="rounded-lg border p-4 bg-white/50">
                    <div className="mb-3 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Shipper (Merchant)</span>
                    </div>
                    <p className="font-bold text-lg text-foreground">{shipment.commercant?.company_name || shipment.commercant?.full_name}</p>
                    <Separator className="my-3" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        {shipment.commercant?.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        {shipment.commercant?.email}
                      </div>
                    </div>
                  </div>

                  {/* Carrier */}
                  <div className="rounded-lg border p-4 bg-white/50">
                    <div className="mb-3 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Carrier (Driver)</span>
                    </div>
                    {shipment.camionneur ? (
                      <>
                        <p className="font-bold text-lg text-foreground">{shipment.camionneur.full_name}</p>
                        <p className="text-sm text-muted-foreground">{shipment.vehicle?.vehicle_type?.replace('_', ' ')} • {shipment.vehicle?.plate_number}</p>
                        <Separator className="my-3" />
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            {shipment.camionneur.phone}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center italic text-muted-foreground">
                         <Clock className="h-6 w-6 mb-2 opacity-50" />
                         <p className="text-sm">Waiting for carrier assignment...</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Timeline & Documents */}
          <div className="space-y-8">
            {/* Timeline */}
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="relative space-y-6 pl-5 border-l-2 border-primary/20 ml-2">
                  {events && events.length > 0 ? (
                    events.map((event) => (
                      <div key={event.id} className="relative">
                        <div className="absolute -left-[29px] flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-background">
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        </div>
                        <p className="text-sm font-bold capitalize">{event.event_type.replace('_', ' ')}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase">{new Date(event.created_at).toLocaleString('fr-DZ')}</p>
                        <p className="mt-1 text-sm text-foreground/80 leading-relaxed">{event.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="relative">
                       <div className="absolute -left-[29px] flex h-4 w-4 items-center justify-center rounded-full bg-muted ring-4 ring-background" />
                       <p className="text-sm text-muted-foreground italic">No events recorded yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {documents && documents.length > 0 ? (
                    documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between rounded-lg border bg-muted/20 p-3 group hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                             <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{doc.file_name.length > 15 ? doc.file_name.slice(0, 15) + '...' : doc.file_name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">{doc.document_type.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground space-y-2">
                       <FileText className="h-8 w-8 mx-auto opacity-20" />
                       <p className="text-xs italic">No documents uploaded</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function Box(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}
