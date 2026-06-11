import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pintzssfhjksnllrkfzh.supabase.co'
const supabaseKey = 'sb_publishable_PXEzjshMf78o98PtdcitbA_C5Wtmdfl'

export const supabase = createClient(supabaseUrl, supabaseKey)
