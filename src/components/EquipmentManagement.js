import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService'

// Equipment management with add/edit/delete functionality and display
function EquipmentManagement({ showActions = true }) {
  var [equipmentList, setEquipmentList] = useState([])
  var [showAddForm, setshowAddForm] = useState(false)
  var [editingItem, setEditingItem] = useState(null)
  var [loading, setLoading] = useState(true)
  var [submitting, setSubmitting] = useState(false)
  var [category, setCategory] = useState('all')
  var [onlyAvailable, setOnlyAvailable] = useState(false)
  
  // Form state management
  var [itemName, setItemName] = useState("")
  var [itemCategory, setItemCategory] = useState("sports")
  var [itemCondition, setItemCondition] = useState("good")
  var [itemQuantity, setItemQuantity] = useState("")

  // Load equipment from API
  async function loadEquipmentFromAPI() {
    try {
      setLoading(true)
      const equipment = await apiService.getEquipment()
      setEquipmentList(equipment)
    } catch (error) {
      console.error('Failed to load equipment:', error)
      alert('Error loading equipment: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEquipmentFromAPI()
  }, [])

  // Add equipment via API
  async function handleAddEquipment(e) {
    e.preventDefault()
    
    if(!itemName || !itemQuantity) {
      alert("Please fill all fields!")
      return
    }

    setSubmitting(true)

    try {
      const newItem = {
        name: itemName,
        category: itemCategory, 
        condition: itemCondition,
        quantity: parseInt(itemQuantity),
        available: parseInt(itemQuantity) // Initially all items are available
      }

      await apiService.addEquipment(newItem)
      
      // Reload equipment list
      await loadEquipmentFromAPI()

      // Reset form
      setItemName("")
      setItemCategory("sports")
      setItemCondition("good")
      setItemQuantity("")
      setshowAddForm(false)
      
      alert("Equipment added successfully!")
    } catch (error) {
      alert("Failed to add equipment: " + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEditEquipment(e) {
    e.preventDefault()
    
    if(!itemName || !itemQuantity) {
      alert("Please fill all fields!")
      return
    }

    setSubmitting(true)

    try {
      const updatedItem = {
        name: itemName,
        category: itemCategory,
        condition: itemCondition,
        quantity: parseInt(itemQuantity),
        available: parseInt(itemQuantity) // Reset available to full quantity on edit
      }

      await apiService.updateEquipment(editingItem.id, updatedItem)
      
      // Reload equipment list
      await loadEquipmentFromAPI()
      
      setEditingItem(null)
      
      // Reset form
      setItemName("")
      setItemCategory("sports")
      setItemCondition("good")
      setItemQuantity("")
      
      alert("Equipment updated successfully!")
    } catch (error) {
      alert("Failed to update equipment: " + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Delete equipment via API
  async function deleteEquipment(id) {
    if(window.confirm("ARE YOU SURE YOU WANT TO DELETE???")) {
      try {
        await apiService.deleteEquipment(id)
        
        // Reload equipment list
        await loadEquipmentFromAPI()
        
        alert("Equipment deleted successfully!")
      } catch (error) {
        alert("Failed to delete equipment: " + error.message)
      }
    }
  }

  function startEditing(item) {
    setEditingItem(item)
    setItemName(item.name)
    setItemCategory(item.category)
    setItemCondition(item.condition)
    setItemQuantity(item.quantity)
  }

  // Filter equipment based on category and availability
  var filtered = equipmentList.filter(item => {
    if (category !== 'all' && item.category !== category) return false
    if (onlyAvailable && (!item.available || Number(item.available) < 1)) return false
    return true
  })

  // BEGINNER UI: minimal but with a little basic styling
  return (
    <div style={{border: '1px solid #aaa', margin: '20px 0', padding: 10, background: '#f9f9f9'}}>
      <h3 style={{color: 'navy', fontSize: '18px'}}>Equipment Management</h3>

      {showActions && !showAddForm && !editingItem && (
        <button 
          onClick={() => setshowAddForm(true)}
          style={{background: '#eee', border: '1px solid #888', padding: '4px 12px', cursor: 'pointer', marginBottom: 10}}
        >
          + Add New Equipment
        </button>
      )}

      {showAddForm && (
        <div style={{border: '1px solid #bbb', padding: 10, marginBottom: 10, background: '#fff'}}>
          <h3 style={{color: 'navy', fontSize: '18px'}}>Add New Equipment</h3>
          <form onSubmit={handleAddEquipment}>
            <div style={{marginBottom: 8}}>
              <label style={{fontWeight: 'bold'}}>Name: </label>
              <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} style={{marginLeft: 5}} />
            </div>
            <div style={{marginBottom: 8}}>
              <label style={{fontWeight: 'bold'}}>Category: </label>
              <select value={itemCategory} onChange={e => setItemCategory(e.target.value)} style={{marginLeft: 5}}>
                <option value="sports">Sports</option>
                <option value="lab">Lab</option>
                <option value="music">Music</option>
                <option value="art">Art</option>
              </select>
            </div>
            <div style={{marginBottom: 8}}>
              <label style={{fontWeight: 'bold'}}>Condition: </label>
              <select value={itemCondition} onChange={e => setItemCondition(e.target.value)} style={{marginLeft: 5}}>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div style={{marginBottom: 8}}>
              <label style={{fontWeight: 'bold'}}>Quantity: </label>
              <input type="number" value={itemQuantity} onChange={e => setItemQuantity(e.target.value)} style={{marginLeft: 5}} min="1" />
            </div>
            <button type="submit" disabled={submitting} style={{background: submitting ? '#ccc' : '#eee', border: '1px solid #888', padding: '4px 12px', cursor: submitting ? 'not-allowed' : 'pointer'}}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => setshowAddForm(false)} disabled={submitting} style={{marginLeft: 10, background: '#eee', border: '1px solid #888', padding: '4px 12px', cursor: submitting ? 'not-allowed' : 'pointer'}}>Cancel</button>
          </form>
        </div>
      )}

      {editingItem && (
        <div style={{border: '1px solid #bbb', padding: 10, marginBottom: 10, background: '#fff'}}>
          <h3 style={{color: 'green', fontSize: '18px'}}>Edit Equipment</h3>
          <form onSubmit={handleEditEquipment}>
            <div style={{marginBottom: 8}}>
              <label style={{fontWeight: 'bold'}}>Name: </label>
              <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} style={{marginLeft: 5}} />
            </div>
            <div style={{marginBottom: 8}}>
              <label style={{fontWeight: 'bold'}}>Category: </label>
              <select value={itemCategory} onChange={e => setItemCategory(e.target.value)} style={{marginLeft: 5}}>
                <option value="sports">Sports</option>
                <option value="lab">Lab</option>
                <option value="music">Music</option>
                <option value="art">Art</option>
              </select>
            </div>
            <div style={{marginBottom: 8}}>
              <label style={{fontWeight: 'bold'}}>Condition: </label>
              <select value={itemCondition} onChange={e => setItemCondition(e.target.value)} style={{marginLeft: 5}}>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div style={{marginBottom: 8}}>
              <label style={{fontWeight: 'bold'}}>Quantity: </label>
              <input type="number" value={itemQuantity} onChange={e => setItemQuantity(e.target.value)} style={{marginLeft: 5}} min="1" />
            </div>
            <button type="submit" disabled={submitting} style={{background: submitting ? '#ccc' : '#eee', border: '1px solid #888', padding: '4px 12px', cursor: submitting ? 'not-allowed' : 'pointer'}}>
              {submitting ? 'Updating...' : 'Update'}
            </button>
            <button type="button" onClick={() => {
              setEditingItem(null)
              setItemName("")
              setItemCategory("sports")
              setItemCondition("good")
              setItemQuantity("")
            }} disabled={submitting} style={{marginLeft: 10, background: '#eee', border: '1px solid #888', padding: '4px 12px', cursor: submitting ? 'not-allowed' : 'pointer'}}>Cancel</button>
          </form>
        </div>
      )}

      {/* Equipment filtering and display */}
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
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={showActions ? "6" : "5"} style={{textAlign: 'center', padding: '20px'}}>
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
                  {showActions && (
                    <td>
                      <button onClick={() => startEditing(item)} style={{background: '#eee', border: '1px solid #888', padding: '2px 8px', cursor: 'pointer', marginRight: 5}}>Edit</button>
                      <button onClick={() => deleteEquipment(item.id)} style={{background: '#eee', border: '1px solid #888', padding: '2px 8px', cursor: 'pointer'}}>Delete</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default EquipmentManagement