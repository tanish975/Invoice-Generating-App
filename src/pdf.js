// Exact replica of the paper TANISH LOGISTIC Lorry Receipt (portrait LR book page).
// Layout mirrors the physical form cell-for-cell:
//  - header: Mob / Om / brand / addresses / GST  |  "To be billed at" box + C.N. box
//  - left column: At Owner's Risk + Consignor & Consignee ruled blocks
//  - right: FOR ACKNOWLEDGEMENT grid (label header row + tall write-in row)
//  - edge: vertical CONSIGNEE COPY / For TANISH LOGISTIC / Booking Incharge
//  - bottom: Truck No. / Delivery Inst. / Invoice No. / Declared Value + legal footer
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const cb = (checked) => `<span class="cb">${checked ? "&#10003;" : ""}</span>`;

export function lrHtml(r) {
  const paidBy = Array.isArray(r.gstinPaidBy) ? r.gstinPaidBy : (r.gstinPaidBy ? [r.gstinPaidBy] : []);
  const hcell = (label, w) => `<td class="hc" style="width:${w}">${label}</td>`;
  const vcell = (value, w) => `<td class="vc" style="width:${w}">${esc(value) || "&nbsp;"}</td>`;

  return `
  <html><head><meta charset="utf-8" /><style>
    * { box-sizing: border-box; }
    body { font-family: Helvetica, Arial, sans-serif; color:#000; margin:0; padding:0; font-size:10px; background:#fff; }
    .slip { width:520px; margin:0 auto; padding:10px; }
    table { border-collapse: collapse; width:100%; }
    td, th { border:1px solid #000; padding:3px 4px; vertical-align:top; }
    .nob { border:none; }
    .brand { font-size:34px; font-weight:900; color:#1B3A6B; letter-spacing:2px; line-height:1.05; }
    .addr { font-size:7.5px; line-height:1.5; }
    .om { font-size:18px; }
    .cn { font-size:20px; font-weight:900; }
    .cb { display:inline-block; width:11px; height:11px; border:1.5px solid #000; margin:0 4px 0 10px; vertical-align:-1px; font-size:9px; font-weight:900; text-align:center; line-height:10px; }
    .cb.first { margin-left:4px; }
    .chk { font-size:10px; margin:4px 0; }
    .lbl { font-size:7.5px; font-weight:700; text-transform:uppercase; }
    .risk { font-weight:800; font-size:10px; text-align:center; padding:3px; border:1px solid #000; }
    .ack { background:#dfe7f2; font-weight:900; text-align:center; font-size:12px; letter-spacing:3px; padding:4px; }
    td.hc { font-size:7px; font-weight:700; text-transform:uppercase; text-align:center; height:24px; padding:2px; }
    td.vc { font-size:11px; height:110px; }
    .side { writing-mode:vertical-rl; text-orientation:mixed; font-weight:900; font-size:11px; text-align:center; letter-spacing:1px; }
    .copy { font-weight:900; font-size:11px; text-align:center; letter-spacing:1px; }
    .foot { font-size:7px; line-height:1.5; }
  </style></head><body>

  <div class="slip">
  <!-- Header row: brand block | billing box | CN box -->
  <table><tr>
    <td class="nob" style="width:44%">
      <div style="font-size:9px;"><b>Mob.:</b> 9924204744</div>
      <div class="om">&#2384;</div>
      <div class="brand">TANISH<br/>LOGISTIC</div>
      <div class="addr">
        H.O. : # No. 393 Street No. 10 Sec 2B Adrash Nagar Mandi Gobind Garh Dist. Fateh Garh Sahib, PB. 147301<br/>
        B.O. : 419, Valamhub Nr. Sidheshwar Harbor B/h Lilaji Hotel NH 8, Kapurai Chokdi Vadodara (GJ) Pin No. 390004<br/>
        <b>GST No.:</b> 03BAPPS3792D1ZG
      </div>
    </td>
    <td style="width:30%">
      <div class="lbl">To be billed at</div>
      <div class="chk"><span class="lbl">Mode of Payment</span>
        <span class="cb${r.paymentMode==="TBB"?"":" first"}" style="margin-left:4px;">${r.paymentMode==="TBB"?"&#10003;":""}</span>TBB
        <span class="cb">${r.paymentMode==="To Pay"?"&#10003;":""}</span>To Pay
        <span class="cb">${r.paymentMode==="Paid"?"&#10003;":""}</span>Paid</div>
      <div class="chk"><span class="lbl">Billing Party</span></div>
      <div class="chk"><span class="lbl">GSTIN Paid by :</span>
        <span class="cb" style="margin-left:4px;">${paidBy.includes("Consignor")?"&#10003;":""}</span>Consignor
        <span class="cb">${paidBy.includes("Consignee")?"&#10003;":""}</span>Consignee
        <span class="cb">${paidBy.includes("Transport")?"&#10003;":""}</span>Transport</div>
    </td>
    <td style="width:26%">
      <div class="chk"><span class="lbl">C.N. No :</span> <span class="cn">${esc(r.cnNo)}</span></div>
      <div class="chk"><span class="lbl">Booking Date</span>&nbsp; ${esc(r.bookingDate)}</div>
      <div class="chk"><span class="lbl">From</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${esc(r.from)}</div>
      <div class="chk"><span class="lbl">To</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${esc(r.to)}</div>
    </td>
  </tr></table>

  <!-- Body row: parties | acknowledgement grid | edge labels -->
  <table style="margin-top:4px;"><tr>
    <td class="nob" style="width:34%">
      <div class="risk">At Owner's Risk &nbsp;&nbsp; Eway Bill.: ${esc(r.ewayBill) || "—"}</div>
      <table style="margin-top:3px;">
        <tr><td style="width:32%"><span class="lbl">Consignor</span></td><td style="height:16px;">${esc(r.consignorName)}</td></tr>
        <tr><td><span class="lbl">Address</span></td><td style="height:38px;">${esc(r.consignorAddress)}</td></tr>
        <tr><td><span class="lbl">GSTIN :</span></td><td style="height:16px;">${esc(r.consignorGstin)}</td></tr>
        <tr><td><span class="lbl">Consignee</span></td><td style="height:16px;">${esc(r.consigneeName)}</td></tr>
        <tr><td><span class="lbl">Address</span></td><td style="height:38px;">${esc(r.consigneeAddress)}</td></tr>
        <tr><td><span class="lbl">GSTIN :</span></td><td style="height:16px;">${esc(r.consigneeGstin)}</td></tr>
      </table>
    </td>
    <td class="nob" style="width:60%">
      <table>
        <tr><th class="ack" colspan="13">FOR ACKNOWLEDGEMENT</th></tr>
        <tr>
          ${hcell("No of Pakage","7%")}${hcell("Nature of Goods (said to Consign)","23%")}${hcell("Nett Wt.","7%")}${hcell("Gross Wt.","7%")}${hcell("Rate","8%")}${hcell("Ins.Ch.","6%")}${hcell("St.Ch.","6%")}${hcell("S.Tax","7%")}${hcell("Cess","6%")}${hcell("TOTAL","7%")}${hcell("Freight","7%")}${hcell("Pvt.Mark","6%")}${hcell("M.R.No.","5%")}
        </tr>
        <tr>
          ${vcell(r.packages,"7%")}${vcell(r.goods,"23%")}${vcell(r.nettWeight,"7%")}${vcell(r.grossWeight,"7%")}${vcell(r.rate,"8%")}${vcell(r.insCh,"6%")}${vcell(r.stCh,"6%")}${vcell(r.serviceTax,"7%")}${vcell(r.cess,"6%")}${vcell(r.total,"7%")}${vcell(r.freight,"7%")}${vcell(r.privateMark,"6%")}${vcell(r.mrBillNo,"5%")}
        </tr>
        <tr>
          <td style="width:25%"><span class="lbl">Truck No.:</span><br/>${esc(r.truckNo)}</td>
          <td style="width:35%"><span class="lbl">Delivery Inst.</span><br/>${esc(r.deliveryInst)}</td>
          <td style="width:20%"><span class="lbl">Invoice No. / Stn.</span><br/>${esc(r.invoiceNo)}</td>
          <td style="width:20%"><span class="lbl">Declared Value Rs.</span><br/>${esc(r.declaredValue)}</td>
        </tr>
      </table>
    </td>
    <td class="nob" style="width:6%">
      <table style="height:100%;">
        <tr><td class="copy">CONSIGNEE COPY</td></tr>
        <tr><td class="side">For TANISH LOGISTIC</td></tr>
        <tr><td class="side">Booking Incharge</td></tr>
      </table>
    </td>
  </tr></table>

  <!-- Footer -->
  <div class="foot" style="border:1px solid #000; border-top:none; padding:4px 5px;">
    We do hereby Certify that I/We subject ourselves / ourselves to the about particulars of goods Consigned by me/us are have been correct entered into and the consignment is booked with full acknowledgement of the terms and condition of G.C Note appear on the reverse and Which I/we accept Received the goods on terms &amp; Condition printed overleaf.
    <b>PAYMENT MUST BE MADE BY ACCOUNT PAYEE CHEQUE OR DRAFT ONLY IN FAVOUR OF TANISH LOGISTIC</b><br/>
    Not Responsible for leakage &amp; Breakage Delivery against Payments. All Disputes Subject to MANDI GOBIND GARH Jurisdiction.
  </div>
  </div>
  </body></html>`;
}
