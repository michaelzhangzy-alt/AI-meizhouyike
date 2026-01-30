
-- Create a public storage bucket for share images
INSERT INTO storage.buckets (id, name, public)
VALUES ('share-images', 'share-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view files
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Public Access Share Images'
    ) THEN
        CREATE POLICY "Public Access Share Images"
        ON storage.objects FOR SELECT
        USING ( bucket_id = 'share-images' );
    END IF;
END $$;

-- Allow authenticated users to upload files
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Authenticated users can upload share images'
    ) THEN
        CREATE POLICY "Authenticated users can upload share images"
        ON storage.objects FOR INSERT
        WITH CHECK (
          bucket_id = 'share-images'
          AND auth.role() = 'authenticated'
        );
    END IF;
END $$;

-- Allow authenticated users to update/delete
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Authenticated users can update share images'
    ) THEN
        CREATE POLICY "Authenticated users can update share images"
        ON storage.objects FOR UPDATE
        USING (
          bucket_id = 'share-images'
          AND auth.role() = 'authenticated'
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Authenticated users can delete share images'
    ) THEN
        CREATE POLICY "Authenticated users can delete share images"
        ON storage.objects FOR DELETE
        USING (
          bucket_id = 'share-images'
          AND auth.role() = 'authenticated'
        );
    END IF;
END $$;
