'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Truck, Building2, ChevronLeft, Phone, User, Mail, Lock, Landmark, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { signup } from '@/app/auth/actions'

export default function SignupPage() {
  const [role, setRole] = useState<'commercant' | 'camionneur'>('commercant')
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-[url('/images/hero-truck.jpg')] bg-cover bg-center flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl"
      >
        <Link 
          href="/" 
          className="mb-6 inline-flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="border-none shadow-2xl bg-background/95 backdrop-blur-md overflow-hidden">
          <div className="grid md:grid-cols-[1fr_1.5fr]">
            {/* Sidebar with Role Selection */}
            <div className="bg-muted/50 p-8 flex flex-col gap-6 border-r">
              <div className="mb-2">
                <h3 className="text-xl font-bold">I am a...</h3>
                <p className="text-sm text-muted-foreground">Select your account type</p>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setRole('commercant')}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    role === 'commercant' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-transparent hover:border-muted-foreground/30'
                  }`}
                >
                  <Building2 className={`h-6 w-6 mt-1 ${role === 'commercant' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div>
                    <p className={`font-bold ${role === 'commercant' ? 'text-primary' : ''}`}>Commerçant</p>
                    <p className="text-xs text-muted-foreground">I want to ship goods across Algeria</p>
                  </div>
                </button>

                <button
                  onClick={() => setRole('camionneur')}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    role === 'camionneur' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-transparent hover:border-muted-foreground/30'
                  }`}
                >
                  <Truck className={`h-6 w-6 mt-1 ${role === 'camionneur' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div>
                    <p className={`font-bold ${role === 'camionneur' ? 'text-primary' : ''}`}>Camionneur</p>
                    <p className="text-xs text-muted-foreground">I own a truck and want to carry loads</p>
                  </div>
                </button>
              </div>

              <div className="mt-auto hidden md:block">
                <p className="text-xs text-muted-foreground">
                  By joining, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
                <CardDescription className="text-base">
                  Get started with Fret-Dz today
                </CardDescription>
              </CardHeader>
              
              <form action={signup} onSubmit={() => setIsLoading(true)} className="flex flex-col gap-4">
                <input type="hidden" name="role" value={role} />
                
                <FieldGroup className="gap-4">
                  <Field>
                    <FieldLabel>Full Name</FieldLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input name="full_name" placeholder="Mohamed Amine" required className="pl-10 h-11" />
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel>Email Address</FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input name="email" type="email" placeholder="mohamed@company.dz" required className="pl-10 h-11" />
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel>Phone Number</FieldLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input name="phone" placeholder="05XX XX XX XX" required className="pl-10 h-11" />
                    </div>
                  </Field>

                  <AnimatePresence mode="wait">
                    {role === 'commercant' ? (
                      <motion.div
                        key="commercant"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col gap-4 overflow-hidden"
                      >
                        <Field>
                          <FieldLabel>Company Name</FieldLabel>
                          <div className="relative">
                            <Landmark className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                            <Input name="company_name" placeholder="Sarl Logistique Express" required className="pl-10 h-11" />
                          </div>
                        </Field>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="camionneur"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col gap-4 overflow-hidden"
                      >
                        <Field>
                          <FieldLabel>License Document (Permis)</FieldLabel>
                          <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-input bg-muted/30 group cursor-pointer hover:border-primary transition-colors">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-background group-hover:bg-primary/10 transition-colors">
                              <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <span className="text-sm text-muted-foreground">Click to upload license copy</span>
                          </div>
                        </Field>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Field>
                    <FieldLabel>Password</FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input name="password" type="password" placeholder="••••••••" required className="pl-10 h-11" />
                    </div>
                  </Field>
                </FieldGroup>

                <Button type="submit" size="lg" className="w-full h-11 mt-4 text-lg font-semibold" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Join Now'}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                    Sign In
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
