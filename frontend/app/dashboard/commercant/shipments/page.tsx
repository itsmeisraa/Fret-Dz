import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Package, Eye, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  created: { label: "Created", variant: "outline" },
  pending: { label: "Pending", variant: "secondary" },
  assigned: { label: "Assigned", variant: "secondary" },
  picked_up: { label: "Picked Up", variant: "secondary" },
  in_transit: { label: "In Transit", variant: "default" },
  arrived: { label: "Arrived", variant: "default" },
  delivered: { label: "Delivered", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

export default async function MerchantShipmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/auth/login')

  const { data: shipments, error } = await supabase
    .from('shipments')
    .select('*')
    .eq('commercant_id', user.id)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching shipments:', error)

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Shipments</h1>
          <p className="text-muted-foreground">Manage and track your entire shipping history</p>
        </div>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/dashboard/commercant/shipments/new">
            <Plus className="mr-2 h-4 w-4" />
            New Shipment
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
         <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search references or cities..." className="pl-9 h-10" />
         </div>
         <Button variant="outline" size="sm" className="h-10">
            <Filter className="mr-2 h-4 w-4" />
            Filters
         </Button>
      </div>

      <Card className="border-none shadow-lg">
        <CardContent className="p-0">
          {shipments && shipments.length > 0 ? (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Reference</TableHead>
                  <TableHead className="font-bold">Origin</TableHead>
                  <TableHead className="font-bold">Destination</TableHead>
                  <TableHead className="font-bold">Cargo</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment) => (
                  <TableRow key={shipment.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs font-semibold text-primary">
                      {shipment.reference_number || shipment.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{shipment.origin_city}</p>
                      <p className="text-xs text-muted-foreground">{shipment.origin_wilaya}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{shipment.destination_city}</p>
                      <p className="text-xs text-muted-foreground">{shipment.destination_wilaya}</p>
                    </TableCell>
                    <TableCell>
                       <span className="text-sm">{shipment.cargo_type}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={statusConfig[shipment.status]?.variant || "outline"}
                        className={shipment.status === "delivered" ? "border-green-200 bg-green-50 text-green-700 font-bold" : "font-bold"}
                      >
                        {statusConfig[shipment.status]?.label || shipment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/shipment/${shipment.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">No shipments found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mb-8">
                You haven't created any shipments yet. Start by creating your first load request.
              </p>
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/dashboard/commercant/shipments/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Shipment Now
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
