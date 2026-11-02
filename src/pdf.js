// Faithful digital replica of the paper TANISH LOGISTIC Lorry Receipt.
// Structure follows the physical form: brand block left, billing + C.N. boxes
// top-right, wide FOR ACKNOWLEDGEMENT column grid, charge row beneath, footer.
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const box = (checked) => `<span class="cb">${checked ? "&#10003;" : ""}</span>`;

export function lrHtml(r) {
  const gstinPaidBy = Array.isArray(r.gstinPaidBy) ? r.gstinPaidBy : (r.gstinPaidBy ? [r.gstinPaidBy] : []);
  // acknowledgement grid: label header cell + tall value cell
  const col = (label, value, w) => `
    <td class="col" style="width:${w}">
      <div class="lbl">${label}</div>
      <div class="val">${esc(value) || "&nbsp;"}</div>
    </td>`;

  return `
  <html><head><meta charset="utf-8" /><style>
    * { box-sizing: border-box; }
    body { font-family: Helvetica, Arial, sans-serif; color:#000; margin:0; padding:12px; font-size:11px; }
    table { border-collapse: collapse; width: 100%; }
    td { border: 1px solid #000; padding: 4px 5px; vertical-align: top; }
    .nob { border: none !important; }
    .lbl { font-size: 8px; text-transform: uppercase; font-weight: 700; }
    .val { font-size: 11.5px; min-height: 14px; }
    .brand { font-size: 36px; font-weight: 900; color:#1B3A6B; letter-spacing: 2px; line-height: 1; }
    .addr { font-size: 8px; line-height: 1.5; margin-top: 4px; }
    .om { font-size: 20px; }
    .cn { font-size: 22px; font-weight: 900; }
    .cb { display:inline-block; width: 12px; height: 12px; border: 1.5px solid #000; margin: 0 3px 0 6px; vertical-align: -2px; font-size: 10px; font-weight: 900; text-align:center; line-height: 11px; }
    .cb:first-child { margin-left: 0; }
    .chkline { font-size: 10.5px; margin: 3px 0; white-space: nowrap; }
    .risk { font-weight: 800; font-size: 10.5px; text-align:center; padding: 3px; }
    .ackhead { background:#e8edf5; font-weight: 900; text-align: center; font-size: 13px; letter-spacing: 3px; padding: 4px; }
    td.col { height: 110px; }
    td.col .val { margin-top: 4px; }
    .totlbl { font-weight: 900; }
    .foot { font-size: 7.5px; line-height: 1.5; padding: 5px; }
    .side { writing-mode: vertical-rl; font-weight: 900; font-size: 12px; text-align: center; letter-spacing: 1px; width: 22px; }
    .copy { font-weight: 900; font-size: 12px; text-align: center; }
  </style></head><body>

  <!-- ===== Top: brand (left) | billing box + CN box (right) ===== -->
  <table><tr>
    <td class="nob" style="width:46%; vertical-align:top;">
      <div style="font-size:10px;"><b>Mob.:</b> 9924204744</div>
      <div class="om">&#2384;</div>
      <div class="brand">TANISH LOGISTIC</div>
      <div class="addr">
        H.O. : # No. 393 Street No. 10 Sec 2B Adrash Nagar Mandi Gobind Garh Dist. Fateh Garh Sahib, PB. 147301<br/>
        B.O. : 419, Valamhub Nr. Sidheshwar Harbor B/h Lilaji Hotel NH 8, Kapurai Chokdi Vadodara (GJ) Pin No. 390004<br/>
        <b>GST No.:</b> 03BAPPS3792D1ZG
      </div>
    </td>
    <td class="nob" style="width:54%; vertical-align:top;">
      <table>
        <tr>
          <!-- To be billed at -->
          <td style="width:52%">
            <div class="lbl">To be billed at</div>
            <div class="chkline"><span class="lbl">Mode of Payment</span>${box(r.paymentMode==="TBB")}TBB${box(r.paymentMode==="To Pay")}To Pay${box(r.paymentMode==="Paid")}Paid</div>
            <div class="chkline"><span class="lbl">Billing Party</span></div>
            <div class="chkline"><span class="lbl">GSTIN Paid by :</span>${box(gstinPaidBy.includes("Consignor"))}Consignor${box(gstinPaidBy.includes("Consignee"))}Consignee${box(gstinPaidBy.includes("Transport"))}Transport</div>
          </td>
          <!-- CN / booking / route -->
          <td style="width:48%">
            <div class="chkline"><span class="lbl">C.N. No :</span> <span class="cn">${esc(r.cnNo)}</span></div>
            <div class="chkline"><span class="lbl">Booking Date</span> ${esc(r.bookingDate)}</div>
            <div class="chkline"><span class="lbl">From</span> ${esc(r.from)}</div>
            <div class="chkline"><span class="lbl">To</span> ${esc(r.to)}</div>
          </td>
        </tr>
      </table>
    </td>
  </tr></table>

  <!-- ===== Middle: parties (left) | acknowledgement grid (right) ===== -->
  <table style="margin-top:4px;"><tr>
    <td class="nob" style="width:40%; vertical-align:top;">
      <div class="risk">At Owner's Risk &nbsp; Eway Bill.: ${esc(r.ewayBill) || "—"}</div>
      <table style="margin-top:3px;">
        <tr><td style="width:30%"><div class="lbl">Consignor</div></td><td><div class="val">${esc(r.consignorName)}</div></td></tr>
        <tr><td><div class="lbl">Address</div></td><td style="height:34px;"><div class="val">${esc(r.consignorAddress)}</div></td></tr>
        <tr><td><div class="lbl">GSTIN :</div></td><td><div class="val">${esc(r.consignorGstin)}</div></td></tr>
        <tr><td><div class="lbl">Consignee</div></td><td><div class="val">${esc(r.consigneeName)}</div></td></tr>
        <tr><td><div class="lbl">Address</div></td><td style="height:34px;"><div class="val">${esc(r.consigneeAddress)}</div></td></tr>
        <tr><td><div class="lbl">GSTIN :</div></td><td><div class="val">${esc(r.consigneeGstin)}</div></td></tr>
      </table>
    </td>
    <td class="nob" style="width:60%; vertical-align:top;">
      <table>
        <tr><th class="ackhead" colspan="13">FOR ACKNOWLEDGEMENT</th></tr>
        <tr>
          ${col("No of Pakage", r.packages, "7%")}
          ${col("Nature of Goods (said to Consign)", r.goods, "20%")}
          ${col("Nett Weight", r.nettWeight, "8%")}
          ${col("Gross Weight", r.grossWeight, "8%")}
          ${col("Rate", r.rate, "8%")}
          ${col("Ins. Ch.", r.insCh, "6%")}
          ${col("St. Ch.", r.stCh, "6%")}
          ${col("Service Tax", r.serviceTax, "7%")}
          ${col("Cess", r.cess, "6%")}
          ${col("TOTAL", r.total, "7%")}
          ${col("Freight Rs.", r.freight, "7%")}
          ${col("Private Mark", r.privateMark, "5%")}
          ${col("M.R./Bill No.", r.mrBillNo, "5%")}
        </tr>
      </table>
      <!-- charge / vehicle row under the grid, like the paper -->
      <table style="margin-top:3px;">
        <tr>
          <td style="width:25%"><div class="lbl">Truck No.:</div><div class="val">${esc(r.truckNo)}</div></td>
          <td style="width:35%"><div class="lbl">Delivery Inst.</div><div class="val">${esc(r.deliveryInst)}</div></td>
          <td style="width:20%"><div class="lbl">Invoice No. / Stn.</div><div class="val">${esc(r.invoiceNo)}</div></td>
          <td style="width:20%"><div class="lbl">Declared Value Rs.</div><div class="val">${esc(r.declaredValue)}</div></td>
        </tr>
      </table>
    </td>
  </tr></table>

  <!-- ===== Footer ===== -->
  <table style="margin-top:4px;"><tr>
    <td class="foot" style="width:76%">
      We do hereby Certify that I/We subject ourselves / ourselves to the about particulars of goods Consigned by me/us are have been correct entered into and the consignment is booked with full acknowledgement of the terms and condition of G.C Note appear on the reverse and Which I/we accept Received the goods on terms &amp; Condition printed overleaf.
      <b>PAYMENT MUST BE MADE BY ACCOUNT PAYEE CHEQUE OR DRAFT ONLY IN FAVOUR OF TANISH LOGISTIC</b><br/>
      Not Responsible for leakage &amp; Breakage Delivery against Payments. All Disputes Subject to MANDI GOBIND GARH Jurisdiction.
    </td>
    <td class="copy">CONSIGNEE<br/>COPY</td>
    <td class="side">For TANISH LOGISTIC</td>
    <td class="side">Booking Incharge</td>
  </tr></table>
  </body></html>`;
}
