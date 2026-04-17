'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createShipment(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const origin_address = formData.get('origin_address') as string
  const origin_city = formData.get('origin_city') as string
  const origin_wilaya = formData.get('origin_wilaya') as string
  const destination_address = formData.get('destination_address') as string
  const destination_city = formData.get('destination_city') as string
  const destination_wilaya = formData.get('destination_wilaya') as string
  const cargo_type = formData.get('cargo_type') as string
  const cargo_description = formData.get('cargo_description') as string
  const weight_kg = parseFloat(formData.get('weight_kg') as string)
  const pickup_date = formData.get('pickup_date') as string

  const { data, error } = await supabase
    .from('shipments')
    .insert({
      commercant_id: user.id,
      origin_address,
      origin_city,
      origin_wilaya,
      destination_address,
      destination_city,
      destination_wilaya,
      cargo_type,
      cargo_description,
      weight_kg,
      pickup_date,
      status: 'created',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating shipment:', error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/commercant')
  return redirect('/dashboard/commercant')
}
