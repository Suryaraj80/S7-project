import { FarmerProfile, Scheme } from '../types';
import { printHtmlSafely, downloadHtmlFile } from './printAndDownloadService';

export function generateSchemeApplicationKitHtml(scheme: Scheme, profile: FarmerProfile): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Application Kit - ${scheme.scheme_name}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      color: #1f2937;
      line-height: 1.5;
    }
    .header {
      border-bottom: 2px solid #15803d;
      padding-bottom: 15px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      color: #15803d;
      margin: 0;
    }
    .badge {
      background-color: #dcfce7;
      color: #166534;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    .section {
      margin-bottom: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 15px;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      color: #374151;
      margin-top: 0;
      margin-bottom: 10px;
      border-bottom: 1px solid #f3f4f6;
      padding-bottom: 5px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      font-size: 13px;
    }
    .field-label {
      color: #6b7280;
    }
    .field-value {
      font-weight: 600;
      color: #111827;
    }
    ul, ol {
      margin: 0;
      padding-left: 20px;
      font-size: 13px;
    }
    li {
      margin-bottom: 6px;
    }
    .footer {
      margin-top: 30px;
      font-size: 11px;
      color: #9ca3af;
      text-align: center;
      border-top: 1px solid #e5e7eb;
      padding-top: 10px;
    }
    .no-print {
      margin-bottom: 15px;
      text-align: right;
    }
    .print-btn {
      background: #15803d;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    @media print {
      body { margin: 15mm; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="header">
    <div>
      <h1 class="title">${scheme.scheme_name}</h1>
      <div style="font-size: 12px; color: #4b5563;">Government Welfare Assistance & Subsidies Kit</div>
    </div>
    <div class="badge">${scheme.level} Scheme · ${scheme.category}</div>
  </div>

  <div class="section">
    <h2 class="section-title">Farmer Applicant Profile Summary</h2>
    <div class="grid">
      <div><span class="field-label">Applicant Name:</span> <span class="field-value">${profile.fullName}</span></div>
      <div><span class="field-label">Mobile Number:</span> <span class="field-value">${profile.mobile}</span></div>
      <div><span class="field-label">Location:</span> <span class="field-value">${profile.village}, ${profile.taluk}, ${profile.district}, ${profile.state}</span></div>
      <div><span class="field-label">Landholding:</span> <span class="field-value">${profile.landholdingSize} ${profile.landUnit} (${profile.ownershipType})</span></div>
      <div><span class="field-label">Primary Crop:</span> <span class="field-value">${profile.cropType} (Secondary: ${profile.secondaryCrop || 'None'})</span></div>
      <div><span class="field-label">Category:</span> <span class="field-value">${profile.farmerCategory} (${profile.smallMarginalClassification} Farmer)</span></div>
      <div><span class="field-label">Annual Income:</span> <span class="field-value">₹${profile.annualIncome.toLocaleString('en-IN')}</span></div>
      <div><span class="field-label">Irrigation:</span> <span class="field-value">${profile.irrigationAvailable ? profile.irrigationType : 'Rainfed'}</span></div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Assistance & Financial Benefits</h2>
    <p style="font-size: 13px; font-weight: bold; color: #15803d; margin: 0 0 6px 0;">${scheme.benefit_amount}</p>
    <p style="font-size: 13px; margin: 0;">${scheme.benefits}</p>
  </div>

  <div class="section">
    <h2 class="section-title">Mandatory Document Checklist for Submission</h2>
    <ul>
      ${scheme.required_documents.map(doc => `<li>[ &nbsp; ] &nbsp; <strong>${doc}</strong></li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <h2 class="section-title">Step-by-Step Application Procedure</h2>
    <ol>
      ${scheme.application_process.map(step => `<li>${step}</li>`).join('')}
    </ol>
  </div>

  <div class="section">
    <h2 class="section-title">Official Verification & Support Contact</h2>
    <div class="grid">
      <div><span class="field-label">Official Portal:</span> <span class="field-value">${scheme.official_website}</span></div>
      <div><span class="field-label">Toll-Free Helpline:</span> <span class="field-value">${scheme.helpline}</span></div>
      <div><span class="field-label">Application Form Link:</span> <span class="field-value">${scheme.application_url}</span></div>
      <div><span class="field-label">Nearest Center:</span> <span class="field-value">Local Agricultural Extension Centre / CSC e-Seva Center</span></div>
    </div>
  </div>

  <div class="footer">
    Generated by ANNA AGRI AI (AAA Platform) · Grounded in verified government guidelines.
  </div>
</body>
</html>`;
}

export function printSchemeApplicationKit(scheme: Scheme, profile: FarmerProfile) {
  const html = generateSchemeApplicationKitHtml(scheme, profile);
  const fallbackName = `Application-Kit-${scheme.id}-${profile.fullName.replace(/\s+/g, '_')}.html`;
  printHtmlSafely(html, fallbackName);
}

export function downloadSchemeApplicationKit(scheme: Scheme, profile: FarmerProfile) {
  const html = generateSchemeApplicationKitHtml(scheme, profile);
  const filename = `Application-Kit-${scheme.id}-${profile.fullName.replace(/\s+/g, '_')}.html`;
  downloadHtmlFile(filename, html);
}

