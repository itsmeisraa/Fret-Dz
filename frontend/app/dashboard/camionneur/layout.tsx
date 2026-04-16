import { DashboardLayout } from "@/components/dashboard-layout"

export default function CamionneurLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In a real app, this would come from the auth session
  const userName = "Mohamed Benali"

  return (
    <DashboardLayout userType="camionneur" userName={userName}>
      {children}
    </DashboardLayout>
  )
}
