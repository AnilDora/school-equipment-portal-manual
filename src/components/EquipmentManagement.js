import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService'

// Beginner mistake: Using inconsistent naming and verbose variable names
function EquipmentManagement() {
  var [equipmentList, setEquipmentList] = useState([])
  var [showAddForm, setshowAddForm] = useState(false)
  var [editingItem, setEditingItem] = useState(null)
  var [loading, setLoading] = useState(true)
  var [submitting, setSubmitting] = useState(false)
  
  // Beginner mistake: Basic form state management
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

  // BEGINNER UI: minimal but with a little basic styling
  return (
    <div style={{border: '1px solid #aaa', maxWidth: 500, margin: '20px auto', padding: 10, background: '#f9f9f9'}}>
      <h2 style={{textAlign: 'center', color: 'navy', fontSize: '22px'}}>Equipment Management</h2>

      {!showAddForm && !editingItem && (
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

      <div style={{marginTop: 10}}>
        <h3 style={{color: 'navy', fontSize: '18px'}}>Available Equipment</h3>
        <table border="1" style={{width: '100%', background: '#fff', fontSize: '15px'}}>
          <thead>
            <tr style={{background: '#e0e0e0'}}>
              <th>Name</th>
              <th>Category</th>
              <th>Condition</th>
              <th>Total Quantity</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipmentList.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.condition}</td>
                <td>{item.quantity}</td>
                <td>{item.available}</td>
                <td>
                  <button onClick={() => startEditing(item)} style={{background: '#eee', border: '1px solid #888', padding: '2px 8px', cursor: 'pointer', marginRight: 5}}>Edit</button>
                  <button onClick={() => deleteEquipment(item.id)} style={{background: '#eee', border: '1px solid #888', padding: '2px 8px', cursor: 'pointer'}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EquipmentManagement