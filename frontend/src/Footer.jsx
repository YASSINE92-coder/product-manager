export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-extrabold text-2xl text-indigo-600 tracking-tight">ShopEase</span>
            </div>
            <p className="text-slate-500 dark:text-slate-300 mb-6 max-w-xs">
              Bringing quality products and seamless shopping to your doorstep.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Stay Updated</h3>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered flex-1 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
                <button
                  type="submit"
                  className="btn bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">1on1 Coaching</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">Company Review</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">Accounts Review</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">HR Consulting</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">SEO Optimisation</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">About</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">Meet the Team</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">Careers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">Contact</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">FAQs</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">Live Chat</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">Accessibility</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">Returns Policy</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">Refund Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Downloads</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">Marketing Calendar</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">SEO Infographics</a></li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition">
              <i className="bi bi-twitter"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition">
              <i className="bi bi-github"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition">
              <i className="bi bi-dribbble"></i>
            </a>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>

          <div className="flex gap-4 text-sm">
            <a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">Terms</a>
            <a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">Privacy</a>
            <a href="#" className="text-slate-500 dark:text-slate-300 hover:text-indigo-600 transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}