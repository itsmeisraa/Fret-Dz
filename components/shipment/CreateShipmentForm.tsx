'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Ship, MapPin, Calendar, Weight, Info, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { createShipment } from '@/lib/actions/shipment'

const ALGERIAN_WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Algiers', 
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annabba', 'Guelma', 
  'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 
  'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 
  'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 
  'Ghardaïa', 'Relizane'
]

export function CreateShipmentForm() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <form action={createShipment} onSubmit={() => setIsLoading(true)}>
        <Card className="border-none shadow-xl">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-xl py-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Ship className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">New Shipment</CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg">
                  Fill in the details to find a carrier across Algeria
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid gap-10 md:grid-cols-2">
              {/* Origin Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <MapPin className="h-5 w-5" />
                  <h4>Origin (Departure)</h4>
                </div>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Wilaya</FieldLabel>
                    <select 
                      name="origin_wilaya" 
                      className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      required
                    >
                      <option value="">Select Wilaya</option>
                      {ALGERIAN_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </Field>
                  <Field>
                    <FieldLabel>City</FieldLabel>
                    <Input name="origin_city" placeholder="e.g. Dar El Beïda" required className="h-11" />
                  </Field>
                  <Field>
                    <FieldLabel>Full Address</FieldLabel>
                    <Input name="origin_address" placeholder="Street, Warehouse Name..." required className="h-11" />
                  </Field>
                </FieldGroup>
              </div>

              {/* Destination Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-accent font-bold">
                  <MapPin className="h-5 w-5" />
                  <h4>Destination (Arrival)</h4>
                </div>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Wilaya</FieldLabel>
                    <select 
                      name="destination_wilaya" 
                      className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      required
                    >
                      <option value="">Select Wilaya</option>
                      {ALGERIAN_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </Field>
                  <Field>
                    <FieldLabel>City</FieldLabel>
                    <Input name="destination_city" placeholder="e.g. Es Sénia" required className="h-11" />
                  </Field>
                  <Field>
                    <FieldLabel>Full Address</FieldLabel>
                    <Input name="destination_address" placeholder="Delivery point details..." required className="h-11" />
                  </Field>
                </FieldGroup>
              </div>

              {/* Cargo Details */}
              <div className="md:col-span-2 space-y-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Truck className="h-5 w-5" />
                  <h4>Cargo & Schedule</h4>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <Field>
                    <FieldLabel>Cargo Type</FieldLabel>
                    <Input name="cargo_type" placeholder="e.g. Food, Electronics, Construction" required className="h-11" />
                  </Field>
                  <Field>
                    <FieldLabel>Weight (KG)</FieldLabel>
                    <div className="relative">
                      <Weight className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input name="weight_kg" type="number" placeholder="5000" required className="h-11 pr-10" />
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel>Pickup Date</FieldLabel>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input name="pickup_date" type="date" required className="h-11 pr-10" />
                    </div>
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Description & Requirements</FieldLabel>
                  <Textarea 
                    name="cargo_description" 
                    placeholder="Provide details about dimensions, fragility, or special handling..." 
                    className="min-h-[100px] bg-muted/20"
                  />
                </Field>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-end gap-4">
              <Button type="button" variant="ghost" size="lg" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-10 h-14 text-lg font-bold shadow-lg shadow-accent/20"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Post Shipment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </motion.div>
  )
}
