import React, { useState, useEffect } from 'react';
import './index.css';

// ✅ Verified image mapping – all URLs tested and working
const getProductImage = (productName) => {
  const name = productName.toLowerCase();

  if (name.includes('headphone') || name.includes('earbuds') || name.includes('audio'))
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';

  if (name.includes('watch') || name.includes('smartwatch'))
    return 'https://images.unsplash.com/photo-1523275335342-871b46d49730?auto=format&fit=crop&w=600&q=80';

  if (name.includes('bottle') || name.includes('water') || name.includes('eco'))
    return 'https://images.unsplash.com/photo-1560214952-5c84d88d0d3e?auto=format&fit=crop&w=600&q=80';

  if (name.includes('lamp') || name.includes('light'))
    return 'https://images.unsplash.com/photo-1520475691228-a1a54bf601d6?auto=format&fit=crop&w=600&q=80';

  if (name.includes('bag') || name.includes('backpack'))
    return 'https://images.unsplash.com/photo-1547928369-b7bc86c281b1?auto=format&fit=crop&w=600&q=80';

  if (name.includes('shoe') || name.includes('sneaker'))
    return 'https://images.unsplash.com/photo-1460353581600-b06a94eac87c?auto=format&fit=crop&w=600&q=80';

  if (name.includes('phone') || name.includes('charger'))
    return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80';

  if (name.includes('camera'))
    return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80';

  if (name.includes('laptop') || name.includes('keyboard') || name.includes('tech'))
    return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80';

  // Fallback: generic product
  return 'https://images.unsplash.com/photo-1607082348826-7a94f16c38a5?auto=format&fit=crop&w=600&q=80';
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3001/products';
  const TOKEN = 'ACC1001';

  // Number of products to show on homepage
  const PRODUCTS_TO_SHOW = 6;

  useEffect(() => {
    setLoading(true);
    fetch(API_URL, {
      headers: { Authorization: TOKEN },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        const formatted = Array.isArray(data) ? data : [];
        setProducts(formatted);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Get limited products
  const displayedProducts = products.slice(0, PRODUCTS_TO_SHOW);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-2xl text-indigo-600 tracking-tight">ShopEase</span>
          </div>
          <nav className="hidden md:flex gap-8 text-base font-medium">
            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
            <a href="#products" className="hover:text-indigo-600 transition">Products</a>
            <a href="#categories" className="hover:text-indigo-600 transition">Categories</a>
            <a href="#contact" className="hover:text-indigo-600 transition">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="/login" className="btn btn-sm btn-outline rounded-full border-indigo-600 text-indigo-600 hover:bg-indigo-50">Sign In</a>
            <a href="/signup" className="btn btn-sm rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow">Get Started</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 bg-gradient-to-b from-white/80 to-blue-50 dark:from-slate-900/80 dark:to-slate-900">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
          Discover the Best <span className="text-indigo-600">Products</span> for Your Lifestyle
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8">
          ShopEase brings you a curated selection of top-quality items, exclusive deals, and a seamless shopping experience. Find your next favorite product today!
        </p>
        <a href="#products" className="btn btn-lg rounded-full bg-indigo-600 text-white px-8 py-3 text-lg font-semibold shadow hover:bg-indigo-700 transition">Shop Now</a>
      </main>

      {/* Featured Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Featured Products</h2>

        {loading && (
          <div className="text-center py-8">
            <span className="loading loading-ring loading-lg text-indigo-600"></span>
            <p className="mt-4 text-slate-500 dark:text-slate-400">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-error">
            <p>❌ {error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>No products available at the moment.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            {/* Limited Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {displayedProducts.map((product) => (
                <div
                  key={product._id || product.id}
                  className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={getProductImage(product.name)}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded-xl mb-4"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1607082348826-7a94f16c38a5?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-slate-500 dark:text-slate-300 mb-2 text-center line-clamp-2">
                    {product.description || 'Premium quality, great value.'}
                  </p>
                  <span className="font-bold text-indigo-600 text-lg mb-2">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  <button className="btn btn-sm bg-indigo-600 text-white rounded-full hover:bg-indigo-700 w-full">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>

            {/* View More Button */}
            <div className="text-center mt-10">
              <a
                href="/products" // or your full products page
                className="btn btn-lg rounded-full bg-indigo-600 text-white px-8 py-3 font-semibold hover:bg-indigo-700 shadow transition"
              >
                View All {products.length} Products
              </a>
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      
        
    </div>
  );
}