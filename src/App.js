
import React, { useState, useEffect } from 'react';
import GlovesCrud from './GlovesCrud';
import './App.css';

function addVAT(price) {
  return price * 1.16;
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showCrud, setShowCrud] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("https://uriexam.onrender.com/api/products/")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error en la solicitud");
        }
        return res.json();
      })
      .then((json) => {
        setProducts(json);
        setLoading(false);
      })
      .catch((err) => {
        setError("No se pudo cargar los productos");
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.model?.toLowerCase().includes(search.toLowerCase()) ||
      product.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="App" style={{ display: 'flex', gap: '40px' }}>
      <div style={{ flex: 2 }}>
        <h1>Listado de Productos</h1>
        {error && <p className="error-message">{error}</p>}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Buscar por modelo o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setShowCrud(!showCrud)}>
            {showCrud ? 'Cerrar Añadir Producto' : 'Añadir Producto'}
          </button>
        </div>
        {loading ? (
          <p className="loading">Cargando...</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-details">
              <p><strong>Serial Number:</strong> {product.serialNumber}</p>
              <p><strong>Marca:</strong> {product.brand}</p>
              <p><strong>Modelo:</strong> {product.model}</p>
              <p><strong>Categoría:</strong> {product.category}</p>
              <p><strong>Nuevo Producto:</strong> {product.isNewProduct ? "Sí" : "No"}</p>
              <p><strong>Precio con IVA:</strong> ${addVAT(product.price).toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p>No se encontraron productos que coincidan con la búsqueda.</p>
        )}
      </div>
      {showCrud && (
        <div style={{ flex: 1, minWidth: 350 }}>
          <GlovesCrud />
        </div>
      )}
    </div>
  );
}

export default App;
