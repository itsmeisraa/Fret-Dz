import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { updateVehicle } from "@/lib/actions/profile"
import { Truck, Scale, ShieldCheck, MapPin, Save, Info } from "lucide-react"

export default async function CarrierAvailabilityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/auth/login')

  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Work & Availability</h1>
        <p className="text-muted-foreground">Manage your vehicle details and work status</p>
      </div>

      <form action={updateVehicle}>
        <div className="grid gap-6">
          {/* Status Toggle */}
          <Card className="border-none shadow-lg bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Looking for Work</h3>
                    <p className="text-sm text-muted-foreground">When active, you will appear to shippers looking for carriers</p>
                  </div>
                </div>
                <Switch name="is_available" defaultChecked={vehicle?.is_available} />
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-accent" />
                Vehicle Information
              </CardTitle>
              <CardDescription>Required to apply for cargo shipments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>License Plate</FieldLabel>
                    <Input name="plate_number" defaultValue={vehicle?.plate_number || ''} placeholder="00123-101-16" required className="h-11 font-mono uppercase" />
                  </Field>
                  <Field>
                    <FieldLabel>Vehicle Type</FieldLabel>
                    <select 
                       name="vehicle_type" 
                       defaultValue={vehicle?.vehicle_type || 'medium_truck'}
                       className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                       required
                    >
                       <option value="small_truck">Small Truck (up to 3.5t)</option>
                       <option value="medium_truck">Medium Truck (3.5t - 19t)</option>
                       <option value="large_truck">Large Truck (above 19t)</option>
                       <option value="semi_trailer">Semi-Trailer (40t)</option>
                       <option value="refrigerated">Refrigerated Truck</option>
                    </select>
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Payload Capacity (KG)</FieldLabel>
                    <div className="relative">
                       <Scale className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                       <Input name="capacity_kg" type="number" defaultValue={vehicle?.capacity_kg || ''} placeholder="5000" required className="h-11 pl-9" />
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel>Current Location (Wilaya)</FieldLabel>
                    <div className="relative">
                       <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                       <Input name="current_location" defaultValue={vehicle?.current_location || ''} placeholder="e.g. Algiers" className="h-11 pl-9" />
                    </div>
                  </Field>
                </div>
              </FieldGroup>

              {!vehicle && (
                <div className="flex gap-3 rounded-lg bg-amber-50 p-4 border border-amber-200">
                  <Info className="h-5 w-5 text-amber-600 shrink-0" />
                  <p className="text-sm text-amber-700">
                    You haven't registered a vehicle yet. You must complete this form to be able to apply for shipments.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" className="min-w-[150px]">
              <Save className="mr-2 h-4 w-4" />
              Update Status
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
