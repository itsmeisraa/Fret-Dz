"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, MapPin, Truck, FileText, Loader2 } from "lucide-react";
import Link from "next/link";

const WILAYAS = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra",
  "Béchar","Blida","Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret",
  "Tizi Ouzou","Alger","Djelfa","Jijel","Sétif","Saïda","Skikda",
  "Sidi Bel Abbès","Annaba","Guelma","Constantine","Médéa","Mostaganem",
  "M'Sila","Mascara","Ouargla","Oran","El Bayadh","Illizi","Bordj Bou Arréridj",
  "Boumerdès","El Tarf","Tindouf","Tissemsilt","El Oued","Khenchela",
  "Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent",
  "Ghardaïa","Relizane","Timimoun","Bordj Badji Mokhtar","Ouled Djellal",
  "Béni Abbès","In Salah","In Guezzam","Touggourt","Djanet","El M'Ghair","El Meniaa",
];

const MARCHANDISE_TYPES = [
  "Électronique","Alimentaire","Textile","Matériaux de construction",
  "Mobilier","Équipement industriel","Produits agricoles","Autre",
];

export default function NewShipmentPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    marchandise_type: "",
    weight_kg: "",
    volume_m3: "",
    description: "",
    pickup_date: "",
    budget_dzd: "",
    contact_phone: "",
    special_instructions: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase.from("expeditions").insert({
        commercant_id: user.id,
        origin: form.origin,
        destination: form.destination,
        marchandise_type: form.marchandise_type,
        weight_kg: parseFloat(form.weight_kg) || null,
        volume_m3: parseFloat(form.volume_m3) || null,
        description: form.description,
        pickup_date: form.pickup_date,
        budget_dzd: parseFloat(form.budget_dzd) || null,
        contact_phone: form.contact_phone,
        special_instructions: form.special_instructions,
        status: "created",
      });

      if (error) throw error;
      router.push("/dashboard/commercant?success=shipment_created");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: "Trajet", icon: MapPin },
    { id: 2, label: "Marchandise", icon: Package },
    { id: 3, label: "Détails", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard/commercant">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">Nouvelle Expédition</h1>
            <p className="text-sm text-gray-500">Créez une demande de transport</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step === s.id
                    ? "bg-[#1e3a5f] text-white"
                    : step > s.id
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  <Icon className="h-4 w-4" />
                  {s.label}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px flex-1 ${step > s.id ? "bg-green-300" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step 1: Trajet */}
        {step === 1 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-[#1e3a5f] flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                Informations du Trajet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Wilaya d'origine *</Label>
                  <Select onValueChange={(v) => handleChange("origin", v)}>
                    <SelectTrigger className="border-gray-200 focus:border-[#1e3a5f]">
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      {WILAYAS.map((w) => (
                        <SelectItem key={w} value={w}>{w}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Wilaya de destination *</Label>
                  <Select onValueChange={(v) => handleChange("destination", v)}>
                    <SelectTrigger className="border-gray-200 focus:border-[#1e3a5f]">
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      {WILAYAS.map((w) => (
                        <SelectItem key={w} value={w}>{w}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Date de collecte souhaitée *</Label>
                <Input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="border-gray-200 focus:border-[#1e3a5f]"
                  value={form.pickup_date}
                  onChange={(e) => handleChange("pickup_date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Téléphone de contact *</Label>
                <Input
                  placeholder="0X XX XX XX XX"
                  className="border-gray-200 focus:border-[#1e3a5f]"
                  value={form.contact_phone}
                  onChange={(e) => handleChange("contact_phone", e.target.value)}
                />
              </div>

              <Button
                className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
                onClick={() => setStep(2)}
                disabled={!form.origin || !form.destination || !form.pickup_date}
              >
                Suivant →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Marchandise */}
        {step === 2 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-[#1e3a5f] flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-500" />
                Détails de la Marchandise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Type de marchandise *</Label>
                <Select onValueChange={(v) => handleChange("marchandise_type", v)}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue placeholder="Sélectionner le type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MARCHANDISE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Poids (kg)</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 500"
                    className="border-gray-200"
                    value={form.weight_kg}
                    onChange={(e) => handleChange("weight_kg", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Volume (m³)</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 2.5"
                    className="border-gray-200"
                    value={form.volume_m3}
                    onChange={(e) => handleChange("volume_m3", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <Textarea
                  placeholder="Décrivez votre marchandise en détail..."
                  className="border-gray-200 resize-none"
                  rows={3}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Budget estimé (DZD)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 15000"
                  className="border-gray-200"
                  value={form.budget_dzd}
                  onChange={(e) => handleChange("budget_dzd", e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  ← Retour
                </Button>
                <Button
                  className="flex-1 bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
                  onClick={() => setStep(3)}
                  disabled={!form.marchandise_type}
                >
                  Suivant →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Récapitulatif */}
        {step === 3 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-[#1e3a5f] flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                Récapitulatif & Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Trajet</span>
                  <span className="text-sm font-semibold text-[#1e3a5f]">
                    {form.origin} → {form.destination}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Date de collecte</span>
                  <span className="text-sm font-medium">{form.pickup_date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Marchandise</span>
                  <Badge variant="secondary">{form.marchandise_type}</Badge>
                </div>
                {form.weight_kg && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Poids</span>
                    <span className="text-sm font-medium">{form.weight_kg} kg</span>
                  </div>
                )}
                {form.budget_dzd && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Budget</span>
                    <span className="text-sm font-semibold text-green-600">
                      {parseInt(form.budget_dzd).toLocaleString()} DZD
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Instructions spéciales</Label>
                <Textarea
                  placeholder="Instructions pour le transporteur (optionnel)..."
                  className="border-gray-200 resize-none"
                  rows={2}
                  value={form.special_instructions}
                  onChange={(e) => handleChange("special_instructions", e.target.value)}
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
                <Truck className="h-4 w-4 inline mr-2" />
                Après confirmation, votre demande sera visible par les transporteurs disponibles.
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                  ← Retour
                </Button>
                <Button
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Création...</>
                  ) : (
                    "✓ Confirmer l'expédition"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
