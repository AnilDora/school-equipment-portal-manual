import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService'

// Very basic equipment listing and search/filter
function EquipmentList() {
  var [equipmentList, setEquipmentList] = useState([])
  var [category, setCategory] = useState('all')
  var [onlyAvailable, setOnlyAvailable] = useState(false)
  var [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEquipment()
  }, [])

  async function loadEquipment() {
    try {
      setLoading(true)
      const equipment = await apiService.getEquipment()
      setEquipmentList(equipment)
    } catch (error) {
      console.error('Failed to load equipment:', error)
      alert('Failed to load equipment: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  var filtered = equipmentList.filter(item => {
    if (category !== 'all' && item.category !== category) return false
    if (onlyAvailable && (!item.available || Number(item.available) < 1)) return false
    return true
  })

  return (
    <div style={{border: '1px solid #aaa', margin: '20px 0', padding: 10, background: '#f9f9f9'}}>
      <h3 style={{color: 'navy', fontSize: '18px'}}>Equipment List</h3>
      <div style={{marginBottom: 10}}>
        <label>Category: </label>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{marginRight: 10}}>
          <option value="all">All</option>
          <option value="sports">Sports</option>
          <option value="lab">Lab</option>
          <option value="music">Music</option>
          <option value="art">Art</option>
        </select>
        <label>
          <input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} /> Only show available
        </label>
      </div>
      
      {loading ? (
        <div style={{textAlign: 'center', padding: '20px'}}>Loading equipment...</div>
      ) : (
        <table border="1" style={{width: '100%', background: '#fff', fontSize: '15px'}}>
          <thead>
            <tr style={{background: '#e0e0e0'}}>
              <th>Name</th>
              <th>Category</th>
              <th>Condition</th>
              <th>Total</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>
                  {equipmentList.length === 0 ? 'No equipment found' : 'No equipment matches your filters'}
                </td>
              </tr>
            ) : (
              filtered.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.condition}</td>
                  <td>{item.quantity}</td>
                  <td>{item.available}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default EquipmentList
