'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Truck, Building2, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { login } from '@/app/auth/actions'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    // The form action handles the redirect
  }

  return (
    <div className="min-h-screen bg-[url('/images/hero-truck.jpg')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Link 
          href="/" 
          className="mb-6 flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="border-none shadow-2xl bg-background/95 backdrop-blur-md">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Sign in to manage your shipments and offers
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form action={login} onSubmit={() => setIsLoading(true)} className="flex flex-col gap-6">
              <FieldGroup>
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input 
                    name="email" 
                    type="email" 
                    placeholder="name@company.dz" 
                    required 
                    className="h-12"
                  />
                </Field>
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel>Password</FieldLabel>
                    <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground" type="button">
                      Forgot password?
                    </Button>
                  </div>
                  <Input 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    className="h-12"
                  />
                </Field>
              </FieldGroup>

              <Button type="submit" size="lg" className="w-full h-12 text-lg font-semibold" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
                  Join Fret-Dz
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm border border-white/20">
            <p className="text-xs font-semibold text-white/60 mb-1 uppercase tracking-wider">Demo Shipper</p>
            <p className="text-sm text-white font-mono truncate">merchant@demo.dz</p>
            <p className="text-sm text-white font-mono">demo1234</p>
          </div>
          <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm border border-white/20">
            <p className="text-xs font-semibold text-white/60 mb-1 uppercase tracking-wider">Demo Carrier</p>
            <p className="text-sm text-white font-mono truncate">carrier@demo.dz</p>
            <p className="text-sm text-white font-mono">demo1234</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
