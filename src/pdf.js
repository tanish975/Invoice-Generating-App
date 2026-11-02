// Exact replica of the paper TANISH LOGISTIC Lorry Receipt.
// LANDSCAPE slip (A5 landscape, 210x148mm -> 794x559 units), drawn as a
// self-contained vector SVG so geometry is identical in every renderer.
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

import { LOGO_B64 } from "./logo";

const W = 794, H = 559; // A5 landscape @96dpi
const INK = "#000", BLUE = "#1B3A6B";

export function lrSvg(r) {
  const paidBy = Array.isArray(r.gstinPaidBy) ? r.gstinPaidBy : (r.gstinPaidBy ? [r.gstinPaidBy] : []);
  const box = (x, y, w, h, sw = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="${sw}"/>`;
  const line = (x1, y1, x2, y2, w = 1) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="${w}"/>`;
  const t = (x, y, str, size = 10, w = 400, fill = INK, anchor = "start") =>
    `<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}">${esc(str)}</text>`;
  const lbl = (x, y, str, size = 8) => t(x, y, str, size, 700);
  // data-adaptive helpers: wrap long text and shrink font to fit cells
  const wrap = (str, maxChars) => {
    const words = String(str || "").split(/\s+/).filter(Boolean);
    const lines = []; let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length <= maxChars) cur = (cur + " " + w).trim();
      else { if (cur) lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    return lines.length ? lines : [""];
  };
  const fitSize = (str, maxWidth, base, min = 5) => {
    let size = base;
    while (String(str || "").length * size * 0.52 > maxWidth && size > min) size -= 0.5;
    return size;
  };
  const wrapped = (x, y, str, size, maxWidth, maxChars, lineH = null) => {
    const lines = wrap(str, maxChars).slice(0, 8);
    const lh = lineH || size + 2;
    return lines.map((ln, i) => t(x, y + i * lh, ln, fitSize(ln, maxWidth, size), 400)).join("");
  };
  const cb = (x, y, checked) =>
    `<rect x="${x}" y="${y}" width="11" height="11" fill="#fff" stroke="${INK}" stroke-width="1.4"/>` +
    (checked ? `<text x="${x + 1}" y="${y + 10}" font-size="11" font-weight="900" fill="${INK}">✓</text>` : "");

  // main table geometry
  const tx = 12, ty = 268, tw = 776;          // table x,y,width
  const hh = 26;                                // header height
  const cols = [                                // [label lines, value, width] for the 6 left columns
    [["No of", "Pakage"], r.packages, 62], [["Nature of Goods", "(said to Consign)"], r.goods, 200],
    [["Nett", "Weight"], r.nettWeight, 66], [["Gross", "Weight"], r.grossWeight, 66],
    [["Rate"], r.rate, 58], [["Freight", "Rs."], r.freight, 64],
  ];
  let cx = tx;
  const headBoxes = cols.map((c) => { const s = box(cx, ty, c[2], hh); cx += c[2]; return s; }).join("");
  cx = tx;
  const heads = cols.map((c) => {
    const s = headBoxes.length ? "" : "";
    const lbls = lbl(cx + c[2] / 2, ty + 11, c[0][0], 7.5) + (c[0][1] ? lbl(cx + c[2] / 2, ty + 21, c[0][1], 7.5) : "");
    cx += c[2]; return lbls;
  }).join("");
  const bodyBottom = 440;
  cx = tx;
  const bodies = cols.map((c) => {
    const s = box(cx, ty + hh, c[2], bodyBottom - ty - hh) + wrapped(cx + 3, ty + hh + 16, c[1], 10, c[2] - 6, Math.floor((c[2] - 6) / 5.2), 12);
    cx += c[2]; return s;
  }).join("");
  const chx = cx;                               // charges block x
  const chw = 84;                              // label+value width
  const chRows = [["Ins. Ch.", r.insCh], ["St. Ch.", r.stCh], ["Service Tax", r.serviceTax], ["Cess", r.cess], ["TOTAL", r.total]];
  const rh = (bodyBottom - ty - hh) / 5;
  const charges = box(chx, ty + hh, chw, bodyBottom - ty - hh) + chRows.map((rw, i) => {
    const y = ty + hh + i * rh;
    return line(chx, y, chx + chw, y) + line(chx + 40, y, chx + 40, y + rh) +
           lbl(chx + 3, y + rh - 6, rw[0], 7) + t(chx + 43, y + rh - 6, rw[1] || "", 8, 700);
  }).join("");
  const ackx = chx + chw;                       // acknowledgement area x
  const ackw = 788 - ackx - 50;                // leave room for Private Mark / M.R. columns
  let ackLines = "";
  for (let y = ty + hh + 24; y < bodyBottom; y += 24) ackLines += line(ackx, y, ackx + ackw, y);
  const ack = box(ackx, ty, ackw, bodyBottom - ty) +
    `<rect x="${ackx}" y="${ty}" width="${ackw}" height="${hh}" fill="#dfe7f2" stroke="${INK}"/>` +
    t(ackx + ackw / 2, ty + 17, "FOR ACKNOWLEDGEMENT", 8.5, 900, INK, "middle") + ackLines;
  // Private Mark / M.R. right columns
  const pmx = ackx + ackw;
  const pm = box(pmx, ty, 50, bodyBottom - ty) + lbl(pmx + 25, ty + 13, "Private", 5.5) + lbl(pmx + 25, ty + 21, "Mark", 5.5) +
             line(pmx, ty + hh, pmx + 50, ty + hh) + box(pmx, bodyBottom - 30, 50, 30) + lbl(pmx + 25, bodyBottom - 17, "M.R./Bill", 6) + lbl(pmx + 25, bodyBottom - 8, "No.", 6);
  // bottom row of table
  const by = bodyBottom, bh = 30;
  const bottomRow =
    box(tx, by, 210, bh) + lbl(tx + 4, by + 12, "Invoice No. / Stn.") + t(tx + 4, by + 25, r.invoiceNo || "", 9, 700) +
    line(tx + 210, by, tx + 210, by + bh) +
    box(tx + 210, by, 110, bh) + lbl(tx + 214, by + 12, "Declared Value Rs.") + t(tx + 214, by + 25, r.declaredValue || "", 9, 700) +
    line(tx + 320, by, tx + 320, by + bh) +
    box(tx + 320, by, 230, bh) + lbl(tx + 324, by + 12, "Delivery Inst.") + wrapped(tx + 324, by + 23, r.deliveryInst, 8, 220, 46, 9) +
    line(tx + 550, by, tx + 550, by + bh) + line(tx + 688, by, tx + 688, by + bh) +
    box(tx + 550, by, 138, bh) + lbl(tx + 554, by + 12, "Truck No.:") + t(tx + 554, by + 25, r.truckNo || "", 9, 700) +
    box(tx + 688, by, 88, bh) + t(tx + 692, by + 7, "Not Responsible for", 4.5) + t(tx + 692, by + 12.5, "leakage & Breakage.", 4.5) + t(tx + 692, by + 18, "Delivery against", 4.5) + t(tx + 692, by + 23.5, "Payments. Disputes:", 4.5) + t(tx + 692, by + 29, "MANDI GOBIND GARH", 4.5);

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Helvetica, Arial, sans-serif">
    <rect x="5" y="5" width="${W - 10}" height="${H - 10}" fill="#fff" stroke="${INK}" stroke-width="1.5"/>

    <!-- ===== header ===== -->
    <defs><clipPath id="logoclip"><circle cx="52" cy="62" r="30"/></clipPath></defs>
    <image x="21" y="31" width="62" height="62" clip-path="url(#logoclip)" href="${LOGO_B64}" preserveAspectRatio="xMidYMid meet"/>
    <circle cx="52" cy="62" r="30" fill="none" stroke="${BLUE}" stroke-width="2"/>
    ${t(245, 24, "ॐ", 16, 700, INK, "middle")}
    ${t(560, 24, "Mob.: 9924204744", 10, 700)}
    ${t(95, 62, "TANISH LOGISTIC", 38, 900, BLUE)}
    ${t(95, 84, "H.O. : # No. 393 Street No. 10 Sec 2B Adrash Nagar Mandi Gobind Garh Dist. Fateh Garh Sahib, PB. 147301", 7)}
    ${t(95, 94, "B.O. : 419, Valamhub Nr. Sidheshwar Harbor B/h Lilaji Hotel NH 8, Kapurai Chokdi Vadodara (GJ) Pin No. 390004", 7)}
    ${line(12, 104, 540, 104)}
    ${t(16, 118, "GST No.:  03BAPPS3792D1ZG", 9, 700)}
    ${t(250, 118, "At Owner's Risk", 10, 800)}
    ${t(370, 118, "Eway Bill.:", 9, 700)}${line(425, 116, 535, 116)}

    <!-- billing box (top right) -->
    ${box(545, 10, 243, 94)}
    ${lbl(551, 22, "To be Billed at")}
    ${lbl(551, 36, "Mode of Payment")}
    ${cb(551, 40, r.paymentMode === "TBB")}${t(566, 49, "TBB", 9)}
    ${cb(600, 40, r.paymentMode === "To Pay")}${t(615, 49, "To Pay", 9)}
    ${cb(655, 40, r.paymentMode === "Paid")}${t(670, 49, "Paid", 9)}
    ${lbl(551, 64, "Billing Party")}${line(610, 62, 782, 62)}
    ${lbl(551, 78, "GSTIN Paid by :")}
    ${cb(551, 82, paidBy.includes("Consignor"))}${t(566, 91, "Consignor", 9)}
    ${cb(625, 82, paidBy.includes("Consignee"))}${t(640, 91, "Consignee", 9)}
    ${cb(710, 82, paidBy.includes("Transport"))}${t(725, 91, "Transport", 9)}

    <!-- ===== party + CN boxes ===== -->
    ${box(12, 128, 250, 132)}
    ${lbl(18, 144, "Consignor")}${line(70, 146, 256, 146)}${t(72, 141, esc(r.consignorName || ""), fitSize(r.consignorName, 180, 10, 7), 700)}
    ${lbl(18, 172, "Address")}${line(60, 176, 256, 176)}${wrapped(62, 168, r.consignorAddress, 8, 190, 44, 10)}${line(18, 198, 256, 198)}
    
    ${line(12, 236, 262, 236)}${line(58, 236, 58, 260)}
    ${lbl(16, 254, "GSTIN :", 8)}${t(64, 254, esc(r.consignorGstin || ""), 9, 700)}

    ${box(268, 128, 250, 132)}
    ${lbl(274, 144, "Consignee")}${line(330, 146, 512, 146)}${t(332, 141, esc(r.consigneeName || ""), fitSize(r.consigneeName, 175, 10, 7), 700)}
    ${lbl(274, 172, "Address")}${line(316, 176, 512, 176)}${wrapped(318, 168, r.consigneeAddress, 8, 190, 44, 10)}${line(274, 198, 512, 198)}
    
    ${line(268, 236, 518, 236)}${line(314, 236, 314, 260)}
    ${lbl(272, 254, "GSTIN :", 8)}${t(320, 254, esc(r.consigneeGstin || ""), 9, 700)}

    ${box(524, 128, 264, 132)}
    ${lbl(530, 148, "C.N. No :")}${t(782, 158, String(r.cnNo || ""), 20, 900, INK, "end")}
    ${line(530, 164, 782, 164)}
    ${lbl(530, 178, "Booking Date")}${line(610, 180, 782, 180)}${t(780, 176, esc(r.bookingDate || ""), 8, 700, INK, "end")}
    ${line(530, 196, 782, 196)}
    ${lbl(530, 210, "From")}${line(570, 212, 782, 212)}${t(782, 208, esc(r.from || ""), 8, 700, INK, "end")}
    ${line(530, 228, 782, 228)}
    ${lbl(530, 242, "To")}${line(560, 244, 782, 244)}${t(782, 240, esc(r.to || ""), 8, 700, INK, "end")}
    ${line(530, 256, 782, 256)}

    <!-- ===== main acknowledgement table ===== -->
    ${headBoxes}${heads}${bodies}${charges}${ack}${pm}${bottomRow}

    <!-- ===== footer ===== -->
    ${line(12, 482, 788, 482)}
    ${t(16, 494, "We do hereby Certify that I/We subject ourselves / ourselves to the about particulars of goods Consigned by me/us are have been correct entered into and", 6.5)}
    ${t(16, 503, "the consignment is booked with full acknowledgement of the terms and condition of G.C Note appear on the reverse and Which I/we accept", 6.5)}
    ${t(16, 512, "Received the goods on terms & Condition printed overleaf.", 6.5)}
    ${t(16, 526, "PAYMENT MUST BE MADE BY ACCOUNT PAYEE CHEQUE OR DRAFT ONLY IN FAVOUR OF TANISH LOGISTIC", 7.5, 900)}
    ${cb(500, 488, false)}${t(515, 497, "Consignor", 8)}
    ${cb(500, 503, false)}${t(515, 512, "Consignee", 8)}
    ${cb(500, 518, false)}${t(515, 527, "Driver", 8)}
    ${t(660, 510, "For TANISH LOGISTIC", 11, 900, INK, "middle")}
    ${t(740, 548, "Booking Incharge", 9, 700, INK, "middle")}
  </svg>`;
}

export function lrHtml(r) {
  return `<html><head><meta charset="utf-8" /><style>
    @page { size: 210mm 148mm; margin: 0; }
    body { margin:0; padding:0; }
    svg { display:block; }
  </style></head><body>${lrSvg(r)}</body></html>`;
}
