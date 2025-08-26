import React, { useState } from 'react'

function App(){
  const [token, setToken] = useState(null)
  const [role, setRole] = useState(null)

  if(!token) return <Login onLogin={(t,r)=>{setToken(t); setRole(r)}} />
  if(role==='admin') return <Admin token={token} />
  return <User token={token} />
}

function Login({onLogin}){
  const [email,setEmail]=useState('admin@mrcu.local')
  const [password,setPassword]=useState('Admin123!')
  async function submit(e){
    e.preventDefault();
    const res = await fetch('http://localhost:4000/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    const data = await res.json();
    if(data.token) onLogin(data.token, data.user.role)
    else alert('Login failed')
  }
  return (
    <form onSubmit={submit} style={{padding:20}}>
      <h2>Login</h2>
      <div><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
      <button type="submit">Login</button>
    </form>
  )
}

function Admin({token}){
  const [activities,setActivities]=useState([])
  React.useEffect(()=>{fetch('http://localhost:4000/api/activities').then(r=>r.json()).then(d=>setActivities(d))},[])
  return (
    <div style={{padding:20}}>
      <h2>Admin Dashboard</h2>
      <ul>{activities.map(a=><li key={a.id}>{a.title} ({a.type})</li>)}</ul>
    </div>
  )
}

function User(){
  return <div style={{padding:20}}><h2>User Dashboard</h2><p>Assigned activities show here.</p></div>
}

export default App
