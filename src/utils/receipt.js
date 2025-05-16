import moment from 'moment'
import QRCode from 'qrcode'

export const printReceipt = async (services, totalAmount) => {
  const receiptId = Date.now().toString()
  
  try {
    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify({
      id: receiptId,
      services,
      totalAmount,
      date: moment().format('DD/MM/YYYY'),
      time: moment().format('HH:mm:ss')
    }))

    // Create receipt HTML template
    const receiptTemplate = `
      <html>
        <head>
          <style>
            @page {
              margin: 0;
              size: 80mm 297mm;
            }
            body {
              font-family: Arial;
              width: 270px;
              padding: 10px;
              margin: 0 auto;
            }
            .receipt {
              text-align: center;
            }
            .service-item {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
            }
            .total {
              border-top: 1px dashed black;
              padding-top: 10px;
              margin-top: 10px;
              display: flex;
              justify-content: space-between;
            }
            .qr-code {
              margin: 15px 0;
            }
            .footer-space {
              height: 60px;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <h3>Clinic Check</h3>
            
            <div>
              <div>Sana: ${moment().format('DD/MM/YYYY')}</div>
              <div>Vaqt: ${moment().format('HH:mm:ss')}</div>
            </div>

            <div style="margin: 15px 0;">
              ${services.map(service => `
                <div class="service-item">
                  <span>${service.name}</span>
                  <span>${service.price} so'm</span>
                </div>
              `).join('')}
            </div>

            <div class="total">
              <strong>Jami:</strong>
              <strong>${totalAmount} so'm</strong>
            </div>

            <div class="qr-code">
              <img src="${qrCodeUrl}" width="150" height="150"/>
            </div>
              <br/><br/><br/>
            <div class="footer-space"></div>
          </div>
        </body>
      </html>
    `

    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    printWindow.document.write(receiptTemplate)
    printWindow.document.close()

    // Wait for images to load
    return new Promise((resolve) => {
      printWindow.onload = () => {
        printWindow.print()
        // Close the print window after a delay
        setTimeout(() => {
          printWindow.close()
          resolve(true)
        }, 500)
      }
    })

  } catch (error) {
    console.error('Printing failed:', error)
    return false
  }
}