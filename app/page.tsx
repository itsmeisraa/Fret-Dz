"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { login, signup } from "@/app/auth/actions";
import { useToast } from "@/components/ui/use-toast";
import { useFormStatus } from "react-dom";
import { 
  Truck, 
  Package, 
  MapPin, 
  Shield, 
  Clock, 
  FileText,
  ChevronRight,
  Upload,
  Building2,
  ChevronDown,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LandingPageContent />
    </Suspense>
  )
}

function LandingPageContent() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [registerType, setRegisterType] = useState<"commercant" | "camionneur">("commercant");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const { toast } = useToast();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = searchParams.get('message');

  useEffect(() => {
    if (error) {
      toast({
        title: "Authentication Error",
        description: decodeURIComponent(error),
        variant: "destructive",
      });
      window.history.replaceState({}, '', '/');
    } else if (message) {
      toast({
        title: "Success",
        description: decodeURIComponent(message),
      });
      window.history.replaceState({}, '', '/');
    }
  }, [error, message, toast]);

  const faqs = [
    {
      q: "How do I track my shipment?",
      a: "Once your shipment is created and assigned to a carrier, you can track its status in real-time from your dashboard. You'll receive notifications at every major milestone."
    },
    {
      q: "What documents do I need to register as a Commerçant?",
      a: "You'll need your company's NIF (Numéro d'Identification Fiscale) and basic business information. Additional verification may be required for high-value shipments."
    },
    {
      q: "How are carriers verified?",
      a: "All Camionneurs must submit their driving permit, vehicle registration, and insurance documents. Our team verifies each document before activation."
    },
    {
      q: "What is a Bon de Livraison?",
      a: "The Bon de Livraison (Delivery Note) is the official document confirming successful delivery. Carriers upload a signed copy through the app, which is stored in your documents section."
    },
      {
      q: "who created this website",
      a: " a cool girl, she is called israa Chiheb "
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-truck.jpg"
            alt="Modern freight truck on Algerian highway"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.h1 
              variants={fadeIn}
              transition={{ duration: 0.6 }}
              className="text-balance text-5xl font-bold tracking-tight text-primary-foreground sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              Smarter Logistics for Algeria
            </motion.h1>
            <motion.p 
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-pretty text-xl text-primary-foreground/90 sm:text-2xl lg:text-3xl"
            >
              Efficient B2B shipments connecting merchants and carriers across the nation. Real-time tracking, transparent pricing, and professional service.
            </motion.p>
            <motion.div 
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                  <Link href="#auth">
                    Let's Start
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-card py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How Fret-Dz Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Simple, transparent, and efficient logistics for your business
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                icon: Package,
                title: "Create Shipment",
                description: "Enter your cargo details, origin, and destination"
              },
              {
                icon: Truck,
                title: "Get Matched",
                description: "We connect you with verified carriers in your region"
              },
              {
                icon: MapPin,
                title: "Track in Real-Time",
                description: "Monitor your shipment status every step of the way"
              },
              {
                icon: FileText,
                title: "Digital Documents",
                description: "All paperwork handled digitally for your records"
              }
            ].map((step, index) => (
              <motion.div 
                key={step.title} 
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                >
                  <step.icon className="h-8 w-8 text-primary" />
                </motion.div>
                <div className="absolute -right-4 top-8 hidden text-4xl font-bold text-muted/50 lg:block">
                  {index < 3 ? "→" : ""}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="auth" className="bg-secondary/30 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 
                variants={slideIn}
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                Built for Algerian Business
              </motion.h2>
              <motion.p 
                variants={slideIn}
                className="mt-4 text-lg text-muted-foreground"
              >
                Fret-Dz understands the unique challenges of logistics in Algeria. Our platform is designed to meet local requirements while providing world-class service.
              </motion.p>

              <div className="mt-10 flex flex-col gap-6">
                {[
                  {
                    icon: Shield,
                    title: "Verified Carriers",
                    description: "All camionneurs are verified with valid permits and insurance"
                  },
                  {
                    icon: Clock,
                    title: "24/7 Support",
                    description: "Round-the-clock assistance in Arabic and French"
                  },
                  {
                    icon: FileText,
                    title: "Compliant Documentation",
                    description: "NIF verification, Bon de Livraison, and all required paperwork"
                  }
                ].map((feature, index) => (
                  <motion.div 
                    key={feature.title} 
                    variants={slideIn}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                    className="flex gap-4"
                  >
                    <motion.div 
                      whileHover={{ rotate: 10 }}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10"
                    >
                      <feature.icon className="h-6 w-6 text-accent" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Auth Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:pl-8"
            >
              <Card className="mx-auto max-w-md shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Welcome to Fret-Dz</CardTitle>
                  <CardDescription>
                    {authMode === "login" 
                      ? "Sign in to access your dashboard" 
                      : "Create an account to get started"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "login" | "register")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="mt-6">
                      <form action={login} className="flex flex-col gap-4">
                        <FieldGroup>
                          <Field>
                            <FieldLabel>Email</FieldLabel>
                            <Input name="email" type="email" placeholder="vous@entreprise.dz" required />
                          </Field>
                          <Field>
                            <FieldLabel>Password</FieldLabel>
                            <Input name="password" type="password" placeholder="••••••••" required />
                          </Field>
                        </FieldGroup>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <SubmitButton className="mt-2 w-full">
                            Sign In
                          </SubmitButton>
                        </motion.div>
                        <div className="flex flex-col gap-2 text-center">
                          <Button variant="link" className="text-sm text-muted-foreground p-0 h-auto">
                            Forgot your password?
                          </Button>
                        </div>
                      </form>
                    </TabsContent>

                    <TabsContent value="register" className="mt-6">
                      <div className="mb-6 grid grid-cols-2 gap-3">
                        <motion.button
                          type="button"
                          onClick={() => setRegisterType("commercant")}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                            registerType === "commercant" 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-muted-foreground/50"
                          }`}
                        >
                          <Building2 className={`h-8 w-8 ${registerType === "commercant" ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`text-sm font-medium ${registerType === "commercant" ? "text-primary" : "text-muted-foreground"}`}>
                            Commerçant
                          </span>
                          <span className="text-xs text-muted-foreground">Shipper</span>
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setRegisterType("camionneur")}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                            registerType === "camionneur" 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-muted-foreground/50"
                          }`}
                        >
                          <Truck className={`h-8 w-8 ${registerType === "camionneur" ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`text-sm font-medium ${registerType === "camionneur" ? "text-primary" : "text-muted-foreground"}`}>
                            Camionneur
                          </span>
                          <span className="text-xs text-muted-foreground">Carrier</span>
                        </motion.button>
                      </div>

                      <form action={signup} className="flex flex-col gap-4">
                        <input type="hidden" name="role" value={registerType} />
                        <FieldGroup>
                          <AnimatePresence mode="wait">
                            {registerType === "commercant" ? (
                              <motion.div
                                key="commercant-fields"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col gap-4"
                              >
                                <Field>
                                  <FieldLabel>Company Name</FieldLabel>
                                  <Input name="company_name" placeholder="Your Business Name" required />
                                </Field>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="camionneur-fields"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col gap-4"
                              >
                                <Field>
                                  <FieldLabel>Full Name</FieldLabel>
                                  <Input name="full_name" placeholder="Your Name" required />
                                </Field>
                                <Field>
                                  <FieldLabel>Vehicle Description</FieldLabel>
                                  <Input placeholder="e.g., Semi-Trailer, Box Truck" />
                                </Field>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <Field>
                            <FieldLabel>Phone Number</FieldLabel>
                            <Input name="phone" type="tel" placeholder="+213 5XX XX XX XX" required />
                          </Field>
                          <Field>
                            <FieldLabel>Email</FieldLabel>
                            <Input name="email" type="email" placeholder="vous@entreprise.dz" required />
                          </Field>
                          <Field>
                            <FieldLabel>Password</FieldLabel>
                            <Input name="password" type="password" placeholder="Create a password" required />
                          </Field>
                        </FieldGroup>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <SubmitButton className="mt-2 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                            Create Account
                          </SubmitButton>
                        </motion.div>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-card py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mt-12 flex flex-col gap-4"
          >
            {faqs.map((faq, index) => (
              <motion.div 
                key={faq.q} 
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
                className="overflow-hidden rounded-lg border bg-card"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <h3 className="font-semibold text-foreground">{faq.q}</h3>
                  <motion.div
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-6 pb-6 text-sm text-muted-foreground">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-primary py-12 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10">
                <Truck className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Fret-Dz</span>
            </motion.div>
            <div className="flex items-center gap-6 text-sm text-primary-foreground/70">
              <Link href="#" className="hover:text-primary-foreground">Privacy</Link>
              <Link href="#" className="hover:text-primary-foreground">Terms</Link>
              <Link href="#" className="hover:text-primary-foreground">Contact</Link>
            </div>
            <p className="text-sm text-primary-foreground/70">
              © 2026 Fret-Dz. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SubmitButton({ children, className }: { children: React.ReactNode, className?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className={className} disabled={pending}>
      {pending ? (
        <>
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Processing...
        </>
      ) : children}
    </Button>
  );
}
