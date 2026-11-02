import React from "react";
import { TouchableOpacity, Text, TextInput, View, StyleSheet } from "react-native";
import { colors, font, touch } from "../theme";

export function BigButton({ title, onPress, variant = "primary", icon }) {
  const bg =
    variant === "primary" ? colors.accent :
    variant === "dark" ? colors.primary :
    variant === "danger" ? colors.danger : colors.card;
  const fg = variant === "light" ? colors.text : "#fff";
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.btn, { backgroundColor: bg, minHeight: touch.min }, variant === "light" && { borderWidth: 1.5, borderColor: colors.border }]}
    >
      {icon ? <Text style={[styles.btnIcon, { color: fg }]}>{icon}</Text> : null}
      <Text style={[styles.btnText, { color: fg }]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function Field({ label, value, onChangeText, placeholder, keyboardType, multiline }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType || "default"}
        multiline={multiline}
        style={[styles.input, { fontSize: font.input }, multiline && { minHeight: 70, textAlignVertical: "top" }]}
      />
    </View>
  );
}

// Large tappable option row for checkbox-like groups (payment mode etc.)
export function OptionRow({ label, selected, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.opt, selected && styles.optSel]}>
      <View style={[styles.box, selected && styles.boxSel]}>{selected ? <Text style={styles.check}>✓</Text> : null}</View>
      <Text style={styles.optText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function SectionTitle({ children }) {
  return <Text style={styles.section}>{children}</Text>;
}

const styles = StyleSheet.create({
  btn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14, marginVertical: 6 },
  btnText: { fontSize: font.button, fontWeight: "700" },
  btnIcon: { fontSize: 24, marginRight: 10 },
  field: { marginBottom: 14 },
  label: { fontSize: font.label, fontWeight: "600", color: colors.primary, marginBottom: 6 },
  input: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, color: colors.text },
  opt: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, padding: 14, marginBottom: 10, minHeight: touch.min },
  optSel: { borderColor: colors.primary, backgroundColor: "#EAF0F9" },
  box: { width: 30, height: 30, borderRadius: 8, borderWidth: 2, borderColor: colors.border, alignItems: "center", justifyContent: "center", marginRight: 14 },
  boxSel: { backgroundColor: colors.primary, borderColor: colors.primary },
  check: { color: "#fff", fontSize: 20, fontWeight: "900" },
  optText: { fontSize: font.body, fontWeight: "600", color: colors.text, flex: 1 },
  section: { fontSize: font.heading, fontWeight: "800", color: colors.primary, marginTop: 18, marginBottom: 10 },
});
