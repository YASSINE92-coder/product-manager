// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/products/Auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(data.user || data));
        navigate('/dashboard');
      } else {
        alert('Login failed: ' + (data.message || 'Invalid credentials'));
      }
    } catch (error) {
      alert('Login error: ' + error.message);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
  <div className="card w-full max-w-md bg-white shadow-lg rounded-xl border border-gray-100 transition-all duration-200">
    <div className="card-body p-8">

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">Login</h2>
      <p className="text-sm text-gray-500 text-center mb-8">Please enter your credentials to continue.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Email Field */}
        <div className="form-control">
          <label className="label" style={{ marginTop: '3px' }}>
            <span className="label-text text-gray-700 text-sm font-medium">Email Address</span>
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            className="input input-bordered w-full rounded-lg border border-gray-300 
                       focus:border-[#34967C] focus:ring-1 focus:ring-[#34967C] 
                       transition-all duration-200 ease-in-out text-gray-800 placeholder-gray-400"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        {/* Password Field */}
        <div className="form-control">
          <label className="label" style={{ marginTop: '3px' }}>
            <span className="label-text text-gray-700 text-sm font-medium">Password</span>
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="input input-bordered w-full rounded-lg border border-gray-300 
                       focus:border-[#34967C] focus:ring-1 focus:ring-[#34967C] 
                       transition-all duration-200 ease-in-out text-gray-800 placeholder-gray-400"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <a
            href="#forgot"
            className="text-sm text-[#34967C] hover:text-[#2c7d68] transition-colors duration-150"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full py-3 mt-2 bg-[#34967C] hover:bg-[#2c7d68] 
                     text-white font-medium rounded-lg shadow-sm hover:shadow 
                     transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-[#34967C]"
        >
          Log In
        </button>
      </form>
    </div>
  </div>
</div>
  );
}