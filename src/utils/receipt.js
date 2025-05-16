import moment from 'moment'
import QRCode from 'qrcode'
import jsPDF from 'jspdf'

export const printReceipt = async (services, totalAmount) => {
  const receiptId = Date.now().toString()
  
  // Format services for QR code
  const formattedServices = services.map(service => 
    `${service.name}: ${service.price} so'm`
  ).join('\n')

  // Create formatted receipt text for QR code
  const qrText = `
Clinic Check
------------------------
Sana: ${moment().format('DD/MM/YYYY')}
Vaqt: ${moment().format('HH:mm:ss')}
------------------------
${formattedServices}
------------------------
Jami: ${totalAmount} so'm
Check ID: ${receiptId}
  `.trim()

  try {
    // Generate QR code with formatted text
    const qrCodeUrl = await QRCode.toDataURL(qrText)

    // Create PDF
    const pdf = new jsPDF({
      unit: 'mm',
      format: [80, 200]
    })

    // Add content to PDF
    pdf.setFontSize(12)
    pdf.text('Clinic Check', 40, 10, { align: 'center' })
    
    pdf.setFontSize(10)
    pdf.text(`Sana: ${moment().format('DD/MM/YYYY')}`, 10, 20)
    pdf.text(`Vaqt: ${moment().format('HH:mm:ss')}`, 10, 25)

    // Add services
    let yPos = 35
    services.forEach(service => {
      pdf.text(service.name, 10, yPos)
      pdf.text(`${service.price} so'm`, 70, yPos, { align: 'right' })
      yPos += 5
    })

    // Add total
    pdf.setFontSize(11)
    pdf.line(10, yPos, 70, yPos)
    yPos += 5
    pdf.text('Jami:', 10, yPos)
    pdf.text(`${totalAmount} so'm`, 70, yPos, { align: 'right' })

    // Add QR code
    pdf.addImage(qrCodeUrl, 'PNG', 25, yPos + 5, 30, 30)

    // Create receipt template with extra space at bottom
    const receiptTemplate = `
      <div style="font-family: 'Arial'; width: 300px;">
        <div style="border: 1px solid #000; padding: 15px; margin: 10px;">
          <h3 style="text-align: center; margin: 0 0 10px 0;">Clinic Check</h3>
          
          <div style="margin: 10px 0;">
            <div>Sana: ${moment().format('DD/MM/YYYY')}</div>
            <div>Vaqt: ${moment().format('HH:mm:ss')}</div>
          </div>

          <div style="margin: 15px 0;">
            ${services.map(service => `
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>${service.name}</span>
                <span>${service.price} so'm</span>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 10px; border-top: 1px solid #000; padding-top: 10px;">
            <strong>Jami:</strong>
            <strong>${totalAmount} so'm</strong>
          </div>

          <div style="text-align: center; margin-top: 15px;">
            <img src="${qrCodeUrl}" width="150" height="150" />
          </div>

          <!-- Add extra space at bottom -->
          <br><br><br><br>
        </div>
      </div>
    `

    // Save PDF and receipt data
    pdf.save(`check-${receiptId}.pdf`)
    
    const receiptData = {
      id: receiptId,
      services,
      totalAmount,
      date: moment().format('DD/MM/YYYY'),
      time: moment().format('HH:mm:ss'),
      qrText // Save formatted text for reference
    }

    const savedReceipts = JSON.parse(localStorage.getItem('receipts') || '[]')
    savedReceipts.push(receiptData)
    localStorage.setItem('receipts', JSON.stringify(savedReceipts))

    return true
  } catch (error) {
    console.error('Receipt generation failed:', error)
    return false
  }
}