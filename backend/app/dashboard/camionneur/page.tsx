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

// Mock data for current active job
const currentJob = {
  id: "SHP-2024-001",
  status: "in-transit",
  origin: {
    city: "Algiers",
    address: "Zone Industrielle Oued Smar, Lot 15",
  },
  destination: {
    city: "Oran",
    address: "Port d'Oran, Entrepôt B7",
  },
  shipper: {
    name: "Entreprise Sarl",
    phone: "+213 555 123 456",
  },
  cargo: {
    type: "General Cargo",
    weight: "12 tonnes",
    volume: "45 m³",
  },
  deadline: "Apr 17, 2026 - 18:00",
  progress: 65,
}

// Mock available loads
const availableLoads = [
  {
    id: "SHP-2024-010",
    origin: "Constantine",
    destination: "Annaba",
    date: "Apr 18, 2026",
    payment: "85,000 DZD",
    distance: "150 km",
  },
  {
    id: "SHP-2024-011",
    origin: "Setif",
    destination: "Bejaia",
    date: "Apr 19, 2026",
    payment: "65,000 DZD",
    distance: "95 km",
  },
  {
    id: "SHP-2024-012",
    origin: "Algiers",
    destination: "Blida",
    date: "Apr 19, 2026",
    payment: "35,000 DZD",
    distance: "50 km",
  },
]

const statusSteps = [
  { key: "picked-up", label: "Picked Up" },
  { key: "in-transit", label: "In Transit" },
  { key: "arrived", label: "Arrived" },
]

export default function CamionneurDashboard() {
  const [currentStatus, setCurrentStatus] = useState("in-transit")
  const [showUpload, setShowUpload] = useState(false)

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
        <h2 className="text-2xl font-bold text-foreground">My Routes</h2>
        <p className="text-sm text-muted-foreground">Manage your current job and find new loads</p>
      </motion.div>

      {/* Current Active Job - Priority Card */}
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
                  <Badge className="mb-2 bg-accent text-accent-foreground">Active Job</Badge>
                </motion.div>
                <CardTitle className="text-xl">
                  <Link href={`/dashboard/shipment/${currentJob.id}`} className="hover:underline">
                    {currentJob.id}
                  </Link>
                </CardTitle>
                <CardDescription className="mt-1">
                  {currentJob.cargo.type} - {currentJob.cargo.weight}
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Deadline</p>
                <p className="font-semibold text-foreground">{currentJob.deadline}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Route Visualization */}
            <motion.div 
              className="rounded-lg bg-card p-4 shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <motion.div 
                  className="flex-1"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-start gap-3">
                    <motion.div 
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10"
                      whileHover={{ scale: 1.1 }}
                    >
                      <MapPin className="h-5 w-5 text-primary" />
                    </motion.div>
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">Origin</p>
                      <p className="font-semibold text-foreground">{currentJob.origin.city}</p>
                      <p className="text-sm text-muted-foreground">{currentJob.origin.address}</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-center px-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </motion.div>

                <motion.div 
                  className="flex-1"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-start gap-3">
                    <motion.div 
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Navigation className="h-5 w-5 text-accent" />
                    </motion.div>
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">Destination</p>
                      <p className="font-semibold text-foreground">{currentJob.destination.city}</p>
                      <p className="text-sm text-muted-foreground">{currentJob.destination.address}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Progress Bar */}
              <motion.div 
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Trip Progress</span>
                  <motion.span 
                    className="font-medium text-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {currentJob.progress}%
                  </motion.span>
                </div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  style={{ originX: 0 }}
                >
                  <Progress value={currentJob.progress} className="h-2" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Shipper Contact */}
            <motion.div 
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border bg-muted/30 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
                  whileHover={{ rotate: 10 }}
                >
                  <Building2 className="h-5 w-5 text-primary" />
                </motion.div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Shipper Contact</p>
                  <p className="font-medium text-foreground">{currentJob.shipper.name}</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${currentJob.shipper.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    {currentJob.shipper.phone}
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Status Update Controls */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm font-medium text-foreground">Update Status</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {statusSteps.map((step, index) => {
                  const isActive = currentStatus === step.key
                  const isPast = statusSteps.findIndex(s => s.key === currentStatus) > statusSteps.findIndex(s => s.key === step.key)
                  
                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={!isPast ? { scale: 1.02 } : {}}
                      whileTap={!isPast ? { scale: 0.98 } : {}}
                    >
                      <Button
                        variant={isActive ? "default" : isPast ? "secondary" : "outline"}
                        className={`w-full ${isActive ? "bg-primary" : ""}`}
                        onClick={() => handleStatusUpdate(step.key)}
                        disabled={isPast}
                      >
                        {isPast && <CheckCircle2 className="mr-2 h-4 w-4" />}
                        {step.label}
                      </Button>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* File Upload for Proof of Delivery */}
            <AnimatePresence>
              {showUpload && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden rounded-lg border-2 border-dashed border-accent/50 bg-accent/5 p-6"
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <motion.div 
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    >
                      <Upload className="h-7 w-7 text-accent" />
                    </motion.div>
                    <div>
                      <p className="font-medium text-foreground">Upload Signed Delivery Note</p>
                      <p className="text-sm text-muted-foreground">Bon de Livraison (PDF/JPG)</p>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90">
                        <FileText className="mr-2 h-4 w-4" />
                        Select File
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Available Loads */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              Available Loads
            </CardTitle>
            <CardDescription>New shipments you can apply for</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {availableLoads.map((load, index) => (
                <motion.div
                  key={load.id}
                  variants={fadeIn}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card className="bg-muted/30 transition-shadow hover:shadow-md">
                    <CardContent className="pt-4">
                      <div className="mb-3 flex items-center justify-between">
                        <Badge variant="outline">{load.id}</Badge>
                        <motion.span 
                          className="text-sm font-semibold text-accent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          {load.payment}
                        </motion.span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{load.origin}</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-foreground">{load.destination}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {load.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            {load.distance}
                          </span>
                        </div>
                      </div>

                      <motion.div 
                        className="mt-4"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          Apply for Load
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
