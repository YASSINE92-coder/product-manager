import { useState, useEffect, useRef } from "react";
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
  const [avgPrice, setAvgPrice] = useState(0);
  const [activeTab, setActiveTab] = useState("add");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState(""); // Pour le tri
  
  // Référence pour le formulaire d'édition
  const editFormRef = useRef(null);
  const statsRef = useRef(null);

  const API_URL = "http://localhost:3001/products";
  const TOKEN = "ACC1001";

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  // Fetch all products with loading state
  const fetchProducts = () => {
    setLoading(true);
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Tri par prix
  const sortByPrice = () => {
    setLoading(true);
    fetch(`${API_URL}/price`, {
      headers: { authorization: TOKEN }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.map(p => ({ ...p, id: p._id })));
          setSortBy("price");
        } else {
          setProducts([]);
        }
      })
      .catch(err => {
        console.error("Sort error:", err);
        showNotification("Erreur lors du tri des produits", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Calcul du prix moyen des produits en stock
  const calculateAvgPriceByStock = () => {
    setLoading(true);
    fetch(`${API_URL}/avg`, {
      headers: { authorization: TOKEN }
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.avgPrice !== undefined) {
        setAvgPrice(data.avgPrice);
        
        // Scroll vers les statistiques
        setTimeout(() => {
          if (statsRef.current) {
            statsRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center'
            });
          }
        }, 300);
      } else {
        setAvgPrice(0);
        showNotification("Aucune donnée disponible", "info");
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      showNotification("Erreur lors du calcul du prix moyen", "error");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  // Récupérer les produits en stock
  const getProductsInStock = () => {
    setLoading(true);
    fetch(`${API_URL}/stock`, {
      headers: { authorization: TOKEN }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.map(p => ({ ...p, id: p._id })));
          setSortBy("stock");
        } else {
          setProducts([]);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        showNotification("Erreur lors du chargement des produits", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Search by name
  const fetchProductsByName = (e) => {
    e.preventDefault();
    if (!searchName.trim()) {
      fetchProducts();
      return;
    }
    
    setLoading(true);
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
        setSortBy("search");
      })
      .catch(err => {
        console.error("Search error:", err);
        showNotification(err.message, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Search by price range
  const fetchProductsByPrice = (e) => {
    e.preventDefault();
    if (!min && !max) {
      fetchProducts();
      return;
    }
    
    setLoading(true);
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
        setSortBy("price-range");
      })
      .catch(err => {
        console.error("Search error:", err);
        showNotification(err.message, "error");
      })
      .finally(() => {
        setLoading(false);
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

    setLoading(true);
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
        setActiveTab("add"); // Reste sur l'onglet d'ajout
      })
      .catch(err => {
        console.error("Add error:", err);
        showNotification(err.message, "error");
      })
      .finally(() => {
        setLoading(false);
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

    setLoading(true);
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
        setActiveTab("add"); // Retour à l'onglet d'ajout après modification
      })
      .catch(err => {
        console.error("Update error:", err);
        showNotification(err.message, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Delete product
  const handleDelete = (e) => {
    e.preventDefault();
    
    if (!deleteId) {
      showNotification("ID du produit requis", "error");
      return;
    }

    setLoading(true);
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
        setActiveTab("add"); // Retour à l'onglet d'ajout après suppression
      })
      .catch(err => {
        console.error("Delete error:", err);
        showNotification(err.message, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Fonction pour faire défiler vers le formulaire d'édition
  const scrollToEditForm = () => {
    setTimeout(() => {
      if (editFormRef.current) {
        editFormRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
      }
    }, 100);
  };

  // Fonction modifiée pour gérer le clic sur le bouton d'édition
  const handleEditClick = (product) => {
    setUpdateProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      inStock: product.inStock
    });
    setActiveTab('edit');
    scrollToEditForm();
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchName("");
    setMin("");
    setMax("");
    setSortBy("");
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="dashboard">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`toast show position-fixed top-0 end-0 m-3 ${notification.type === 'error' ? 'bg-danger' : notification.type === 'info' ? 'bg-info' : 'bg-success'}`} 
             style={{ zIndex: 1050 }}>
          <div className="toast-body text-white">
            {notification.message}
          </div>
        </div>
      )}
      
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
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
          
          <div className="stats d-flex gap-3 align-items-center" ref={statsRef}>
            <span className="badge bg-primary">Total: {products.length}</span>
            
            <button className="btn btn-outline-primary btn-sm" onClick={calculateAvgPriceByStock}>
              <i className="bi bi-calculator me-1"></i> Prix moyen
            </button>
            
            {avgPrice > 0 && (
              <span className="badge bg-success">
                Moyenne: {avgPrice.toFixed(2)} €
              </span>
            )}
          </div>
        </div>

        {/* Search Section */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="card-title mb-0">
              <i className="bi bi-search me-2"></i> Recherche et Filtres
            </h3>
            <button className="btn btn-sm btn-outline-secondary" onClick={resetFilters}>
              <i className="bi bi-x-circle me-1"></i> Réinitialiser
            </button>
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
                  <button type="submit" className="btn btn-outline-primary" disabled={loading}>
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
                  <button type="submit" className="btn btn-outline-primary" disabled={loading}>
                    <i className="bi bi-search"></i>
                  </button>
                </form>
              </div>
            </div>
            
            {/* Indicateur de tri/filtre actif */}
            {sortBy && (
              <div className="mt-3">
                <span className="badge bg-info">
                  <i className="bi bi-funnel me-1"></i>
                  Filtre actif: {sortBy === 'price' ? 'Tri par prix' : 
                                sortBy === 'stock' ? 'Produits en stock' : 
                                sortBy === 'search' ? 'Recherche par nom' : 
                                sortBy === 'price-range' ? 'Plage de prix' : 
                                'Personnalisé'}
                  <button 
                    className="btn-close btn-close-white ms-2" 
                    onClick={resetFilters}
                  ></button>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h3 className="card-title mb-0">
              <i className="bi bi-collection me-2"></i> Liste des Produits
            </h3>
            
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-sm btn-outline-secondary" onClick={fetchProducts} disabled={loading}>
                <i className="bi bi-arrow-clockwise me-1"></i> Actualiser
              </button>
              <button className="btn btn-sm btn-outline-primary" onClick={sortByPrice} disabled={loading}>
                <i className="bi bi-sort-numeric-down me-1"></i> Tri par prix
              </button>
              <button className="btn btn-sm btn-outline-success" onClick={getProductsInStock} disabled={loading}>
                <i className="bi bi-boxes me-1"></i> En stock uniquement
              </button>
            </div>
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
              <div className="table-responsive">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom</th>
                      <th>Description</th>
                      <th>Prix</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td data-label="ID">
                          <div className="product-id">{product.id.substring(0, 8)}</div>
                        </td>
                        <td data-label="Nom" className="product-name">{product.name}</td>
                        <td data-label="Description">{product.description}</td>
                        <td data-label="Prix" className="product-price">{product.price.toFixed(2)} €</td>
                        <td data-label="Stock">
                          <span className={`badge ${product.inStock ? 'bg-success' : 'bg-danger'}`}>
                            {product.inStock ? 'En stock' : 'Rupture'}
                          </span>
                        </td>
                        <td data-label="Actions">
                          <button 
                            className="btn btn-sm btn-outline-primary btn-action me-1"
                            onClick={() => handleEditClick(product)}
                            title="Modifier"
                            disabled={loading}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger btn-action"
                            onClick={() => {
                              setDeleteId(product.id);
                              setActiveTab("delete");
                            }}
                            title="Supprimer"
                            disabled={loading}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Action Tabs */}
        <div className="card" ref={editFormRef}>
          <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'add' ? 'active' : ''}`}
                  onClick={() => setActiveTab('add')} 
                  disabled={loading}
                >
                  <i className="bi bi-plus-circle me-1"></i> Ajouter
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'edit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('edit')}
                  disabled={loading}
                >
                  <i className="bi bi-pencil-square me-1"></i> Modifier
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'delete' ? 'active' : ''}`}
                  onClick={() => setActiveTab('delete')}
                  disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
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
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="inStockAdd">
                        En stock
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Ajout en cours...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-plus-circle me-2"></i> Ajouter le produit
                        </>
                      )}
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
                      readOnly
                      disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
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
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="inStockEdit">
                        En stock
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Mise à jour...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save me-2"></i> Mettre à jour
                        </>
                      )}
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
                      disabled={loading}
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-danger w-100" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Suppression...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-trash3 me-2"></i> Supprimer le produit
                        </>
                      )}
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