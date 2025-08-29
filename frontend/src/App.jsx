import { useState, useEffect } from "react";
import "./index.css";
import Login from "../src/Login"

export default function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "", inStock: true });
  const [updateProduct, setUpdateProduct] = useState({ id: "", name: "", price: "", description: "", inStock: true });
  const [deleteId, setDeleteId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [avgPrice, setAvgPrice] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const API_URL = "http://localhost:3001/products";
  const TOKEN = "ACC1001";

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  // Fetch all products
  const fetchProducts = () => {
    setLoading(true);
    fetch(API_URL, { headers: { authorization: TOKEN } })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data.map((p) => ({ ...p, id: p._id })));
        } else {
          setProducts([]);
        }
      })
      .catch(() => showNotification("Erreur de chargement", "error"))
      .finally(() => setLoading(false));
  };

  // Sort by price
  const sortByPrice = () => {
    setProducts([...products].sort((a, b) => a.price - b.price));
    setSortBy("price");
    showNotification("✅ Trié par prix");
  };

  // Calculate average price
  const calculateAvgPriceByStock = () => {
    setLoading(true);
    fetch(`${API_URL}/avg`, { headers: { authorization: TOKEN } })
      .then((res) => res.json())
      .then((data) => {
        if (data.avgPrice !== undefined) {
          setAvgPrice(data.avgPrice);
        }
      })
      .catch(() => showNotification("Erreur de chargement du prix moyen", "error"))
      .finally(() => setLoading(false));
  };

  // Filter in stock
  const getProductsInStock = () => {
    const filtered = products.filter((p) => p.inStock);
    setProducts(filtered);
    setSortBy("stock");
    showNotification(filtered.length ? "Filtré : en stock" : "Aucun produit en stock", filtered.length ? "info" : "warning");
  };

  // Search by name
  const fetchProductsByName = (e) => {
    e.preventDefault();
    if (!searchName.trim()) return fetchProducts();
    setLoading(true);
    fetch(`${API_URL}/search?name=${searchName}`, { headers: { authorization: TOKEN } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const arr = Array.isArray(data) ? data : [data];
        setProducts(arr.map((p) => ({ ...p, id: p._id })));
        setSortBy("search");
      })
      .catch(() => showNotification("Aucun produit trouvé", "warning"))
      .finally(() => setLoading(false));
  };

  // Search by price range
  const fetchProductsByPrice = (e) => {
    e.preventDefault();
    if (!min && !max) return fetchProducts();
    setLoading(true);
    fetch(`${API_URL}/${min || 0}/${max || 999999}`, { headers: { authorization: TOKEN } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const arr = Array.isArray(data) ? data : [data];
        setProducts(arr.map((p) => ({ ...p, id: p._id })));
        setSortBy("price-range");
      })
      .catch(() => showNotification("Aucun produit dans cette plage", "warning"))
      .finally(() => setLoading(false));
  };

  // Add product
  const handleAdd = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.description || newProduct.price <= 0) {
      showNotification("Champs requis", "error");
      return;
    }
    setLoading(true);
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: TOKEN },
      body: JSON.stringify({
        ...newProduct,
        price: Number(newProduct.price),
        inStock: Boolean(newProduct.inStock),
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(() => {
        fetchProducts();
        setNewProduct({ name: "", price: "", description: "", inStock: true });
        document.getElementById("add_modal").close();
        showNotification("✅ Produit ajouté !");
      })
      .catch(() => showNotification("❌ Échec de l'ajout", "error"))
      .finally(() => setLoading(false));
  };

  // Update product
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!updateProduct.id || !updateProduct.name || updateProduct.price <= 0) {
      showNotification("ID et champs requis", "error");
      return;
    }
    setLoading(true);
    fetch(`${API_URL}/${updateProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", authorization: TOKEN },
      body: JSON.stringify({
        name: updateProduct.name,
        price: Number(updateProduct.price),
        description: updateProduct.description,
        inStock: Boolean(updateProduct.inStock),
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(() => {
        fetchProducts();
        setUpdateProduct({ id: "", name: "", price: "", description: "", inStock: true });
        document.getElementById("edit_modal").close();
        showNotification("✅ Mis à jour !");
      })
      .catch(() => showNotification("❌ Échec", "error"))
      .finally(() => setLoading(false));
  };

  // Delete product
  const handleDelete = () => {
    if (!deleteId) return showNotification("ID requis", "error");
    setLoading(true);
    fetch(`${API_URL}/${deleteId}`, { method: "DELETE", headers: { authorization: TOKEN } })
      .then(() => {
        fetchProducts();
        setDeleteId("");
        setShowDeleteModal(false);
        showNotification("🗑️ Supprimé !");
      })
      .catch(() => showNotification("❌ Échec", "error"))
      .finally(() => setLoading(false));
  };

  // Open edit modal
  const handleEditClick = (product) => {
    setUpdateProduct({ ...product });
    document.getElementById("edit_modal").showModal();
  };

  // Reset filters
  const resetFilters = () => {
    setSearchName("");
    setMin("");
    setMax("");
    setSortBy("");
    fetchProducts();
  };

  // Load data on mount
  useEffect(() => {
    fetchProducts();
    const timer = setTimeout(() => calculateAvgPriceByStock(), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 text-base-content transition-all duration-500">
      {/* Theme Toggle */}
<link rel="stylesheet" href="" />      
<div className="fixed top-4 right-4 z-50">
        <label className="swap swap-rotate btn btn-sm bg-base-100 shadow-lg">
          <input type="checkbox" data-toggle-theme="synthwave,light" />
          <svg className="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5.64...Z" />
          </svg>
          <svg className="swap-off fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.64...Z" />
          </svg>
        </label>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className="toast toast-top toast-end z-50 mt-20">
          <div className={`alert shadow-lg ${notification.type === 'error' ? 'alert-error' : notification.type === 'warning' ? 'alert-warning' : 'alert-success'}`}>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold text-error flex items-center gap-2">
              <i className="bi bi-exclamation-triangle"></i> Confirmer la suppression
            </h3>
            <p className="py-4">
              Supprimer <strong>"{products.find(p => p.id === deleteId)?.name}"</strong> ?
            </p>
            <div className="modal-action">
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-ghost">Annuler</button>
              <button onClick={handleDelete} className="btn btn-error" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-xs"></span> : <i className="bi bi-trash"></i>}
                Supprimer
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Loading */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40 backdrop-blur-sm">
          <span className="loading loading-ring loading-lg text-primary"></span>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

        {/* Header */}
        <header className="glass-card bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-white/10 shadow-xl">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <i className="bi bi-box-seam-fill text-primary text-4xl"></i>
              Gestion des Produits
            </h1>
            <p className="text-base-content/70 mt-1 ml-3">Organisez, modifiez et suivez vos produits</p>
          </div>
          <div className="mt-6 sm:mt-0 flex flex-wrap justify-center sm:justify-end gap-4">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Total</div>
                <div className="stat-value">{products.length}</div>
              </div>
            </div>
            {avgPrice > 0 && (
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Prix moyen</div>
                  <div className="stat-value">{avgPrice.toFixed(2)} €</div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Search & Filters */}
        <section className="glass-card bg-opacity-80 backdrop-blur-sm rounded-3xl p-6 space-y-6 border border-white/20 dark:border-white/10 shadow-xl">
          <div className="flex flex-wrap items-center justify-between">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <i className="bi bi-search"></i> Rechercher
            </h3>
            {sortBy && (
              <div className="alert alert-info shadow-sm flex items-center justify-between">
                <span>Filtre actif : <strong>{sortBy}</strong></span>
                <button onClick={resetFilters} className="btn btn-sm btn-circle">✕</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search by name */}
            <form onSubmit={fetchProductsByName} className="flex items-center max-w-sm mx-auto">
              <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z..." />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ps-10 p-2.5 w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <button type="submit" className="btn ms-3">
                <i className="bi bi-search"></i>
              </button>
            </form>

            {/* Price range */}
            <form onSubmit={fetchProductsByPrice} className="flex items-center max-w-sm mx-auto gap-2">
              <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" d="M4 10a6 6 0 0 1 12 0..." />
                  </svg>
                </div>
                <input
                  type="number"
                  placeholder="Min"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ps-10 p-2.5 w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" d="M4 10a6 6 0 0 1 12 0..." />
                  </svg>
                </div>
                <input
                  type="number"
                  placeholder="Max"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ps-10 p-2.5 w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <button type="submit" className="btn">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>
        </section>

        {/* Products Table */}
        <section className="glass-card bg-opacity-80 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 dark:border-white/10 shadow-xl">
          <div className="p-6 border-b border-base-200 flex flex-wrap justify-between items-center">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <i className="bi bi-collection"></i> Liste des Produits
            </h3>
            <div className="flex flex-wrap gap-2">
              <div className="dropdown">
                <button tabIndex="0" className="btn m-1 ">Filter</button>
                <ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <li><button onClick={fetchProducts}><i className="bi bi-arrow-clockwise"></i> Actualiser</button></li>
                  <li><button onClick={sortByPrice}><i className="bi bi-sort-numeric-down"></i> Tri prix</button></li>
                  <li><button onClick={getProductsInStock}><i className="bi bi-boxes"></i> En stock</button></li>
                </ul>
              </div>
              <button className="btn btn-primary" onClick={() => document.getElementById("add_modal").showModal()}>
                + Ajouter
              </button>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="p-16 text-center">
              <i className="bi bi-inbox text-8xl text-base-content/20 block mb-4"></i>
              <p className="text-lg text-base-content/70 mb-4">Aucun produit trouvé</p>
              <button className="btn btn-primary" onClick={() => document.getElementById("add_modal").showModal()}>
                Ajouter un produit
              </button>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3 font-semibold">ID</th>
                    <th className="px-6 py-3 font-semibold">Nom</th>
                    <th className="px-6 py-3 font-semibold">Description</th>
                    <th className="px-6 py-3 font-semibold">Prix</th>
                    <th className="px-6 py-3 font-semibold">Stock</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-xs text-gray-500">{p.id.slice(0, 8)}...</td>
                      <td className="px-6 py-4 font-medium">{p.name}</td>
                      <td className="px-6 py-4 text-sm truncate max-w-xs" title={p.description}>{p.description}</td>
                      <td className="px-6 py-4 font-bold">{p.price.toFixed(2)} €</td>
                      <td className="px-6 py-4">
                        <span>{p.inStock ? ' en stock' : ' en rupture'}</span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <button onClick={() => handleEditClick(p)} className="btn btn-sm btn-outline btn-primary">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button onClick={() => { setDeleteId(p.id); setShowDeleteModal(true); }} className="btn btn-sm btn-outline btn-error">
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Modals */}
        {/* Add Modal */}
        <dialog id="add_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Ajouter un produit</h3>
            <form onSubmit={handleAdd} className="space-y-4 mt-4">
              <input placeholder="Nom" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="input input-bordered w-full" required />
              <input type="number" step="0.01" placeholder="Prix" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="input input-bordered w-full" required />
              <textarea placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} rows="3" className="textarea textarea-bordered w-full" required />
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={newProduct.inStock} onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })} className="toggle toggle-primary" />
                <span>En stock</span>
              </label>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "..." : "Ajouter"}
                </button>
                <button type="button" className="btn" onClick={() => document.getElementById("add_modal").close()}>Annuler</button>
              </div>
            </form>
          </div>
        </dialog>

        {/* Edit Modal */}
        <dialog id="edit_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Modifier produit</h3>
            <form onSubmit={handleUpdate} className="space-y-4 mt-4">
              <input placeholder="Nom" value={updateProduct.name} onChange={(e) => setUpdateProduct({ ...updateProduct, name: e.target.value })} className="input input-bordered w-full" required />
              <input type="number" step="0.01" placeholder="Prix" value={updateProduct.price} onChange={(e) => setUpdateProduct({ ...updateProduct, price: e.target.value })} className="input input-bordered w-full" required />
              <textarea placeholder="Description" value={updateProduct.description} onChange={(e) => setUpdateProduct({ ...updateProduct, description: e.target.value })} rows="3" className="textarea textarea-bordered w-full" required />
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={updateProduct.inStock} onChange={(e) => setUpdateProduct({ ...updateProduct, inStock: e.target.checked })} className="toggle toggle-primary" />
                <span>En stock</span>
              </label>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "..." : "Mettre à jour"}
                </button>
                <button type="button" className="btn" onClick={() => document.getElementById("edit_modal").close()}>Annuler</button>
              </div>
            </form>
          </div>
        </dialog>

      </div>
      <Login/>
    </div>
  );
}