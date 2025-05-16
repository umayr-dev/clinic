import { useState } from 'react'
import QrScanner from 'react-qr-scanner'

function ReceiptScanner() {
  const [scanData, setScanData] = useState(null)
  const [isScanning, setIsScanning] = useState(true)

  const handleScan = (data) => {
    if (data) {
      try {
        setIsScanning(false)
        // Parse the scanned QR code text
        const receiptText = data.text
        setScanData(receiptText)
      } catch (error) {
        console.error('QR kod o`qishda xatolik:', error)
      }
    }
  }

  const handleError = (err) => {
    console.error('Scaner xatosi:', err)
  }

  const handleNewScan = () => {
    setScanData(null)
    setIsScanning(true)
  }

  return (
    <div className="receipt-scanner">
      {isScanning ? (
        <div className="scanner-container">
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%', maxWidth: '400px' }}
          />
        </div>
      ) : (
        <div className="scanned-receipt">
          <pre>{scanData}</pre>
          <button onClick={handleNewScan}>Yangi Scan</button>
        </div>
      )}
    </div>
  )
}

export default ReceiptScanner