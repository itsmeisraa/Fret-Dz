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

export async function applyForShipment(shipmentId: string, proposedPrice?: number, message?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Get user's vehicle
  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!vehicle) throw new Error('You must register a vehicle before applying')

  const { error } = await supabase
    .from('shipment_applications')
    .insert({
      shipment_id: shipmentId,
      camionneur_id: user.id,
      vehicle_id: vehicle.id,
      proposed_price: proposedPrice,
      message: message,
      status: 'pending'
    })

  if (error) {
    if (error.code === '23505') throw new Error('You have already applied for this shipment')
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/camionneur')
  revalidatePath(`/dashboard/shipment/${shipmentId}`)
  return { success: true }
}

export async function updateShipmentStatus(shipmentId: string, status: string, description: string, location?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Update shipment
  const { error: updateError } = await supabase
    .from('shipments')
    .update({ 
      status, 
      updated_at: new Date().toISOString(),
      actual_delivery_date: status === 'delivered' ? new Date().toISOString() : null
    })
    .eq('id', shipmentId)

  if (updateError) throw new Error(updateError.message)

  // Log event
  await supabase
    .from('shipment_events')
    .insert({
      shipment_id: shipmentId,
      event_type: status,
      description,
      location,
      created_by: user.id
    })

  revalidatePath(`/dashboard/shipment/${shipmentId}`)
  revalidatePath('/dashboard/camionneur')
  return { success: true }
}

export async function acceptCarrier(shipmentId: string, applicationId: string, camionneurId: string, vehicleId: string) {
  const supabase = await createClient()

  // 1. Update application status
  const { error: appError } = await supabase
    .from('shipment_applications')
    .update({ status: 'accepted' })
    .eq('id', applicationId)

  if (appError) throw new Error(appError.message)

  // 2. Reject other applications
  await supabase
    .from('shipment_applications')
    .update({ status: 'rejected' })
    .eq('shipment_id', shipmentId)
    .neq('id', applicationId)

  // 3. Update shipment with assigned carrier
  const { error: shipError } = await supabase
    .from('shipments')
    .update({ 
      camionneur_id: camionneurId,
      vehicle_id: vehicleId,
      status: 'assigned'
    })
    .eq('id', shipmentId)

  if (shipError) throw new Error(shipError.message)

  revalidatePath(`/dashboard/shipment/${shipmentId}`)
  revalidatePath('/dashboard/commercant')
  return { success: true }
}
