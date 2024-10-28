import { useEffect, useState } from 'react'
import { Send, Repeat, Shield, Users, Facebook, Twitter, Instagram, Linkedin, X, ChevronDown, ChevronUp, Star, DollarSign, CreditCard, PieChart, Settings, PlusCircle } from 'lucide-react'
import { Link } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification/Notification';

export default function LandingPage() {
    const navigate = useNavigate();
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

    // Add this at the top, right after useState and other imports
    const [registerData, setRegisterData] = useState({ fullName: '', username: '', email: '', password: '' });
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [token, setToken] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [name, setName] = useState<string | null>(null);


 // Handle register form submission
 const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
        // Send registration request
        const response = await fetch('https://walletx-server.vercel.app/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData),
        });

        const data = await response.json();

        if (response.ok) {
            setSuccessMessage('Account created successfully!');
            localStorage.setItem('token', data.token); // Save the token from the registration response

            // Fetch user profile after registration
            const userResponse = await fetch('https://walletx-server.vercel.app/api/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${data.token}`, // Use the token from registration
                },
            });

            const userData = await userResponse.json();

            if (userResponse.ok) {
                setName(userData.fullName); // Set the user name after fetching the profile
                navigate('/dashboard'); // Redirect to dashboard after success
            } else {
                setError('Failed to load user profile.');
            }
        } else {
            setError(data.message || 'Something went wrong');
        }
    } catch (error) {
        setError('Failed to register');
    }
};


