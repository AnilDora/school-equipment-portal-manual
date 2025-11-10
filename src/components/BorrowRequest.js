import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService'


function BorrowRequest({ user }) {
  console.log('BorrowRequest - user prop:', user)
  console.log('BorrowRequest - user?.Email:', user?.Email)
  console.log('BorrowRequest - user?.Type:', user?.Type)
  
  var [equipmentList, setEquipmentList] = useState([])
  var [selectedItem, setSelectedItem] = useState("")
  var [borrowDate, setBorrowDate] = useState("")
  var [returnDate, setReturnDate] = useState("")
  var [requests, setRequests] = useState([])
  var [loading, setLoading] = useState(true)
  var [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user && (user.Email || user.email)) {
      loadData()
    }
  }, [user])

  async function loadData() {
    const userEmail = user?.Email || user?.email
    if (!userEmail) {
      console.error('User email not available')
      return
    }

    try {
      setLoading(true)
      
      const equipment = await apiService.getEquipment()
      setEquipmentList(equipment)
      
      try {
        const userRequests = await apiService.getUserRequests(userEmail)
        setRequests(userRequests || [])
      } catch (requestError) {
        console.error('Failed to load user requests:', requestError)
        setRequests([])
      }
    } catch (error) {
      console.error('Failed to load equipment data:', error)
      setEquipmentList([])
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  async function handleRequest(e) {
    e.preventDefault()
    
    const userEmail = user?.Email || user?.email
    const userType = user?.Type || user?.type
    
    if (!userEmail) {
      alert('User information not available. Please try logging in again.')
      return
    }
    
    if (!selectedItem || !borrowDate || !returnDate) {
      alert('Please fill all fields!')
      return
    }

    console.log('User object:', user)
    console.log('User Email:', userEmail)
    console.log('User Type:', userType)

    setSubmitting(true)

    try {
      const newReq = {
        ItemId: selectedItem,
        User: userEmail,
        UserType: userType,
        BorrowDate: borrowDate,
        ReturnDate: returnDate,
        Status: 'pending'
      }

      console.log('Request payload:', newReq)

      await apiService.addRequest(newReq)
      
      const userRequests = await apiService.getUserRequests(userEmail)
      setRequests(userRequests)
      
      setSelectedItem("")
      setBorrowDate("")
      setReturnDate("")
      alert('Request submitted!')
    } catch (error) {
      alert('Failed to submit request: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{border: '1px solid #aaa', maxWidth: 400, margin: '20px auto', padding: 10, background: '#f9f9f9'}}>
      <h2 style={{textAlign: 'center', color: 'navy', fontSize: '22px'}}>Borrow Equipment</h2>
      {/* <div style={{fontSize: '12px', color: '#666', margin: '5px 0', padding: '5px', background: '#f0f0f0'}}> */}
        {/* <strong>Debug:</strong> User: {user?.Email || user?.email || 'NO EMAIL'} | Type: {user?.Type || user?.type || 'NO TYPE'} | Equipment: {equipmentList?.length || 0} items | Requests: {requests?.length || 0} */}
        {/* <br/> */}
        {/* <strong>User Object:</strong> {JSON.stringify(user)} */}
      {/* </div> */}
      
      {loading ? (
        <div style={{textAlign: 'center', padding: '20px'}}>Loading...</div>
      ) : (
        <>
          <form onSubmit={handleRequest}>
            <div style={{marginBottom: 8}}>
              <label style={{fontWeight: 'bold'}}>Item: </label>
              <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)} style={{marginLeft: 5}}>
                <option value="">Select</option>
                {equipmentList && equipmentList.length > 0 ? (
                  equipmentList.map(eq => (
                    <option value={eq.id} key={eq.id}>{eq.name}</option>
                  ))
                ) : (
                  <option value="" disabled>No equipment available</option>
                )}
              </select>
            </div>
            <div style={{marginBottom: 8}}>
              <label style={{fontWeight: 'bold'}}>Borrow Date: </label>
              <input type="date" value={borrowDate} onChange={e => setBorrowDate(e.target.value)} style={{marginLeft: 5}} />
            </div>
            <div style={{marginBottom: 8}}>
              <label style={{fontWeight: 'bold'}}>Return Date: </label>
              <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} style={{marginLeft: 5}} />
            </div>
            <button type="submit" disabled={submitting} style={{background: submitting ? '#ccc' : '#eee', border: '1px solid #888', padding: '4px 12px', cursor: submitting ? 'not-allowed' : 'pointer'}}>
              {submitting ? 'Submitting...' : 'Request'}
            </button>
          </form>
          <h3 style={{marginTop: 20, fontSize: '18px'}}>My Requests</h3>
          <table border="1" style={{width: '100%', background: '#fff', fontSize: '15px'}}>
            <thead>
              <tr style={{background: '#e0e0e0'}}>
                <th>Item</th>
                <th>Borrow</th>
                <th>Return</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests && requests.length > 0 ? (
                requests.filter(r => r.user === user?.Email || r.User === user?.Email).map(r => {
                  const eq = equipmentList.find(e => String(e.id) === String(r.itemId) || String(e.id) === String(r.ItemId))
                  let statusText = r.status || r.Status
                  if (r.status === 'returned') statusText = 'Returned'
                  if (r.status === 'rejected') statusText = 'Rejected'
                  if (r.status === 'approved') statusText = 'Approved (Collect/Use)'
                  if (r.status === 'pending') statusText = 'Pending Approval'
                  return (
                    <tr key={r.id}>
                      <td>{eq ? eq.name : 'Unknown'}</td>
                      <td>{r.borrowDate}</td>
                      <td>{r.returnDate}</td>
                      <td>{statusText}</td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '10px', color: '#666'}}>
                    No requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export default BorrowRequest
