"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  Bell,
  ChevronDown,
  Menu,
  X,
  LogOut,
  User,
  Route,
  Calendar,
  CreditCard,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: "commercant" | "camionneur"
  userName: string
}

const commercantNavItems = [
  { href: "/dashboard/commercant", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/commercant/shipments/new", label: "New Shipment", icon: Package },
  { href: "/dashboard/commercant/documents", label: "My Documents", icon: FileText },
  { href: "/dashboard/commercant/settings", label: "Settings", icon: Settings },
]

const camionneurNavItems = [
  { href: "/dashboard/camionneur", label: "My Routes", icon: Route },
  { href: "/dashboard/camionneur/current", label: "Current Job", icon: Package },
  { href: "/dashboard/camionneur/availability", label: "Availability", icon: Calendar },
  { href: "/dashboard/camionneur/payments", label: "Payment History", icon: CreditCard },
]

const sidebarVariants = {
  open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
}

const overlayVariants = {
  open: { opacity: 1, transition: { duration: 0.2 } },
  closed: { opacity: 0, transition: { duration: 0.2 } }
}

export function DashboardLayout({ children, userType, userName }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  
  const navItems = userType === "commercant" ? commercantNavItems : camionneurNavItems

  const handleLogout = async () => {
    const { signout } = await import("@/app/auth/actions")
    await signout()
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar (visible only on small screens) */}
      <motion.aside
        className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white lg:hidden"
        variants={sidebarVariants}
        initial="closed"
        animate={sidebarOpen ? "open" : "closed"}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
              <Image src="/images/logo.png" alt="Fret-Dz Logo" width={24} height={24} className="h-6 w-auto object-contain" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-black">Fret-Dz</span>
          </Link>
          <button className="rounded-md p-1 hover:bg-gray-100" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-gray-500")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userType}</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Desktop Sidebar (always visible on large screens) */}
      <aside className="hidden w-64 flex-col bg-white lg:flex border-r border-gray-100">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-100 px-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
              <Image src="/images/logo.png" alt="Fret-Dz Logo" width={24} height={24} className="h-6 w-auto object-contain" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-black">Fret-Dz</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-gray-500")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userType}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 lg:px-6">
          <button className="rounded-md p-2 hover:bg-gray-100 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-gray-700" />
          </button>

          <div className="hidden lg:block">
            <h1 className="text-base font-medium text-gray-700">
              Welcome back, <span className="font-semibold text-gray-900">{userName}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-gray-600 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-gray-700 hover:bg-gray-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}