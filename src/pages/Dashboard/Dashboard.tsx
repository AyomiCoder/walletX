import { useEffect, useState } from 'react'
import { Send, CreditCard, Settings, PlusCircle, X, Download, LogOut, User, Lock, StickyNote, CoinsIcon, Repeat, ChevronDown, ArrowDownRight, ArrowUpRight } from 'lucide-react'
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
          // console.log(`Parsed amount for ${transaction.description}: ${parsedAmount}`)
          return {
            type: transaction.type,
            name: transaction.description,
            date: new Date(transaction.createdAt).toLocaleString(),
            amount: parsedAmount
          }
        })
          .sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // console.log('Formatted transactions:', formattedTransactions)
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
  });

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
  }


  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {notification.visible && (
          <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${notification.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {notification.message}
          </div>
        )}
        <div className="bg-white text-gray-800 p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-4">
            <img
              src={profilePicture || `https://via.placeholder.com/64x64.png?text=U`}
              alt="User's profile"
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

        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="text-center md:text-left mr-4">
                <p className="text-gray-600">Total Balance</p>
                <h2 className="text-3xl font-bold">{formatter.format(balance)}</h2>
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
                <Repeat className="w-6 h-6" />
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

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            <div className="space-y-4">
              {displayedTransactions.length > 0 ? (
                displayedTransactions.map((transaction: any, index: number) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {transaction.type === 'credit' ? <CoinsIcon className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.name}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <p className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatter.format(transaction.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No transactions available.</p>
              )}
            </div>
            {!showAllTransactions && transactions.length > 7 && (
              <button
                onClick={() => setShowAllTransactions(true)}
                className="mt-4 w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                Show More <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Cash Flow Overview</h3>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
                <p className="text-sm text-gray-600 mb-1">Total Inflow</p>
                <div className="flex items-center">
                  <ArrowUpRight className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-xl font-semibold text-green-600">{formatter.format(inflow)}</span>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <p className="text-sm text-gray-600 mb-1">Total Outflow</p>
                <div className="flex items-center">
                  <ArrowDownRight className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-xl font-semibold text-red-600">{formatter.format(outflow)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {activeModal === 'addMoney' && 'Fund your Account'}
                {activeModal === 'sendMoney' && 'Send Money'}
                {activeModal === 'requestMoney' && 'Request Money'}
                {activeModal === 'manageCards' && 'Manage Cards'}
                {activeModal === 'setPin' && 'Set PIN'}
                {activeModal === 'downloadHistory' && 'Download Transaction History'}
                {activeModal === 'editProfile' && 'Edit Profile'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
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
                    <label htmlFor="newPin" className="block text-sm font-medium text-gray-700">New PIN</label>
                    <input
                      type="password"
                      id="newPin"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700">Confirm PIN</label>
                    <input
                      type="password"
                      id="confirmPin"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
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
                    e.preventDefault()
                    const amount = parseFloat((e.target as HTMLFormElement).amount.value)
                    handleAddMoney(amount)
                  }}
                  className="space-y-4"
                >
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
                    <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">Recipient</label>
                    <input type="text" id="recipient" name="recipient" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                    <input type="number" id="amount" name="amount" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Send Money
                  </button>
                  {error && (
                    <div className="mt-4 p-2 bg-red-100 text-red-600 rounded">
                      {error}
                    </div>
                  )}
                </form>
              )}

              {activeModal === 'downloadHistory' && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">Your transaction history will be downloaded as a PDF file.</p>
                  <button
                    onClick={downloadTransactionHistory}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Download
                  </button>
                  {error && (
                    <div className="mt-4 p-2 bg-red-100 text-red-600 rounded">
                      {error}
                    </div>
                  )}
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
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      defaultValue={name || ''}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      accept="image/*"
                      className="mt-1 block w-full"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
            <h2 className="text-xl font-bold mb-4">Enter PIN</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const enteredPin = (e.target as HTMLFormElement).pin.value
              handlePinSubmit(enteredPin)
            }} className="space-y-4">
              <input
                type="password"
                name="pin"
                placeholder="Enter your PIN"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md">
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}

      {isCopied && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md">
          Username copied successfully!
        </div>
      )}
    </div>
  )
}