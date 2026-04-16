"use client"

import { use } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MapPin,
  Package,
  Truck,
  User,
  Building2,
  Phone,
  Mail,
  FileText,
  Download,
  Clock,
  CheckCircle2,
  Circle,
  Navigation,
  Scale,
  Box,
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

// Mock shipment data
const getShipmentData = (id: string) => ({
  id,
  status: "in-transit",
  createdAt: "Apr 14, 2026 - 14:00",
  route: {
    origin: {
      city: "Algiers",
      address: "Zone Industrielle Oued Smar, Lot 15",
      coordinates: "36.7538° N, 3.0588° E",
    },
    destination: {
      city: "Oran",
      address: "Port d'Oran, Entrepôt B7",
      coordinates: "35.6969° N, 0.6331° W",
    },
    waypoints: ["Blida", "Chlef", "Relizane"],
    distance: "430 km",
    estimatedDuration: "5h 30m",
  },
  payload: {
    type: "General Cargo",
    description: "Industrial machinery parts",
    weight: "12 tonnes",
    volume: "45 m³",
    specialInstructions: "Handle with care. Keep dry.",
  },
  shipper: {
    name: "Entreprise Sarl",
    nif: "000012345678901",
    contact: "Ahmed Bouzid",
    phone: "+213 555 123 456",
    email: "contact@entreprise-sarl.dz",
  },
  carrier: {
    name: "Mohamed Benali",
    vehicleType: "Semi-Trailer (40T)",
    plateNumber: "00123-101-16",
    phone: "+213 555 987 654",
    email: "m.benali@email.dz",
  },
  timeline: [
    {
      event: "Shipment Created",
      timestamp: "Apr 14, 2026 - 14:00",
      actor: "Entreprise Sarl",
      completed: true,
    },
    {
      event: "Carrier Assigned",
      timestamp: "Apr 14, 2026 - 16:30",
      actor: "System",
      completed: true,
    },
    {
      event: "Picked Up",
      timestamp: "Apr 15, 2026 - 09:00",
      actor: "Mohamed Benali",
      completed: true,
    },
    {
      event: "In Transit",
      timestamp: "Apr 15, 2026 - 09:15",
      actor: "Mohamed Benali",
      completed: true,
    },
    {
      event: "Arrived at Destination",
      timestamp: null,
      actor: null,
      completed: false,
    },
    {
      event: "Delivered",
      timestamp: null,
      actor: null,
      completed: false,
    },
  ],
  documents: [
    {
      name: "Scan de Carte d'Identité du Chauffeur",
      type: "ID Document",
      uploadedAt: "Apr 14, 2026",
      url: "#",
    },
    {
      name: "Facture Commerciale",
      type: "Invoice",
      uploadedAt: "Apr 14, 2026",
      url: "#",
    },
  ],
})

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  created: { label: "Created", color: "text-muted-foreground", bgColor: "bg-muted" },
  assigned: { label: "Assigned", color: "text-blue-700", bgColor: "bg-blue-100" },
  "in-transit": { label: "In Transit", color: "text-primary", bgColor: "bg-primary/10" },
  delivered: { label: "Delivered", color: "text-green-700", bgColor: "bg-green-100" },
}

