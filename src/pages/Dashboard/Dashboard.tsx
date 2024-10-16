import { useEffect, useState } from 'react'
import { Send, DollarSign, CreditCard, PieChart, Settings, PlusCircle, X, Download, LogOut, User, Lock, StickyNote } from 'lucide-react'


export default function Dashboard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [name, setName] = useState<string | null>(null); // State to hold user name
  const [error, setError] = useState<string | null>(null); // 
  const [pin, setPin] = useState<string | null>(null); // PIN state
  const [balance, setBalance] = useState<number>(0);
  const [username, setUsername] = useState<string | null>(null);
  const [isPinSetSuccess, setIsPinSetSuccess] = useState(false);
  const [isFundSuccess, setIsFundSuccess] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });



  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        setError('User not authenticated');
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setName(data.fullName); // Set user name
          setUsername(data.username);
          setBalance(data.balance);
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (error) {
        setError('Failed to fetch user data');
      }
    };

    fetchUserData(); // Call the function
  }, []); // Empty dependency array to run only on mount

  const handleCopy = () => {
    if (username) {
      navigator.clipboard.writeText(username); // Copy the dynamic username
      setIsCopied(true); // Show notification
      setTimeout(() => setIsCopied(false), 3000); // Hide notification after 3 seconds
    }
  }

  const openModal = (modalName: string) => {
    setActiveModal(modalName)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setName(null)
    window.location.href = './';
  }

  // Function to show notification
  const showNotification = (message: string, type: string) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Modify the handleAddMoney function
  const handleAddMoney = async (amount: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/fund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.newBalance); // Update balance based on the backend response
        showNotification('Wallet funded successfully!', 'success');
        closeModal(); // Close modal after success
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError('Failed to add money');
    }
  };


  const handleSetPin = async (newPin: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated');
      return false; // Indicate failure
    }
  
    try {
      const response = await fetch('http://localhost:8080/api/auth/set-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pin: newPin }),
      });
  
      if (response.ok) {
        showNotification('PIN set successfully!', 'success');
        return true; // Indicate success
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        return false; // Indicate failure
      }
    } catch (error) {
      setError('Failed to set PIN');
      return false; // Indicate failure
    }
  };
  

  function closeSettings() {
    throw new Error('Function not implemented.')
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {notification.visible && (
          <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${notification.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {notification.message}
          </div>
        )}
        {/* Dashboard Header */}
        <div className="bg-white text-gray-800 p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/64x64.png?text=AL"
              alt="Alex's profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <h1 className="text-xl font-bold">🙋🏽‍♂️Hi, {name || 'User'}</h1>
          </div>
          <button onClick={toggleSettings} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 md:p-6">
          {/* Balance and Quick Actions */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="text-center md:text-left mr-4">
                <p className="text-gray-600">Total Balance</p>
                <h2 className="text-3xl font-bold">${balance.toFixed(2)}</h2>
              </div>
              <button
                onClick={() => openModal('addMoney')}
                className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition-colors"
                title="Add Money"
              >
                <PlusCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => openModal('sendMoney')}
                className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition-colors"
                title="Send Money"
              >
                <Send className="w-6 h-6" />
              </button>
              <button
                onClick={() => openModal('requestMoney')}
                className="bg-green-100 text-green-600 p-2 rounded-full hover:bg-green-200 transition-colors"
                title="Request Money"
              >
                <DollarSign className="w-6 h-6" />
              </button>
              <button
                onClick={() => openModal('manageCards')}
                className="bg-purple-100 text-purple-600 p-2 rounded-full hover:bg-purple-200 transition-colors"
                title="Manage Cards"
              >
                <CreditCard className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
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
                      {transaction.type === 'subscription' && <CreditCard className="w-5 h-5" />}
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
            <h3 className="text-lg font-semibold mb-4">Spending Overview</h3>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between">
              <PieChart className="w-32 h-32 text-blue-600 mb-4 md:mb-0" />
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

      {/* Settings Popup */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Settings</h2>
              <button onClick={toggleSettings} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <button onClick={() => openModal('setPin')} className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center">
                <Lock className="w-5 h-5 mr-2" /> Set PIN
              </button>
              <button onClick={() => openModal('downloadHistory')} className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center">
                <Download className="w-5 h-5 mr-2" /> Download Transaction History
              </button>
              <button onClick={() => openModal('editProfile')} className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center">
                <User className="w-5 h-5 mr-2" /> Edit Profile
              </button>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded flex items-center">
                <LogOut className="w-5 h-5 mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {activeModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4"> {/* Responsive width and margin */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {activeModal === 'addMoney' && 'Fund your Account'}
          {activeModal === 'sendMoney' && 'Send Money'}
          {activeModal === 'requestMoney' && 'Request Money'}
          {activeModal === 'manageCards' && 'Manage Cards'}
          {activeModal === 'setPin' && 'Set PIN'}
          {activeModal === 'downloadHistory' && 'Download Transaction History'}
          {activeModal === 'editProfile' && 'Edit Profile'}
          {activeModal === 'logout' && 'Logout'}
        </h2>
        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        {activeModal === 'setPin' && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const newPin = (e.target as HTMLFormElement).pin.value;
              const success = await handleSetPin(newPin);
              if (success) {
                closeModal(); // Close both modals
                closeSettings(); // Close the settings modal if it's open
              }
            }}
            className="space-y-4"
          >
            <label htmlFor="pin" className="block text-sm font-medium text-gray-700">Set PIN</label>
            <input
              type="password"
              id="pin"
              name="pin"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md">
              Set PIN
            </button>
            {error && (
              <div className="mt-4 p-2 bg-red-100 text-red-600 rounded">
                {error}
              </div>
            )}
          </form>
        )}

        {activeModal === 'addMoney' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const amount = parseFloat((e.target as HTMLFormElement).amount.value);
              handleAddMoney(amount);
              closeModal(); // Close modal after success
            }}
            className="space-y-4"
          >
            {/* Username Display with Copy Icon */}
            <div className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-700">@{username || 'username'}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center text-blue-600 text-sm focus:outline-none"
              >
                <StickyNote className="w-5 h-5 mr-1 hover:animate-pulse" />
                Copy
              </button>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Fund
            </button>
            {error && (
              <div className="mt-4 p-2 bg-red-100 text-red-600 rounded">
                {error}
              </div>
            )}
          </form>
        )}

        {/* Custom Notification */}
        {isCopied && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md">
            Username copied successfully!
          </div>
        )}

        {activeModal === 'sendMoney' && (
          <form className="space-y-4">
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">Recipient</label>
              <input type="text" id="recipient" name="recipient" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" id="amount" name="amount" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Send Money
            </button>
          </form>
        )}
        {/* Add similar form structures for other modal types */}
      </div>
    </div>
  </div>
)}

    </div>
  )
}