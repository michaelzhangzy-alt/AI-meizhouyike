
-- 1. Create profiles table to store user points and referral codes
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  points INTEGER DEFAULT 0,
  membership_tier TEXT DEFAULT 'free' CHECK (membership_tier IN ('free', 'vip', 'pro')),
  avatar_url TEXT,
  nickname TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Create referrals table to track invitations
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES profiles(id),
  referred_id UUID REFERENCES profiles(id), -- Can be null if not yet registered
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
  reward_points INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- 3. Function to handle new user signup and create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, referral_code, nickname, avatar_url)
  VALUES (
    new.id,
    -- Generate a random 6-character referral code
    upper(substring(md5(random()::text) from 1 for 6)),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
