import React from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../services/apiService'

function Login({ setUser }) {
  const navigate = useNavigate()
  
  var [email, setEmail] = React.useState("")
  var [pass, setPass] = React.useState("")
  var [loading, setLoading] = React.useState(false)

  
  async function submitForm(e) {
    e.preventDefault()
    
    if(email == "") {
      alert('email is empty!')
      return
    }
    if(pass == "") {
      alert('password is empty!')
      return
    }

    setLoading(true)

    try {
      const loginData = {
        Email: email,
        Password: pass
      }
      
      const userData = await apiService.login(loginData)
      
      console.log('Login response - userData:', userData)
      console.log('Login response - userData.Email:', userData.Email)
      console.log('Login response - userData.Type:', userData.Type)
      
      localStorage.setItem('userInfo', JSON.stringify(userData))
      setUser(userData)
      navigate('/dashboard')
    } catch (error) {
      alert('Login failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  
  return (
    <div style={{border: '1px solid #aaa', maxWidth: 350, margin: '60px auto', padding: 20, background: '#f7f7f7', borderRadius: 8, boxShadow: '0 2px 8px #ddd'}}>
      <h2 style={{textAlign: 'center', color: 'navy', fontSize: '22px', marginBottom: 20}}>Login</h2>
      {/* <div style={{marginBottom: 15, padding: 10, background: '#e8f4fd', border: '1px solid #bee5eb', borderRadius: 4, fontSize: '12px'}}>
        <strong>Test Accounts:</strong><br/>
        Admin: admin@school.edu / admin123<br/>
        Staff: teacher@school.edu / teacher123<br/>
        Student: student@school.edu / student123
      </div> */}
      <form onSubmit={submitForm}>
        <div style={{marginBottom: 14}}>
          <label style={{fontWeight: 'bold', display: 'inline-block', width: 80}}>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{marginLeft: 5, width: 150, padding: '3px'}} />
        </div>
        <div style={{marginBottom: 18}}>
          <label style={{fontWeight: 'bold', display: 'inline-block', width: 80}}>Password:</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} style={{marginLeft: 5, width: 150, padding: '3px'}} />
        </div>
        <div style={{textAlign: 'center'}}>
          <button type="submit" disabled={loading} style={{background: loading ? '#ccc' : '#eee', border: '1px solid #888', padding: '6px 18px', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 4}}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      <div style={{marginTop: 16, textAlign: 'center'}}>
        <span>New User? </span>
        <span onClick={() => navigate('/signup')} style={{color:'blue', cursor:'pointer', textDecoration: 'underline'}}>Signup</span>
      </div>
    </div>
  )
}

export default Login;