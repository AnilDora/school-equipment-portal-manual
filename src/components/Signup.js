import React from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../services/apiService'

// Beginner mistake: mixing naming conventions
function Signup() {
  // Beginner mistake: using inconsistent case for hook names
  const navigate = useNavigate()
  // Beginner mistake: using var and inconsistent naming
  var [userEmail, setUserEmail] = React.useState("")
  var [userPass, setUserPass] = React.useState("")
  var [userPassConfirm, setUserPassConfirm] = React.useState("")
  var [userType, setUserType] = React.useState("student")
  var [loading, setLoading] = React.useState(false)

  // Beginner mistake: verbose function name
  async function handleSignupFormSubmit(e) {
    e.preventDefault()
    
    // Beginner mistake: multiple alerts and redundant checks
    if(userEmail == "") {
      alert("Please enter email!")
      return
    }
    if(userPass == "") {
      alert("Please enter password!")
      return
    }
    if(userPassConfirm == "") {
      alert("Please confirm your password!")
      return
    }
    if(userPass != userPassConfirm) {
      alert("PASSWORDS DO NOT MATCH!!!")
      return
    }

    setLoading(true)

    try {
      // Call API for registration
      var newUserData = {
        Email: userEmail,
        Password: userPass,
        Type: userType
      }
      
      await apiService.register(newUserData)
      alert("SIGNUP SUCCESS!! Click OK to go to login page")
      navigate('/')
    } catch (error) {
      alert("SIGNUP FAILED: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Updated to match Login page styling
  return (
    <div style={{border: '1px solid #aaa', maxWidth: 350, margin: '60px auto', padding: 20, background: '#f7f7f7', borderRadius: 8, boxShadow: '0 2px 8px #ddd'}}>
      <h2 style={{textAlign: 'center', color: 'navy', fontSize: '22px', marginBottom: 20}}>Sign Up</h2>
        
      <form onSubmit={handleSignupFormSubmit}>
        <div style={{marginBottom: 14}}>
          <label style={{fontWeight: 'bold', display: 'inline-block', width: 80}}>User Type:</label>
          <select 
            value={userType} 
            onChange={(e) => setUserType(e.target.value)}
            style={{marginLeft: 5, width: 150, padding: '3px'}}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="lab_assistant">Lab Assistant</option>
            <option value="administrator">Administrator</option>
          </select>
        </div>
        <div style={{marginBottom: 14}}>
          <label style={{fontWeight: 'bold', display: 'inline-block', width: 80}}>Email:</label>
          <input 
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            style={{marginLeft: 5, width: 150, padding: '3px'}}
          />
        </div>
        <div style={{marginBottom: 14}}>
          <label style={{fontWeight: 'bold', display: 'inline-block', width: 80}}>Password:</label>
          <input 
            type="password"
            value={userPass}
            onChange={(e) => setUserPass(e.target.value)}
            style={{marginLeft: 5, width: 150, padding: '3px'}}
          />
        </div>
        <div style={{marginBottom: 18}}>
          <label style={{fontWeight: 'bold', display: 'inline-block', width: 80}}>Confirm:</label>
          <input 
            type="password"
            value={userPassConfirm}
            onChange={(e) => setUserPassConfirm(e.target.value)}
            style={{marginLeft: 5, width: 150, padding: '3px'}}
          />
        </div>
        <div style={{textAlign: 'center'}}>
          <button 
            type="submit"
            disabled={loading}
            style={{background: loading ? '#ccc' : '#eee', border: '1px solid #888', padding: '6px 18px', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 4}}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>
      </form>
      <div style={{marginTop: 16, textAlign: 'center'}}>
        <span>Already have an account? </span>
        <span onClick={() => navigate('/')} style={{color:'blue', cursor:'pointer', textDecoration: 'underline'}}>Login</span>
      </div>
    </div>
  )
}

export default Signup;