'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const supabase = createClient()
  return (
    <div style={{minHeight:'100vh',background:'#111',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#1a1a1a',padding:'2rem',borderRadius:'1rem',width:'100%',maxWidth:'400px'}}>
        <h1 style={{color:'white',textAlign:'center',marginBottom:'1.5rem'}}>自衛隊式AIコーチ</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{theme:ThemeSupa}}
          theme="dark"
          providers={[]}
          redirectTo="https://jieitai-fitness.vercel.app/auth/callback"/>
          </div>
    </div>
  )
}