// Exact replica of the paper TANISH LOGISTIC Lorry Receipt, drawn as a
// self-contained vector SVG (pattern borrowed from cathrynlavery/diagram-design:
// self-contained HTML+SVG, no shadows) so geometry is identical in every renderer.
// Page = A5 portrait (148x210mm), like the LR book slip.
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const W = 559, H = 794; // A5 @96dpi
const INK = "#000", BLUE = "#1B3A6B";

const cb = (x, y, checked) =>
  `<rect x="${x}" y="${y}" width="10" height="10" fill="#fff" stroke="${INK}" stroke-width="1.4"/>` +
  (checked ? `<text x="${x + 1.5}" y="${y + 9}" font-size="10" font-weight="900" fill="${INK}">✓</text>` : "");

const vtext = (x, y, str, size = 11, anchor = "middle") =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="800" fill="${INK}" text-anchor="${anchor}" transform="rotate(-90 ${x} ${y})" letter-spacing="1">${esc(str)}</text>`;

export function lrSvg(r) {
  const paidBy = Array.isArray(r.gstinPaidBy) ? r.gstinPaidBy : (r.gstinPaidBy ? [r.gstinPaidBy] : []);
  const line = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="1"/>`;
  const box = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="1"/>`;
  const t = (x, y, str, size = 10, w = 400, fill = INK, anchor = "start") =>
    `<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}">${esc(str)}</text>`;
  const lbl = (x, y, str, sz = 7) => t(x, y, str, sz, 700);

  // acknowledgement columns: [label, value, width]
  const cols = [
    ["No of Pakage", r.packages, 24], ["Nature of Goods (said to Consign)", r.goods, 66],
    ["Nett Weight", r.nettWeight, 25], ["Gross Weight", r.grossWeight, 25], ["Rate", r.rate, 22],
    ["Ins. Ch.", r.insCh, 19], ["St. Ch.", r.stCh, 19], ["Service Tax", r.serviceTax, 23],
    ["Cess", r.cess, 19], ["TOTAL", r.total, 23], ["Freight Rs.", r.freight, 24],
    ["Private Mark", r.privateMark, 24], ["M.R./Bill No.", r.mrBillNo, 24],
  ];
  const ax = 196, ay = 148, aw = cols.reduce((s, c) => s + c[2], 0); // table x,y,width
  const hh = 30, vh = 150;
  let x = ax;
  const headCells = cols.map((c) => {
    const cell = box(x, ay, c[2], hh) + lbl(x + c[2] / 2, ay + 11, c[0].split(" ")[0]) + lbl(x + c[2] / 2, ay + 20, c[0].split(" ").slice(1).join(" ") || " ") ;
    x += c[2]; return cell;
  }).join("");
  x = ax;
  const valCells = cols.map((c) => {
    const cell = box(x, ay + hh, c[2], vh) + t(x + 2, ay + hh + 14, c[1] || "", 10, 400);
    x += c[2]; return cell;
  }).join("");

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Helvetica, Arial, sans-serif">
    <rect x="6" y="6" width="${W - 12}" height="${H - 12}" fill="#fff" stroke="${INK}" stroke-width="1.5"/>

    <!-- ===== header ===== -->
    ${t(16, 26, "Mob.: 9924204744", 9, 700)}
    ${t(16, 48, "ॐ", 16, 700)}
    ${t(16, 92, "TANISH", 34, 900, BLUE)}
    ${t(16, 128, "LOGISTIC", 34, 900, BLUE)}
    ${t(16, 148, "H.O. : # No. 393 Street No. 10 Sec 2B Adrash Nagar Mandi Gobind Garh Dist. Fateh", 6.5)}
    ${t(16, 157, "Garh Sahib, PB. 147301", 6.5)}
    ${t(16, 168, "B.O. : 419, Valamhub Nr. Sidheshwar Harbor B/h Lilaji Hotel NH 8, Kapurai Chokdi", 6.5)}
    ${t(16, 177, "Vadodara (GJ) Pin No. 390004", 6.5)}
    ${t(16, 190, "GST No.: 03BAPPS3792D1ZG", 8, 700)}

    <!-- billing box -->
    ${box(268, 12, 150, 128)}
    ${lbl(274, 24, "TO BE BILLED AT")}
    ${lbl(274, 38, "MODE OF PAYMENT")}
    ${cb(274, 42, r.paymentMode === "TBB")}${t(288, 51, "TBB", 9)}
    ${cb(312, 42, r.paymentMode === "To Pay")}${t(326, 51, "To Pay", 9)}
    ${cb(356, 42, r.paymentMode === "Paid")}${t(370, 51, "Paid", 9)}
    ${lbl(274, 70, "BILLING PARTY")}
    ${lbl(274, 88, "GSTIN PAID BY :")}
    ${cb(274, 94, paidBy.includes("Consignor"))}${t(288, 103, "Consignor", 9)}
    ${cb(340, 94, paidBy.includes("Consignee"))}${t(354, 103, "Consignee", 9)}
    ${cb(274, 114, paidBy.includes("Transport"))}${t(288, 123, "Transport", 9)}

    <!-- CN box -->
    ${box(424, 12, 129, 128)}
    ${lbl(430, 26, "C.N. No :")}${t(488, 30, String(r.cnNo || ""), 18, 900, INK, "end")}
    ${line(430, 40, 547, 40)}
    ${lbl(430, 54, "BOOKING DATE")}${t(547, 54, esc(r.bookingDate || ""), 8, 700, INK, "end")}
    ${line(430, 66, 547, 66)}
    ${lbl(430, 80, "FROM")}${t(547, 80, esc(r.from || ""), 8, 700, INK, "end")}
    ${line(430, 92, 547, 92)}
    ${lbl(430, 106, "TO")}${t(547, 106, esc(r.to || ""), 8, 700, INK, "end")}
    ${line(430, 118, 547, 118)}
    ${lbl(430, 132, "EWAY BILL:")}${t(547, 132, esc(r.ewayBill || ""), 7, 700, INK, "end")}

    <!-- ===== left column: parties ===== -->
    ${box(12, 200, 170, 20)}
    ${t(97, 213, "At Owner's Risk", 8.5, 800, INK, "middle")}
    ${box(12, 224, 170, 252)}
    ${lbl(16, 238, "CONSIGNOR")}${line(16, 242, 178, 242)}${t(16, 254, esc(r.consignorName || ""), 9, 700)}
    ${lbl(16, 268, "ADDRESS")}${line(16, 272, 178, 272)}${t(16, 284, esc(r.consignorAddress || ""), 8)}
    ${line(16, 300, 178, 300)}${line(16, 316, 178, 316)}
    ${lbl(16, 330, "GSTIN :")}${t(52, 330, esc(r.consignorGstin || ""), 8, 700)}
    ${line(16, 340, 178, 340)}
    ${lbl(16, 354, "CONSIGNEE")}${line(16, 358, 178, 358)}${t(16, 370, esc(r.consigneeName || ""), 9, 700)}
    ${lbl(16, 384, "ADDRESS")}${line(16, 388, 178, 388)}${t(16, 400, esc(r.consigneeAddress || ""), 8)}
    ${line(16, 416, 178, 416)}${line(16, 432, 178, 432)}
    ${lbl(16, 446, "GSTIN :")}${t(52, 446, esc(r.consigneeGstin || ""), 8, 700)}

    <!-- ===== FOR ACKNOWLEDGEMENT table ===== -->
    ${vtext(ax - 7, ay + hh + vh / 2, "FOR ACKNOWLEDGEMENT", 13)}
    ${box(ax, ay, aw, hh + vh)}
    ${headCells}${valCells}
    ${line(ax, ay + hh, ax + aw, ay + hh)}

    <!-- charge row under table -->
    ${box(ax, ay + hh + vh, aw, 56)}
    ${lbl(ax + 4, ay + hh + vh + 12, "TRUCK NO.:")}${t(ax + 4, ay + hh + vh + 26, esc(r.truckNo || ""), 9, 700)}
    ${line(ax + 90, ay + hh + vh, ax + 90, ay + hh + vh + 56)}
    ${lbl(ax + 94, ay + hh + vh + 12, "DELIVERY INST.")}${t(ax + 94, ay + hh + vh + 26, esc(r.deliveryInst || ""), 8)}
    ${line(ax + 190, ay + hh + vh, ax + 190, ay + hh + vh + 56)}
    ${lbl(ax + 194, ay + hh + vh + 12, "INVOICE NO. / STN.")}${t(ax + 194, ay + hh + vh + 26, esc(r.invoiceNo || ""), 8)}
    ${line(ax + 250, ay + hh + vh, ax + 250, ay + hh + vh + 56)}
    ${lbl(ax + 254, ay + hh + vh + 12, "DECLARED VALUE RS.")}${t(ax + 254, ay + hh + vh + 26, esc(r.declaredValue || ""), 9, 700)}

    <!-- ===== right edge vertical labels ===== -->
    ${vtext(508, 190, "CONSIGNEE COPY", 10)}
    ${vtext(524, 260, "For TANISH LOGISTIC", 10)}
    ${vtext(540, 330, "Booking Incharge", 10)}
    ${line(500, 148, 500, 384)}${line(516, 148, 516, 384)}${line(532, 148, 532, 384)}

    <!-- ===== footer ===== -->
    ${line(12, 720, 547, 720)}
    ${t(16, 732, "We do hereby Certify that I/We subject ourselves / ourselves to the about particulars of goods Consigned by me/us are have been correct entered into and the consignment is booked with full acknowledgement of the", 6.5)}
    ${t(16, 741, "terms and condition of G.C Note appear on the reverse and Which I/we accept Received the goods on terms & Condition printed overleaf.", 6.5)}
    ${t(16, 752, "PAYMENT MUST BE MADE BY ACCOUNT PAYEE CHEQUE OR DRAFT ONLY IN FAVOUR OF TANISH LOGISTIC", 7, 900)}
    ${t(16, 763, "Not Responsible for leakage & Breakage Delivery against Payments. All Disputes Subject to MANDI GOBIND GARH Jurisdiction.", 6.5)}
  </svg>`;
}

export function lrHtml(r) {
  return `<html><head><meta charset="utf-8" /><style>
    @page { size: 148mm 210mm; margin: 0; }
    body { margin:0; padding:0; }
    svg { display:block; }
  </style></head><body>${lrSvg(r)}</body></html>`;
}
