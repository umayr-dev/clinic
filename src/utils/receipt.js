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