// Handle login form submission
const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
        const response = await fetch('https://walletx-server.vercel.app/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (response.ok) {
            setToken(data.token);
            localStorage.setItem('token', data.token); // Save the token in localStorage
            setSuccessMessage('Login successful!');

            // Fetch user profile after login
            const userResponse = await fetch('https://walletx-server.vercel.app/api/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${data.token}`,
                },
            });

            const userData = await userResponse.json();

            if (userResponse.ok) {
                setName(userData.fullName); // Set the user name after fetching
                navigate('/dashboard'); // Redirect to dashboard after success
            } else {
                setError('Failed to load user profile.');
            }
        } else {
            setError(data.message || 'Invalid login credentials');
        }
    } catch (error) {
        setError('Failed to login');
    }
};


    // Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000); // Clear after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [successMessage]);


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
                            <Link to="features" smooth={true} duration={1500} className="text-gray-600 hover:text-gray-900 cursor-pointer">
                                Features
                            </Link>
                            <Link to="how" smooth={true} duration={1500} className="text-gray-600 hover:text-gray-900 cursor-pointer">
                                How It Works
                            </Link>
                            <Link to="cms" smooth={true} duration={1500} className="text-gray-600 hover:text-gray-900 cursor-pointer">
                                Testimonials
                            </Link>
                            <Link to="faq" smooth={true} duration={1500} className="text-gray-600 hover:text-gray-900 cursor-pointer">
                                FAQ
                            </Link>
                        </div>
                        <button onClick={openLoginModal} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                            Sign In
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
                        <div id="features">
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
                        </div>

                        {/* User Dashboard Preview */}
                        <section className="mt-32">
                            <h2 className="text-4xl font-bold text-center mb-12">Your Financial Hub at a Glance</h2>
                            <div className="bg-gray-100 rounded-lg p-4 md:p-8 shadow-lg">
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    {/* Dashboard Header */}
                                    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                                        <h3 className="text-xl font-bold">Welcome back, Alex!</h3>
                                        <div className="flex items-center space-x-4">
                                            <Settings className="w-6 h-6" />
                                        </div>
                                    </div>

                                    {/* Dashboard Content */}
                                    <div className="p-4 md:p-6">
                                        {/* Balance and Quick Actions */}
                                        <div className="flex flex-col items-center md:items-start md:flex-row justify-between mb-8">
                                            <div className="flex items-center mb-4 md:mb-0">
                                                <div className="text-center md:text-left">
                                                    <p className="text-gray-600">Total Balance</p>
                                                    <h4 className="text-2xl md:text-3xl font-bold">$2,450.35</h4>
                                                </div>
                                                <button className="ml-4 bg-blue-100 text-blue-600 p-2 rounded-full flex items-center" title="Add Money">
                                                    <PlusCircle className="w-6 h-6" />
                                                    <span className="sr-only">Add Money</span>
                                                </button>
                                            </div>
                                            <div className="flex space-x-4">
                                                <button className="bg-blue-100 text-blue-600 p-2 rounded-full" title="Send Money">
                                                    <Send className="w-6 h-6" />
                                                    <span className="sr-only">Send Money</span>
                                                </button>
                                                <button className="bg-green-100 text-green-600 p-2 rounded-full" title="Request Money">
                                                    <DollarSign className="w-6 h-6" />
                                                    <span className="sr-only">Request Money</span>
                                                </button>
                                                <button className="bg-purple-100 text-purple-600 p-2 rounded-full" title="Manage Cards">
                                                    <CreditCard className="w-6 h-6" />
                                                    <span className="sr-only">Manage Cards</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Recent Transactions */}
                                        <div className="mb-8">
                                            <h5 className="text-lg font-semibold mb-4">Recent Transactions</h5>
                                            <div className="space-y-4">
                                                {[
                                                    { name: "Sarah J.", amount: "-$45.00", date: "Today", type: "sent" },
                                                    { name: "Netflix", amount: "-$12.99", date: "Yesterday", type: "subscription" },
                                                    { name: "Payroll", amount: "+$2,500.00", date: "Mar 1", type: "received" },
                                                ].map((transaction, index) => (
                                                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'sent' ? 'bg-red-100 text-red-600' :
                                                                    transaction.type === 'received' ? 'bg-green-100 text-green-600' :
                                                                        'bg-blue-100 text-blue-600'
                                                                }`}>
                                                                {transaction.type === 'sent' && <Send className="w-5 h-5" />}
                                                                {transaction.type === 'received' && <DollarSign className="w-5 h-5" />}
                                                                {transaction.type === 'subscription' && <Repeat className="w-5 h-5" />}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{transaction.name}</p>
                                                                <p className="text-sm text-gray-500">{transaction.date}</p>
                                                            </div>
                                                        </div>
                                                        <p className={`font-medium ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                                            {transaction.amount}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Spending Overview */}
                                        <div>
                                            <h5 className="text-lg font-semibold mb-4">Spending Overview</h5>
                                            <div className="bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between">
                                                <PieChart className="w-16 h-16 text-blue-600 mb-4 md:mb-0" />
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                        <p className="text-sm">Food & Dining (35%)</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        <p className="text-sm">Transportation (25%)</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                        <p className="text-sm">Entertainment (20%)</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                                        <p className="text-sm">Others (20%)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* How It Works Section */}
                        <section className="mt-32" id="how">
                            <h2 className="text-4xl font-bold text-center mb-12">How WalletX Works</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-blue-100 rounded-full p-6 mb-4">
                                        <Users className="w-12 h-12 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">1. Create Your Account</h3>
                                    <p className="text-gray-600">Sign up with your email and choose a unique username</p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-green-100 rounded-full p-6 mb-4">
                                        <Send className="w-12 h-12 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">2. Send or Request Money</h3>
                                    <p className="text-gray-600">Enter a username and amount to transfer funds instantly</p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-purple-100 rounded-full p-6 mb-4">
                                        <Repeat className="w-12 h-12 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">3. Manage Your Finances</h3>
                                    <p className="text-gray-600">Track your transactions and balance in real-time</p>
                                </div>
                            </div>
                        </section>

                        {/* Customer Testimonials Section */}
                        <section className="mt-32" id="cms">
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
                                    <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                                        <div className="flex items-center mb-4">
                                            <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full mr-4" />
                                            <div>
                                                <h3 className="font-bold">{testimonial.name}</h3>
                                                <p className="text-gray-600 text-sm">{testimonial.role}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mb-4">{testimonial.comment}</p>
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
                                    <div key={index} className="border-b border-gray-200 pb-4">
                                        <button
                                            className="flex justify-between items-center w-full text-left"
                                            onClick={() => toggleFaq(index)}
                                        >
                                            <span className="text-lg font-medium">{faq.question}</span>
                                            {openFaqIndex === index ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500" />
                                            )}
                                        </button>
                                        {openFaqIndex === index && (
                                            <p className="mt-2 text-gray-600">{faq.answer}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-100 mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">About WalletX</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-600 hover:text-blue-600">Our Story</a></li>
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
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Connect</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-600 hover:text-blue-600"><Facebook /></a>
                                <a href="#" className="text-gray-600 hover:text-blue-600"><Twitter /></a>
                                <a href="#" className="text-gray-600 hover:text-blue-600"><Instagram /></a>
                                <a href="#" className="text-gray-600 hover:text-blue-600"><Linkedin /></a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-600">&copy; 2023 WalletX. All rights reserved.</p>
                        <div className="mt-4 md:mt-0 flex space-x-4">
                            <a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a>
                            <a href="#" className="text-gray-600 hover:text-blue-600">Terms of Service</a>
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
                        {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}
                        <form className="space-y-4" onSubmit={handleRegister}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                type="text"
                                id="name"
                                name="name"
                                value={registerData.fullName}
                                onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                type="email"
                                id="email"
                                name="email"
                                value={registerData.email}
                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            </div>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                type="text"
                                id="username"
                                name="username"
                                value={registerData.username}
                                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                type="password"
                                id="password"
                                name="password"
                                value={registerData.password}
                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            </div>
                            {error && <Notification message={error} type="error" />}
                            {successMessage && <Notification message={successMessage} type="success" />}
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
                        {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}
                        <form className="space-y-4" onSubmit={handleLogin}>
                            <div>
                                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                type="email"
                                id="login-email"
                                name="email"
                                value={loginData.email}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            </div>
                            <div>
                                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                type="password"
                                id="login-password"
                                name="password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            </div>
                            {error && <Notification message={error} type="error" />}
                            {successMessage && <Notification message={successMessage} type="success" />}
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