import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { updateProfile } from "@/lib/actions/profile"
import { User, Building2, Phone, Mail, MapPin, Save } from "lucide-react"

export default async function MerchantSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and company profile</p>
      </div>

      <form action={updateProfile}>
        <div className="grid gap-6">
          {/* Personal Info */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input name="full_name" defaultValue={profile?.full_name || ''} placeholder="e.g. Ahmed Benali" required className="h-11" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Phone Number</FieldLabel>
                    <div className="relative">
                       <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                       <Input name="phone" defaultValue={profile?.phone || ''} placeholder="+213..." className="h-11 pl-9" />
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel>Email Address</FieldLabel>
                    <div className="relative">
                       <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                       <Input disabled value={user.email} className="h-11 pl-9 bg-muted/50" />
                    </div>
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-accent" />
                Company Profile
              </CardTitle>
              <CardDescription>Identity details used for billing and cargo tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Company Name</FieldLabel>
                  <Input name="company_name" defaultValue={profile?.company_name || ''} placeholder="Company Sarl" className="h-11" />
                </Field>
                <Field>
                  <FieldLabel>Business Address</FieldLabel>
                  <div className="relative">
                     <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                     <Input name="company_address" defaultValue={profile?.company_address || ''} placeholder="Zone Industrielle..." className="h-11 pl-9" />
                  </div>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost">Cancel</Button>
            <Button type="submit" className="bg-primary text-primary-foreground min-w-[150px]">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
