"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Truck,
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
  { href: "/dashboard/commercant", label: "Dashboard", icon: LayoutDashboard, color: "text-blue-500" },
  { href: "/dashboard/commercant/shipments/new", label: "New Shipment", icon: Package, color: "text-orange-500" },
  { href: "/dashboard/commercant/documents", label: "My Documents", icon: FileText, color: "text-emerald-500" },
  { href: "/dashboard/commercant/settings", label: "Settings", icon: Settings, color: "text-gray-400" },
]

const camionneurNavItems = [
  { href: "/dashboard/camionneur", label: "My Routes", icon: Route, color: "text-blue-500" },
  { href: "/dashboard/camionneur/current", label: "Current Job", icon: Package, color: "text-orange-500" },
  { href: "/dashboard/camionneur/availability", label: "Availability", icon: Calendar, color: "text-emerald-500" },
  { href: "/dashboard/camionneur/payments", label: "Payment History", icon: CreditCard, color: "text-purple-500" },
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
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground lg:static",
          "lg:translate-x-0"
        )}
        variants={sidebarVariants}
        initial="closed"
        animate={sidebarOpen ? "open" : "closed"}
        style={{ translateX: 0 }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-sidebar-border overflow-hidden">
                <Image
                  src="/images/logo.png"
                  alt="Fret-Dz Logo"
                  width={24}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
              <span className="text-xl font-black tracking-tighter text-sidebar-foreground">Fret-Dz</span>
            </Link>
          </motion.div>
          <motion.button
            className="rounded-md p-1 hover:bg-sidebar-accent lg:hidden"
            onClick={() => setSidebarOpen(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 p-4">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary/10 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                      isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted group-hover:bg-muted-foreground/10"
                    )}
                  >
                    <item.icon className="h-4.5 w-4.5" />
                  </motion.div>
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]"
                      layoutId="activeIndicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* User Section */}
        <motion.div 
          className="border-t border-sidebar-border p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent"
              whileHover={{ scale: 1.05 }}
            >
              <User className="h-5 w-5 text-sidebar-accent-foreground" />
            </motion.div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">{userType}</p>
            </div>
          </div>
        </motion.div>
      </motion.aside>

      {/* Desktop Sidebar (always visible) */}
      <aside className="hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-200 overflow-hidden">
                <Image
                  src="/images/logo.png"
                  alt="Fret-Dz Logo"
                  width={24}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
              <span className="text-xl font-black tracking-tighter text-sidebar-foreground">Fret-Dz</span>
            </Link>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 p-4">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary/10 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                      isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted/50 group-hover:bg-muted-foreground/10"
                    )}
                  >
                    <item.icon className="h-4.5 w-4.5" />
                  </motion.div>
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                      layoutId="activeIndicatorDesktop"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* User Section */}
        <motion.div 
          className="border-t border-sidebar-border p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent"
              whileHover={{ scale: 1.05 }}
            >
              <User className="h-5 w-5 text-sidebar-accent-foreground" />
            </motion.div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">{userType}</p>
            </div>
          </div>
        </motion.div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Navigation */}
        <motion.header 
          className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6"
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <motion.button
            className="rounded-md p-2 hover:bg-muted lg:hidden"
            onClick={() => setSidebarOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="h-5 w-5" />
          </motion.button>

          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-foreground">
              Welcome back, <span className="text-primary">{userName}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </motion.div>
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
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.header>

        {/* Page Content */}
        <motion.main 
          className="flex-1 p-4 lg:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
