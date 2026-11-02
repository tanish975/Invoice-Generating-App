import React from "react";
import { View, Text, ScrollView, StyleSheet, Alert, Platform } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { colors, font, useScale } from "../theme";
import { BigButton } from "../components/ui";
import { lrHtml } from "../pdf";

export default function PreviewScreen({ record, onBack, onEdit }) {
  const k = useScale();
  const sharePdf = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: lrHtml(record) });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: "application/pdf", dialogTitle: `LR-${record.cnNo}.pdf` });
      } else {
        Alert.alert("PDF ready", uri);
      }
    } catch (e) {
      Alert.alert("Error", String(e.message || e));
    }
  };

  const r = record;
  const cb = (on) => (on ? "☑" : "☐");
  const gstinBy = Array.isArray(r.gstinPaidBy) ? r.gstinPaidBy : (r.gstinPaidBy ? [r.gstinPaidBy] : []);
  const line = (l, v) => (
    <View style={styles.line}><Text style={styles.lk}>{l}</Text><Text style={styles.lv}>{v || "—"}</Text></View>
  );

  return (
    <ScrollView style={[styles.container, { padding: 20 * k, paddingTop: 54 * k }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.stamp}>
        <Text style={styles.stampBrand}>TANISH LOGISTIC</Text>
        <Text style={styles.stampCn}>C.N. No: {r.cnNo}</Text>
      </View>
      {line("Booking Date", r.bookingDate)}
      {line("Route", `${r.from} → ${r.to}`)}
      <View style={styles.lineCol}>
        <Text style={styles.lk}>To be billed at</Text>
        <Text style={styles.chk}>{cb(r.paymentMode === "TBB")} TBB   {cb(r.paymentMode === "To Pay")} To Pay   {cb(r.paymentMode === "Paid")} Paid</Text>
        <Text style={styles.chk}>Billing Party: {cb(r.billingParty === "Consignor")} Consignor  {cb(r.billingParty === "Consignee")} Consignee</Text>
        <Text style={styles.chk}>GSTIN Paid by: {cb(gstinBy.includes("Consignor"))} Consignor  {cb(gstinBy.includes("Consignee"))} Consignee</Text>
      </View>
      {line("Consignor", r.consignorName)}
      {line("Consignee", r.consigneeName)}
      {line("Goods", `${r.packages || "-"} pkg — ${r.goods || "-"}`)}
      {line("Weight (Net/Gross)", `${r.nettWeight || "-"} / ${r.grossWeight || "-"}`)}
      {line("Truck No.", r.truckNo)}
      {line("Freight / TOTAL", `Rs. ${r.freight || "-"} / Rs. ${r.total || "-"}`)}

      <View style={{ marginTop: 20 }}>
        <BigButton title="📄  PDF Download / Share" onPress={sharePdf} variant="primary" />
        <BigButton title="✏️  Edit" onPress={() => onEdit(r)} variant="dark" />
        <BigButton title="←  Back to Home" onPress={onBack} variant="light" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 20, paddingTop: 54 },
  stamp: { backgroundColor: colors.primary, borderRadius: 16, padding: 18, marginBottom: 14 },
  stampBrand: { color: "#fff", fontSize: font.heading, fontWeight: "900", letterSpacing: 1 },
  stampCn: { color: colors.accent, fontSize: font.heading, fontWeight: "800", marginTop: 4 },
  line: { flexDirection: "row", backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  lineCol: { backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  chk: { fontSize: font.body, fontWeight: "700", color: colors.text, marginTop: 4 },
  lk: { width: 150, fontSize: font.small, fontWeight: "700", color: colors.muted, textTransform: "uppercase" },
  lv: { flex: 1, fontSize: font.body, fontWeight: "700", color: colors.text },
});
