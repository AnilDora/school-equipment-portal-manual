import React from 'react'
import EquipmentManagement from './EquipmentManagement'
import BorrowRequest from './BorrowRequest'
import RequestApproval from './RequestApproval'

function Dashboard({ user, onLogout }) {
  var [showEquipment, setShowEquipment] = React.useState(false)
  var [currentTime, setCurrentTime] = React.useState("")
  
  setTimeout(() => {
    setCurrentTime(new Date().toLocaleTimeString())
  }, 1000)

  function logoutClick() {
    if(window.confirm("Do you really want to logout???")) {
      onLogout()
    }
  }

  return (
    <div style={{border: '1px solid #aaa', maxWidth: 800, margin: '30px auto', padding: 18, background: '#f7f7f7', borderRadius: 8, boxShadow: '0 2px 8px #ddd'}}>
      <div style={{background: '#e3eaff', padding: '10px 0', marginBottom: 18, borderRadius: 4}}>
        <h2 style={{textAlign: 'center', color: 'navy', fontSize: '22px', margin: 0}}>School Equipment Management System</h2>
        <div style={{textAlign: 'center', fontSize: '15px', marginTop: 4}}>
          <span>Logged in as: <b>{user?.Email}</b> ({user?.Type || user?.type})</span>
          <span style={{marginLeft: 20}}>Time: {currentTime}</span>
          <div style={{fontSize: '12px', color: '#666', marginTop: 5}}>
            Debug: User object = {JSON.stringify(user)}
          </div>
        </div>
      </div>
      <div style={{display: 'flex', gap: 18}}>
        <div style={{minWidth: 180, textAlign: 'center'}}>
          <button onClick={logoutClick} style={{background: '#eee', border: '1px solid #888', padding: '6px 18px', cursor: 'pointer', borderRadius: 4, marginTop: 8}}>Logout</button>
        </div>
        <div style={{flex: 1}}>
          <EquipmentManagement showActions={false} />
          <div style={{padding: '10px', background: '#fff3cd', border: '1px solid #ffeaa7', margin: '10px 0', fontSize: '12px'}}>
            <strong>Debug Info:</strong><br/>
            User Type (uppercase): "{user?.Type}"<br/>
            User Type (lowercase): "{user?.type}"<br/>
            Final User Type: "{user?.Type || user?.type}"<br/>
            Is Administrator: {(user?.Type === "administrator" || user?.type === "administrator") ? "YES" : "NO"}<br/>
            Is Lab Assistant: {(user?.Type === "lab_assistant" || user?.type === "lab_assistant") ? "YES" : "NO"}<br/>
            Is Teacher: {(user?.Type === "teacher" || user?.type === "teacher") ? "YES" : "NO"}<br/>
            Is Student: {(user?.Type === "student" || user?.type === "student") ? "YES" : "NO"}
          </div>
          
          {(user?.Type === "administrator" || user?.type === "administrator") && (
            <div>
              <h3 style={{color: 'navy', fontSize: '18px', borderBottom: '1px solid #bbb', paddingBottom: 4}}>Administrator Dashboard</h3>
              <div style={{display: 'flex', gap: 10, marginTop: 10}}>
                <div style={{border: '1px solid #bbb', padding: 10, width: 180, background: '#f9f9ff', borderRadius: 4}}>
                  <h4 style={{margin: 0}}>Monitor Usage</h4>
                  <p style={{margin: '8px 0'}}>Track equipment usage and availability</p>
                  <button style={{background: '#eee', border: '1px solid #888', padding: '4px 12px', cursor: 'pointer'}}>View Reports</button>
                </div>
                <div style={{border: '1px solid #bbb', padding: 10, width: 180, background: '#f9f9ff', borderRadius: 4}}>
                  <h4 style={{margin: 0}}>Manage Equipment</h4>
                  <p style={{margin: '8px 0'}}>Add, edit, or remove equipment</p>
                  <button onClick={() => setShowEquipment(!showEquipment)} style={{background: '#eee', border: '1px solid #888', padding: '4px 12px', cursor: 'pointer'}}>
                    {showEquipment ? "Hide Equipment" : "Manage Equipment"}
                  </button>
                </div>
              </div>
              <RequestApproval />
              {showEquipment && (
                <div style={{marginTop: 18}}>
                  <EquipmentManagement />
                </div>
              )}
            </div>
          )}

          {(user?.Type === "lab_assistant" || user?.type === "lab_assistant") && (
            <div>
              <h3 style={{color: 'green', fontSize: '18px', borderBottom: '1px solid #bbb', paddingBottom: 4}}>Lab Assistant Dashboard</h3>
              <div style={{display: 'flex', gap: 10, marginTop: 10}}>
                <div style={{border: '1px solid #bbb', padding: 10, width: 180, background: '#f9fff9', borderRadius: 4}}>
                  <h4 style={{margin: 0}}>Approve Requests</h4>
                  <p style={{margin: '8px 0'}}>Review and approve equipment requests</p>
                </div>
                <div style={{border: '1px solid #bbb', padding: 10, width: 180, background: '#f9fff9', borderRadius: 4}}>
                  <h4 style={{margin: 0}}>Issue & Track</h4>
                  <p style={{margin: '8px 0'}}>Issue equipment and track returns</p>
                </div>
              </div>
              <RequestApproval />
            </div>
          )}

          {(user?.Type === "teacher" || user?.type === "teacher") && (
            <div>
              <h3 style={{color: 'purple', fontSize: '18px', borderBottom: '1px solid #bbb', paddingBottom: 4}}>Teacher Dashboard</h3>
              <BorrowRequest user={user} />
            </div>
          )}

          {(user?.Type === "student" || user?.type === "student") && (
            <div>
              <h3 style={{color: 'blue', fontSize: '18px', borderBottom: '1px solid #bbb', paddingBottom: 4}}>Student Dashboard</h3>
              <BorrowRequest user={user} />
            </div>
          )}
        </div>
      </div>
      <div style={{marginTop: 18, textAlign: 'center', fontSize: '13px', color: '#888'}}>
        © 2025 School Equipment Management System - Created by Group 10
      </div>
    </div>
  )
}

export default Dashboard;