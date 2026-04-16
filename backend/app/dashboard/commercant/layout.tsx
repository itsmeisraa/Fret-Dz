import { DashboardLayout } from "@/components/dashboard-layout"

export default function CommercantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In a real app, this would come from the auth session
  const userName = "Entreprise Sarl"

  return (
    <DashboardLayout userType="commercant" userName={userName}>
      {children}
    </DashboardLayout>
  )
}
