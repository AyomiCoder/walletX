'use client'

import { useEffect, useState } from 'react'
import { Send, CreditCard, PieChart, Settings, PlusCircle, X, Download, LogOut, User, Lock, StickyNote, CoinsIcon, Repeat, ChevronDown, ArrowDownRight, ArrowUpRight, Sun, Moon, Eye, EyeOff } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function Dashboard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [name, setName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [username, setUsername] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [displayedTransactions, setDisplayedTransactions] = useState<any[]>([])
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: '', visible: false })
  const [pinModalOpen, setPinModalOpen] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [sendAmount, setSendAmount] = useState(0)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [inflow, setInflow] = useState(0)
  const [outflow, setOutflow] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showBalance, setShowBalance] = useState(true)

  useEffect(() => {
    fetchUserData()
    fetchTransactionHistory()
  }, [])

  useEffect(() => {
    setDisplayedTransactions(showAllTransactions ? transactions : transactions.slice(0, 7))
    calculateCashFlow()
  }, [transactions, showAllTransactions])

  const fetchUserData = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('User not authenticated')
      return
    }

    try {
      const response = await fetch('https://walletx-server.vercel.app/api/auth/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setName(data.fullName)
        setUsername(data.username)
        setBalance(data.balance)
        setProfilePicture(data.profilePicture)
      } else {
        const errorData = await response.json()
        setError(errorData.message)
      }
    } catch (error) {
      setError('Failed to fetch user data')
    }
  }

  const fetchTransactionHistory = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('User not authenticated')
      return
    }

    try {
      const response = await fetch('https://walletx-server.vercel.app/api/auth/transaction-history', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const formattedTransactions = data.map((transaction: { type: string; description: any; createdAt: string | number | Date; amount: number | string }) => {
          const parsedAmount = parseFloat(transaction.amount.toString())
          return {
            type: transaction.type,
            name: transaction.description,
            date: new Date(transaction.createdAt).toLocaleString(),
            amount: parsedAmount
          }
        })
        .sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setTransactions(formattedTransactions)
      } else {
        const errorData = await response.json()
        setError(errorData.message)
      }
    } catch (error) {
      setError('Failed to fetch transaction history')
    }
  }

  const calculateCashFlow = () => {
    let totalInflow = 0
    let totalOutflow = 0
    transactions.forEach(transaction => {
      if (transaction.type === 'credit') {
        totalInflow += transaction.amount
      } else {
        totalOutflow += transaction.amount
      }
    })
    setInflow(totalInflow)
    setOutflow(totalOutflow)
  }

  const handleCopy = () => {
    if (username) {
      navigator.clipboard.writeText(username)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 3000)
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
    localStorage.removeItem('token')
    window.location.href = './'
  }

  const showNotification = (message: string, type: string) => {
    setNotification({ message, type, visible: true })
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }

  const closeAllModals = () => {
    setIsSettingsOpen(false)
    setActiveModal(null)
    setPinModalOpen(false)
  }

  const handleAddMoney = async (amount: number) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('User not authenticated')
      return
    }

    try {
      const response = await fetch('https://walletx-server.vercel.app/api/auth/fund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      })

      if (response.ok) {
        const data = await response.json()
        setBalance(data.newBalance)
        showNotification('Wallet funded successfully!', 'success')
        fetchTransactionHistory()
        closeModal()
      } else {
        const errorData = await response.json()
        setError(errorData.message)
      }
    } catch (error) {
      setError('Failed to add money')
    }
  }

  const handleSendMoney = async (recipientUsername: string, amount: number, pin: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('User not authenticated')
      return
    }

    try {
      const response = await fetch('https://walletx-server.vercel.app/api/auth/send-money', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          recipientUsername, 
          amount, 
          pin: parseInt(pin, 10) 
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setBalance(data.newBalance)
        showNotification(data.message, 'success')
        fetchTransactionHistory()
        closeModal()
      } else {
        const errorData = await response.json()
        setError(errorData.message)
      }
    } catch (error) {
      setError('Failed to send money')
    }
  }

  const handlePinSubmit = async (pin: string) => {
    await handleSendMoney(recipient, sendAmount, pin)
    setPinModalOpen(false)
  }

  const handleSetPin = async (newPin: string, confirmPin: string) => {
    if (newPin !== confirmPin) {
      setError('PINs do not match')
      return false
    }

    const token = localStorage.getItem('token')
    if (!token) {
      setError('User not authenticated')
      return false
    }

    try {
      const response = await fetch('https://walletx-server.vercel.app/api/auth/set-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pin: newPin }),
      })

      if (response.ok) {
        showNotification('PIN set successfully!', 'success')
        closeAllModals()
        return true
      } else {
        const errorData = await response.json()
        setError(errorData.message)
        return false
      }
    } catch (error) {
      setError('Failed to set PIN')
      return false
    }
  }

  const handleEditProfile = async (newFullName: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('User not authenticated')
      return
    }

    const formData = new FormData()
    formData.append('fullName', newFullName)
    
    const fileInput = document.querySelector<HTMLInputElement>('#profilePicture')
    const file = fileInput?.files?.[0]
    if (file) {
      formData.append('profilePicture', file)
    }

    try {
      const response = await fetch('https://walletx-server.vercel.app/api/auth/edit-profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setName(data.fullName)
        if (data.profilePicture) {
          setProfilePicture(data.profilePicture)
        }
        showNotification('Profile updated successfully!', 'success')
        closeAllModals()
      } else {
        const errorData = await response.json()
        setError(errorData.message)
      }
    } catch (error) {
      setError('Failed to update profile')
    }
  }

  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const downloadTransactionHistory = () => {
    const doc = new jsPDF()
    
    // Format amount helper function
    const formatAmount = (amount: number) => {
      return `NGN ${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    }
    
    // Set font styles
    doc.setFont("helvetica", "bold")
    doc.setFontSize(20)
    doc.setTextColor(44, 62, 80)
    
    // Add logo/header
    doc.text("WalletX", 14, 15)
    
    // Add user info section
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(52, 73, 94)
    
    // Add user profile picture if available
    if (profilePicture) {
      try {
        doc.addImage(profilePicture, 'JPEG', 14, 25, 20, 20)
      } catch (error) {
        console.error('Failed to add profile picture to PDF:', error)
      }
    }
    
    // Add user details
    const userInfoX = profilePicture ? 40 : 14
    doc.setFont("helvetica", "bold")
    doc.text(`Account Holder: ${name || 'N/A'}`, userInfoX, 30)
    doc.setFont("helvetica", "normal")
  
    // Find the first credit transaction for opening balance
    const firstCredit = [...transactions]
      .reverse()
      .find(t => t.type === 'credit')
  
    const openingBalance = firstCredit ? firstCredit.amount : 0
    doc.text(`Opening Balance: ${formatAmount(openingBalance)}`, userInfoX, 37)
    doc.text(`Current Balance: ${formatAmount(balance)}`, userInfoX, 44)
    
    // Add statement details
    doc.setDrawColor(41, 128, 185)
    doc.setLineWidth(0.5)
    doc.line(14, 55, 196, 55)
    
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 60)
    
    // Prepare transaction data
    const tableColumn = ["Type", "Description", "Date", "Amount"]
    const tableRows = transactions.map(transaction => [
      transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
      transaction.name,
      transaction.date,
      formatAmount(transaction.amount)
    ])
    
    // Add transaction table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 70,
      styles: { 
        font: "helvetica",
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.1,
        minCellHeight: 10,
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 25, halign: 'left' },
        1: { cellWidth: 60, halign: 'left' },
        2: { cellWidth: 45, halign: 'center' },
        3: { 
          cellWidth: 45, 
          halign: 'right',
          fontStyle: "normal",
          fontSize: 9
        }
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        font: "helvetica"
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255]
      },
      bodyStyles: {
        textColor: [52, 73, 94]
      },
      // Color coding for transactions
      didParseCell: function(data: { section: string; column: { index: number }; row: { raw: any[] }; cell: { styles: { textColor: number[] } } }) {
        if (data.section === 'body' && data.column.index === 3) {
          const transactionType = data.row.raw[0]
          if (transactionType === 'Debit') {
            data.cell.styles.textColor = [192, 0, 0] // Darker red for better readability
          } else if (transactionType === 'Credit') {
            data.cell.styles.textColor = [0, 128, 0] // Darker green for better readability
          }
        }
      },
      margin: { left: 14, right: 14 },
      tableWidth: 'auto'
    })
    
    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFontSize(8)
    doc.setTextColor(127, 140, 141)
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      const pageSize = doc.internal.pageSize
      const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth()
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
      doc.text(
        `Page ${i} of ${pageCount} | This is an auto-generated statement from WalletX`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    }
    
    // Save the PDF
    doc.save(`${name || 'user'}_transaction_history.pdf`)
    closeAllModals()
    showNotification('Transaction history downloaded!', 'success')
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notification.visible && (
          <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {notification.message}
          </div>
        )}
        <header className={`flex justify-between items-center mb-8 p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center space-x-4">
            <img
              src={profilePicture || `https://via.placeholder.com/64x64.png?text=U`}
              alt="User's profile"
              className="w-12 h-12 rounded-full border-2 border-blue-500"
            />
            <h1 className="text-2xl font-bold">Welcome, {name || 'User'}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className={`p-2 rounded-full ${isDarkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-white'}`}>
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            <button onClick={toggleSettings} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="space-y-8">
          <section className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0 flex items-center">
                <div className="text-center md:text-left mr-4">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Balance</p>
                  <h2 className="text-3xl font-bold flex items-center">
                    {showBalance ? formatter.format(balance) : '••••••'}
                    <button onClick={toggleBalanceVisibility} className="ml-2">
                      {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </h2>
                </div>
                <button
                  onClick={() => openModal('addMoney')}
                  className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'} hover:bg-blue-200 transition-colors`}
                  title="Add Money"
                >
                  <PlusCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => openModal('sendMoney')}
                  className={`p-2 rounded-full ${isDarkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'} hover:bg-green-200 transition-colors`}
                  title="Send Money"
                >
                  <Send className="w-6 h-6" />
                </button>
                <button
                  onClick={() => openModal('requestMoney')}
                  className={`p-2 rounded-full ${isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'} hover:bg-purple-200 transition-colors`}
                  title="Request Money"
                >
                  <Repeat className="w-6 h-6" />
                </button>
                <button
                  onClick={() => openModal('manageCards')}
                  className={`p-2 rounded-full ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'} hover:bg-indigo-200 transition-colors`}
                  title="Manage Cards"
                >
                  <CreditCard className="w-6 h-6" />
                </button>
              </div>
            </div>
          </section>

          <section className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            <div className="space-y-4">
              {displayedTransactions.length > 0 ? (
                displayedTransactions.map((transaction: any, index: number) => (
                  <div key={index} className={`flex justify-between items-center p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' 
                          ? (isDarkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600')
                          : (isDarkMode ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600')
                      }`}>
                        {transaction.type === 'credit' ? <CoinsIcon className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.name}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{transaction.date}</p>
                      </div>
                    </div>
                    <p className={`font-medium ${
                      transaction.type === 'credit'
                        ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                        : (isDarkMode ? 'text-red-400' : 'text-red-600')
                    }`}>
                      {formatter.format(transaction.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No transactions available.</p>
              )}
            </div>
            {!showAllTransactions && transactions.length > 7 && (
              <button
                onClick={() => setShowAllTransactions(true)}
                className={`mt-4 w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                Show More <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            )}
          </section>

          <section className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4">Cash Flow Overview</h3>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Inflow</p>
                <div className="flex items-center">
                  <ArrowUpRight className="w-6 h-6 text-green-500 mr-2" />
                  <span className={`text-2xl font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{formatter.format(inflow)}</span>
                </div>
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Outflow</p>
                <div className="flex items-center">
                  <ArrowDownRight className="w-6 h-6 text-red-500 mr-2" />
                  <span className={`text-2xl font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{formatter.format(outflow)}</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 w-96 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              <button onClick={toggleSettings} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <button onClick={() => openModal('setPin')} className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                <Lock className="w-5 h-5 mr-3" /> Set PIN
              </button>
              <button onClick={() => openModal('downloadHistory')} className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                <Download className="w-5 h-5 mr-3" /> Download Transaction History
              </button>
              <button onClick={() => openModal('editProfile')} className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                <User className="w-5 h-5 mr-3" /> Edit Profile
              </button>
              <button onClick={handleLogout} className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                <LogOut className="w-5 h-5 mr-3" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {activeModal === 'addMoney' && 'Fund your Account'}
                {activeModal === 'sendMoney' && 'Send Money'}
                {activeModal === 'requestMoney' && 'Request Money'}
                {activeModal === 'manageCards' && 'Manage Cards'}
                {activeModal === 'setPin' && 'Set PIN'}
                {activeModal === 'downloadHistory' && 'Download Transaction History'}
                {activeModal === 'editProfile' && 'Edit Profile'}
              </h2>
              <button onClick={closeModal} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-6">
              {activeModal === 'setPin' && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const success = await handleSetPin(newPin, confirmPin)
                    if (success) {
                      closeModal()
                      setIsSettingsOpen(false)
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="newPin" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>New PIN</label>
                    <input
                      type="password"
                      id="newPin"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPin" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm PIN</label>
                    <input
                      type="password"
                      id="confirmPin"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Set PIN
                  </button>
                </form>
              )}

              {activeModal === 'addMoney' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const amount = parseFloat((e.target as HTMLFormElement).amount.value)
                    handleAddMoney(amount)
                  }}
                  className="space-y-4"
                >
                  <div className={`flex justify-between items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>@{username || 'username'}</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center text-blue-500 text-sm focus:outline-none hover:text-blue-600"
                    >
                      <StickyNote className="w-5 h-5 mr-1" />
                      Copy
                    </button>
                  </div>
                  <div>
                    <label htmlFor="amount" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Amount</label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Fund
                  </button>
                </form>
              )}

              {activeModal === 'sendMoney' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const recipient = (e.target as HTMLFormElement).recipient.value
                    const amount = parseFloat((e.target as HTMLFormElement).amount.value)
                    setRecipient(recipient)
                    setSendAmount(amount)
                    setPinModalOpen(true)
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="recipient" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Recipient</label>
                    <input 
                      type="text" 
                      id="recipient" 
                      name="recipient" 
                      className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                      }`}
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="amount" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Amount</label>
                    <input 
                      type="number" 
                      id="amount" 
                      name="amount" 
                      className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                      }`}
                      required 
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Send Money
                  </button>
                </form>
              )}

              {activeModal === 'downloadHistory' && (
                <div>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>Your transaction history will be downloaded as a PDF file.</p>
                  <button
                    onClick={downloadTransactionHistory}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Download
                  </button>
                </div>
              )}

              {activeModal === 'editProfile' && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const newFullName = (e.target as HTMLFormElement).fullName.value
                    await handleEditProfile(newFullName)
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="fullName" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      defaultValue={name || ''}
                      className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="profilePicture" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Profile Picture</label>
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      accept="image/*"
                      className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                      } file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${
                        isDarkMode ? 'file:bg-gray-600 file:text-white' : 'file:bg-blue-50 file:text-blue-700'
                      } hover:file:bg-blue-100`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {pinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 w-full max-w-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">Enter PIN</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const enteredPin = (e.target as HTMLFormElement).pin.value
              handlePinSubmit(enteredPin)
            }} className="space-y-4">
              <input
                type="password"
                name="pin"
                placeholder="Enter your PIN"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                }`}
                required
              />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}

      {isCopied && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
          Username copied successfully!
        </div>
      )}
    </div>
  )
}