import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, StatusBar, Alert } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { colors } from "./src/theme";
import HomeScreen from "./src/screens/HomeScreen";
import LRFormScreen from "./src/screens/LRFormScreen";
import PreviewScreen from "./src/screens/PreviewScreen";
import { loadRecords, addRecord, removeRecord } from "./src/storage";

export default function App() {
  const [screen, setScreen] = useState("home"); // home | form | preview
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);

  const refresh = useCallback(async () => setRecords(await loadRecords()), []);
  useEffect(() => { refresh(); }, [refresh]);

  const onNew = () => { setEditing(null); setScreen("form"); };
  const onOpen = (r) => { setPreview(r); setScreen("preview"); };
  const onDelete = (id) =>
    Alert.alert("Delete karein?", "Ye LR hamesha ke liye delete ho jayega.", [
      { text: "Rokein", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { setRecords(await removeRecord(id)); } },
    ]);
  const onSave = async (record) => {
    const existing = records.find((x) => x.id === record.id);
    let next;
    if (existing) {
      next = records.map((x) => (x.id === record.id ? record : x));
      const { saveRecords } = await import("./src/storage");
      await saveRecords(next);
    } else {
      next = await addRecord(record);
    }
    setRecords(next);
    setPreview(record);
    setScreen("preview");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ExpoStatusBar style="dark" />
      {screen === "home" && <HomeScreen records={records} onNew={onNew} onOpen={onOpen} onDelete={onDelete} />}
      {screen === "form" && (
        <LRFormScreen
          initial={editing}
          onSave={onSave}
          onCancel={() => { setEditing(null); setScreen(preview ? "preview" : "home"); }}
        />
      )}
      {screen === "preview" && preview && (
        <PreviewScreen
          record={preview}
          onBack={() => setScreen("home")}
          onEdit={(r) => { setEditing(r); setScreen("form"); }}
        />
      )}
    </SafeAreaView>
  );
}
