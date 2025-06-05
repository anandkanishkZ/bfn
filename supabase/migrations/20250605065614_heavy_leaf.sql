/*
  # Initial Schema Setup for Blood For Nepal

  1. New Tables
    - users (managed by Supabase Auth)
    - profiles (user profile data)
    - donors (donor information)
    - blood_requests (blood request details)
    - donations (donation tracking)
    - notifications (system notifications)

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
    - Set up proper role-based access

  3. Changes
    - Leverage Supabase Auth for user management
    - Add proper timestamps and audit fields
    - Implement robust data validation
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'donor');
CREATE TYPE blood_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE request_urgency AS ENUM ('normal', 'urgent', 'emergency');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'fulfilled', 'cancelled');
CREATE TYPE donation_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE notification_type AS ENUM ('request', 'donation', 'system');

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create donors table
CREATE TABLE donors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  blood_type blood_type NOT NULL,
  location TEXT NOT NULL,
  last_donation_date DATE,
  is_available BOOLEAN DEFAULT true,
  medical_conditions TEXT,
  phone_number TEXT NOT NULL,
  province TEXT NOT NULL,
  district TEXT NOT NULL,
  municipality TEXT NOT NULL,
  ward_number INTEGER,
  street_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blood_requests table
CREATE TABLE blood_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_age INTEGER NOT NULL CHECK (patient_age > 0),
  patient_gender TEXT NOT NULL,
  blood_type blood_type NOT NULL,
  units_required INTEGER NOT NULL CHECK (units_required > 0),
  urgency request_urgency DEFAULT 'normal',
  status request_status DEFAULT 'pending',
  hospital_name TEXT NOT NULL,
  hospital_address TEXT NOT NULL,
  province TEXT NOT NULL,
  district TEXT NOT NULL,
  municipality TEXT NOT NULL,
  ward_number INTEGER,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  relationship TEXT NOT NULL,
  purpose TEXT NOT NULL,
  prescription_url TEXT,
  required_date DATE,
  additional_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create donations table
CREATE TABLE donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID REFERENCES donors ON DELETE CASCADE,
  request_id UUID REFERENCES blood_requests ON DELETE CASCADE,
  donation_date DATE NOT NULL,
  status donation_status DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for donors
CREATE POLICY "Donors are viewable by everyone"
  ON donors FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their donor profile"
  ON donors FOR ALL
  USING (auth.uid() = user_id);

-- Create policies for blood requests
CREATE POLICY "Blood requests are viewable by everyone"
  ON blood_requests FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their blood requests"
  ON blood_requests FOR ALL
  USING (auth.uid() = requester_id);

-- Create policies for donations
CREATE POLICY "Donations are viewable by involved parties"
  ON donations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM donors d
      WHERE d.id = donor_id AND d.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM blood_requests br
      WHERE br.id = request_id AND br.requester_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their donations"
  ON donations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM donors d
      WHERE d.id = donor_id AND d.user_id = auth.uid()
    )
  );

-- Create policies for notifications
CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_donors_updated_at
  BEFORE UPDATE ON donors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blood_requests_updated_at
  BEFORE UPDATE ON blood_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_donors_blood_type ON donors(blood_type);
CREATE INDEX idx_donors_location ON donors(province, district, municipality);
CREATE INDEX idx_blood_requests_blood_type ON blood_requests(blood_type);
CREATE INDEX idx_blood_requests_status ON blood_requests(status);
CREATE INDEX idx_blood_requests_urgency ON blood_requests(urgency);
CREATE INDEX idx_donations_date ON donations(donation_date);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);