-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bus_routes table
CREATE TABLE public.bus_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  bus_type TEXT NOT NULL DEFAULT 'Standard',
  amenities TEXT[] DEFAULT '{}',
  available_seats INTEGER NOT NULL DEFAULT 40,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  route_id UUID REFERENCES public.bus_routes(id) ON DELETE CASCADE NOT NULL,
  travel_date DATE NOT NULL,
  seat_numbers TEXT[] NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  passenger_name TEXT NOT NULL,
  passenger_email TEXT NOT NULL,
  passenger_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Bus routes are public to view
CREATE POLICY "Anyone can view bus routes"
ON public.bus_routes FOR SELECT
TO authenticated
USING (true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
ON public.bookings FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample bus routes
INSERT INTO public.bus_routes (origin, destination, departure_time, arrival_time, duration_minutes, price, bus_type, amenities, available_seats) VALUES
('New York', 'Boston', '08:00', '12:30', 270, 45.00, 'Luxury', ARRAY['WiFi', 'AC', 'Power Outlets', 'Reclining Seats'], 35),
('New York', 'Boston', '14:00', '18:30', 270, 39.00, 'Standard', ARRAY['AC', 'Reclining Seats'], 40),
('New York', 'Washington DC', '07:00', '11:30', 270, 55.00, 'Luxury', ARRAY['WiFi', 'AC', 'Power Outlets', 'Snacks'], 28),
('Boston', 'New York', '09:00', '13:30', 270, 42.00, 'Standard', ARRAY['AC', 'WiFi'], 32),
('Los Angeles', 'San Francisco', '06:00', '12:00', 360, 65.00, 'Luxury', ARRAY['WiFi', 'AC', 'Power Outlets', 'Entertainment'], 25),
('Chicago', 'Detroit', '10:00', '14:30', 270, 38.00, 'Standard', ARRAY['AC', 'Reclining Seats'], 42),
('Miami', 'Orlando', '08:30', '12:00', 210, 32.00, 'Standard', ARRAY['AC', 'WiFi'], 38),
('Seattle', 'Portland', '07:30', '10:30', 180, 28.00, 'Standard', ARRAY['AC', 'WiFi', 'Power Outlets'], 36);