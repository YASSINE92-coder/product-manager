import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import './style.css';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", color: "" });
  const [updateProduct, setUpdateProduct] = useState({ id: "", name: "", price: "", color: "" });
  const [deleteId, setDeleteId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [theme, setTheme] = useState("light");

  // Effet pour appliquer le thème
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const fetchProducts = () => {
    fetch("http://localhost:3001/products", {
      headers: { Authorization: "ACC1001" }
    })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Fetch error:", err));
  };

  const fetchProductsByName = (e) => {
    e.preventDefault();//  prevent page reload
    fetch(`http://localhost:3001/products/search?name=${searchName}`, {
      headers: { Authorization: "ACC1001" }
    })
      .then(res => {
        if (!res.ok) throw new Error("No products found");
        return res.json();
      })
      .then(data => setProducts(Array.isArray(data) ? data : [data]))
      .catch(err => console.error("Fetch error:", err));
  };

  const fetchProductsByPrice = (e) => {
    e.preventDefault(); // prevent page reload
    fetch(`http://localhost:3001/products/${min}/${max}`, {
      headers: { Authorization: "ACC1001" }
    })
      .then(res => {
        if (!res.ok) throw new Error("No products found");
        return res.json();
      })
      .then(data => setProducts(Array.isArray(data) ? data : [data]))
      .catch(err => console.error("Fetch error:", err));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/products", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "ACC1001" },
      body: JSON.stringify(newProduct),
    })
      .then(res => res.json())
      .then(() => {
        fetchProducts();
        setNewProduct({ name: "", price: "", color: "" });
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/products/${updateProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "ACC1001" },
      body: JSON.stringify(updateProduct),
    })
      .then(res => res.json())
      .then(() => {
        fetchProducts();
        setUpdateProduct({ id: "", name: "", price: "", color: "" });
      });
  };

  // Delete product
  const handleDelete = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/products/${deleteId}`, {
      method: "DELETE",
      headers: { Authorization: "ACC1001" },
    })
      .then(res => res.json())
      .then(() => {
        fetchProducts();
        setDeleteId("");
      });
  };
    useEffect(() => {
    fetchProducts();
  }, []); // empty dependency array = run only once when mounted

  return (
    
  <div className="main-container">
  {/* Bouton de basculement de thème */}
  <button className="theme-toggle btn btn-outline-secondary" onClick={toggleTheme}>
    {theme === "light" ? <i className="bi bi-moon"></i> : <i className="bi bi-sun"></i>}
  </button>

  {/* Header */}
  <div className="app-header">
    <div className="container">
      <h1 className="app-title">
        <i className="bi bi-box-seam me-2"></i> Gestionnaire de Produits
      </h1>
    </div>
  </div>

  <div className="container">
    {/* 🔍 Recherche par nom & prix */}
    <div className="row mb-4">
      {/* Recherche par nom */}
      <div className="col-md-6 mb-3">
        <div className="card fade-in">
          <div className="card-header">
            <h3 className="card-title">
              <i className="bi bi-search me-2"></i> Recherche par Nom
            </h3>
          </div>
          <div className="card-body">
            <form onSubmit={fetchProductsByName}>
              <div className="form-row d-flex gap-2">
                <input
                  className="form-control"
                  placeholder="Nom du produit"
                  value={searchName}
                  onChange={e => setSearchName(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Recherche par prix */}
      <div className="col-md-6 mb-3">
        <div className="card fade-in">
          <div className="card-header">
            <h3 className="card-title">
              <i className="bi bi-cash-coin me-2"></i> Recherche par Prix
            </h3>
          </div>
          <div className="card-body">
            <form onSubmit={fetchProductsByPrice}>
              <div className="form-row d-flex gap-2">
                <input
                  className="form-control"
                  placeholder="Prix minimum"
                  type="number"
                  value={min}
                  onChange={e => setMin(e.target.value)}
                />
                <input
                  className="form-control"
                  placeholder="Prix maximum"
                  type="number"
                  value={max}
                  onChange={e => setMax(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-2">
                <i className="bi bi-search"></i> Rechercher
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    {/* 📋 Liste des produits */}
    <div className="card fade-in mb-4">
      <div className="card-header">
        <h2 className="card-title">
          <i className="bi bi-collection me-2"></i> Liste des Produits
        </h2>
      </div>
      <div className="card-body">
        {products.length === 0 ? (
          <div className="empty-state text-center">
            <i className="bi bi-inbox fs-1 text-muted"></i>
            <p>Aucun produit trouvé. Ajoutez votre premier produit ci-dessous.</p>
          </div>
        ) : (
          <div className="products-list">
  {products.map(product => (
    <div key={product._id} className="product-item card mb-3 position-relative p-3">
      <div className="product-info">
        <div className="product-name mb-2">
          <i className="bi bi-tag me-2"></i> {product.name}
        </div>
        <div className="product-details">
          <i className="bi bi-currency-dollar me-1"></i> {product.price} •{" "}
          <i className="bi bi-palette me-1"></i> {product.color}  
        </div>

        {/* ID at bottom-left */}
        <div
          className="id"
        >
          ID: {product.id}
        </div>
      </div>
    </div>
  ))}
</div>

        )}
      </div>
    </div>

    {/* ➕ Modifier / Supprimer / Ajouter */}
    <div className="row">
      {/* Ajouter */}
      <div className="col-md-4 mb-4">
        <div className="card fade-in">
          <div className="card-header">
            <h3 className="card-title">
              <i className="bi bi-plus-circle me-2"></i> Ajouter un Produit
            </h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleAdd}>
              <input
                className="form-control mb-2"
                placeholder="Nom du produit"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                className="form-control mb-2"
                placeholder="Prix"
                type="number"
                value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
              />
              <input
                className="form-control mb-2"
                placeholder="Couleur"
                value={newProduct.color}
                onChange={e => setNewProduct({ ...newProduct, color: e.target.value })}
              />
              <button type="submit" className="btn btn-success w-100">
                <i className="bi bi-check-circle"></i> Ajouter
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modifier */}
      <div className="col-md-4 mb-4">
        <div className="card fade-in">
          <div className="card-header">
            <h3 className="card-title">
              <i className="bi bi-pencil-square me-2"></i> Modifier un Produit
            </h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpdate}>
              <input
                className="form-control mb-2"
                placeholder="ID du produit"
                value={updateProduct.id}
                onChange={e => setUpdateProduct({ ...updateProduct, id: e.target.value })}
              />
              <input
                className="form-control mb-2"
                placeholder="Nouveau nom"
                value={updateProduct.name}
                onChange={e => setUpdateProduct({ ...updateProduct, name: e.target.value })}
              />
              <input
                className="form-control mb-2"
                placeholder="Nouveau prix"
                type="number"
                value={updateProduct.price}
                onChange={e => setUpdateProduct({ ...updateProduct, price: e.target.value })}
              />
              <input
                className="form-control mb-2"
                placeholder="Nouvelle couleur"
                value={updateProduct.color}
                onChange={e => setUpdateProduct({ ...updateProduct, color: e.target.value })}
              />
              <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-save"></i> Modifier
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Supprimer */}
      <div className="col-md-4 mb-4">
        <div className="card fade-in">
          <div className="card-header">
            <h3 className="card-title">
              <i className="bi bi-trash3 me-2"></i> Supprimer un Produit
            </h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleDelete}>
              <input
                className="form-control mb-2"
                placeholder="ID du produit à supprimer"
                value={deleteId}
                onChange={e => setDeleteId(e.target.value)}
              />
              <button type="submit" className="btn btn-danger w-100">
                <i className="bi bi-x-circle"></i> Supprimer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


  );
}

export default App;