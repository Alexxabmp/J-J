import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fjjfaazbehgacegoyqgl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqamZhYXpiZWhnYWNlZ295cWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjcwNzAsImV4cCI6MjA5MzE0MzA3MH0.4_Hvxk4f0SRaZjXtvx29VArNv3ws6ecVYSUu6yirNgY'

export const supabase = createClient(supabaseUrl, supabaseKey)
