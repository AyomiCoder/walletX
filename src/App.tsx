import { useState } from 'react'
import { Send, Repeat, Shield, Users, Facebook, Twitter, Instagram, Linkedin, X } from 'lucide-react'

export default function App() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true)
    setIsLoginModalOpen(false)
  }

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
    setIsRegisterModalOpen(false)
  }

  const closeModals = () => {
    setIsRegisterModalOpen(false)
    setIsLoginModalOpen(false)
  }

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col">
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <nav className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <div className="text-blue-600 font-bold text-2xl mr-2">●</div>
              <span className="font-bold text-xl">WalletX</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">How It Works</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Security</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Support</a>
            </div>
            <button onClick={openRegisterModal} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              Get Started
            </button>
          </nav>

          {/* Main Content */}
          <main className="mt-16 relative">
            {/* Decorative Elements in Background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="grid grid-cols-5 gap-4 opacity-10">
                {[...Array(50)].map((_, i) => (
                  <div key={i} className={`w-12 h-12 rounded-lg ${i % 7 === 0 ? 'bg-blue-400' : i % 11 === 0 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                ))}
              </div>
            </div>

            <div className="relative z-10 text-center">
              <h1 className="text-6xl font-bold leading-tight mb-4">
                Send and receive money<br />with just a username
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                WalletX makes financial transactions as easy as sending a message.<br />No account numbers, just usernames.
              </p>
              <button onClick={openRegisterModal} className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-medium">
                Create Your WalletX
              </button>
            </div>

            {/* Feature Boxes */}
            <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Instant Transfers Box */}
              <div className="bg-blue-100 rounded-3xl p-6 flex flex-col items-center text-center">
                <Send className="w-12 h-12 text-blue-600 mb-4" />
                <h2 className="text-xl font-bold mb-2">Instant Transfers</h2>
                <p className="text-gray-600">Send money in seconds, anytime, anywhere</p>
              </div>

              {/* Username Payments Box */}
              <div className="bg-green-100 rounded-3xl p-6 flex flex-col items-center text-center">
                <Users className="w-12 h-12 text-green-600 mb-4" />
                <h2 className="text-xl font-bold mb-2">Username Payments</h2>
                <p className="text-gray-600">No need for complex account numbers, just use usernames</p>
              </div>

              {/* Zero Fees Box */}
              <div className="bg-yellow-100 rounded-3xl p-6 flex flex-col items-center text-center">
                <Repeat className="w-12 h-12 text-yellow-600 mb-4" />
                <h2 className="text-xl font-bold mb-2">Zero Fees</h2>
                <p className="text-gray-600">Enjoy fee-free transactions within our network</p>
              </div>

              {/* Bank-Level Security Box */}
              <div className="bg-purple-100 rounded-3xl p-6 flex flex-col items-center text-center">
                <Shield className="w-12 h-12 text-purple-600 mb-4" />
                <h2 className="text-xl font-bold mb-2">Bank-Level Security</h2>
                <p className="text-gray-600">Your money and data are protected by advanced encryption</p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* <div>
              <h3 className="text-lg font-semibold mb-4">About WalletX</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">The Idea</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Products</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Personal</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Business</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Developers</a></li>
              </ul>
            </div> */}
            <div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-600"><Facebook /></a>
                <a href="#" className="text-gray-600 hover:text-blue-600"><Twitter /></a>
                <a href="#" className="text-gray-600 hover:text-blue-600"><Instagram /></a>
                <a href="#" className="text-gray-600 hover:text-blue-600"><Linkedin /></a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600">&copy; 2024 WalletX.</p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600">Developed By Aluko</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create Your WalletX</h2>
              <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input type="text" id="username" name="username" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" name="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Create Account
              </button>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button onClick={openLoginModal} className="text-blue-600 hover:text-blue-800 font-medium">
                    Login
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Login to WalletX</h2>
              <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="login-email" name="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="login-password" name="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Login
              </button>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button onClick={openRegisterModal} className="text-blue-600 hover:text-blue-800 font-medium">
                    Create account
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}