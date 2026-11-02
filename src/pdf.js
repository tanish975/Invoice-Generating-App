// Builds an HTML rendition of the paper LR (matching the Tanish Logistic layout)
// which expo-print turns into a shareable/downloadable PDF.
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

export function lrHtml(r) {
  const row = (label, value, w = "50%") => `
    <div class="cell" style="width:${w}">
      <div class="lbl">${label}</div>
      <div class="val">${esc(value) || "&nbsp;"}</div>
    </div>`;
  const money = (label, value) => `
    <div class="cell sm"><div class="lbl">${label}</div><div class="val">${esc(value) || "-"}</div></div>`;

  return `
  <html><head><meta charset="utf-8" /><style>
    body { font-family: Helvetica, Arial, sans-serif; color:#111; margin:0; padding:18px; font-size:12px; }
    .head { display:flex; justify-content:space-between; border-bottom:3px solid #1B3A6B; padding-bottom:8px; }
    .brand { font-size:30px; font-weight:900; color:#1B3A6B; letter-spacing:1px; }
    .brand small { display:block; font-size:9px; color:#333; font-weight:400; line-height:1.4; }
    .meta { text-align:right; font-size:11px; }
    .risk { text-align:center; font-weight:bold; border:1px solid #999; padding:3px; margin:6px 0; font-size:11px; }
    .grid { display:flex; flex-wrap:wrap; border:1.5px solid #1B3A6B; }
    .cell { border-right:1px solid #9db; border-bottom:1px solid #9db; padding:5px 7px; box-sizing:border-box; }
    .cell.sm { width:12.5%; }
    .lbl { font-size:9px; color:#555; text-transform:uppercase; }
    .val { font-size:13px; font-weight:600; min-height:16px; }
    h4 { margin:10px 0 4px; color:#1B3A6B; font-size:13px; text-transform:uppercase; }
    .foot { margin-top:10px; font-size:8.5px; color:#333; border-top:1px solid #999; padding-top:6px; line-height:1.5; }
    .tot { background:#eef2f8; font-weight:900; }
  </style></head><body>
    <div class="head">
      <div class="brand">TANISH LOGISTIC
        <small>H.O.: # No. 393 Street No. 10 Sec 2B Adrash Nagar Mandi Gobind Garh Dist. Fateh Garh Sahib, PB. 147301<br/>
        B.O.: 419, Valamhub Nr. Sidheshwar Harbor B/h Lilaji Hotel NH 8, Kapurai Chokdi Vadodara (GJ) Pin No. 390004<br/>
        GST No.: 03BAPPS3792D1ZG &nbsp; Mob.: 9924204744</small>
      </div>
      <div class="meta">
        <b>C.N. No : ${esc(r.cnNo)}</b><br/>Booking Date: ${esc(r.bookingDate)}<br/>
        From: ${esc(r.from)} &nbsp; To: ${esc(r.to)}
      </div>
    </div>
    <div class="risk">AT OWNER'S RISK &nbsp;•&nbsp; Eway Bill: ${esc(r.ewayBill)}</div>
    <div class="grid">
      ${row("Consignor", r.consignorName)}
      ${row("Address", r.consignorAddress)}
      ${row("GSTIN", r.consignorGstin)}
      ${row("Consignee", r.consigneeName)}
      ${row("Address", r.consigneeAddress)}
      ${row("GSTIN", r.consigneeGstin)}
    </div>
    <h4>To be billed at</h4>
    <div class="grid">
      ${row("Mode of Payment", r.paymentMode, "25%")}
      ${row("Billing Party", r.billingParty, "25%")}
      ${row("GSTIN Paid by", r.gstinPaidBy, "25%")}
      ${row("Truck No.", r.truckNo, "25%")}
    </div>
    <h4>Goods &amp; Charges</h4>
    <div class="grid">
      ${row("No. of Package", r.packages, "25%")}
      ${row("Nature of Goods (said to contain)", r.goods, "75%")}
      ${row("Nett Weight", r.nettWeight, "25%")}
      ${row("Gross Weight", r.grossWeight, "25%")}
      ${row("Invoice No. / Stn.", r.invoiceNo, "25%")}
      ${row("Declared Value Rs.", r.declaredValue, "25%")}
    </div>
    <div class="grid">
      ${money("Freight Rs.", r.freight)}
      ${money("Rate", r.rate)}
      ${money("Ins. Ch.", r.insCh)}
      ${money("St. Ch.", r.stCh)}
      ${money("Service Tax", r.serviceTax)}
      ${money("Cess", r.cess)}
      ${money("Private Mark", r.privateMark)}
      <div class="cell sm tot"><div class="lbl">TOTAL</div><div class="val">${esc(r.total) || "-"}</div></div>
    </div>
    <div class="grid">
      ${row("M.R./Bill No.", r.mrBillNo)}
      ${row("Delivery Inst.", r.deliveryInst, "75%")}
    </div>
    <div class="foot">
      We do hereby certify that the above particulars of goods are true and correct. Not responsible for leakage &amp; breakage.
      PAYMENT MUST BE MADE BY ACCOUNT PAYEE CHEQUE OR DRAFT ONLY IN FAVOUR OF TANISH LOGISTIC.
    </div>
  </body></html>`;
}
