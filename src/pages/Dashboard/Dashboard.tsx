'use client'

import { useEffect, useState } from 'react'
import { Send, CreditCard, PieChart, Settings, PlusCircle, X, Download, LogOut, User, Lock, StickyNote, CoinsIcon, Repeat, ChevronDown, ArrowDownRight, ArrowUpRight, Sun, Moon, Eye, EyeOff, Loader } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function Dashboard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeModals, setActiveModals] = useState<string[]>([])
  const [isCopied, setIsCopied] = useState(false)
  const [name, setName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [username, setUsername] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [displayedTransactions, setDisplayedTransactions] = useState<any[]>([])
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: '', visible: false })
  const [recipient, setRecipient] = useState('')
  const [sendAmount, setSendAmount] = useState(0)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [inflow, setInflow] = useState(0)
  const [outflow, setOutflow] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showBalance, setShowBalance] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [pinError, setPinError] = useState<string | null>(null)
  const [hasPinSet, setHasPinSet] = useState(false)

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
        setHasPinSet(data.pin !== null)
      } else {
        const errorData = await response.json()
        showNotification(errorData.message, 'error')
      }
    } catch (error) {
      showNotification('Failed to fetch user data', 'error')
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
        showNotification(errorData.message, 'error')
      }
    } catch (error) {
      showNotification('Failed to fetch transaction history', 'error')
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
    setActiveModals(prevModals => [...prevModals, modalName])
  }

  const closeModal = () => {
    setActiveModals(prevModals => prevModals.slice(0, -1))
    setError(null)
    setPinError(null)
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
    setActiveModals([])
    setError(null)
    setPinError(null)
  }

  const handleAddMoney = async (amount: number) => {
    setIsLoading(true)
    const token = localStorage.getItem('token')
    if (!token) {
      showNotification('User not authenticated', 'error')
      setIsLoading(false)
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
        showNotification(errorData.message, 'error')
      }
    } catch (error) {
      showNotification('Failed to add money', 'error')
    }
    setIsLoading(false)
  }

  const handleSendMoney = async (recipientUsername: string, amount: number, pin: string) => {
    setIsLoading(true)
    const token = localStorage.getItem('token')
    if (!token) {
      showNotification('User not authenticated', 'error')
      setIsLoading(false)
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
        closeAllModals()
      } else {
        const errorData = await response.json()
        setPinError(errorData.message)
        setTimeout(() => setPinError(null), 5000)
      }
    } catch (error) {
      showNotification('Failed to send money', 'error')
    }
    setIsLoading(false)
  }

  const handlePinSubmit = async (pin: string) => {
    await handleSendMoney(recipient, sendAmount, pin)
  }

  const handleSetPin = async (newPin: string, confirmPin: string) => {
    setIsLoading(true)
    if (newPin !== confirmPin) {
      setError('PINs do not match')
      setTimeout(() => setError(null), 5000)
      setIsLoading(false)
      return false
    }

    const token = localStorage.getItem('token')
    if (!token) {
      showNotification('User not authenticated', 'error')
      setIsLoading(false)
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
        setHasPinSet(true) // Update: Set hasPinSet to true
        setNewPin('') // Clear newPin field
        setConfirmPin('') // Clear confirmPin field
        closeAllModals()
        setIsLoading(false)
        return true
      } else {
        const errorData = await response.json()
        setError(errorData.message)
        setTimeout(() => setError(null), 5000)
        setIsLoading(false)
        return false
      }
    } catch (error) {
      showNotification('Failed to set PIN', 'error')
      setIsLoading(false)
      return false
    }
  }

  const handleEditProfile = async (newFullName: string) => {
    setIsLoading(true)
    const token = localStorage.getItem('token')
    if (!token) {
      showNotification('User not authenticated', 'error')
      setIsLoading(false)
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
        showNotification(errorData.message, 'error')
      }
    } catch (error) {
      showNotification('Failed to update profile', 'error')
    }
    setIsLoading(false)
  }

  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const downloadTransactionHistory = () => {
    setIsLoading(true)
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
     // @ts-ignore
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
      didParseCell: function (data: { section: string; column: { index: number }; row: { raw: any[] }; cell: { styles: { textColor: number[] } } }) {
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
     // @ts-ignore
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
    setIsLoading(false)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {notification.visible && (
          <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white z-50`}>
            {notification.message}
          </div>
        )}
        <header className={`flex flex-row justify-between items-center gap-4 mb-6 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}> {/* Updated header class */}
          <div className="flex items-center gap-3">
            <img
              src={profilePicture || `https://via.placeholder.com/64x64.png?text=U`}
              alt="User's profile"
              className="w-10 h-10 rounded-full border-2 border-blue-500"
            />
            <h1 className="text-base sm:text-xl font-bold truncate"> {/* Updated text size and added truncate */} Welcome, {name || 'User'}</h1>
          </div>
          <div className="flex items-center gap-2"> {/* Reduced gap */}
            <button onClick={toggleTheme} className={`p-2 rounded-full ${isDarkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-white'}`}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={toggleSettings} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="space-y-6">
          <section className={`p-4 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Balance</p>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {showBalance ? formatter.format(balance) : '••••••'}
                    <button onClick={toggleBalanceVisibility} className="focus:outline-none">
                      {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </h2>
                </div>
                <button
                  onClick={() => openModal('addMoney')}
                  className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'} hover:bg-blue-200 transition-colors`}
                  title="Add Money"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => openModal('sendMoney')}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg ${isDarkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'} hover:bg-green-200 transition-colors`}
                  title="Send Money"
                >
                  <Send className="w-4 h-4 mb-1" />
                  <span className="text-xs">Send</span>
                </button>
                <button
                  onClick={() => openModal('requestMoney')}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg ${isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'} hover:bg-purple-200 transition-colors`}
                  title="Request Money"
                >
                  <Repeat className="w-4 h-4 mb-1" />
                  <span className="text-xs">Request</span>
                </button>
                <button
                  onClick={() => openModal('manageCards')}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'} hover:bg-indigo-200 transition-colors`}
                  title="Manage Cards"
                >
                  <CreditCard className="w-4 h-4 mb-1" />
                  <span className="text-xs">Cards</span>
                </button>
              </div>
            </div>
          </section>

          <section className={`p-4 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            <div className="space-y-4">
              {displayedTransactions.length > 0 ? (
                displayedTransactions.map((transaction: any, index: number) => (
                  <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.type === 'credit'
                          ? (isDarkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600')
                          : (isDarkMode ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600')
                        }`}>
                        {transaction.type === 'credit' ? <CoinsIcon className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.name}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{transaction.date}</p>
                      </div>
                    </div>
                    <p className={`font-medium text-sm ${transaction.type === 'credit'
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
                className={`mt-4 w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
              >
                Show More <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            )}
          </section>

          <section className={`p-4 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4">Cash Flow Overview</h3>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Inflow</p>
                <div className="flex items-center">
                  <ArrowUpRight className="w-5 h-5 text-green-500 mr-2" />
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{formatter.format(inflow)}</span>
                </div>
              </div>
              <div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Outflow</p>
                <div className="flex items-center">
                  <ArrowDownRight className="w-5 h-5 text-red-500 mr-2" />
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{formatter.format(outflow)}</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {(isSettingsOpen || activeModals.length > 0) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeAllModals}>
          {isSettingsOpen && (
            <div
              className={`absolute rounded-xl p-6 w-full max-w-xs sm:max-w-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 100,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Settings</h2>
                <button onClick={toggleSettings} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <button onClick={() => openModal('setPin')} className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}>
                  <Lock className="w-5 h-5 mr-3" /> {hasPinSet ? 'Update PIN' : 'Set PIN'}
                </button>
                <button onClick={() => openModal('downloadHistory')} className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}>
                  <Download className="w-5 h-5 mr-3" /> Download Transaction History
                </button>
                <button onClick={() => openModal('editProfile')} className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}>
                  <User className="w-5 h-5 mr-3" /> Edit Profile
                </button>
                <button onClick={handleLogout} className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}>
                  <LogOut className="w-5 h-5 mr-3" /> Logout
                </button>
              </div>
            </div>
          )}

          {activeModals.map((modalName, index) => (
            <div
              key={index}
              className={`absolute rounded-xl p-6 w-full max-w-xs sm:max-w-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
              style={{
                top: `${50 + index * 2}%`,
                left: '50%',
                transform: `translate(-50%, -50%)`,
                zIndex: 101 + index,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {modalName === 'setPin' && (hasPinSet ? 'Update PIN' : 'Set PIN')}
                  {modalName === 'addMoney' && 'Fund your Account'}
                  {modalName === 'sendMoney' && 'Send Money'}
                  {modalName === 'requestMoney' && 'Request Money'}
                  {modalName === 'manageCards' && 'Manage Cards'}
                  {modalName === 'downloadHistory' && 'Download Transaction History'}
                  {modalName === 'editProfile' && 'Edit Profile'}
                  {modalName === 'enterPin' && 'Enter PIN'}
                </h2>
                <button onClick={closeModal} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                {modalName === 'setPin' && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      const success = await handleSetPin(newPin, confirmPin)
                      if (success) {
                        closeModal()
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
                        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
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
                        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                          }`}
                        required
                      />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader className="w-5 h-5 animate-spin mr-2" /> : (hasPinSet ? 'Update PIN' : 'Set PIN')}
                    </button>
                  </form>
                )}

                {modalName === 'addMoney' && (
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
                        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                          }`}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader className="w-5 h-5 animate-spin mr-2" /> : 'Fund'}
                    </button>
                  </form>
                )}

                {modalName === 'sendMoney' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const recipient = (e.target as HTMLFormElement).recipient.value
                      const amount = parseFloat((e.target as HTMLFormElement).amount.value)
                      setRecipient(recipient)
                      setSendAmount(amount)
                      openModal('enterPin')
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="recipient" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Recipient</label>
                      <input
                        type="text"
                        id="recipient"
                        name="recipient"
                        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
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
                        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                          }`}
                        required
                      />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader className="w-5 h-5 animate-spin mr-2" /> : 'Continue to PIN'}
                    </button>
                  </form>
                )}

                {modalName === 'downloadHistory' && (
                  <div>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>Your transaction history will be downloaded as a PDF file.</p>
                    <button
                      onClick={downloadTransactionHistory}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader className="w-5 h-5 animate-spin mr-2" /> : 'Download'}
                    </button>
                  </div>
                )}

                {modalName === 'editProfile' && (
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
                        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
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
                        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                          } file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${isDarkMode ? 'file:bg-gray-600 file:text-white' : 'file:bg-blue-50 file:text-blue-700'
                          } hover:file:bg-blue-100`}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader className="w-5 h-5 animate-spin mr-2" /> : 'Save Changes'}
                    </button>
                  </form>
                )}

                {modalName === 'enterPin' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const enteredPin = (e.target as HTMLFormElement).pin.value
                      handlePinSubmit(enteredPin)
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="pin" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Enter your PIN</label>
                      <input
                        type="password"
                        id="pin"
                        name="pin"
                        maxLength={4}
                        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                          }`}
                        required
                      />
                    </div>
                    {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Sending {formatter.format(sendAmount)} to @{recipient}
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader className="w-5 h-5 animate-spin mr-2" /> : 'Confirm'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
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