'use client'

import { useState, useEffect } from 'react'
import { Send, Repeat, Shield, Users, Twitter, Linkedin, X, ChevronDown, ChevronUp, Star, Github, Globe, Sun, Moon, Loader, Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-scroll'
import { useNavigate } from 'react-router-dom'
import Notification from '../../components/Notification/Notification'

export default function LandingPage() {
    const navigate = useNavigate()
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
    const [registerData, setRegisterData] = useState({ fullName: '', username: '', email: '', password: '', confirmPassword: '' })
    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showLoginPassword, setShowLoginPassword] = useState(false)

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        setIsDarkMode(savedTheme === 'dark')
    }, [])

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode)
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    }, [isDarkMode])

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode)
    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')
        setIsLoading(true)

        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }

        if (registerData.password.length < 8) {
            setError('Password must be at least 8 characters long')
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch('https://walletx-server.vercel.app/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccessMessage('Account created successfully!')
                localStorage.setItem('token', data.token)
                navigate('/dashboard')
            } else {
                setError(data.message || 'Something went wrong')
            }
        } catch (error) {
            setError('Failed to register')
        }

        setIsLoading(false)
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')
        setIsLoading(true)

        try {
            const response = await fetch('https://walletx-server.vercel.app/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('token', data.token)
                setSuccessMessage('Login successful!')
                navigate('/dashboard')
            } else {
                setError(data.message || 'Invalid login credentials')
            }
        } catch (error) {
            setError('Failed to login')
        }

        setIsLoading(false)
    }

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('')
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [successMessage])

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

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index)
    }

    return (
        <div className={`min-h-screen font-sans flex flex-col ${isDarkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
            <div className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Navigation */}
                    <nav className="flex items-center justify-between py-6">
                        <div className="flex items-center">
                            <div className="text-blue-600 font-bold text-2xl mr-2">●</div>
                            <span className="font-bold text-xl">WalletX</span>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            <Link to="features" smooth={true} duration={1500} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                                Features
                            </Link>
                            <Link to="how" smooth={true} duration={1500} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                                How It Works
                            </Link>
                            <Link to="testimonials" smooth={true} duration={1500} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                                Testimonials
                            </Link>
                            <Link to="faq" smooth={true} duration={1500} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                                FAQ
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <button onClick={openLoginModal} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                Sign In
                            </button>
                        </div>
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
                            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                                WalletX makes financial transactions as easy as sending a message.<br />No account numbers, just usernames.
                            </p>
                            <button onClick={openRegisterModal} className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-medium">
                                Create Your WalletX
                            </button>
                        </div>

                        {/* Feature Boxes */}
                        <div id="features">
                            <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Instant Transfers Box */}
                                <div className="bg-blue-100 dark:bg-blue-900 rounded-3xl p-6 flex flex-col items-center text-center">
                                    <Send className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                                    <h2 className="text-xl font-bold mb-2">Instant Transfers</h2>
                                    <p className="text-gray-700 dark:text-gray-300">Send money in seconds, anytime, anywhere</p>
                                </div>

                                {/* Username Payments Box */}
                                <div className="bg-green-100 dark:bg-green-900 rounded-3xl p-6 flex flex-col items-center text-center">
                                    <Users className="w-12 h-12 text-green-600 dark:text-green-400 mb-4" />
                                    <h2 className="text-xl font-bold mb-2">Username Payments</h2>
                                    <p className="text-gray-700 dark:text-gray-300">No need for complex account numbers, just use usernames</p>
                                </div>

                                {/* Zero Fees Box */}
                                <div className="bg-yellow-100 dark:bg-yellow-900 rounded-3xl p-6 flex flex-col items-center text-center">
                                    <Repeat className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mb-4" />
                                    <h2 className="text-xl font-bold mb-2">Zero Fees</h2>
                                    <p className="text-gray-700 dark:text-gray-300">Enjoy fee-free transactions within our network</p>
                                </div>

                                {/* Bank-Level Security Box */}
                                <div className="bg-purple-100 dark:bg-purple-900 rounded-3xl p-6 flex flex-col items-center text-center">
                                    <Shield className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-4" />
                                    <h2 className="text-xl font-bold mb-2">Bank-Level Security</h2>
                                    <p className="text-gray-700 dark:text-gray-300">Your money and data are protected by advanced encryption</p>
                                </div>
                            </div>
                        </div>

                        {/* How It Works Section */}
                        <section className="mt-32" id="how">
                            <h2 className="text-4xl font-bold text-center mb-12">How WalletX Works</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-6 mb-4">
                                        <Users className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">1. Create Your Account</h3>
                                    <p className="text-gray-700 dark:text-gray-300">Sign up with your email and choose a unique username</p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-green-100 dark:bg-green-900 rounded-full p-6 mb-4">
                                        <Send className="w-12 h-12 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">2. Send or Request Money</h3>
                                    <p className="text-gray-700 dark:text-gray-300">Enter a username and amount to transfer funds instantly</p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-6 mb-4">
                                        <Repeat className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">3. Manage Your Finances</h3>
                                    <p className="text-gray-700 dark:text-gray-300">Track your transactions and balance in real-time</p>
                                </div>
                            </div>
                        </section>

                        {/* Customer Testimonials Section */}
                        <section className="mt-32" id="testimonials">
                            <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    {
                                        name: "Sarah Johnson",
                                        role: "Freelance Designer",
                                        comment: "WalletX has revolutionized how I receive payments from clients. It's so quick and easy!",
                                        avatar: "https://via.placeholder.com/64x64.png?text=SJ"
                                    },
                                    {
                                        name: "Michael Chen",
                                        role: "Small Business Owner",
                                        comment: "The ability to send money instantly to my suppliers has greatly improved my cash flow management.",
                                        avatar: "https://via.placeholder.com/64x64.png?text=MC"
                                    },
                                    {
                                        name: "Emily Rodriguez",
                                        role: "Student",
                                        comment: "Splitting bills with roommates is a breeze now. No more awkward conversations about who owes what!",
                                        avatar: "https://via.placeholder.com/64x64.png?text=ER"
                                    }
                                ].map((testimonial, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                                        <div className="flex items-center mb-4">
                                            <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full mr-4" />
                                            <div>
                                                <h3 className="font-bold">{testimonial.name}</h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.role}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4">{testimonial.comment}</p>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Partners and Integrations Section */}
                        <section className="mt-32">
                            <h2 className="text-4xl font-bold text-center mb-12">Our Partners and Integrations</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {['Partner1', 'Partner2', 'Partner3', 'Partner4', 'Partner5', 'Partner6', 'Partner7', 'Partner8'].map((partner, index) => (
                                    <div key={index} className="flex items-center justify-center">
                                        <img src={`https://via.placeholder.com/160x80.png?text=${partner}`} alt={partner} className="max-w-full h-auto" />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section className="mt-32" id="faq">
                            <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {[
                                    {
                                        question: "How secure is WalletX?",
                                        answer: "WalletX uses bank-level encryption and security measures to protect your data and transactions. We employ multi-factor authentication, end-to-end encryption, and regular security audits to ensure your money and personal information are always safe."
                                    },
                                    {
                                        question: "Are there any fees for using WalletX?",
                                        answer: "Transactions within the WalletX network are completely free. There may be small fees for certain external transfers or currency conversions. We always display any applicable fees upfront before you confirm a transaction."
                                    },
                                    {
                                        question: "How quickly are transfers processed?",
                                        answer: "Transfers between WalletX users are instant, allowing you to send and receive money in seconds. External transfers to bank accounts typically take 1-3 business days, depending on the receiving bank's processing times."
                                    },
                                    {
                                        question: "Can I use WalletX internationally?",
                                        answer: "Yes, WalletX supports international transfers to many countries. We offer competitive exchange rates and clearly display any associated fees. Check our supported countries list in the app or on our website for specific details about international usage."
                                    },
                                    {
                                        question: "What if I forget my password or username?",
                                        answer: "If you forget your password, you can easily reset it through our secure password recovery process. For forgotten usernames, you can recover your account using the email address associated with your WalletX account. Our customer support team is also available to assist you with account recovery if needed."
                                    }
                                ].map((faq, index) => (
                                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                        <button
                                            className="flex justify-between items-center w-full text-left"
                                            onClick={() => toggleFaq(index)}
                                        >
                                            <span className="text-lg font-medium">{faq.question}</span>
                                            {openFaqIndex === index ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                            )}
                                        </button>
                                        {openFaqIndex === index && (
                                            <p className="mt-2 text-gray-700 dark:text-gray-300">{faq.answer}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-100 dark:bg-gray-800 mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">About WalletX</h3>
                            <p className="text-gray-600 dark:text-gray-400">Revolutionizing digital payments with simplicity and security.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                            <div className="flex space-x-4">
                                <a href="https://github.com/AyomiCoder" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" target='blank'><Github /></a>
                                <a href="https://x.com/ayomicoder" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" target='blank'><Twitter /></a>
                                <a href="https://ayaluko.vercel.app" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" target='blank'><Globe /></a>
                                <a href="https://www.linkedin.com/in/ayomidealuko" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" target='blank'><Linkedin /></a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-600 dark:text-gray-400">&copy; 2024 WalletX. V2.</p>
                        <div className="mt-4 md:mt-0">
                            <a href="mailto:alukoayomide623@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Contact Dev</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Register Modal */}
            {isRegisterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Create Your WalletX</h2>
                            <button onClick={closeModals} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form className="space-y-4" onSubmit={handleRegister}>
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                                    value={registerData.fullName}
                                    onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                                    value={registerData.username}
                                    onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white pr-10"
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                                />
                                <button
                                    type="button"
                                    className="absolute top-[2.15rem] right-3 flex items-center text-sm"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
                                </button>
                            </div>
                            <div className="relative">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white pr-10"
                                    value={registerData.confirmPassword}
                                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                                />
                                <button
                                    type="button"
                                    className="absolute top-[2.15rem] right-3 flex items-center text-sm"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Login Modal */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Sign In to WalletX</h2>
                            <button onClick={closeModals} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <form className="space-y-4" onSubmit={handleLogin}>
                            <div>
                                <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    id="loginEmail"
                                    name="email"
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <input
                                    type={showLoginPassword ? "text" : "password"}
                                    id="loginPassword"
                                    name="password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white pr-10"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                />
                                <button
                                    type="button"
                                    className="absolute top-[2.15rem] right-3 flex items-center text-sm"
                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                >
                                    {showLoginPassword ? <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Notifications */}
            {(error || successMessage) && (
                <div className="fixed bottom-5 right-5 z-50">
                    {error && <Notification message={error} type="error" />}
                    {successMessage && <Notification message={successMessage} type="success" />}
                </div>
            )}
        </div>
    )
}