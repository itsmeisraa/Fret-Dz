"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Truck, MapPin, Package,
  CheckCircle, Clock, Banknote, Loader2, ShieldCheck,
  Weight, CalendarDays, ChevronRight,
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
  payment_status: string;
}

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (id) fetchExpedition();
  }, [id]);

  const fetchExpedition = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("expeditions")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      setExpedition(data);
      if (data.payment_status === "paid") setConfirmed(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async () => {
    setConfirming(true);
    try {
      const { error } = await supabase
        .from("expeditions")
        .update({ payment_status: "cash_on_delivery", payment_method: "cash" })
        .eq("id", id);
      if (error) throw error;
      setConfirmed(true);
    } catch (err) {
      console.error(err);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-[#1e3a5f] flex items-center justify-center">
              <Truck className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -inset-1 rounded-2xl border-2 border-[#1e3a5f]/20 animate-ping" />
          </div>
          <p className="text-sm text-[#1e3a5f]/60 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!expedition) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-2xl bg-gray-200 flex items-center justify-center mx-auto mb-3">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Expédition introuvable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      {/* Top nav bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="h-9 w-9 rounded-xl bg-[#f0f4f8] flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-[#1e3a5f]" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-[#1e3a5f] leading-none">Paiement</h1>
          <p className="text-xs text-gray-400 mt-0.5">Confirmez votre mode de paiement</p>
        </div>
        <div className="h-8 w-8 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
          <Truck className="h-4 w-4 text-white" />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 pb-8 space-y-4">

        {confirmed ? (
          /* ── SUCCESS STATE ── */
          <div className="pt-4">
            {/* Animated success icon */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-3xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">Expédition confirmée !</h2>
              <p className="text-sm text-gray-500 text-center mt-1 max-w-xs">
                Votre expédition est enregistrée. Le paiement s'effectuera à la livraison.
              </p>
            </div>

            {/* Route visual */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="h-8 w-8 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div className="w-0.5 h-6 bg-gradient-to-b from-[#1e3a5f] to-orange-400 rounded-full" />
                  <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Départ</p>
                    <p className="font-semibold text-[#1e3a5f]">{expedition.origin}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Destination</p>
                    <p className="font-semibold text-[#1e3a5f]">{expedition.destination}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount pill */}
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4f80] rounded-2xl p-4 shadow-md mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs font-medium">Montant à régler</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {expedition.budget_dzd?.toLocaleString()}
                    <span className="text-lg font-normal text-white/60 ml-1">DZD</span>
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <Banknote className="h-7 w-7 text-orange-400" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-white/80 text-xs font-medium">💵 Paiement à la livraison</p>
              </div>
            </div>

            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 text-sm rounded-2xl shadow-md shadow-orange-500/20"
              onClick={() => router.push("/dashboard/commercant")}
            >
              Retour au dashboard
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        ) : (
          <>
            {/* ── ROUTE CARD ── */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-3">Trajet</p>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="h-9 w-9 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div className="w-0.5 h-8 bg-gradient-to-b from-[#1e3a5f] to-orange-400 rounded-full" />
                  <div className="h-9 w-9 rounded-xl bg-orange-500 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="bg-[#f0f4f8] rounded-xl px-3 py-2">
                    <p className="text-[10px] text-gray-400 font-semibold">Départ</p>
                    <p className="font-semibold text-[#1e3a5f] text-sm">{expedition.origin}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-orange-400 font-semibold">Destination</p>
                    <p className="font-semibold text-orange-600 text-sm">{expedition.destination}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── EXPEDITION DETAILS ── */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-3">Détails de l'expédition</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Package className="h-4 w-4 text-[#1e3a5f]" />
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Marchandise</span>
                    <span className="text-sm font-semibold text-[#1e3a5f]">{expedition.marchandise_type}</span>
                  </div>
                </div>

                {expedition.weight_kg && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Weight className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-sm text-gray-500">Poids</span>
                      <span className="text-sm font-semibold text-[#1e3a5f]">{expedition.weight_kg} kg</span>
                    </div>
                  </div>
                )}

                {expedition.pickup_date && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-sm text-gray-500">Date de collecte</span>
                      <span className="text-sm font-semibold text-[#1e3a5f]">
                        {new Date(expedition.pickup_date).toLocaleDateString("fr-FR", {
                          day: "numeric", month: "long"
                        })}
                      </span>
                    </div>
                  </div>
                )}

                <div className="border-t border-dashed border-gray-100 pt-3 mt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600">Total à payer</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#1e3a5f]">
                        {expedition.budget_dzd?.toLocaleString() || "—"}
                      </span>
                      <span className="text-sm text-gray-400 ml-1">DZD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── PAYMENT METHOD ── */}
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2 px-1">
                Mode de paiement
              </p>
              <div className="bg-white rounded-2xl border-2 border-[#1e3a5f] shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  <div className="h-12 w-12 rounded-xl bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
                    <Banknote className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#1e3a5f]">Paiement à la livraison</p>
                    <p className="text-sm text-gray-400">Payez en espèces à la réception</p>
                  </div>
                  <div className="h-6 w-6 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  </div>
                </div>
                <div className="bg-[#f0f4f8] px-4 py-2 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <p className="text-xs text-gray-500">Disponible dans toute l'Algérie</p>
                </div>
              </div>
            </div>

            {/* ── SECURITY NOTE ── */}
            <div className="flex items-start gap-3 bg-green-50 rounded-xl px-4 py-3 border border-green-100">
              <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-green-700 font-medium leading-relaxed">
                Votre expédition est protégée par Fret-DZ. Le paiement est dû uniquement après réception de votre marchandise.
              </p>
            </div>

            {/* ── CONFIRM BUTTON ── */}
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold py-6 text-base rounded-2xl shadow-lg shadow-orange-500/25 transition-all"
              onClick={confirmPayment}
              disabled={confirming}
            >
              {confirming ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Confirmation en cours...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Confirmer — Payer à la livraison
                </span>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
