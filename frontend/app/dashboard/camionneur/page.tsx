import { createClient } from "@/lib/supabase/server"
import CarrierDashboardView from "@/components/dashboard/CarrierDashboardView"
import { redirect } from "next/navigation"

export default async function CamionneurDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect('/auth/login')
  }

  // 1. Fetch current active job (assigned to this carrier and not yet delivered)
  const { data: activeJob, error: activeError } = await supabase
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

  if (activeError) {
    console.error('Error fetching active job:', activeError)
  }

  // 2. Fetch available loads (status is 'created' or 'pending' and no carrier assigned)
  const { data: availableLoads, error: availableError } = await supabase
    .from('shipments')
    .select('*')
    .is('camionneur_id', null)
    .in('status', ['created', 'pending'])
    .order('created_at', { ascending: false })
    .limit(10)

  if (availableError) {
    console.error('Error fetching available loads:', availableError)
  }

  // Map database field names to View component names if necessary
  const processedActiveJob = activeJob ? {
    ...activeJob,
    shipper: {
      name: activeJob.commercant?.company_name || activeJob.commercant?.full_name || "Merchant",
      phone: activeJob.commercant?.phone || "No contact"
    }
  } : null

  return (
    <CarrierDashboardView 
      currentJob={processedActiveJob} 
      availableLoads={availableLoads || []} 
    />
  )
}
