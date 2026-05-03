"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Truck, MapPin, Package, DollarSign, Bell,
  CheckCircle, Clock, TrendingUp, Eye, Loader2,
} from "lucide-react";

interface Expedition {
  id: string;
  origin: string;
  destination: string;
  marchandise_type: string;
  weight_kg: number;
  budget_dzd: number;
  pickup_date: string;
  status: string;
  description: string;
  contact_phone: string;
  created_at: string;
  profiles: { full_name: string; email: string };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  created:    { label: "Disponible",  color: "text-blue-700",  bg: "bg-blue-50" },
  assigned:   { label: "Assignée",    color: "text-orange-700", bg: "bg-orange-50" },
  in_transit: { label: "En transit",  color: "text-purple-700", bg: "bg-purple-50" },
  delivered:  { label: "Livrée",      color: "text-green-700",  bg: "bg-green-50" },
};

export default function CamionneurDashboardPage() {
  const supabase = createClient();
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [myExpeditions, setMyExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"available" | "mine">("available");
  const [accepting, setAccepting] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get camionneur profile
      const { data: cam } = await supabase
        .from("camionneurs")
        .select("full_name")
        .eq("user_id", user.id)
        .single();
      setProfile(cam);

      // Available expeditions (status = created, no camionneur)
      const { data: available } = await supabase
        .from("expeditions")
        .select("*, profiles(full_name, email)")
        .eq("status", "created")
        .is("camionneur_id", null)
        .order("created_at", { ascending: false });
      setExpeditions(available || []);

      // My assigned expeditions
      const { data: mine } = await supabase
        .from("expeditions")
        .select("*, profiles(full_name, email)")
        .eq("camionneur_id", user.id)
        .order("created_at", { ascending: false });
      setMyExpeditions(mine || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const acceptExpedition = async (expeditionId: string) => {
    setAccepting(expeditionId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("expeditions")
        .update({ camionneur_id: user.id, status: "assigned" })
        .eq("id", expeditionId);

      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setAccepting(null);
    }
  };

  const updateStatus = async (expeditionId: string, newStatus: string) => {
    const { error } = await supabase
      .from("expeditions")
      .update({ status: newStatus })
      .eq("id", expeditionId);
    if (!error) fetchData();
  };

  const stats = {
    available: expeditions.length,
    active: myExpeditions.filter(e => e.status === "in_transit").length,
    completed: myExpeditions.filter(e => e.status === "delivered").length,
    earnings: myExpeditions
      .filter(e => e.status === "delivered")
      .reduce((acc, e) => acc + (e.budget_dzd || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">
              Bonjour, {profile?.full_name || "Transporteur"} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Tableau de bord Camionneur
            </p>
          </div>
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            {expeditions.length > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-orange-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Disponibles", value: stats.available, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "En transit", value: stats.active, icon: Truck, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Livrées", value: stats.completed, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
            { label: "Gains (DZD)", value: stats.earnings.toLocaleString(), icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-0 shadow-sm">
                <CardContent className="flex items-center gap-3 py-4">
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-xl font-bold text-[#1e3a5f]">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "available" ? "default" : "outline"}
            className={activeTab === "available" ? "bg-[#1e3a5f]" : ""}
            onClick={() => setActiveTab("available")}
          >
            Expéditions disponibles
            {expeditions.length > 0 && (
              <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                {expeditions.length}
              </span>
            )}
          </Button>
          <Button
            variant={activeTab === "mine" ? "default" : "outline"}
            className={activeTab === "mine" ? "bg-[#1e3a5f]" : ""}
            onClick={() => setActiveTab("mine")}
          >
            Mes expéditions
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#1e3a5f]" />
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === "available" && (
              <>
                {expeditions.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="flex flex-col items-center py-16 text-center">
                      <Package className="h-10 w-10 text-gray-300 mb-3" />
                      <p className="font-medium text-gray-500">Aucune expédition disponible</p>
                      <p className="text-sm text-gray-400">Revenez bientôt pour de nouvelles offres</p>
                    </CardContent>
                  </Card>
                ) : (
                  expeditions.map((exp) => (
                    <ExpeditionCard
                      key={exp.id}
                      exp={exp}
                      mode="available"
                      onAccept={() => acceptExpedition(exp.id)}
                      accepting={accepting === exp.id}
                    />
                  ))
                )}
              </>
            )}

            {activeTab === "mine" && (
              <>
                {myExpeditions.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="flex flex-col items-center py-16 text-center">
                      <Truck className="h-10 w-10 text-gray-300 mb-3" />
                      <p className="font-medium text-gray-500">Aucune expédition acceptée</p>
                      <p className="text-sm text-gray-400">Acceptez des expéditions pour les voir ici</p>
                    </CardContent>
                  </Card>
                ) : (
                  myExpeditions.map((exp) => (
                    <ExpeditionCard
                      key={exp.id}
                      exp={exp}
                      mode="mine"
                      onStatusChange={(status) => updateStatus(exp.id, status)}
                    />
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Expedition Card Component
function ExpeditionCard({
  exp, mode, onAccept, accepting, onStatusChange,
}: {
  exp: Expedition;
  mode: "available" | "mine";
  onAccept?: () => void;
  accepting?: boolean;
  onStatusChange?: (status: string) => void;
}) {
  const statusCfg = STATUS_CONFIG[exp.status] || STATUS_CONFIG.created;

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1e3a5f]/10 rounded-xl">
              <Truck className="h-5 w-5 text-[#1e3a5f]" />
            </div>
            <div>
              <p className="font-semibold text-[#1e3a5f]">
                {exp.origin} → {exp.destination}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(exp.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
            {statusCfg.label}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <Package className="h-4 w-4 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Marchandise</p>
            <p className="text-sm font-medium text-gray-700 truncate">{exp.marchandise_type}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <Clock className="h-4 w-4 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Collecte</p>
            <p className="text-sm font-medium text-gray-700">
              {exp.pickup_date ? new Date(exp.pickup_date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "—"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <DollarSign className="h-4 w-4 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-sm font-semibold text-green-600">
              {exp.budget_dzd ? `${exp.budget_dzd.toLocaleString()} DZD` : "À négocier"}
            </p>
          </div>
        </div>

        {exp.description && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{exp.description}</p>
        )}

        {mode === "available" && (
          <Button
            className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
            onClick={onAccept}
            disabled={accepting}
          >
            {accepting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Acceptation...</>
            ) : (
              "✓ Accepter cette expédition"
            )}
          </Button>
        )}

        {mode === "mine" && (
          <div className="flex gap-2">
            {exp.status === "assigned" && (
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm"
                onClick={() => onStatusChange?.("in_transit")}
              >
                🚛 Démarrer le transit
              </Button>
            )}
            {exp.status === "in_transit" && (
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
                onClick={() => onStatusChange?.("delivered")}
              >
                ✓ Marquer comme livré
              </Button>
            )}
            {exp.contact_phone && (
              <Button variant="outline" size="sm" className="border-gray-200 text-sm">
                📞 {exp.contact_phone}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
