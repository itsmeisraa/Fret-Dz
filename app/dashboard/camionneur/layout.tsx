import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { redirect } from "next/navigation"

export default async function CamionneurLayout({
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
     .select('full_name, role')
     .eq('id', user.id)
     .single()

  return (
    <DashboardLayout 
      userType="camionneur" 
      userName={profile?.full_name || "Driver"}
    >
      {children}
    </DashboardLayout>
  )
}
