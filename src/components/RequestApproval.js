import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService'

// Very basic admin approval UI for requests
function RequestApproval() {
  var [requests, setRequests] = useState([])
  var [equipmentList, setEquipmentList] = useState([])
  var [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [allRequests, equipment] = await Promise.all([
        apiService.getRequests(),
        apiService.getEquipment()
      ])
      setRequests(allRequests)
      setEquipmentList(equipment)
    } catch (error) {
      console.error('Failed to load data:', error)
      alert('Failed to load data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }


  async function updateRequestStatus(id, status) {
    try {
      await apiService.updateRequestStatus(id, status)
      
      // Reload requests
      const allRequests = await apiService.getRequests()
      setRequests(allRequests)
      
      alert(`Request ${status} successfully!`)
    } catch (error) {
      alert('Failed to update request status: ' + error.message)
    }
  }

  async function markReturned(id) {
    await updateRequestStatus(id, 'returned')
  }

  return (
    <div style={{border: '1px solid #aaa', margin: '20px 0', padding: 10, background: '#f9f9f9'}}>
      <h3 style={{color: 'navy', fontSize: '18px'}}>Approve/Reject Requests</h3>
      
      {loading ? (
        <div style={{textAlign: 'center', padding: '20px'}}>Loading requests...</div>
      ) : (
        <table border="1" style={{width: '100%', background: '#fff', fontSize: '15px'}}>
        <thead>
          <tr style={{background: '#e0e0e0'}}>
            <th>Student</th>
            <th>Item</th>
            <th>Borrow</th>
            <th>Return</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => {
            const eq = equipmentList.find(e => e.id === r.itemId)
            return (
              <tr key={r.id}>
                <td>{r.user}</td>
                <td>{eq ? eq.name : 'Unknown'}</td>
                <td>{r.borrowDate}</td>
                <td>{r.returnDate}</td>
                <td>{r.status}</td>
                <td>
                  {r.status === 'pending' && <>
                    <button onClick={() => updateRequestStatus(r.id, 'approved')} style={{background: '#eee', border: '1px solid #888', padding: '2px 8px', cursor: 'pointer', marginRight: 5}}>Approve</button>
                    <button onClick={() => updateRequestStatus(r.id, 'rejected')} style={{background: '#eee', border: '1px solid #888', padding: '2px 8px', cursor: 'pointer'}}>Reject</button>
                  </>}
                  {r.status === 'approved' && <button onClick={() => markReturned(r.id)} style={{background: '#eee', border: '1px solid #888', padding: '2px 8px', cursor: 'pointer'}}>Mark Returned</button>}
                  {r.status === 'returned' && <span>Returned</span>}
                  {r.status === 'rejected' && <span>Rejected</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      )}
    </div>
  )
}

export default RequestApproval