export default function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const shipment = getShipmentData(id)
  const status = statusConfig[shipment.status]

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <motion.div 
        className={`${status.bgColor} border-b`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" asChild className="shrink-0">
                  <Link href="/dashboard/commercant">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Back</span>
                  </Link>
                </Button>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Shipment #{id}</h1>
                <p className="text-sm text-muted-foreground">Created {shipment.createdAt}</p>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            >
              <Badge className={`${status.bgColor} ${status.color} border-0 px-4 py-1.5 text-sm font-semibold`}>
                {status.label}
              </Badge>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <motion.div 
            className="space-y-6 lg:col-span-2"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Route Information */}
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-primary" />
                    Route Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <motion.div 
                      className="rounded-lg border bg-muted/30 p-4"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-start gap-3">
                        <motion.div 
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10"
                          whileHover={{ rotate: 10 }}
                        >
                          <MapPin className="h-5 w-5 text-primary" />
                        </motion.div>
                        <div>
                          <p className="text-xs font-medium uppercase text-muted-foreground">Origin</p>
                          <p className="font-semibold text-foreground">{shipment.route.origin.city}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{shipment.route.origin.address}</p>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="rounded-lg border bg-muted/30 p-4"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-start gap-3">
                        <motion.div 
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10"
                          whileHover={{ rotate: 10 }}
                        >
                          <MapPin className="h-5 w-5 text-accent" />
                        </motion.div>
                        <div>
                          <p className="text-xs font-medium uppercase text-muted-foreground">Destination</p>
                          <p className="font-semibold text-foreground">{shipment.route.destination.city}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{shipment.route.destination.address}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Key Waypoints:</span>
                      <span className="font-medium text-foreground">{shipment.route.waypoints.join(" → ")}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Distance:</span>
                      <span className="font-medium text-foreground">{shipment.route.distance}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Est. Duration:</span>
                      <span className="font-medium text-foreground">{shipment.route.estimatedDuration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payload Details */}
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Payload Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { icon: Box, label: "Type", value: shipment.payload.type },
                      { icon: Scale, label: "Weight", value: shipment.payload.weight },
                      { icon: Package, label: "Volume", value: shipment.payload.volume },
                    ].map((item, index) => (
                      <motion.div 
                        key={item.label}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <motion.div 
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <item.icon className="h-5 w-5 text-primary" />
                        </motion.div>
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="font-medium text-foreground">{item.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-sm text-muted-foreground">{shipment.payload.description}</p>
                    {shipment.payload.specialInstructions && (
                      <motion.div 
                        className="mt-3 rounded-md bg-accent/10 p-3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <p className="text-sm font-medium text-accent">Special Instructions:</p>
                        <p className="text-sm text-foreground">{shipment.payload.specialInstructions}</p>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Parties Involved */}
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Parties Involved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Shipper */}
                    <motion.div 
                      className="rounded-lg border p-4"
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium uppercase text-muted-foreground">Shipper</span>
                      </div>
                      <p className="font-semibold text-foreground">{shipment.shipper.name}</p>
                      <p className="text-sm text-muted-foreground">NIF: {shipment.shipper.nif}</p>
                      <Separator className="my-3" />
                      <div className="space-y-2">
                        <p className="text-sm text-foreground">{shipment.shipper.contact}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {shipment.shipper.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {shipment.shipper.email}
                        </div>
                      </div>
                    </motion.div>

                    {/* Carrier */}
                    <motion.div 
                      className="rounded-lg border p-4"
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium uppercase text-muted-foreground">Carrier</span>
                      </div>
                      <p className="font-semibold text-foreground">{shipment.carrier.name}</p>
                      <p className="text-sm text-muted-foreground">{shipment.carrier.vehicleType}</p>
                      <p className="text-sm text-muted-foreground">Plate: {shipment.carrier.plateNumber}</p>
                      <Separator className="my-3" />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {shipment.carrier.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {shipment.carrier.email}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Right Column - Timeline & Documents */}
          <motion.div 
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Timeline */}
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative space-y-0">
                    {shipment.timeline.map((item, index) => (
                      <motion.div 
                        key={index} 
                        className="relative flex gap-4 pb-6 last:pb-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        {/* Line */}
                        {index < shipment.timeline.length - 1 && (
                          <motion.div 
                            className={`absolute left-[11px] top-6 h-full w-0.5 ${
                              item.completed ? "bg-primary" : "bg-border"
                            }`}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            style={{ originY: 0 }}
                          />
                        )}
                        
                        {/* Icon */}
                        <motion.div 
                          className="relative z-10 shrink-0"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, delay: 0.4 + index * 0.1 }}
                        >
                          {item.completed ? (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </motion.div>

                        {/* Content */}
                        <div className="flex-1">
                          <p className={`font-medium ${item.completed ? "text-foreground" : "text-muted-foreground"}`}>
                            {item.event}
                          </p>
                          {item.timestamp && (
                            <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                          )}
                          {item.actor && (
                            <p className="text-xs text-muted-foreground">by {item.actor}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Documents */}
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {shipment.documents.map((doc, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10"
                            whileHover={{ rotate: 10 }}
                          >
                            <FileText className="h-4 w-4 text-primary" />
                          </motion.div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.uploadedAt}</p>
                          </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button variant="ghost" size="icon-sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download {doc.name}</span>
                          </Button>
                        </motion.div>
                      </motion.div>
                    ))}

                    {/* Pending Document */}
                    <motion.div 
                      className="rounded-lg border-2 border-dashed border-accent/50 bg-accent/5 p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                          <FileText className="h-6 w-6 text-accent" />
                        </motion.div>
                        <p className="text-sm font-medium text-foreground">Bon de Livraison Signé</p>
                        <p className="text-xs text-muted-foreground">Pending upload after delivery</p>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
