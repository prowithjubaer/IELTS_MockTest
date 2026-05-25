-- =============================================
-- STORAGE BUCKET POLICIES
-- Run after creating buckets in Supabase Dashboard
-- =============================================

-- Public buckets: anyone can read
-- listening-audio, writing-assets, speaking-videos, instruction-videos, general-assets

-- Admin can upload to all public buckets
CREATE POLICY "admin_upload_listening_audio" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'listening-audio' 
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','super_admin'))
  );

CREATE POLICY "admin_upload_writing_assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'writing-assets'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','super_admin'))
  );

CREATE POLICY "admin_upload_speaking_videos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'speaking-videos'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','super_admin'))
  );

CREATE POLICY "admin_upload_instruction_videos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'instruction-videos'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','super_admin'))
  );

CREATE POLICY "admin_upload_general_assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'general-assets'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','super_admin'))
  );


-- Speaking recordings: students upload to own folder
CREATE POLICY "student_upload_speaking_recording" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'speaking-recordings'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Students can read own recordings
CREATE POLICY "student_read_own_recordings" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'speaking-recordings'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','super_admin'))
    )
  );

-- Public buckets: anyone can read
CREATE POLICY "public_read_listening_audio" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'listening-audio');

CREATE POLICY "public_read_writing_assets" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'writing-assets');

CREATE POLICY "public_read_speaking_videos" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'speaking-videos');

CREATE POLICY "public_read_instruction_videos" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'instruction-videos');

CREATE POLICY "public_read_general_assets" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'general-assets');

-- Admin can delete from any bucket
CREATE POLICY "admin_delete_any" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','super_admin'))
  );
