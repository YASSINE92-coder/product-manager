import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import './style.css';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" , description: "" , inStock: true });
  const [updateProduct, setUpdateProduct] = useState({ id: "", name: "", price: "" , description: "", inStock: true });
  const [deleteId, setDeleteId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [min, setMin] = useState();
  const [max, setMax] = useState();
// Get all products
const API_URL = "http://localhost:3001/products";
const TOKEN = "ACC1001"; // Same token your Auth middleware expects

// Get all products
const fetchProducts = () => {
  fetch(API_URL, {
    headers: { authorization: TOKEN } // matches middleware
  })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setProducts(data.map(p => ({ ...p, id: p._id })));
      } else {
        setProducts([]);
      }
    })
    .catch(err => console.error("Fetch error:", err));
};

// Search by name
const fetchProductsByName = (e) => {
  e.preventDefault();
  fetch(`${API_URL}/search?name=${searchName}`, {
    headers: { authorization: TOKEN }
  })
    .then(res => {
      if (!res.ok) throw new Error("No products found");
      return res.json();
    })
    .then(data => {
      const arr = Array.isArray(data) ? data : [data];
      setProducts(arr.map(p => ({ ...p, id: p._id })));
    })
    .catch(err => console.error("Fetch error:", err));
};

// Search by price
const fetchProductsByPrice = (e) => {
  e.preventDefault();
  fetch(`${API_URL}/${min}/${max}`, {
    headers: { authorization: TOKEN }
  })
    .then(res => {
      if (!res.ok) throw new Error("No products found");
      return res.json();
    })
    .then(data => {
      const arr = Array.isArray(data) ? data : [data];
      setProducts(arr.map(p => ({ ...p, id: p._id })));
    })
    .catch(err => console.error("Fetch error:", err));
};

// Add product
const handleAdd = (e) => {
  e.preventDefault();

  // Validate required fields
  if (!newProduct.name || !newProduct.description || newProduct.price <= 0) {
    console.error("All fields are required and price must be greater than 0");
    return;
  }
 
  const productToSend = {
    ...newProduct,
    price: Number(newProduct.price),
    inStock: Boolean(newProduct.inStock)
  };

  console.log("Sending product:", productToSend);

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: TOKEN // ensure proper header format
    },
    body: JSON.stringify(productToSend)
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add product");
      }
      return res.json();
    })
    .then(() => {
      fetchProducts(); // refresh product list
      setNewProduct({ name: "", price: "", description: "", inStock: true }); // reset form
    })
    .catch(err => console.error("Add error:", err));
};

// Update product
const handleUpdate = (e) => {
  e.preventDefault();

  if (!updateProduct.id) {
    console.error("Product ID is required to update");
    return;
  }
  if (!updateProduct.name || !updateProduct.description || updateProduct.price <= 0) {
    console.error("All fields are required and price must be greater than 0");
    return;
  }

  const productToSend = {
    name: updateProduct.name,
    price: Number(updateProduct.price),
    description: updateProduct.description,
    inStock: Boolean(updateProduct.inStock)
  };

  console.log("Updating product:", productToSend);

  fetch(`${API_URL}/${updateProduct.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN
    },
    body: JSON.stringify(productToSend)
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to update product");
      return res.json();
    })
    .then(() => {
      fetchProducts(); // refresh list
      setUpdateProduct({ id: "", name: "", price: 0, description: "", inStock: true }); // reset form
    })
    .catch(err => console.error("Update error:", err));
};


// Delete product
const handleDelete = (e) => {
  e.preventDefault();
  fetch(`${API_URL}/${deleteId}`, {
    method: "DELETE",
    headers: { authorization: TOKEN },
  })
    .then(res => res.json())
    .then(() => {
      fetchProducts();
      setDeleteId("");
    })
    .catch(err => console.error("Delete error:", err));
};

useEffect(() => {
  fetchProducts();
}, []);

  return (
    
  <div className="main-container">
  {/* Bouton de basculement de thème */}
 

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
        { products.length === 0 ? (
          <div className="empty-state text-center">
            <i className="bi bi-inbox fs-1 text-muted"></i>
            <p>Aucun produit trouvé. Ajoutez votre premier produit ci-dessous.</p>
          </div>
        ) : (
         <div className="products-list">
  {Array.isArray(products) && products.map(product => (
    <div key={product.id} className="product-item card mb-3 position-relative p-3">
      <div className="product-info">
        <div className="product-name mb-2">
          <i className="bi bi-tag me-2"></i> {product.name}
        </div>
        <div className="product-details">
          <i className="bi bi-currency-dollar me-1"></i> {product.price} •{" "}
          <i className="bi bi-info-circle me-1"></i> {product.description} •{" "}
          <i className="bi bi-check-circle me-1"></i> {product.inStock ? "En stock" : "Rupture de stock"}
        </div>
        <div className="id">
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
                placeholder="description"
                value={newProduct.description}
                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              <div className="form-check mb-2">
  <input
    className="form-check-input"
    type="checkbox"
    checked={newProduct.inStock}
    onChange={e => setNewProduct({ ...newProduct, inStock: e.target.checked })}
    id="inStockCheckbox"
  />
  <label className="form-check-label" htmlFor="inStockCheckbox">
    En stock
  </label>
</div>
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
                placeholder=" Nouvelle description"
                value={updateProduct.description}
                onChange={e => setUpdateProduct({ ...updateProduct, description: e.target.value })}
              />
             <div className="form-check mb-2">
  <input
    className="form-check-input"
    type="checkbox"
    checked={updateProduct.inStock}
    onChange={e => setUpdateProduct({ ...updateProduct, inStock: e.target.checked })}
    id="inStockCheckbox"
  />
  <label className="form-check-label" htmlFor="inStockCheckbox">
    En stock
  </label>
</div>
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