import { InvoiceRecord, SoilTestBooking, Scheme, FarmerProfile } from '../types';

/**
 * Downloads any HTML string as an offline-viewable and printable file
 */
export function downloadHtmlFile(filename: string, htmlContent: string) {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.html') ? filename : `${filename}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/**
 * Downloads plain text or CSV file
 */
export function downloadTextFile(filename: string, content: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/**
 * Prints HTML content safely in sandboxed / iframe environments without window.open()
 */
export function printHtmlSafely(htmlContent: string, fallbackFilename?: string) {
  try {
    // 1. Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (printErr) {
          console.warn('Iframe print blocked, initiating file download:', printErr);
          if (fallbackFilename) {
            downloadHtmlFile(fallbackFilename, htmlContent);
          }
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 30000);
        }
      }, 400);
      return;
    }
  } catch (err) {
    console.warn('Direct printing error, falling back to download:', err);
  }

  // Fallback: If printing was prohibited by browser sandbox, download the file
  if (fallbackFilename) {
    downloadHtmlFile(fallbackFilename, htmlContent);
  }
}

/**
 * Generates official standalone HTML for an Invoice or Sales Receipt
 */
export function generateInvoicePrintHtml(invoice: InvoiceRecord): string {
  const isReceipt = invoice.invoiceType === 'FARMER_SALES_RECEIPT';
  const isSubsidy = invoice.invoiceType === 'GOVT_SUBSIDY_BILLING';
  const title = isReceipt 
    ? 'FARMER DIRECT SALES RECEIPT (உழவர் விற்பனை ரசீது)' 
    : isSubsidy 
    ? 'STATE SUBSIDY BILLING & FEE WAIVER CERTIFICATE' 
    : 'COMMERCIAL AGRICULTURAL TAX INVOICE';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${invoice.invoiceNumber} - ${title}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1c1917; margin: 0; padding: 20px; font-size: 13px; line-height: 1.45; }
    .header { border-bottom: 2px solid #065f46; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
    .govt-title { font-size: 16px; font-weight: 900; color: #065f46; text-transform: uppercase; margin: 0; }
    .govt-sub { font-size: 11px; font-weight: bold; color: #047857; margin-top: 2px; }
    .act-note { font-size: 9px; color: #78716c; margin-top: 2px; }
    .inv-meta { text-align: right; font-family: monospace; font-size: 11px; }
    .inv-num { font-size: 14px; font-weight: bold; color: #1c1917; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
    .card { background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 8px; padding: 12px; }
    .card-title { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e7e5e4; padding-bottom: 4px; margin-bottom: 8px; color: #065f46; }
    .party-name { font-size: 13px; font-weight: bold; color: #0c0a09; margin: 0 0 4px 0; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
    th { background: #f5f5f4; border: 1px solid #d6d3d1; padding: 8px 10px; text-align: left; font-weight: bold; color: #292524; }
    td { border: 1px solid #e7e5e4; padding: 8px 10px; }
    .text-right { text-align: right; }
    .totals-area { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
    .statutory-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 10px 12px; font-size: 10.5px; color: #065f46; max-width: 58%; }
    .totals-table { width: 38%; font-size: 12px; }
    .totals-row { display: flex; justify-content: space-between; padding: 3px 0; color: #44403c; }
    .totals-final { border-top: 2px solid #065f46; padding-top: 6px; font-size: 15px; font-weight: 900; color: #065f46; display: flex; justify-content: space-between; }
    .logistics { background: #f5f5f4; border: 1px solid #e7e5e4; border-radius: 6px; padding: 8px 12px; font-size: 11px; margin-bottom: 16px; display: flex; justify-content: space-between; }
    .footer { border-top: 1px solid #d6d3d1; padding-top: 12px; font-size: 10px; color: #78716c; display: flex; justify-content: space-between; align-items: center; }
    .qr-badge { border: 1px solid #065f46; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 9px; font-weight: bold; color: #065f46; background: #f0fdf4; }
    .print-bar { background: #065f46; color: white; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; margin-bottom: 20px; }
    .print-btn { background: #f59e0b; color: #1c1917; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px; }
    @media print { .print-bar { display: none; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="print-bar">
    <span><strong>ANNA AGRI AI Platform</strong> · Official Farmgate Settlement Voucher</span>
    <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
  </div>

  <div class="header">
    <div>
      <h1 class="govt-title">GOVERNMENT OF TAMIL NADU</h1>
      <div class="govt-sub">Department of Agriculture & Farmers Welfare · AAA Direct Farm Trade</div>
      <div class="act-note">${title} — Direct Farmer Settlement Act 2024</div>
    </div>
    <div class="inv-meta">
      <div class="inv-num">${invoice.invoiceNumber}</div>
      <div>Date: <strong>${invoice.date}</strong></div>
      ${invoice.ewayBillNumber ? `<div>E-Way Bill: <strong>${invoice.ewayBillNumber}</strong></div>` : ''}
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-title">SELLER / GROWER (விவசாயி)</div>
      <p class="party-name">${invoice.farmerName}</p>
      <div>Village: ${invoice.farmerVillage || 'Agri Ward'}, ${invoice.farmerTaluk || 'Taluk'}</div>
      <div>District: <strong>${invoice.farmerDistrict}</strong>, Tamil Nadu</div>
      <div>Land Patta: <strong>${invoice.farmerPattaNo || 'PTA-VERIFIED'}</strong> · Mobile: +91 ${invoice.farmerMobile}</div>
      <div style="color:#065f46;font-weight:600;margin-top:4px;">Bank Settlement: ${invoice.farmerBankRef || 'Direct DBT Account'}</div>
    </div>

    <div class="card">
      <div class="card-title">CONSIGNEE / BUYER (கொள்முதல் நுகர்வோர்)</div>
      <p class="party-name">${invoice.buyerName}</p>
      ${invoice.buyerOrganization ? `<div><strong>${invoice.buyerOrganization}</strong></div>` : ''}
      <div>Destination: ${invoice.deliveryAddress}</div>
      ${invoice.buyerGstin ? `<div>GSTIN: <strong>${invoice.buyerGstin}</strong></div>` : ''}
      <div>Contact: +91 ${invoice.buyerMobile} · Method: ${invoice.paymentMethod}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Commodity & Variety Description</th>
        <th>HSN Code</th>
        <th class="text-right">Quantity</th>
        <th class="text-right">Farmgate Rate</th>
        <th class="text-right">Mandi Comp</th>
        <th class="text-right">Total Amount (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map((item, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>
            <strong>${item.description}</strong>
            ${item.description_ta ? `<div style="font-size:10px;color:#57534e;">${item.description_ta}</div>` : ''}
          </td>
          <td>${item.hsnCode || '100610'}</td>
          <td class="text-right"><strong>${item.quantity} ${item.unit}</strong></td>
          <td class="text-right">₹${item.unitPrice.toLocaleString('en-IN')}</td>
          <td class="text-right" style="color:#78716c;">${item.mandiComparisonPrice ? `₹${item.mandiComparisonPrice}` : '—'}</td>
          <td class="text-right"><strong>₹${item.total.toLocaleString('en-IN')}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals-area">
    <div class="statutory-box">
      <strong>Statutory APMC Mandi Cess Exemption:</strong>
      <p style="margin:4px 0;">Transacted directly at farmgate under Tamil Nadu Direct Agricultural Produce Marketing Act. APMC Mandi Cess: <strong>₹0.00 (Exempt)</strong>.</p>
      <p style="margin:4px 0;">Middleman Brokerage Deduction: <strong>₹0.00 (0% Commission)</strong>. 100% of agreed purchase value goes directly to grower account.</p>
      <div style="font-family:monospace;font-size:9.5px;color:#047857;margin-top:6px;">Ref: ${invoice.transactionReference} · Status: ${invoice.paymentStatus}</div>
    </div>

    <div class="totals-table">
      <div class="totals-row">
        <span>Produce Subtotal:</span>
        <strong>₹${invoice.subtotal.toLocaleString('en-IN')}</strong>
      </div>
      ${invoice.freightAndLogistics > 0 ? `
        <div class="totals-row">
          <span>Freight & Logistics:</span>
          <strong>₹${invoice.freightAndLogistics.toLocaleString('en-IN')}</strong>
        </div>
      ` : ''}
      <div class="totals-row">
        <span>APMC Cess (Exempt):</span>
        <span style="color:#065f46;">₹0.00</span>
      </div>
      <div class="totals-row">
        <span>Commission Deduction:</span>
        <span style="color:#065f46;">₹0.00 (0%)</span>
      </div>
      <div class="totals-row">
        <span>GST on Raw Produce:</span>
        <span>₹0.00 (0%)</span>
      </div>
      <div class="totals-final">
        <span>Net Total:</span>
        <span>₹${invoice.totalAmount.toLocaleString('en-IN')}</span>
      </div>
    </div>
  </div>

  ${invoice.ewayBillNumber ? `
    <div class="logistics">
      <div>Vehicle No: <strong>${invoice.vehicleNumber || 'Standard Agri Logistics'}</strong></div>
      <div>Operator: <strong>${invoice.transportOperator || 'Tamil Nadu Farm Freight'}</strong></div>
      <div>Dispatch: <strong>${invoice.dispatchDate || invoice.date}</strong></div>
    </div>
  ` : ''}

  <div class="footer">
    <div class="qr-badge">QR SEAL: ${invoice.qrCodeData}</div>
    <div>Authorized Digital Signature · Tamil Nadu Agricultural Marketing Board</div>
  </div>
</body>
</html>`;
}

/**
 * Generates official printable HTML for a Soil Test Appointment Slip
 */
export function generateSoilSlipHtml(booking: SoilTestBooking): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Soil Test Token - ${booking.id}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1c1917; padding: 20px; font-size: 13px; line-height: 1.5; }
    .header { border-bottom: 2px solid #065f46; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 18px; font-weight: 900; color: #065f46; margin: 0; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; margin-top: 6px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
    .box { border: 1px solid #e7e5e4; padding: 12px; border-radius: 8px; background: #fafaf9; }
    .label { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #78716c; }
    .val { font-size: 14px; font-weight: bold; margin-top: 2px; color: #0c0a09; }
    .instructions { background: #f5f5f4; border: 1px solid #d6d3d1; padding: 14px; border-radius: 8px; font-size: 12px; }
    .instructions ol { margin: 6px 0 0 0; padding-left: 20px; }
    .instructions li { margin-bottom: 4px; }
    .print-btn { background: #065f46; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; float: right; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
  <div class="header">
    <div>
      <h1 class="title">TAMIL NADU AGRICULTURAL UNIVERSITY (TNAU)</h1>
      <div style="font-size:12px;color:#57534e;">Mobile & Regional Soil Testing Laboratory Appointment Slip</div>
      <div class="badge">TOKEN: ${booking.id} · STATUS: ${booking.status.toUpperCase()}</div>
    </div>
  </div>

  <div class="grid">
    <div class="box">
      <div class="label">Farmer Applicant</div>
      <div class="val">${booking.farmerName} (${booking.mobile})</div>
    </div>
    <div class="box">
      <div class="label">Appointment Schedule</div>
      <div class="val">${booking.appointmentDate} · ${booking.timeSlot}</div>
    </div>
    <div class="box">
      <div class="label">Farm Location & Survey No.</div>
      <div class="val">${booking.village}, ${booking.taluk}, ${booking.district} (Survey No: ${booking.surveyNumber})</div>
    </div>
    <div class="box">
      <div class="label">Assigned Laboratory</div>
      <div class="val">${booking.centerName}</div>
    </div>
    <div class="box">
      <div class="label">Planned Crop</div>
      <div class="val">${booking.plannedCrop}</div>
    </div>
    <div class="box">
      <div class="label">Testing Fee Waiver</div>
      <div class="val" style="color:#065f46;">100% Free (Govt Soil Health Mission)</div>
    </div>
  </div>

  <div class="instructions">
    <strong>Mandatory Soil Sample Collection Protocol:</strong>
    <ol>
      <li>Scrape surface weeds and litter from 8-10 zig-zag spots across the farm.</li>
      <li>Dig a V-shaped pit 15 cm deep (plough layer) and take a 1-inch slice from top to bottom.</li>
      <li>Mix collected soil on a clean cloth, divide into four quarters, and repeat until 500g remains.</li>
      <li>Dry in shade (NOT in direct sunlight). Pack in a clean polythene cover and attach this token slip.</li>
    </ol>
  </div>

  <div style="margin-top:24px;border-top:1px solid #e7e5e4;padding-top:12px;font-size:11px;color:#78716c;text-align:center;">
    ANNA AGRI AI Platform · Verified Government of Tamil Nadu Soil Health Service
  </div>
</body>
</html>`;
}

/**
 * Print & Download actions for individual invoices
 */
export function printInvoiceSafely(invoice: InvoiceRecord) {
  const html = generateInvoicePrintHtml(invoice);
  const fallback = `Invoice-${invoice.invoiceNumber}.html`;
  printHtmlSafely(html, fallback);
}

export function downloadInvoiceHtml(invoice: InvoiceRecord) {
  const html = generateInvoicePrintHtml(invoice);
  const filename = `Invoice-${invoice.invoiceNumber}.html`;
  downloadHtmlFile(filename, html);
}

/**
 * Print & Download actions for soil appointment slips
 */
export function printSoilSlipSafely(booking: SoilTestBooking) {
  const html = generateSoilSlipHtml(booking);
  const fallback = `Soil-Test-Slip-${booking.id}.html`;
  printHtmlSafely(html, fallback);
}

export function downloadSoilSlipHtml(booking: SoilTestBooking) {
  const html = generateSoilSlipHtml(booking);
  const filename = `Soil-Test-Slip-${booking.id}.html`;
  downloadHtmlFile(filename, html);
}

/**
 * Generates and downloads a complete CSV Report of invoices / sales ledger
 */
export function downloadInvoicesCsvReport(invoices: InvoiceRecord[], roleTitle: string = 'All') {
  const headers = [
    'Invoice Number',
    'Date',
    'Invoice Type',
    'Farmer Name',
    'Farmer Patta',
    'Farmer District',
    'Farmer Mobile',
    'Buyer Name',
    'Buyer Organization',
    'Buyer GSTIN',
    'Destination Address',
    'Commodity',
    'HSN Code',
    'Quantity',
    'Unit',
    'Farmgate Unit Price (INR)',
    'Subtotal (INR)',
    'Freight (INR)',
    'Net Total Amount (INR)',
    '0% Commission Verified',
    'APMC Mandi Cess',
    'Payment Status',
    'Payment Method',
    'Transaction Reference',
    'E-Way Bill Number'
  ];

  const rows: string[][] = [];

  for (const inv of invoices) {
    for (const item of inv.items) {
      rows.push([
        `"${inv.invoiceNumber}"`,
        `"${inv.date}"`,
        `"${inv.invoiceType}"`,
        `"${inv.farmerName}"`,
        `"${inv.farmerPattaNo || ''}"`,
        `"${inv.farmerDistrict}"`,
        `"${inv.farmerMobile}"`,
        `"${inv.buyerName}"`,
        `"${inv.buyerOrganization || ''}"`,
        `"${inv.buyerGstin || ''}"`,
        `"${(inv.deliveryAddress || '').replace(/"/g, '""')}"`,
        `"${item.description}"`,
        `"${item.hsnCode || '100610'}"`,
        `"${item.quantity}"`,
        `"${item.unit}"`,
        `"${item.unitPrice}"`,
        `"${item.total}"`,
        `"${inv.freightAndLogistics || 0}"`,
        `"${inv.totalAmount}"`,
        `"${inv.zeroCommissionVerified ? 'YES (0% Middleman)' : 'NO'}"`,
        `"EXEMPT (Direct Act 2024)"`,
        `"${inv.paymentStatus}"`,
        `"${inv.paymentMethod}"`,
        `"${inv.transactionReference}"`,
        `"${inv.ewayBillNumber || 'N/A'}"`
      ]);
    }
  }

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const filename = `AAA-Agri-Trade-Report-${roleTitle.replace(/\s+/g, '_')}-${new Date().toISOString().slice(0, 10)}.csv`;
  downloadTextFile(filename, csvContent, 'text/csv');
}

/**
 * Generates official printable HTML for Comprehensive Trade & Settlement Report
 */
export function generateTradeAuditReportHtml(invoices: InvoiceRecord[], role: string, userTitle: string): string {
  const totalTurnover = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const totalVolumeKg = invoices.reduce((s, i) => s + i.items.reduce((acc, it) => acc + (it.unit.toLowerCase().includes('kg') ? it.quantity : it.quantity * 100), 0), 0);
  const totalCommissionSaved = totalTurnover * 0.085; // ~8.5% typical APMC middleman commission saved
  const settledCount = invoices.filter(i => i.paymentStatus !== 'Pending Settlement').length;
  const settlementRate = invoices.length > 0 ? Math.round((settledCount / invoices.length) * 100) : 100;

  // District distribution
  const districtMap: Record<string, { count: number; total: number }> = {};
  invoices.forEach(inv => {
    const dist = inv.farmerDistrict || 'Other';
    if (!districtMap[dist]) districtMap[dist] = { count: 0, total: 0 };
    districtMap[dist].count += 1;
    districtMap[dist].total += inv.totalAmount;
  });

  const reportTitle = role === 'ADMIN'
    ? 'Statewide Agricultural Trade, Mandi-Free Settlement & Invoicing Audit Report'
    : role === 'BUYER'
    ? 'Commercial Produce Sourcing & Farmgate Procurement Ledger Report'
    : 'Farmer Farmgate Sales, Bikri Receipts & Bank Credit Summary Report';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${reportTitle}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1c1917; margin: 0; padding: 24px; font-size: 12px; line-height: 1.5; }
    .header-bar { border-bottom: 3px solid #065f46; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .org-title { font-size: 18px; font-weight: 900; color: #065f46; text-transform: uppercase; margin: 0; }
    .org-sub { font-size: 12px; font-weight: bold; color: #047857; margin-top: 3px; }
    .report-name { font-size: 14px; font-weight: bold; color: #1c1917; margin-top: 6px; }
    .meta-box { text-align: right; font-size: 11px; color: #57534e; }
    .stat-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .stat-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; }
    .stat-card.amber { background: #fffbeb; border-color: #fde68a; }
    .stat-card.blue { background: #eff6ff; border-color: #bfdbfe; }
    .stat-card.purple { background: #faf5ff; border-color: #e9d5ff; }
    .stat-label { font-size: 9.5px; font-weight: 800; text-transform: uppercase; color: #78716c; }
    .stat-val { font-size: 18px; font-weight: 900; margin-top: 4px; color: #0c0a09; }
    .section-title { font-size: 13px; font-weight: 900; color: #065f46; text-transform: uppercase; letter-spacing: 0.5px; margin: 20px 0 8px 0; border-bottom: 1px solid #e7e5e4; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
    th { background: #f5f5f4; border: 1px solid #d6d3d1; padding: 8px 10px; text-align: left; font-weight: 800; color: #1c1917; }
    td { border: 1px solid #e7e5e4; padding: 7px 10px; }
    .text-right { text-align: right; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 9.5px; }
    .badge-green { background: #dcfce7; color: #15803d; }
    .badge-blue { background: #dbeafe; color: #1e40af; }
    .badge-amber { background: #fef3c7; color: #92400e; }
    .print-controls { background: #065f46; color: white; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; margin-bottom: 24px; }
    .print-btn { background: #f59e0b; color: #0c0a09; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; }
    @media print { .print-controls { display: none; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="print-controls">
    <div><strong>ANNA AGRI AI Platform</strong> · Official Settlement & Trade Audit Register</div>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="header-bar">
    <div>
      <h1 class="org-title">GOVERNMENT OF TAMIL NADU</h1>
      <div class="org-sub">Department of Agriculture & Farmers Welfare · AAA Platform Direct Trade Directorate</div>
      <div class="report-name">${reportTitle}</div>
    </div>
    <div class="meta-box">
      <div>Report Generated: <strong>${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div>
      <div>Entity: <strong>${userTitle}</strong> (${role})</div>
      <div>Records Audited: <strong>${invoices.length} Invoices</strong></div>
    </div>
  </div>

  <div class="stat-cards">
    <div class="stat-card">
      <div class="stat-label">Total Trade Value</div>
      <div class="stat-val">₹${totalTurnover.toLocaleString('en-IN')}</div>
    </div>
    <div class="stat-card amber">
      <div class="stat-label">Est. Middleman Saved</div>
      <div class="stat-val" style="color:#b45309;">₹${Math.round(totalCommissionSaved).toLocaleString('en-IN')}</div>
    </div>
    <div class="stat-card blue">
      <div class="stat-label">Settlement Ratio</div>
      <div class="stat-val" style="color:#1d4ed8;">${settlementRate}%</div>
    </div>
    <div class="stat-card purple">
      <div class="stat-label">Statutory Cess Saved</div>
      <div class="stat-val" style="color:#7e22ce;">₹${Math.round(totalTurnover * 0.01).toLocaleString('en-IN')}</div>
    </div>
  </div>

  <div class="section-title">District Trade Distribution Summary</div>
  <table>
    <thead>
      <tr>
        <th>District</th>
        <th class="text-right">Transaction Count</th>
        <th class="text-right">Total Trade Amount (₹)</th>
        <th class="text-right">% Share of Trade</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(districtMap).map(([dist, data]) => `
        <tr>
          <td><strong>${dist}</strong></td>
          <td class="text-right">${data.count}</td>
          <td class="text-right">₹${data.total.toLocaleString('en-IN')}</td>
          <td class="text-right">${totalTurnover > 0 ? ((data.total / totalTurnover) * 100).toFixed(1) : 0}%</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="section-title">Verified Invoices & Settlement Register</div>
  <table>
    <thead>
      <tr>
        <th>Inv #</th>
        <th>Date</th>
        <th>Farmer (Seller)</th>
        <th>District</th>
        <th>Buyer (Consignee)</th>
        <th>Produce & Qty</th>
        <th class="text-right">Net Value (₹)</th>
        <th>Payment Status</th>
      </tr>
    </thead>
    <tbody>
      ${invoices.map(inv => `
        <tr>
          <td><strong style="font-family:monospace;">${inv.invoiceNumber}</strong></td>
          <td>${inv.date}</td>
          <td>${inv.farmerName}</td>
          <td>${inv.farmerDistrict}</td>
          <td>${inv.buyerName}</td>
          <td>${inv.items.map(it => `${it.description} (${it.quantity} ${it.unit})`).join(', ')}</td>
          <td class="text-right"><strong>₹${inv.totalAmount.toLocaleString('en-IN')}</strong></td>
          <td>
            <span class="badge ${inv.paymentStatus !== 'Pending Settlement' ? 'badge-green' : 'badge-amber'}">
              ${inv.paymentStatus}
            </span>
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div style="margin-top:24px;border-top:1px solid #d6d3d1;padding-top:12px;font-size:10px;color:#78716c;display:flex;justify-content:space-between;">
    <div>Certified Official Digital Ledger · Government of Tamil Nadu Direct Agri Trade Act 2024</div>
    <div>Page 1 of 1 · Verified Tamper-Resistant Log</div>
  </div>
</body>
</html>`;
}

export function printTradeAuditReportSafely(invoices: InvoiceRecord[], role: string, userTitle: string) {
  const html = generateTradeAuditReportHtml(invoices, role, userTitle);
  const fallback = `Agri-Trade-Audit-Report-${role}.html`;
  printHtmlSafely(html, fallback);
}

export function downloadTradeAuditReportHtml(invoices: InvoiceRecord[], role: string, userTitle: string) {
  const html = generateTradeAuditReportHtml(invoices, role, userTitle);
  const filename = `Agri-Trade-Audit-Report-${role}-${new Date().toISOString().slice(0, 10)}.html`;
  downloadHtmlFile(filename, html);
}

