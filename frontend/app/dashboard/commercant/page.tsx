import { createClient } from "@/lib/supabase/server"
import MerchantDashboardView from "@/components/dashboard/MerchantDashboardView"
import { redirect } from "next/navigation"

export type Shipment = {
  id: string
  reference_number: string
  origin_city: string
  destination_city: string
  status: string
  pickup_date: string
  final_price?: number
}

export default async function CommercantDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect('/auth/login')
  }

  // Fetch recent shipments
  const { data: shipments, error } = await supabase
    .from('shipments')
    .select('*')
    .eq('commercant_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching shipments:', error)
  }

  // Calculate real stats
  const { data: allStats, error: statsError } = await supabase
    .from('shipments')
    .select('id, status, final_price')
    .eq('commercant_id', user.id)

  const activeCount = allStats?.filter(s => 
    !['delivered', 'cancelled'].includes(s.status)
  ).length || 0

  const deliveredCount = allStats?.filter(s => 
    s.status === 'delivered'
  ).length || 0

  const totalSpend = allStats?.reduce((sum, s) => sum + (s.final_price || 0), 0) || 0

  // Fetch count of documents linked to user's shipments
  const { count: pendingDocs, error: docsError } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .in('shipment_id', allStats?.map(s => s.id) || [])

  if (docsError) {
    console.error('Error fetching documents:', docsError)
  }

  const stats = {
    active: activeCount,
    delivered: deliveredCount,
    totalSpend: totalSpend.toLocaleString('fr-DZ') + " DZD",
    pendingDocs: pendingDocs
  }

  return (
    <MerchantDashboardView 
      shipments={shipments || []} 
      stats={stats} 
    />
  )
}
