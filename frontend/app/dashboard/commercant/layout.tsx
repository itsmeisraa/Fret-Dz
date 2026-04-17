import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { redirect } from "next/navigation"

export default async function CommercantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, company_name, role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'commercant') {
    return redirect('/dashboard/' + (profile?.role || 'commercant'))
  }

  return (
    <DashboardLayout 
      userType="commercant" 
      userName={profile?.company_name || profile?.full_name || "Merchant"}
    >
      {children}
    </DashboardLayout>
  )
}
