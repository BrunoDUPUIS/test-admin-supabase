import { supabase } from './supabase'

export const getUser = async () => {
  const { data } = await supabase.auth.getSession()
  return data.session?.user ?? null
}
