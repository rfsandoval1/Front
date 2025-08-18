import React, { useState, useEffect } from 'react';

function GlovesCrud() {
  const [gloves, setGloves] = useState([]);
  const [form, setForm] = useState({
    serialNumber: '',
    brand: '',
    model: '',
    category: '',
    isNewProduct: false,
    price: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar guantes desde la API al montar
  useEffect(() => {
    setLoading(true);
    fetch('https://uriexam.onrender.com/api/products/')
      .then(res => res.json())
      .then(data => {
        setGloves(data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo cargar los guantes');
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Crear o actualizar guante en la API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingId !== null) {
        // Actualizar
        const res = await fetch(`https://uriexam.onrender.com/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (!res.ok) throw new Error('Error al actualizar');
        const updated = await res.json();
        setGloves(gloves.map(g => g._id === editingId ? updated : g));
        setEditingId(null);
      } else {
        // Crear
        const res = await fetch('https://uriexam.onrender.com/api/products/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (!res.ok) throw new Error('Error al crear');
        const created = await res.json();
        setGloves([...gloves, created]);
      }
      setForm({ serialNumber: '', brand: '', model: '', category: '', isNewProduct: false, price: '' });
    } catch (err) {
      setError('Ocurrió un error al guardar');
    }
    setLoading(false);
  };

  // Editar guante
  const handleEdit = (id) => {
    const glove = gloves.find(g => g._id === id);
    setForm({
      serialNumber: glove.serialNumber,
      brand: glove.brand,
      model: glove.model,
      category: glove.category,
      isNewProduct: glove.isNewProduct,
      price: glove.price
    });
    setEditingId(id);
  };

  // Eliminar guante en la API
  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://uriexam.onrender.com/api/products/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Error al eliminar');
      setGloves(gloves.filter(g => g._id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm({ serialNumber: '', brand: '', model: '', category: '', isNewProduct: false, price: '' });
      }
    } catch (err) {
      setError('Ocurrió un error al eliminar');
    }
    setLoading(false);
  };

  return (
    <div className="product-details" style={{ background: '#f9f9f9', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '20px', marginTop: 0 }}>
      <h2 style={{ color: '#4a90e2', textAlign: 'center', marginBottom: '20px' }}>CRUD de Guantes</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 20 }}>
        <input
          name="serialNumber"
          placeholder="Serial Number"
          value={form.serialNumber}
          onChange={handleChange}
          required
          style={{ padding: '12px', borderRadius: '5px', border: '2px solid #ddd', fontSize: '16px' }}
        />
        <input
          name="brand"
          placeholder="Marca"
          value={form.brand}
          onChange={handleChange}
          required
          style={{ padding: '12px', borderRadius: '5px', border: '2px solid #ddd', fontSize: '16px' }}
        />
        <input
          name="model"
          placeholder="Modelo"
          value={form.model}
          onChange={handleChange}
          required
          style={{ padding: '12px', borderRadius: '5px', border: '2px solid #ddd', fontSize: '16px' }}
        />
        <input
          name="category"
          placeholder="Categoría"
          value={form.category}
          onChange={handleChange}
          required
          style={{ padding: '12px', borderRadius: '5px', border: '2px solid #ddd', fontSize: '16px' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '16px' }}>
            <input
              type="checkbox"
              name="isNewProduct"
              checked={form.isNewProduct}
              onChange={handleChange}
              style={{ marginRight: '8px' }}
            />
            Nuevo Producto
          </label>
          <input
            name="price"
            type="number"
            placeholder="Precio"
            value={form.price}
            onChange={handleChange}
            required
            style={{ padding: '12px', borderRadius: '5px', border: '2px solid #ddd', fontSize: '16px', width: '120px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ flex: 1 }} disabled={loading}>{editingId !== null ? 'Actualizar' : 'Agregar'}</button>
          {editingId !== null && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ serialNumber: '', brand: '', model: '', category: '', isNewProduct: false, price: '' }); }} style={{ background: '#d9534f' }} disabled={loading}>Cancelar</button>
          )}
        </div>
      </form>
      {loading ? <p className="loading">Cargando...</p> : null}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {gloves.map(g => (
          <li key={g._id} style={{ marginBottom: 10, background: '#fff', borderRadius: '5px', padding: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <span style={{ fontWeight: 'bold', color: '#4a90e2' }}>{g.serialNumber}</span> | Marca: {g.brand} | Modelo: {g.model} | Categoría: {g.category} | Nuevo: {g.isNewProduct ? 'Sí' : 'No'} | Precio: ${g.price}
            <button onClick={() => handleEdit(g._id)} style={{ marginLeft: 10 }} disabled={loading}>Editar</button>
            <button onClick={() => handleDelete(g._id)} style={{ marginLeft: 5, background: '#d9534f' }} disabled={loading}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GlovesCrud;
