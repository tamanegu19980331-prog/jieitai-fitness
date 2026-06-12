'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase'

export default function RegisterPage() {
  const supabase = createClient()
  return (
    <div style={{minHeight:'100vh',background:'#111',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#1a1a1a',padding:'2rem',borderRadius:'1rem',width:'100%',maxWidth:'400px'}}>
        <h1 style={{color:'white',textAlign:'center',marginBottom:'1.5rem'}}>🎖️ 無料登録</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{theme:ThemeSupa}}
          theme="dark"
          providers={[]}
          view="sign_up"
          localization={{variables:{sign_up:{email_label:'メールアドレス',password_label:'パスワード',button_label:'無料登録',link_text:'すでにアカウントをお持ちの方はこちら'}}}}
        />
      </div>
    </div>
  )
}