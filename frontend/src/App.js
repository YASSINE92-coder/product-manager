import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import './style.css';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ 
    name: "", 
    price: "", 
    description: "", 
    inStock: true 
  });
  const [updateProduct, setUpdateProduct] = useState({ 
    id: "", 
    name: "", 
    price: "", 
    description: "", 
    inStock: true 
  });
  const [deleteId, setDeleteId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [activeTab, setActiveTab] = useState("add");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const API_URL = "http://localhost:3001/products";
  const TOKEN = "ACC1001";

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  // Fetch all products
  const fetchProducts = () => {
    fetch(API_URL, {
      headers: { authorization: TOKEN }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.map(p => ({ ...p, id: p._id })));
        } else {
          setProducts([]);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        showNotification("Erreur lors du chargement des produits", "error");
      });
  };

  // Search by name
  const fetchProductsByName = (e) => {
    e.preventDefault();
    if (!searchName.trim()) {
      fetchProducts();
      return;
    }
    
    fetch(`${API_URL}/search?name=${searchName}`, {
      headers: { authorization: TOKEN }
    })
      .then(res => {
        if (!res.ok) throw new Error("Aucun produit trouvé");
        return res.json();
      })
      .then(data => {
        const arr = Array.isArray(data) ? data : [data];
        setProducts(arr.map(p => ({ ...p, id: p._id })));
      })
      .catch(err => {
        console.error("Search error:", err);
        showNotification(err.message, "error");
      });
  };

  // Search by price
  const fetchProductsByPrice = (e) => {
    e.preventDefault();
    if (!min && !max) {
      fetchProducts();
      return;
    }
    
    fetch(`${API_URL}/${min || 0}/${max || 999999}`, {
      headers: { authorization: TOKEN }
    })
      .then(res => {
        if (!res.ok) throw new Error("Aucun produit trouvé");
        return res.json();
      })
      .then(data => {
        const arr = Array.isArray(data) ? data : [data];
        setProducts(arr.map(p => ({ ...p, id: p._id })));
      })
      .catch(err => {
        console.error("Search error:", err);
        showNotification(err.message, "error");
      });
  };

  // Add product
  const handleAdd = (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.description || newProduct.price <= 0) {
      showNotification("Tous les champs sont requis", "error");
      return;
    }

    const productToSend = {
      ...newProduct,
      price: Number(newProduct.price),
      inStock: Boolean(newProduct.inStock)
    };

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: TOKEN
      },
      body: JSON.stringify(productToSend)
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Échec de l'ajout");
        }
        return res.json();
      })
      .then(() => {
        fetchProducts();
        setNewProduct({ name: "", price: "", description: "", inStock: true });
        showNotification("Produit ajouté avec succès!");
      })
      .catch(err => {
        console.error("Add error:", err);
        showNotification(err.message, "error");
      });
  };

  // Update product
  const handleUpdate = (e) => {
    e.preventDefault();

    if (!updateProduct.id) {
      showNotification("ID du produit requis", "error");
      return;
    }
    if (!updateProduct.name || !updateProduct.description || updateProduct.price <= 0) {
      showNotification("Tous les champs sont requis", "error");
      return;
    }

    const productToSend = {
      name: updateProduct.name,
      price: Number(updateProduct.price),
      description: updateProduct.description,
      inStock: Boolean(updateProduct.inStock)
    };

    fetch(`${API_URL}/${updateProduct.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN
      },
      body: JSON.stringify(productToSend)
    })
      .then(res => {
        if (!res.ok) throw new Error("Échec de la mise à jour");
        return res.json();
      })
      .then(() => {
        fetchProducts();
        setUpdateProduct({ id: "", name: "", price: "", description: "", inStock: true });
        showNotification("Produit mis à jour!");
      })
      .catch(err => {
        console.error("Update error:", err);
        showNotification(err.message, "error");
      });
  };

  // Delete product
  const handleDelete = (e) => {
    e.preventDefault();
    
    if (!deleteId) {
      showNotification("ID du produit requis", "error");
      return;
    }

    fetch(`${API_URL}/${deleteId}`, {
      method: "DELETE",
      headers: { authorization: TOKEN },
    })
      .then(res => {
        if (!res.ok) throw new Error("Échec de la suppression");
        return res.json();
      })
      .then(() => {
        fetchProducts();
        setDeleteId("");
        showNotification("Produit supprimé!");
      })
      .catch(err => {
        console.error("Delete error:", err);
        showNotification(err.message, "error");
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="dashboard">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`toast show position-fixed top-0 end-0 m-3 ${notification.type === 'error' ? 'bg-danger' : 'bg-success'}`} 
             style={{ zIndex: 1050 }}>
          <div className="toast-body text-white">
            {notification.message}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="app-header d-flex justify-content-between align-items-center mb-4">
          <h1 className="app-title mb-0">
            <i className="bi bi-box-seam me-2"></i> Gestion des Produits
          </h1>
          <div className="stats d-flex gap-3">
            <span className="badge bg-primary">Total: {products.length}</span>
          </div>
        </div>

        {/* Search Section */}
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title mb-0">
              <i className="bi bi-search me-2"></i> Recherche
            </h3>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <form onSubmit={fetchProductsByName} className="d-flex gap-2">
                  <input
                    className="form-control"
                    placeholder="Rechercher par nom"
                    value={searchName}
                    onChange={e => setSearchName(e.target.value)}
                  />
                  <button type="submit" className="btn btn-outline-primary">
                    <i className="bi bi-search"></i>
                  </button>
                </form>
              </div>
              <div className="col-md-6">
                <form onSubmit={fetchProductsByPrice} className="d-flex gap-2">
                  <input
                    className="form-control"
                    placeholder="Prix min"
                    type="number"
                    value={min}
                    onChange={e => setMin(e.target.value)}
                  />
                  <input
                    className="form-control"
                    placeholder="Prix max"
                    type="number"
                    value={max}
                    onChange={e => setMax(e.target.value)}
                  />
                  <button type="submit" className="btn btn-outline-primary">
                    <i className="bi bi-search"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="card-title mb-0">
              <i className="bi bi-collection me-2"></i> Liste des Produits
            </h3>
            <button className="btn btn-sm btn-outline-secondary" onClick={fetchProducts}>
              <i className="bi bi-arrow-clockwise"></i> Actualiser
            </button>
          </div>
          <div className="card-body">
            {products.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
                <p className="mb-0">Aucun produit trouvé</p>
                <button className="btn btn-link" onClick={() => setActiveTab("add")}>
                  Ajouter votre premier produit
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-id text-muted small">ID: {product.id.substring(0, 8)}</div>
                    <h4 className="mt-2">{product.name}</h4>
                    <p className="text-muted">{product.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="fw-bold">{product.price.toFixed(2)} €</span>
                      <span className={`badge ${product.inStock ? 'bg-success' : 'bg-danger'}`}>
                        {product.inStock ? 'En stock' : 'Rupture'}
                      </span>
                    </div>
                    <div className="mt-3 d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setUpdateProduct({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            description: product.description,
                            inStock: product.inStock
                          });
                          setActiveTab("edit");
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          setDeleteId(product.id);
                          setActiveTab("delete");
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Tabs */}
        <div className="card">
          <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'add' ? 'active' : ''}`}
                  onClick={() => setActiveTab('add')}
                >
                  <i className="bi bi-plus-circle me-1"></i> Ajouter
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'edit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('edit')}
                >
                  <i className="bi bi-pencil-square me-1"></i> Modifier
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'delete' ? 'active' : ''}`}
                  onClick={() => setActiveTab('delete')}
                >
                  <i className="bi bi-trash3 me-1"></i> Supprimer
                </button>
              </li>
            </ul>
          </div>
          <div className="card-body">
            {/* Add Product Form */}
            {activeTab === 'add' && (
              <form onSubmit={handleAdd}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nom du produit</label>
                    <input
                      className="form-control"
                      placeholder="Nom du produit"
                      value={newProduct.name}
                      onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Prix (€)</label>
                    <input
                      className="form-control"
                      placeholder="Prix"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Description du produit"
                      rows="2"
                      value={newProduct.description}
                      onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="col-md-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={newProduct.inStock}
                        onChange={e => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                        id="inStockAdd"
                      />
                      <label className="form-check-label" htmlFor="inStockAdd">
                        En stock
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100">
                      <i className="bi bi-plus-circle me-2"></i> Ajouter le produit
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Edit Product Form */}
            {activeTab === 'edit' && (
              <form onSubmit={handleUpdate}>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label">ID du produit</label>
                    <input
                      className="form-control"
                      placeholder="ID du produit à modifier"
                      value={updateProduct.id}
                      onChange={e => setUpdateProduct({ ...updateProduct, id: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Nouveau nom</label>
                    <input
                      className="form-control"
                      placeholder="Nouveau nom"
                      value={updateProduct.name}
                      onChange={e => setUpdateProduct({ ...updateProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Nouveau prix (€)</label>
                    <input
                      className="form-control"
                      placeholder="Nouveau prix"
                      type="number"
                      step="0.01"
                      value={updateProduct.price}
                      onChange={e => setUpdateProduct({ ...updateProduct, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Nouvelle description</label>
                    <textarea
                      className="form-control"
                      placeholder="Nouvelle description"
                      rows="2"
                      value={updateProduct.description}
                      onChange={e => setUpdateProduct({ ...updateProduct, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="col-md-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={updateProduct.inStock}
                        onChange={e => setUpdateProduct({ ...updateProduct, inStock: e.target.checked })}
                        id="inStockEdit"
                      />
                      <label className="form-check-label" htmlFor="inStockEdit">
                        En stock
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100">
                      <i className="bi bi-save me-2"></i> Mettre à jour
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Delete Product Form */}
            {activeTab === 'delete' && (
              <form onSubmit={handleDelete}>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label">ID du produit à supprimer</label>
                    <input
                      className="form-control"
                      placeholder="ID du produit"
                      value={deleteId}
                      onChange={e => setDeleteId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-danger w-100">
                      <i className="bi bi-trash3 me-2"></i> Supprimer le produit
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;