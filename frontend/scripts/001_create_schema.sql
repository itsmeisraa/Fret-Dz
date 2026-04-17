-- Fret-Dz Logistics Database Schema
-- This script creates the core tables for the B2B logistics platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('commercant', 'camionneur', 'admin')),
  company_name TEXT,
  company_address TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles table (for camionneurs)
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plate_number TEXT NOT NULL UNIQUE,
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('small_truck', 'medium_truck', 'large_truck', 'semi_trailer', 'refrigerated')),
  capacity_kg NUMERIC NOT NULL,
  capacity_m3 NUMERIC,
  is_available BOOLEAN DEFAULT TRUE,
  current_location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipments table
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number TEXT UNIQUE NOT NULL,
  commercant_id UUID NOT NULL REFERENCES public.profiles(id),
  camionneur_id UUID REFERENCES public.profiles(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  
  -- Route information
  origin_address TEXT NOT NULL,
  origin_city TEXT NOT NULL,
  origin_wilaya TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  destination_wilaya TEXT NOT NULL,
  
  -- Payload information
  cargo_type TEXT NOT NULL,
  cargo_description TEXT,
  weight_kg NUMERIC NOT NULL,
  volume_m3 NUMERIC,
  special_instructions TEXT,
  is_fragile BOOLEAN DEFAULT FALSE,
  requires_refrigeration BOOLEAN DEFAULT FALSE,
  
  -- Pricing
  estimated_price NUMERIC,
  final_price NUMERIC,
  currency TEXT DEFAULT 'DZD',
  
  -- Status
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'assigned', 'picked_up', 'in_transit', 'arrived', 'delivered', 'cancelled')),
  
  -- Dates
  pickup_date DATE,
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipment Timeline/Audit Log
CREATE TABLE IF NOT EXISTS public.shipment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  document_type TEXT NOT NULL CHECK (document_type IN ('bon_livraison', 'facture', 'bordereau', 'photo_cargo', 'photo_delivery', 'other')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipment Applications (camionneurs applying for loads)
CREATE TABLE IF NOT EXISTS public.shipment_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  camionneur_id UUID NOT NULL REFERENCES public.profiles(id),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
  proposed_price NUMERIC,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(shipment_id, camionneur_id)
);

-- Ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  rated_by UUID NOT NULL REFERENCES public.profiles(id),
  rated_user UUID NOT NULL REFERENCES public.profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(shipment_id, rated_by)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Vehicles RLS Policies
DROP POLICY IF EXISTS "Anyone can view vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Camionneurs can manage own vehicles" ON public.vehicles;
CREATE POLICY "Anyone can view vehicles" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Camionneurs can manage own vehicles" ON public.vehicles FOR ALL USING (auth.uid() = owner_id);

-- Shipments RLS Policies
DROP POLICY IF EXISTS "Commercants can view own shipments" ON public.shipments;
DROP POLICY IF EXISTS "Camionneurs can view assigned shipments" ON public.shipments;
DROP POLICY IF EXISTS "Camionneurs can view available shipments" ON public.shipments;
DROP POLICY IF EXISTS "Commercants can create shipments" ON public.shipments;
DROP POLICY IF EXISTS "Commercants can update own shipments" ON public.shipments;
DROP POLICY IF EXISTS "Camionneurs can update assigned shipments" ON public.shipments;
CREATE POLICY "Commercants can view own shipments" ON public.shipments FOR SELECT USING (auth.uid() = commercant_id);
CREATE POLICY "Camionneurs can view assigned shipments" ON public.shipments FOR SELECT USING (auth.uid() = camionneur_id);
CREATE POLICY "Camionneurs can view available shipments" ON public.shipments FOR SELECT USING (status = 'pending' AND camionneur_id IS NULL);
CREATE POLICY "Commercants can create shipments" ON public.shipments FOR INSERT WITH CHECK (auth.uid() = commercant_id);
CREATE POLICY "Commercants can update own shipments" ON public.shipments FOR UPDATE USING (auth.uid() = commercant_id);
CREATE POLICY "Camionneurs can update assigned shipments" ON public.shipments FOR UPDATE USING (auth.uid() = camionneur_id);

-- Shipment Events RLS Policies
DROP POLICY IF EXISTS "View events for accessible shipments" ON public.shipment_events;
DROP POLICY IF EXISTS "Users can create events" ON public.shipment_events;
CREATE POLICY "View events for accessible shipments" ON public.shipment_events FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.shipments s 
    WHERE s.id = shipment_id 
    AND (s.commercant_id = auth.uid() OR s.camionneur_id = auth.uid())
  )
);
CREATE POLICY "Users can create events" ON public.shipment_events FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Documents RLS Policies
DROP POLICY IF EXISTS "View documents for accessible shipments" ON public.documents;
DROP POLICY IF EXISTS "Users can upload documents" ON public.documents;
CREATE POLICY "View documents for accessible shipments" ON public.documents FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.shipments s 
    WHERE s.id = shipment_id 
    AND (s.commercant_id = auth.uid() OR s.camionneur_id = auth.uid())
  )
);
CREATE POLICY "Users can upload documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- Shipment Applications RLS Policies
DROP POLICY IF EXISTS "Commercants can view applications for their shipments" ON public.shipment_applications;
DROP POLICY IF EXISTS "Camionneurs can view own applications" ON public.shipment_applications;
DROP POLICY IF EXISTS "Camionneurs can create applications" ON public.shipment_applications;
DROP POLICY IF EXISTS "Camionneurs can update own applications" ON public.shipment_applications;
DROP POLICY IF EXISTS "Commercants can update applications for their shipments" ON public.shipment_applications;
CREATE POLICY "Commercants can view applications for their shipments" ON public.shipment_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.shipments s WHERE s.id = shipment_id AND s.commercant_id = auth.uid())
);
CREATE POLICY "Camionneurs can view own applications" ON public.shipment_applications FOR SELECT USING (auth.uid() = camionneur_id);
CREATE POLICY "Camionneurs can create applications" ON public.shipment_applications FOR INSERT WITH CHECK (auth.uid() = camionneur_id);
CREATE POLICY "Camionneurs can update own applications" ON public.shipment_applications FOR UPDATE USING (auth.uid() = camionneur_id);
CREATE POLICY "Commercants can update applications for their shipments" ON public.shipment_applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.shipments s WHERE s.id = shipment_id AND s.commercant_id = auth.uid())
);

-- Ratings RLS Policies
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can create ratings" ON public.ratings;
CREATE POLICY "Anyone can view ratings" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Users can create ratings" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = rated_by);

-- Create trigger function for auto-creating profile on signup
-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role, company_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'commercant'),
    COALESCE(NEW.raw_user_meta_data ->> 'company_name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    company_name = EXCLUDED.company_name;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Create trigger for auto-profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_vehicles_updated_at ON public.vehicles;
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_shipments_updated_at ON public.shipments;
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON public.shipment_applications;
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.shipment_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate reference number
CREATE OR REPLACE FUNCTION public.generate_reference_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reference_number = 'FDZ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add reference number trigger
DROP TRIGGER IF EXISTS generate_shipment_reference ON public.shipments;
CREATE TRIGGER generate_shipment_reference BEFORE INSERT ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.generate_reference_number();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipments_commercant ON public.shipments(commercant_id);
CREATE INDEX IF NOT EXISTS idx_shipments_camionneur ON public.shipments(camionneur_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment ON public.shipment_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_documents_shipment ON public.documents(shipment_id);
CREATE INDEX IF NOT EXISTS idx_applications_shipment ON public.shipment_applications(shipment_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_owner ON public.vehicles(owner_id);
