// Pixel-faithful digital rendition of the paper Tanish Logistic LR form.
// expo-print converts this HTML into the downloadable/shareable PDF.
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const box = (checked) => `<span class="cb">${checked ? "&#10003;" : ""}</span>`;

export function lrHtml(r) {
  const gstinPaidBy = Array.isArray(r.gstinPaidBy) ? r.gstinPaidBy : (r.gstinPaidBy ? [r.gstinPaidBy] : []);
  const cell = (label, value, w) =>
    `<td class="c"${w ? ` style="width:${w}"` : ""}><div class="lbl">${label}</div><div class="val">${esc(value) || "&nbsp;"}</div></td>`;

  return `
  <html><head><meta charset="utf-8" /><style>
    * { box-sizing: border-box; }
    body { font-family: Helvetica, Arial, sans-serif; color:#000; margin:0; padding:14px; font-size:11px; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #000; padding: 4px 6px; vertical-align: top; }
    .lbl { font-size: 8.5px; text-transform: uppercase; color:#000; font-weight: 700; }
    .val { font-size: 12px; min-height: 15px; }
    .brand { font-size: 34px; font-weight: 900; color:#1B3A6B; letter-spacing: 2px; line-height: 1; }
    .addr { font-size: 8.5px; line-height: 1.45; margin-top: 4px; }
    .om { font-size: 22px; }
    .cn { font-size: 20px; font-weight: 900; }
    .cb { display:inline-block; width: 13px; height: 13px; border: 1.5px solid #000; margin-right: 4px; vertical-align: -2px; font-size: 11px; font-weight: 900; text-align:center; line-height: 12px; }
    .chkline { font-size: 11px; margin: 2px 0; }
    .risk { text-align: center; font-weight: 800; font-size: 11px; padding: 3px; }
    .side { writing-mode: vertical-rl; text-orientation: mixed; font-weight: 800; font-size: 12px; text-align: center; letter-spacing: 1px; }
    .ackhead { background:#e8edf5; font-weight: 900; text-align: center; font-size: 13px; letter-spacing: 2px; }
    .tot { font-weight: 900; background:#eef2f8; }
    .foot { font-size: 8px; line-height: 1.5; padding: 4px 6px; }
    .copy { font-weight: 900; font-size: 13px; text-align: center; }
  </style></head><body>

  <!-- Header: brand + addresses (left), CN/booking/from-to (right) -->
  <table><tr>
    <td style="width:58%; border:none;">
      <div class="om">&#2384;</div>
      <div class="brand">TANISH LOGISTIC</div>
      <div class="addr">
        H.O. : # No. 393 Street No. 10 Sec 2B Adrash Nagar Mandi Gobind Garh Dist. Fateh Garh Sahib, PB. 147301<br/>
        B.O. : 419, Valamhub Nr. Sidheshwar Harbor B/h Lilaji Hotel NH 8, Kapurai Chokdi Vadodara (GJ) Pin No. 390004<br/>
        <b>GST No.:</b> 03BAPPS3792D1ZG &nbsp;&nbsp; <b>Mob.:</b> 9924204744
      </div>
    </td>
    <td style="width:42%; border:none;">
      <table>
        <tr><td style="width:45%"><div class="lbl">C.N. No :</div></td><td class="cn">${esc(r.cnNo)}</td></tr>
        <tr><td><div class="lbl">Booking Date</div></td><td class="val">${esc(r.bookingDate)}</td></tr>
        <tr><td><div class="lbl">From</div></td><td class="val">${esc(r.from)}</td></tr>
        <tr><td><div class="lbl">To</div></td><td class="val">${esc(r.to)}</td></tr>
      </table>
    </td>
  </tr></table>

  <!-- Billing / payment strip -->
  <table style="margin-top:4px;"><tr>
    <td style="width:42%">
      <div class="lbl">To be billed at</div>
      <div class="chkline">${box(r.paymentMode === "TBB")} TBB &nbsp; ${box(r.paymentMode === "To Pay")} To Pay &nbsp; ${box(r.paymentMode === "Paid")} Paid</div>
      <div class="lbl" style="margin-top:3px;">Mode of Payment &nbsp; Billing Party</div>
      <div class="chkline">${box(r.billingParty === "Consignor")} Consignor &nbsp; ${box(r.billingParty === "Consignee")} Consignee</div>
      <div class="lbl" style="margin-top:3px;">GSTIN Paid by :</div>
      <div class="chkline">${box(gstinPaidBy.includes("Consignor"))} Consignor &nbsp; ${box(gstinPaidBy.includes("Consignee"))} Consignee</div>
    </td>
    <td style="width:58%">
      <div class="risk">At Owner's Risk &nbsp;&nbsp; Eway Bill.: ${esc(r.ewayBill) || "—"}</div>
      <table>
        <tr>${cell("Consignor", r.consignorName, "34%")}${cell("Consignee", r.consigneeName, "33%")}${cell("Truck No.:", r.truckNo, "33%")}</tr>
        <tr>${cell("Address", r.consignorAddress)}${cell("Address", r.consigneeAddress)}${cell("Delivery Inst.", r.deliveryInst)}</tr>
        <tr>${cell("GSTIN :", r.consignorGstin)}${cell("GSTIN :", r.consigneeGstin)}${cell("Invoice No. / Stn.", r.invoiceNo)}</tr>
      </table>
    </td>
  </tr></table>

  <!-- FOR ACKNOWLEDGEMENT goods table -->
  <table style="margin-top:4px;">
    <tr><th class="ackhead" colspan="10">FOR ACKNOWLEDGEMENT</th>
        <th class="copy" style="border-left:2px solid #000;">CONSIGNEE COPY</th></tr>
    <tr>
      ${cell("No of Pakage", r.packages, "8%")}
      ${cell("Nature of Goods (said to Consign)", r.goods, "24%")}
      ${cell("Nett Weight", r.nettWeight, "9%")}
      ${cell("Gross Weight", r.grossWeight, "9%")}
      ${cell("Rate", r.rate, "8%")}
      ${cell("Freight Rs.", r.freight, "8%")}
      ${cell("Ins. Ch.", r.insCh, "6%")}
      ${cell("St. Ch.", r.stCh, "6%")}
      ${cell("Service Tax", r.serviceTax, "6%")}
      ${cell("Cess", r.cess, "6%")}
    </tr>
    <tr>
      ${cell("Declared Value Rs.", r.declaredValue, "20%")}
      ${cell("Private Mark", r.privateMark, "40%")}
      ${cell("M.R./Bill No.", r.mrBillNo, "20%")}
      <td class="tot" style="width:20%"><div class="lbl">TOTAL</div><div class="val">${esc(r.total) || "—"}</div></td>
    </tr>
  </table>

  <!-- Footer -->
  <table style="margin-top:4px;"><tr>
    <td class="foot" style="width:78%">
      We do hereby Certify that I/We subject ourselves / ourselves to the about particulars of goods Consigned by me/us are have been correct entered into and the consignment is booked with full acknowledgement of the terms and condition of G.C Note appear on the reverse and Which I/we accept Received the goods on terms &amp; Condition printed overleaf.<br/>
      <b>PAYMENT MUST BE MADE BY ACCOUNT PAYEE CHEQUE OR DRAFT ONLY IN FAVOUR OF TANISH LOGISTIC</b><br/>
      Not Responsible for leakage &amp; Breakage Delivery against Payments. All Disputes Subject to MANDI GOBIND GARH Jurisdiction.
    </td>
    <td class="side" style="width:11%">For TANISH LOGISTIC</td>
    <td class="side" style="width:11%">Booking Incharge</td>
  </tr></table>
  </body></html>`;
}
