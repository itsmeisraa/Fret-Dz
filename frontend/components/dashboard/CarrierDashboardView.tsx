"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Package,
  MapPin,
  Phone,
  Navigation,
  Upload,
  CheckCircle2,
  Truck,
  ArrowRight,
  FileText,
  Building2,
  Calendar,
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
      staggerChildren: 0.1
    }
  }
}

const statusSteps = [
  { key: "picked_up", label: "Picked Up" },
  { key: "in_transit", label: "In Transit" },
  { key: "arrived", label: "Arrived" },
]

interface CarrierDashboardViewProps {
  currentJob: any | null
  availableLoads: any[]
}

export default function CarrierDashboardView({ currentJob, availableLoads }: CarrierDashboardViewProps) {
  const { toast } = useToast()
  const [currentStatus, setCurrentStatus] = useState(currentJob?.status || "")
  const [showUpload, setShowUpload] = useState(currentJob?.status === "delivered")
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusUpdate = async (newStatus: string) => {
    setIsLoading(true)
    try {
      const { updateShipmentStatus } = await import("@/lib/actions/shipment")
      let description = ""
      switch(newStatus) {
        case 'picked_up': description = "Carrier has arrived and picked up the cargo."; break;
        case 'in_transit': description = "Cargo is currently in transit across wilayas."; break;
        case 'arrived': description = "Carrier has arrived at the destination city."; break;
      }
      
      await updateShipmentStatus(currentJob.id, newStatus, description)
      setCurrentStatus(newStatus)
      if (newStatus === "arrived") setShowUpload(true)
      toast({
        title: "Status Updated",
        description: `Shipment is now ${newStatus.replace('_', ' ')}`,
      })
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const statusProgressValue = (currentStatus: string) => {
    if (currentStatus === 'picked_up') return 33
    if (currentStatus === 'in_transit') return 66
    if (currentStatus === 'arrived') return 100
    return 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h2 className="text-2xl font-bold text-foreground">Driver Dashboard</h2>
        <p className="text-sm text-muted-foreground">Manage your active route and discover new loads near you</p>
      </motion.div>

      {/* Current Active Job - Priority Card */}
      {currentJob ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="relative overflow-hidden border-none bg-zinc-900 text-zinc-100 shadow-2xl">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            
            <CardHeader className="relative z-10 border-b border-zinc-800/50 pb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] px-2 py-0.5">Live Mission</Badge>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight">
                    <Link href={`/dashboard/shipment/${currentJob.id}`} className="hover:text-primary transition-colors">
                      {currentJob.reference_number || `JOB-${currentJob.id.slice(0, 8)}`.toUpperCase()}
                    </Link>
                  </CardTitle>
                  <div className="flex items-center gap-3 mt-1 text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Package className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">{currentJob.cargo_type}</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-zinc-700" />
                    <span className="text-xs font-medium">{currentJob.weight_kg} KG</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/30">
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Scheduled Pickup</p>
                    <p className="text-sm font-black text-white">{currentJob.pickup_date}</p>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                    <Calendar className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-8 pt-8 px-6 pb-8">
              {/* Route Visualization 2.0 */}
              <div className="relative isolate">
                <div className="grid gap-8 sm:grid-cols-2 lg:gap-12 relative">
                  {/* Origin */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700 shadow-inner group-hover:bg-zinc-700 transition-colors">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Departure City</span>
                        <h4 className="text-lg font-black text-white">{currentJob.origin_city}</h4>
                        <p className="text-xs text-zinc-400 max-w-[200px] truncate">{currentJob.origin_address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700 shadow-inner group-hover:bg-zinc-700 transition-colors">
                        <Navigation className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Arrival Target</span>
                        <h4 className="text-lg font-black text-white">{currentJob.destination_city}</h4>
                        <p className="text-xs text-zinc-400 max-w-[200px] truncate">{currentJob.destination_address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Connecting Line (Desktop) */}
                  <div className="absolute left-1/2 top-6 -translate-x-1/2 hidden sm:flex items-center gap-2">
                    <div className="h-px w-12 bg-gradient-to-r from-zinc-700 to-primary/40" />
                    <Truck className="h-4 w-4 text-primary animate-bounce shadow-primary" />
                    <div className="h-px w-12 bg-gradient-to-l from-zinc-700 to-emerald-500/40" />
                  </div>
                </div>

                {/* Progress Bar Upgrade */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Current Transit Completion</span>
                    <span className="text-xs font-black text-primary">{statusProgressValue(currentStatus)}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50 p-0.5">
                    <motion.div 
                      className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.3)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${statusProgressValue(currentStatus)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* Status Update Controls - Refined */}
              <div className="pt-6 border-t border-zinc-800/50">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-zinc-800" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Control Panel</span>
                  <div className="h-px flex-1 bg-zinc-800" />
                </div>
                
                <div className="grid gap-3 sm:grid-cols-3">
                  {statusSteps.map((step, index) => {
                    const isActive = currentStatus === step.key
                    const isPast = statusSteps.findIndex(s => s.key === currentStatus) > statusSteps.findIndex(s => s.key === step.key)
                    
                    return (
                      <motion.div key={step.key} whileHover={{ scale: isPast ? 1 : 1.02 }} whileTap={{ scale: isPast ? 1 : 0.98 }}>
                        <Button
                          variant={isActive ? "default" : isPast ? "secondary" : "outline"}
                          className={cn(
                            "w-full h-14 rounded-2xl font-bold transition-all duration-300",
                            isActive 
                              ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/40 lg:border-2 lg:border-white/20" 
                              : isPast 
                                ? "bg-zinc-800/40 text-emerald-500/60 border-transparent italic"
                                : "bg-zinc-800/20 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                          )}
                          onClick={() => handleStatusUpdate(step.key)}
                          disabled={isPast || isLoading}
                        >
                          {isPast && <CheckCircle2 className="mr-2 h-4 w-4" />}
                          {isActive && <div className="mr-2 h-2 w-2 rounded-full bg-white animate-pulse" />}
                          {step.label}
                        </Button>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Card className="border-2 border-dashed border-zinc-200 py-16 text-center bg-zinc-50/50 rounded-[2rem]">
          <CardContent>
            <div className="h-20 w-20 rounded-3xl bg-zinc-100 flex items-center justify-center mx-auto mb-6">
              <Truck className="h-10 w-10 text-zinc-400" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Vechicle Idle</h3>
            <p className="text-zinc-500 mt-2 max-w-[280px] mx-auto text-sm font-medium leading-relaxed">No active mission detected. Select a load from the marketplace below to begin your route.</p>
          </CardContent>
        </Card>
      )}

      {/* Available Loads Marketplace */}
      <Card className="border-none shadow-2xl bg-white rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-zinc-50/80 backdrop-blur-sm border-b px-8 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                  <Package className="h-5 w-5 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-black tracking-tight">Regional Marketplace</CardTitle>
              </div>
              <p className="text-sm text-zinc-500 font-medium ml-13">Discover high-priority shipments across Algeria</p>
            </div>
            <Button variant="outline" className="rounded-full border-zinc-200 font-bold hover:bg-zinc-100 px-6">
              Refine Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {availableLoads.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {availableLoads.map((load, index) => (
                <motion.div
                  key={load.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="group relative h-full overflow-hidden border-zinc-100 shadow-lg shadow-zinc-200/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 rounded-[1.5rem]">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <code className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase">
                            {load.reference_number || load.id.slice(0, 8)}
                          </code>
                          <p className="text-xs font-bold text-zinc-400 lowercase">{load.cargo_type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-primary tracking-tight">
                            {load.estimated_price ? `${load.estimated_price.toLocaleString()}` : '--'} 
                            <span className="text-[10px] ml-0.5">DZD</span>
                          </p>
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Fixed Fare</span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-6">
                        {/* Route Timeline */}
                        <div className="relative isolate py-1">
                          <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-zinc-100 group-hover:bg-primary/20 transition-colors" />
                          <div className="space-y-6 relative ml-3">
                            <div className="flex items-center gap-4">
                              <div className="h-5 w-5 rounded-full border-4 border-white bg-zinc-200 shadow-sm transition-colors group-hover:bg-primary relative" />
                              <div className="space-y-0.5">
                                <span className="block text-[8px] font-black uppercase text-zinc-400 tracking-widest">Origin Point</span>
                                <p className="text-sm font-black text-zinc-900 leading-none">{load.origin_city}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="h-5 w-5 rounded-full border-4 border-white bg-zinc-200 shadow-sm transition-colors group-hover:bg-accent relative" />
                              <div className="space-y-0.5">
                                <span className="block text-[8px] font-black uppercase text-zinc-400 tracking-widest">Drop-off Target</span>
                                <p className="text-sm font-black text-zinc-900 leading-none">{load.destination_city}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pb-2 pt-2 border-t border-zinc-50">
                          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold bg-zinc-50 px-3 py-2 rounded-xl group-hover:bg-primary/5 transition-colors">
                            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                            {load.pickup_date}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold bg-zinc-50 px-3 py-2 rounded-xl group-hover:bg-primary/5 transition-colors">
                            <Truck className="h-3.5 w-3.5 text-zinc-400" />
                            {load.weight_kg} kg
                          </div>
                        </div>
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          className="w-full mt-6 h-12 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/20" 
                          variant={index === 0 ? "default" : "secondary"}
                          disabled={isLoading}
                          onClick={async () => {
                            setIsLoading(true)
                            try {
                              const { applyForShipment } = await import("@/lib/actions/shipment")
                              await applyForShipment(load.id)
                              toast({
                                title: "Application Sent",
                                description: "The merchant will review your profile shortly.",
                              })
                            } catch (err: any) {
                              toast({
                                title: "Application Error",
                                description: err.message,
                                variant: "destructive",
                              })
                            } finally {
                              setIsLoading(false)
                            }
                          }}
                        >
                          {isLoading ? "Processing..." : "Claim Mission"}
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <div className="h-20 w-20 rounded-3xl bg-zinc-50 flex items-center justify-center mx-auto mb-6 border-zinc-100 border">
                <Package className="h-10 w-10 text-zinc-300" />
              </div>
              <h3 className="text-xl font-bold text-zinc-400">Marketplace Quiet</h3>
              <p className="text-zinc-400 text-sm font-medium mt-2">No loads available in your region right now.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
