import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CreditCard, TrendingUp, Calendar, CheckCircle2, Download } from "lucide-react"

export default async function CarrierPaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/auth/login')

  // Fetch delivered shipments and their prices
  const { data: shipments, error } = await supabase
    .from('shipments')
    .select('*')
    .eq('camionneur_id', user.id)
    .eq('status', 'delivered')
    .order('actual_delivery_date', { ascending: false })

  if (error) console.error('Error fetching earnings:', error)

  const totalEarned = shipments?.reduce((sum, s) => sum + (s.final_price || 0), 0) || 0
  const thisMonth = shipments?.filter(s => {
    const deliveryDate = new Date(s.actual_delivery_date!)
    const now = new Date()
    return deliveryDate.getMonth() === now.getMonth() && deliveryDate.getFullYear() === now.getFullYear()
  }).reduce((sum, s) => sum + (s.final_price || 0), 0) || 0

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Earning History</h1>
        <p className="text-muted-foreground">Detailed overview of your successful deliveries and payouts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-lg bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Total Earnings</p>
                <p className="text-3xl font-bold">{totalEarned.toLocaleString('fr-DZ')} DZD</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Earned this Month</p>
                <p className="text-3xl font-bold text-foreground">{thisMonth.toLocaleString('fr-DZ')} DZD</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg sm:col-span-2 lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Successful Deliveries</p>
                <p className="text-3xl font-bold text-foreground">{shipments?.length || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Payments Table */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Recent Payouts</CardTitle>
          <CardDescription>Earnings from your completed shipments</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {shipments && shipments.length > 0 ? (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold">Reference</TableHead>
                  <TableHead className="font-bold">Route</TableHead>
                  <TableHead className="font-bold text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment) => (
                  <TableRow key={shipment.id} className="hover:bg-muted/30">
                    <TableCell className="text-sm text-muted-foreground">
                       {new Date(shipment.actual_delivery_date!).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold text-primary">
                       {shipment.reference_number || shipment.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-1.5 text-sm">
                          <span className="font-medium">{shipment.origin_city}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="font-medium">{shipment.destination_city}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-foreground font-mono">
                       {shipment.final_price?.toLocaleString('fr-DZ')} DZD
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
               <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Calendar className="h-5 w-5" />
               </div>
               <p>No payment history available yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
