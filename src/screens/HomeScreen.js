import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { colors, font } from "../theme";
import { BigButton } from "../components/ui";

export default function HomeScreen({ records, onNew, onOpen, onDelete }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LR Generator</Text>
      <Text style={styles.sub}>Create consignment notes — simple and fast</Text>

      <BigButton title="＋  New LR" onPress={onNew} variant="primary" />

      <Text style={styles.listHead}>Saved LRs ({records.length})</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No LRs yet. Tap the button above to create one.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onOpen(item)} activeOpacity={0.75}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cn}>C.N. No: {item.cnNo}</Text>
              <Text style={styles.route}>{item.from} → {item.to}</Text>
              <Text style={styles.party}>{item.consignorName || "—"} → {item.consigneeName || "—"}</Text>
              <Text style={styles.date}>{item.bookingDate}</Text>
            </View>
            <TouchableOpacity style={styles.del} onPress={() => onDelete(item.id)}>
              <Text style={styles.delText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 20, paddingTop: 54 },
  title: { fontSize: font.title, fontWeight: "900", color: colors.primary },
  sub: { fontSize: font.body, color: colors.muted, marginBottom: 16 },
  listHead: { fontSize: font.heading, fontWeight: "800", color: colors.primary, marginTop: 22, marginBottom: 8 },
  empty: { fontSize: font.body, color: colors.muted, textAlign: "center", marginTop: 24 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  cn: { fontSize: font.heading, fontWeight: "800", color: colors.text },
  route: { fontSize: font.body, fontWeight: "600", color: colors.primary, marginTop: 2 },
  party: { fontSize: font.small, color: colors.muted, marginTop: 2 },
  date: { fontSize: font.small, color: colors.muted },
  del: { padding: 10, marginLeft: 8 },
  delText: { fontSize: 22, color: colors.danger, fontWeight: "700" },
});
