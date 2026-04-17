"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
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
    { label: "Active Shipments", value: stats.active.toString(), icon: Package, change: "Current live loads" },
    { label: "Delivered This Month", value: stats.delivered.toString(), icon: TrendingUp, change: "Succesful arrivals" },
    { label: "Total Spend (DZD)", value: stats.totalSpend, icon: Truck, change: "Estimated volume" },
    { label: "Pending Documents", value: stats.pendingDocs.toString(), icon: FileText, change: "Requires upload" },
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
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={fadeIn}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="transition-shadow hover:shadow-md h-full">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 10 }}
                    className="rounded-lg bg-primary/10 p-2.5"
                  >
                    <stat.icon className="h-5 w-5 text-primary" />
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Real-time Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {pipelineSteps.map((step, index) => (
                <motion.div 
                  key={step.key} 
                  className="flex flex-1 items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex flex-1 flex-col items-center text-center">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                        step.key === "delivered" 
                          ? "bg-green-100 text-green-600" 
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <step.icon className="h-7 w-7" />
                    </motion.div>
                    <p className="mt-2 text-sm font-medium text-foreground">{step.label}</p>
                    <motion.p 
                      className="text-2xl font-bold text-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      {pipelineStats[step.key as keyof typeof pipelineStats]}
                    </motion.p>
                  </div>
                  {index < pipelineSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <ArrowRight className="mx-2 hidden h-5 w-5 text-muted-foreground/50 sm:block" />
                    </motion.div>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Shipments</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/commercant/shipments">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {shipments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pickup Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment, index) => (
                    <motion.tr
                      key={shipment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell>
                        <Link 
                          href={`/dashboard/shipment/${shipment.id}`}
                          className="font-mono text-xs font-medium text-primary hover:underline"
                        >
                          {shipment.reference_number || shipment.id.slice(0, 8)}
                        </Link>
                      </TableCell>
                      <TableCell>{shipment.origin_city}</TableCell>
                      <TableCell>{shipment.destination_city}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={statusConfig[shipment.status]?.variant || "outline"}
                          className={shipment.status === "delivered" ? "border-green-200 bg-green-50 text-green-700" : ""}
                        >
                          {statusConfig[shipment.status]?.label || shipment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{shipment.pickup_date || 'Not set'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/shipment/${shipment.id}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View details</span>
                              </Link>
                            </Button>
                          </motion.div>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No shipments yet</h3>
                <p className="text-sm text-muted-foreground mb-6">Create your first shipment to start moving your goods.</p>
                <Button asChild>
                  <Link href="/dashboard/commercant/shipments/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Shipment
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
