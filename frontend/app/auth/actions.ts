'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login Error:', error.message)
    return redirect('/?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  
  // Fetch user role to redirect to correct dashboard
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role === 'camionneur') {
      return redirect('/dashboard/camionneur')
    }
    return redirect('/dashboard/commercant')
  }

  return redirect('/dashboard/commercant')
}

export async function signup(formData: FormData) {
  const adminClient = await createAdminClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string
  const fullName = formData.get('full_name') as string
  const phone = formData.get('phone') as string
  const companyName = formData.get('company_name') as string

  const signupData = {
    email,
    password,
    email_confirm: true, // Auto-confirm email to solve verification loops
    user_metadata: {
      full_name: fullName || '',
      phone: phone || '',
      role: role || 'commercant',
      company_name: companyName || '',
    },
  }

  console.log('--- Admin Signup Attempt ---')
  console.log('Email:', email)

  const { data, error } = await adminClient.auth.admin.createUser(signupData)

  if (error) {
    console.error('Admin Signup Error:', JSON.stringify(error, null, 2))
    return redirect('/?error=' + encodeURIComponent(error.message))
  }

  // AUTO-LOGIN: Now that the user is created and confirmed, log them in immediately
  const supabase = await createClient()
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (loginError) {
    console.error('Auto-login Error:', loginError.message)
    return redirect('/?message=' + encodeURIComponent("Account created! Please log in manually."))
  }

  revalidatePath('/', 'layout')
  
  if (role === 'camionneur') {
    return redirect('/dashboard/camionneur')
  }
  return redirect('/dashboard/commercant')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  return redirect('/')
}
