import { useEffect, useState } from "react";
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchProducts = () => {
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
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.model.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase())
  );

  const addVAT = (price) => {
    return price * 1.15;
  };

  return (
    <div className="App">
      <h1>Listado de Productos</h1>

      {error && <p className="error-message">{error}</p>}

      <div>
        <input
          type="text"
          placeholder="Buscar por modelo o marca..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
  );
}

export default App;
