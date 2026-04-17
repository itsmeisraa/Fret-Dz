"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
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
  const [currentStatus, setCurrentStatus] = useState(currentJob?.status || "")
  const [showUpload, setShowUpload] = useState(currentJob?.status === "delivered")

  const handleStatusUpdate = (newStatus: string) => {
    setCurrentStatus(newStatus)
    if (newStatus === "arrived") {
      setShowUpload(true)
    }
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                  >
                    <Badge className="mb-2 bg-accent text-accent-foreground">Active Assignment</Badge>
                  </motion.div>
                  <CardTitle className="text-xl">
                    <Link href={`/dashboard/shipment/${currentJob.id}`} className="hover:underline">
                      {currentJob.reference_number || currentJob.id.slice(0, 8)}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {currentJob.cargo_type} - {currentJob.weight_kg} kg
                  </CardDescription>
                </div>
                <div className="text-right text-xs sm:text-sm">
                  <p className="text-muted-foreground uppercase tracking-wider">Pickup Date</p>
                  <p className="font-semibold text-foreground">{currentJob.pickup_date}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Route Visualization */}
              <motion.div 
                className="rounded-lg bg-card p-6 shadow-sm border"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Origin</p>
                        <p className="font-bold text-foreground">{currentJob.origin_city}</p>
                        <p className="text-xs text-muted-foreground">{currentJob.origin_address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="h-0.5 bg-muted-foreground/20 flex-1 hidden sm:block w-12" />
                    <ArrowRight className="h-5 w-5 text-muted-foreground mx-2" />
                    <div className="h-0.5 bg-muted-foreground/20 flex-1 hidden sm:block w-12" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                        <Navigation className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Destination</p>
                        <p className="font-bold text-foreground">{currentJob.destination_city}</p>
                        <p className="text-xs text-muted-foreground">{currentJob.destination_address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar Mock */}
                <div className="mt-8">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Estimated Progress</span>
                    <span className="font-medium text-foreground">60%</span>
                  </div>
                  <Progress value={60} className="h-1.5" />
                </div>
              </motion.div>

              {/* Status Update Controls */}
              <div className="space-y-4">
                <p className="text-sm font-bold text-foreground uppercase tracking-widest text-center">Update Shipment Progress</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {statusSteps.map((step, index) => {
                    const isActive = currentStatus === step.key
                    const isPast = statusSteps.findIndex(s => s.key === currentStatus) > statusSteps.findIndex(s => s.key === step.key)
                    
                    return (
                      <Button
                        key={step.key}
                        variant={isActive ? "default" : isPast ? "secondary" : "outline"}
                        className={`h-12 ${isActive ? "bg-primary shadow-lg shadow-primary/20" : ""}`}
                        onClick={() => handleStatusUpdate(step.key)}
                        disabled={isPast || isLoading}
                      >
                        {isPast && <CheckCircle2 className="mr-2 h-4 w-4" />}
                        {step.label}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* File Upload for Proof of Delivery */}
              <AnimatePresence>
                {showUpload && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-xl border-2 border-dashed border-accent/50 bg-accent/5 p-8"
                  >
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                        <Upload className="h-8 w-8 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Proof of Delivery</h4>
                        <p className="text-sm text-muted-foreground">Upload the signed Bon de Livraison to finalize</p>
                      </div>
                      <Button className="bg-accent text-accent-foreground hover:bg-accent/90 px-8">
                        <FileText className="mr-2 h-4 w-4" />
                        Select Document
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Card className="border-dashed border-2 py-12 text-center bg-muted/20">
          <CardContent>
            <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold">No Active Job</h3>
            <p className="text-muted-foreground mt-2">Browse the available loads below to start earning.</p>
          </CardContent>
        </Card>
      )}

      {/* Available Loads */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Available Loads
              </CardTitle>
              <CardDescription>Shipments matching your vehicle and profile</CardDescription>
            </div>
            <Button variant="ghost" className="text-primary hover:text-primary/80">View Map</Button>
          </div>
        </CardHeader>
        <CardContent>
          {availableLoads.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableLoads.map((load, index) => (
                <motion.div
                  key={load.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="shadow-sm border border-border h-full hover:border-primary/50 transition-colors">
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {load.reference_number || load.id.slice(0, 8)}
                        </Badge>
                        <span className="font-bold text-accent text-lg">
                          {load.estimated_price ? `${load.estimated_price.toLocaleString()} DZD` : 'Negotiable'}
                        </span>
                      </div>

                      <div className="space-y-4 flex-1">
                        <div className="relative pl-6 space-y-4">
                          <div className="absolute left-1 top-1.5 bottom-1.5 w-0.5 bg-muted-foreground/30" />
                          <div className="relative">
                            <div className="absolute -left-7 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background" />
                            <p className="text-xs font-bold text-foreground">{load.origin_city}</p>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-7 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-background" />
                            <p className="text-xs font-bold text-foreground">{load.destination_city}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium bg-muted px-2 py-1 rounded">
                            <Calendar className="h-3 w-3" />
                            {load.pickup_date}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium bg-muted px-2 py-1 rounded">
                            <Truck className="h-3 w-3" />
                            {load.weight_kg} kg
                          </div>
                        </div>
                      </div>

                      <Button className="w-full mt-6" variant="secondary">
                        View Details & Apply
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No available loads at the moment. Check back soon!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
