import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService'


function BorrowRequest({ user }) {
  var [equipmentList, setEquipmentList] = useState([])
  var [selectedItem, setSelectedItem] = useState("")
  var [borrowDate, setBorrowDate] = useState("")
  var [returnDate, setReturnDate] = useState("")
  var [requests, setRequests] = useState([])
  var [loading, setLoading] = useState(true)
  var [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      
      // Load equipment first (this is essential)
      const equipment = await apiService.getEquipment()
      setEquipmentList(equipment)
      
      // Try to load user requests, but don't fail if it doesn't work
      try {
        const userRequests = await apiService.getUserRequests(user.Email)
        setRequests(userRequests || [])
      } catch (requestError) {
        console.error('Failed to load user requests:', requestError)
        // Set empty array if user requests fail, but still allow equipment requests
        setRequests([])
      }
    } catch (error) {
      console.error('Failed to load equipment data:', error)
      // Still try to render the component with empty data
      setEquipmentList([])
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  async function handleRequest(e) {
    e.preventDefault()
    if (!selectedItem || !borrowDate || !returnDate) {
      alert('Please fill all fields!')
      return
    }

    setSubmitting(true)

    try {
      const newReq = {
        itemId: parseInt(selectedItem),
        user: user.Email,
        userType: user.Type,
        borrowDate,
        returnDate,
        status: 'pending'
      }

      await apiService.addRequest(newReq)
      
      // Reload user requests
      const userRequests = await apiService.getUserRequests(user.Email)
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

  // BEGINNER UI: minimal but with a little basic styling
  return (
    <div style={{border: '1px solid #aaa', maxWidth: 400, margin: '20px auto', padding: 10, background: '#f9f9f9'}}>
      <h2 style={{textAlign: 'center', color: 'navy', fontSize: '22px'}}>Borrow Equipment</h2>
      <div style={{fontSize: '12px', color: '#666', margin: '5px 0', padding: '5px', background: '#f0f0f0'}}>
        <strong>Debug:</strong> User: {user?.Email} | Type: {user?.Type} | Equipment: {equipmentList?.length || 0} items | Requests: {requests?.length || 0}
      </div>
      
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
                requests.filter(r => r.user === user.Email).map(r => {
                  const eq = equipmentList.find(e => String(e.id) === String(r.itemId))
                  let statusText = r.status
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
