'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const full_name = formData.get('full_name') as string
  const phone = formData.get('phone') as string
  const company_name = formData.get('company_name') as string
  const company_address = formData.get('company_address') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name,
      phone,
      company_name,
      company_address,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/settings')
  return { success: true }
}

export async function updateVehicle(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const plate_number = formData.get('plate_number') as string
  const vehicle_type = formData.get('vehicle_type') as string
  const capacity_kg = parseFloat(formData.get('capacity_kg') as string)
  const is_available = formData.get('is_available') === 'on'

  // UPSERT vehicle based on owner_id
  const { error } = await supabase
    .from('vehicles')
    .upsert({
      owner_id: user.id,
      plate_number,
      vehicle_type,
      capacity_kg,
      is_available,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'owner_id' })

  if (error) {
    console.error('Error updating vehicle:', error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/camionneur/availability')
  return { success: true }
}
