"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
import {
  Package,
  TrendingUp,
  Truck,
  FileText,
  Plus,
  Eye,
  Upload,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
} from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  created: { label: "Created", variant: "outline" },
  assigned: { label: "Assigned", variant: "secondary" },
  picked_up: { label: "Picked Up", variant: "secondary" },
  in_transit: { label: "In Transit", variant: "default" },
  arrived: { label: "Arrived", variant: "default" },
  delivered: { label: "Delivered", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

const pipelineSteps = [
  { key: "created", label: "Created", icon: Package },
  { key: "assigned", label: "Assigned", icon: Truck },
  { key: "in_transit", label: "In Transit", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
]

interface MerchantDashboardViewProps {
  shipments: any[]
  stats: {
    active: number
    delivered: number
    totalSpend: string
    pendingDocs: number
  }
}

export default function MerchantDashboardView({ shipments, stats }: MerchantDashboardViewProps) {
  const pipelineStats = {
    created: shipments.filter(s => s.status === "created").length,
    assigned: shipments.filter(s => s.status === "assigned" || s.status === "picked_up").length,
    in_transit: shipments.filter(s => s.status === "in_transit" || s.status === "arrived").length,
    delivered: shipments.filter(s => s.status === "delivered").length,
  }

  const statCards = [
    { label: "Active Shipments", value: stats.active.toString(), icon: Package, change: "Live across Algeria" },
    { label: "Delivered (Total)", value: stats.delivered.toString(), icon: TrendingUp, change: "Successful arrivals" },
    { label: "Total Spend (DZD)", value: stats.totalSpend, icon: Truck, change: "Volume handled" },
    { label: "Carrier Documents", value: stats.pendingDocs.toString(), icon: FileText, change: "Files uploaded" },
  ]

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground">Merchant Dashboard</h2>
          <p className="text-sm text-muted-foreground">Manage your shipments and track deliveries across Algeria</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href="/dashboard/commercant/shipments/new">
              <Plus className="mr-2 h-4 w-4" />
              Create New Shipment
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={fadeIn}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
          >
            <Card className="relative overflow-hidden border-none bg-gradient-to-br from-card to-muted/30 shadow-lg shadow-black/5 h-full">
              <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <p className="text-3xl font-black text-foreground">{stat.value}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                      <p className="text-[10px] font-medium text-muted-foreground/80 lowercase">{stat.change}</p>
                    </div>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20"
                  >
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Shipment Status Pipeline */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 rounded-full bg-primary" />
              <CardTitle className="text-lg font-bold">Logistics Command Center</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-0">
              {pipelineSteps.map((step, index) => (
                <motion.div 
                  key={step.key} 
                  className="group relative flex flex-1 items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex flex-1 flex-col items-center text-center">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={cn(
                        "relative flex h-16 w-16 items-center justify-center rounded-3xl transition-all duration-300 shadow-md",
                        step.key === "delivered" 
                          ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                          : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
                      )}
                    >
                      <step.icon className="h-8 w-8" />
                      <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-background text-[10px] font-bold shadow-sm border">
                        {pipelineStats[step.key as keyof typeof pipelineStats]}
                      </div>
                    </motion.div>
                    <p className="mt-3 text-xs font-bold uppercase tracking-tight text-foreground/80">{step.label}</p>
                  </div>
                  {index < pipelineSteps.length - 1 && (
                    <div className="hidden flex-1 items-center px-2 sm:flex">
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent" />
                      <ArrowRight className="h-4 w-4 text-muted-foreground/30" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Shipments Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 pb-4">
            <div>
              <CardTitle className="text-xl font-bold">Recent Operations</CardTitle>
              <p className="text-xs text-muted-foreground">Monitor and track your latest shipment activities</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-full hover:bg-primary hover:text-white transition-all shadow-sm" asChild>
              <Link href="/dashboard/commercant/shipments">Browse All Shipments</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {shipments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="py-4 font-bold uppercase tracking-tighter text-[10px]">Reference</TableHead>
                      <TableHead className="py-4 font-bold uppercase tracking-tighter text-[10px]">Route Path</TableHead>
                      <TableHead className="py-4 font-bold uppercase tracking-tighter text-[10px]">Status Update</TableHead>
                      <TableHead className="py-4 font-bold uppercase tracking-tighter text-[10px]">Date</TableHead>
                      <TableHead className="py-4 font-bold uppercase tracking-tighter text-[10px] text-right pr-6">Management</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipments.map((shipment, index) => (
                      <motion.tr
                        key={shipment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className="group border-b transition-all hover:bg-primary/[0.02]"
                      >
                        <TableCell className="py-4 pl-6">
                          <Link 
                            href={`/dashboard/shipment/${shipment.id}`}
                            className="font-mono text-[11px] font-black text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {shipment.reference_number || shipment.id.slice(0, 8)}
                          </Link>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1.5 font-medium text-xs">
                            <span className="text-foreground">{shipment.origin_city}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                            <span className="text-foreground">{shipment.destination_city}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge 
                            variant="outline"
                            className={cn(
                              "rounded-md border-none font-bold text-[10px] uppercase tracking-wide px-2 py-1",
                              shipment.status === "delivered" 
                                ? "bg-emerald-100 text-emerald-700" 
                                : "bg-primary/10 text-primary"
                            )}
                          >
                            {statusConfig[shipment.status]?.label || shipment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-xs text-muted-foreground font-medium">
                          {shipment.pickup_date || 'TBD'}
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/20 hover:text-primary" asChild>
                              <Link href={`/dashboard/shipment/${shipment.id}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Details</span>
                              </Link>
                            </Button>
                          </motion.div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mb-6 shadow-inner ring-1 ring-border">
                  <Package className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">No active operations</h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-[280px]">Your shipment history is empty. Start by creating a new transport request.</p>
                <div className="flex gap-3">
                  <Button className="rounded-xl px-8" asChild>
                    <Link href="/dashboard/commercant/shipments/new">
                      <Plus className="mr-2 h-4 w-4" />
                      New Shipment
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
