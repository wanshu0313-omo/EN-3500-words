import React,{useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import StudyApp from './study-app';
import {configured,readSession,verifySession,login,signup,logout,type Session} from './cloud';
import './style.css';
function App(){
 const [session,setSession]=useState<Session|null>(null),[loading,setLoading]=useState(true),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[register,setRegister]=useState(false);
 useEffect(()=>{if(!configured){setLoading(false);return}if(!readSession()){setLoading(false);return}verifySession().then(setSession).catch(()=>setMessage('登录已失效或网络不可用，请重新登录。')).finally(()=>setLoading(false));
 const onStorage=()=>{const s=readSession();setSession(prev=>prev?.user.id===s?.user.id?prev:null)};window.addEventListener('storage',onStorage);return()=>window.removeEventListener('storage',onStorage)},[]);
 if(!configured)return <div className="auth-page"><section className="auth-card panel"><div className="eyebrow">词序 · GITHUB EDITION</div><h1>还差一步，开启同步。</h1><p>请按上传说明配置 Supabase，然后把 Project URL 和 publishable key 填入网站根目录的 config.js。</p><p>首次使用需运行 supabase/setup.sql，再创建自己的邮箱账号。配置完成后刷新此页。</p><p>这里不需要 ChatGPT 登录。手机和电脑用同一邮箱账号登录。</p></section></div>;
 if(loading)return <div className="auth-page"><p>正在连接学习账户…</p></div>;
 if(session)return <StudyApp key={session.user.id} userId={session.user.id} email={session.user.email||''} onLogout={async()=>{await logout();setSession(null);setPassword('')}}/>;
 return <div className="auth-page"><section className="auth-card panel"><div className="auth-mark">词序</div><div className="eyebrow">IELTS 3500 · ONE WORD AT A TIME</div><h1>{register?'创建学习账户':'欢迎回到你的学习空间'}</h1><p>手机和电脑使用同一账号，接着上次的进度学。</p><form onSubmit={async e=>{e.preventDefault();setBusy(true);setMessage('');try{const s=register?await signup(email.trim(),password):await login(email.trim(),password);setPassword('');if(s)setSession(s);else{setMessage('注册请求已提交。如已开启邮箱确认，请先点击邮件中的确认链接，然后返回登录。');setRegister(false)}}catch(err){setMessage(err instanceof Error?err.message:'连接失败，请重试')}finally{setBusy(false)}}}><label>邮箱<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>密码<input type="password" required minLength={8} autoComplete={register?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="primary" disabled={busy}>{busy?'正在连接…':register?'注册':'登录'}</button></form>{message&&<p className="auth-message" role="status">{message}</p>}<button className="text-button" onClick={()=>{setRegister(!register);setMessage('')}}>{register?'已有账号，返回登录':'首次使用？创建账号'}</button><p className="auth-small">这是独立学习账号，与 ChatGPT 账号无关。请保管好此学习账号的密码。</p></section></div>
}
createRoot(document.getElementById('root')!).render(<App/>);
