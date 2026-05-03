"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft, Package, MapPin, Truck, User,
  Phone, Calendar, DollarSign, FileText,
  CheckCircle, Clock, AlertCircle, Upload, Loader2,
} from "lucide-react";
import Link from "next/link";

interface Expedition {
  id: string;
  origin: string;
  destination: string;
  marchandise_type: string;
  weight_kg: number;
  volume_m3: number;
  budget_dzd: number;
  pickup_date: string;
  status: string;
  description: string;
  contact_phone: string;
  special_instructions: string;
  created_at: string;
  profiles: { full_name: string; email: string };
  camionneurs: { full_name: string; phone: string; wilaya: string } | null;
}

const STEPS = [
  { key: "created",    label: "Créée",      icon: Package,      desc: "Demande enregistrée" },
  { key: "assigned",   label: "Assignée",   icon: Truck,        desc: "Transporteur confirmé" },
  { key: "in_transit", label: "En transit", icon: MapPin,       desc: "Marchandise en route" },
  { key: "delivered",  label: "Livrée",     icon: CheckCircle,  desc: "Destination atteinte" },
];

export default function ShipmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) fetchExpedition();
  }, [id]);

  const fetchExpedition = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("expeditions")
        .select("*, profiles(full_name, email), camionneurs(full_name, phone, wilaya)")
        .eq("id", id)
        .single();
      if (error) throw error;
      setExpedition(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !expedition) return;
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const path = `${user.id}/${expedition.id}_bon_livraison_${Date.now()}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage
        .from("bons-livraison")
        .upload(path, file);
      if (error) throw error;
      alert("Bon de livraison uploadé avec succès !");
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const currentStepIndex = STEPS.findIndex(s => s.key === expedition?.status);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e3a5f]" />
      </div>
    );
  }

  if (!expedition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <p className="text-gray-600">Expédition introuvable</p>
          <Button className="mt-4" onClick={() => router.back()}>Retour</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#1e3a5f]">
              {expedition.origin} → {expedition.destination}
            </h1>
            <p className="text-xs text-gray-400 font-mono">#{expedition.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <StatusBadge status={expedition.status} />
        </div>

        {/* Progress Tracker */}
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[#1e3a5f]">Suivi de l'expédition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100">
                <div
                  className="h-full bg-[#1e3a5f] transition-all duration-700"
                  style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                />
              </div>

              <div className="flex justify-between relative">
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done = i <= currentStepIndex;
                  const current = i === currentStepIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-2" style={{ width: "25%" }}>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center z-10 border-2 transition-all ${
                        done
                          ? "bg-[#1e3a5f] border-[#1e3a5f] text-white"
                          : "bg-white border-gray-200 text-gray-300"
                      } ${current ? "ring-4 ring-[#1e3a5f]/20" : ""}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-center">
                        <p className={`text-xs font-semibold ${done ? "text-[#1e3a5f]" : "text-gray-400"}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-400 hidden md:block">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#1e3a5f] flex items-center gap-2">
                <Package className="h-4 w-4 text-orange-500" />
                Marchandise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Row label="Type" value={expedition.marchandise_type} />
              {expedition.weight_kg && <Row label="Poids" value={`${expedition.weight_kg} kg`} />}
              {expedition.volume_m3 && <Row label="Volume" value={`${expedition.volume_m3} m³`} />}
              {expedition.description && <Row label="Description" value={expedition.description} />}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#1e3a5f] flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                Logistique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Row label="Collecte" value={expedition.pickup_date ? new Date(expedition.pickup_date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "—"} />
              <Row label="Contact" value={expedition.contact_phone || "—"} />
              {expedition.budget_dzd && (
                <Row label="Budget" value={`${expedition.budget_dzd.toLocaleString()} DZD`} highlight />
              )}
              {expedition.special_instructions && (
                <Row label="Instructions" value={expedition.special_instructions} />
              )}
            </CardContent>
          </Card>

          {/* Transporteur info */}
          {expedition.camionneurs && (
            <Card className="border-0 shadow-sm bg-[#1e3a5f]/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#1e3a5f] flex items-center gap-2">
                  <Truck className="h-4 w-4 text-orange-500" />
                  Transporteur assigné
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Row label="Nom" value={expedition.camionneurs.full_name} />
                {expedition.camionneurs.phone && <Row label="Téléphone" value={expedition.camionneurs.phone} />}
                {expedition.camionneurs.wilaya && <Row label="Wilaya" value={expedition.camionneurs.wilaya} />}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Upload bon de livraison */}
        {expedition.status === "delivered" && (
          <Card className="border-0 shadow-sm border-l-4 border-l-green-500">
            <CardContent className="flex items-center gap-4 py-4">
              <FileText className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1e3a5f]">Bon de livraison signé</p>
                <p className="text-xs text-gray-500">Uploadez le document signé pour archivage</p>
              </div>
              <label className="cursor-pointer">
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={uploadDocument} />
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                  disabled={uploading}
                  asChild
                >
                  <span>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    Upload
                  </span>
                </Button>
              </label>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className={`text-sm font-medium text-right ${highlight ? "text-green-600 font-semibold" : "text-gray-700"}`}>
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; className: string }> = {
    created:    { label: "Créée",      className: "bg-blue-100 text-blue-700" },
    assigned:   { label: "Assignée",   className: "bg-orange-100 text-orange-700" },
    in_transit: { label: "En transit", className: "bg-purple-100 text-purple-700" },
    delivered:  { label: "Livrée",     className: "bg-green-100 text-green-700" },
  };
  const cfg = configs[status] || configs.created;
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${cfg.className}`}>{cfg.label}</span>;
}
