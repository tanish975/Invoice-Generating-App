import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { colors, font } from "../theme";
import { BigButton, Field, OptionRow, SectionTitle } from "../components/ui";
import { nextCNNo } from "../storage";

const EMPTY = {
  cnNo: "", bookingDate: "", from: "", to: "", ewayBill: "",
  consignorName: "", consignorAddress: "", consignorGstin: "",
  consigneeName: "", consigneeAddress: "", consigneeGstin: "",
  paymentMode: "To Pay", billingParty: "Consignee", gstinPaidBy: ["Consignee"],
  truckNo: "", packages: "", goods: "", invoiceNo: "", declaredValue: "",
  nettWeight: "", grossWeight: "", freight: "", rate: "", insCh: "",
  stCh: "", serviceTax: "", cess: "", total: "", privateMark: "",
  mrBillNo: "", deliveryInst: "",
};

export default function LRFormScreen({ initial, onSave, onCancel }) {
  const [f, setF] = useState(EMPTY);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    if (initial) { setF({ ...EMPTY, ...initial }); return; }
    const today = new Date();
    const d = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    nextCNNo().then((n) => setF((s) => ({ ...s, cnNo: String(n), bookingDate: d })));
  }, []);

  const valid = f.consignorName && f.consigneeName && f.from && f.to;
  const save = () => {
    if (!valid) { Alert.alert("Required fields", "Please fill Consignor, Consignee, From and To."); return; }
    onSave({ ...f, id: initial?.id || String(Date.now()), total: f.total || f.freight });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{initial ? "Edit LR" : "New LR"}</Text>

      <SectionTitle>Basic Details</SectionTitle>
      <View style={styles.row2}>
        <View style={{ flex: 1, marginRight: 8 }}><Field label="C.N. No" value={f.cnNo} onChangeText={set("cnNo")} keyboardType="numeric" /></View>
        <View style={{ flex: 1 }}><Field label="Booking Date" value={f.bookingDate} onChangeText={set("bookingDate")} placeholder="DD/MM/YYYY" /></View>
      </View>
      <View style={styles.row2}>
        <View style={{ flex: 1, marginRight: 8 }}><Field label="From" value={f.from} onChangeText={set("from")} placeholder="Vadodara" /></View>
        <View style={{ flex: 1 }}><Field label="To" value={f.to} onChangeText={set("to")} placeholder="Delhi" /></View>
      </View>
      <Field label="Eway Bill No." value={f.ewayBill} onChangeText={set("ewayBill")} keyboardType="numeric" />
      <Field label="Truck No." value={f.truckNo} onChangeText={set("truckNo")} placeholder="GJ-01-AB-1234" />

      <SectionTitle>Payment</SectionTitle>
      <Text style={styles.mini}>Mode of Payment</Text>
      <View style={styles.row2}>
        {["Paid", "To Pay", "TBB"].map((m) => (
          <View key={m} style={{ flex: 1, marginHorizontal: 3 }}>
            <OptionRow label={m} selected={f.paymentMode === m} onPress={() => setF((s) => ({ ...s, paymentMode: m }))} />
          </View>
        ))}
      </View>
      <Text style={styles.mini}>Billing Party</Text>
      <View style={styles.row2}>
        {["Consignor", "Consignee"].map((m) => (
          <View key={m} style={{ flex: 1, marginHorizontal: 3 }}>
            <OptionRow label={m} selected={f.billingParty === m} onPress={() => setF((s) => ({ ...s, billingParty: m }))} />
          </View>
        ))}
      </View>
      <Text style={styles.mini}>GSTIN Paid By (tick all that apply)</Text>
      <View style={styles.row2}>
        {["Consignor", "Consignee"].map((m) => (
          <View key={m} style={{ flex: 1, marginHorizontal: 3 }}>
            <OptionRow
              label={m}
              selected={(f.gstinPaidBy || []).includes(m)}
              onPress={() => setF((s) => {
                const cur = Array.isArray(s.gstinPaidBy) ? s.gstinPaidBy : (s.gstinPaidBy ? [s.gstinPaidBy] : []);
                const next = cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m];
                return { ...s, gstinPaidBy: next };
              })}
            />
          </View>
        ))}
      </View>

      <SectionTitle>Consignor (Sender)</SectionTitle>
      <Field label="Name *" value={f.consignorName} onChangeText={set("consignorName")} placeholder="Name" />
      <Field label="Address" value={f.consignorAddress} onChangeText={set("consignorAddress")} multiline placeholder="Address" />
      <Field label="GSTIN" value={f.consignorGstin} onChangeText={set("consignorGstin")} placeholder="24AAAAA0000A1Z5" />

      <SectionTitle>Consignee (Receiver)</SectionTitle>
      <Field label="Name *" value={f.consigneeName} onChangeText={set("consigneeName")} placeholder="Name" />
      <Field label="Address" value={f.consigneeAddress} onChangeText={set("consigneeAddress")} multiline placeholder="Address" />
      <Field label="GSTIN" value={f.consigneeGstin} onChangeText={set("consigneeGstin")} placeholder="24AAAAA0000A1Z5" />

      <SectionTitle>Goods (Cargo)</SectionTitle>
      <View style={styles.row2}>
        <View style={{ flex: 1, marginRight: 8 }}><Field label="No. of Package" value={f.packages} onChangeText={set("packages")} keyboardType="numeric" /></View>
        <View style={{ flex: 1 }}><Field label="Invoice No." value={f.invoiceNo} onChangeText={set("invoiceNo")} /></View>
      </View>
      <Field label="Nature of Goods" value={f.goods} onChangeText={set("goods")} multiline placeholder="e.g. Cotton bales" />
      <View style={styles.row2}>
        <View style={{ flex: 1, marginRight: 8 }}><Field label="Nett Weight" value={f.nettWeight} onChangeText={set("nettWeight")} keyboardType="numeric" /></View>
        <View style={{ flex: 1 }}><Field label="Gross Weight" value={f.grossWeight} onChangeText={set("grossWeight")} keyboardType="numeric" /></View>
      </View>
      <Field label="Declared Value (Rs.)" value={f.declaredValue} onChangeText={set("declaredValue")} keyboardType="numeric" />

      <SectionTitle>Freight & Charges</SectionTitle>
      <View style={styles.row2}>
        <View style={{ flex: 1, marginRight: 8 }}><Field label="Freight Rs." value={f.freight} onChangeText={set("freight")} keyboardType="numeric" /></View>
        <View style={{ flex: 1 }}><Field label="TOTAL Rs." value={f.total} onChangeText={set("total")} keyboardType="numeric" /></View>
      </View>
      <View style={styles.row2}>
        <View style={{ flex: 1, marginRight: 8 }}><Field label="Rate" value={f.rate} onChangeText={set("rate")} keyboardType="numeric" /></View>
        <View style={{ flex: 1 }}><Field label="Ins. Ch." value={f.insCh} onChangeText={set("insCh")} keyboardType="numeric" /></View>
      </View>
      <View style={styles.row2}>
        <View style={{ flex: 1, marginRight: 8 }}><Field label="St. Ch." value={f.stCh} onChangeText={set("stCh")} keyboardType="numeric" /></View>
        <View style={{ flex: 1 }}><Field label="Service Tax" value={f.serviceTax} onChangeText={set("serviceTax")} keyboardType="numeric" /></View>
      </View>
      <Field label="Cess" value={f.cess} onChangeText={set("cess")} keyboardType="numeric" />

      <SectionTitle>Extra</SectionTitle>
      <Field label="Private Mark" value={f.privateMark} onChangeText={set("privateMark")} />
      <Field label="M.R./Bill No." value={f.mrBillNo} onChangeText={set("mrBillNo")} />
      <Field label="Delivery Instructions" value={f.deliveryInst} onChangeText={set("deliveryInst")} multiline />

      <View style={{ marginTop: 20 }}>
        <BigButton title="💾  Save & Preview" onPress={save} variant="dark" />
        <BigButton title="Cancel" onPress={onCancel} variant="light" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 20, paddingTop: 54 },
  title: { fontSize: font.title, fontWeight: "900", color: colors.primary, marginBottom: 8 },
  row2: { flexDirection: "row" },
  mini: { fontSize: font.label, fontWeight: "700", color: colors.muted, marginBottom: 4 },
});
