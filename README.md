# LR / Consignment Note Generator (Mobile App)

A minimal, large-type React Native (Expo) app for generating digital Lorry Receipts /
Consignment Notes for transport & logistics — designed so first-time smartphone users
can use it without help.

## Features
- One-tap **New LR** with auto C.N. numbering and today's date pre-filled
- All paper-LR fields: consignor/consignee, goods, weights, freight & charges, truck no.
- Big checkbox-style options (Paid / To Pay / TBB, billing party, GSTIN paid by)
- Saved LR list with delete; open any record for a clean preview
- **PDF download / share** styled like the classic LR form (expo-print + expo-sharing)
- Minimal UI: large fonts, 60px+ touch targets, high contrast, plain-English labels

## Run
```bash
npm install
npm start          # then press "w" for web preview or scan QR for Expo Go
npm run android    # Android device/emulator
```

## Get the app on your phone

**Fastest (today):** install **Expo Go** from Play Store, then on your computer run
`npm install && npm start` and scan the QR code with Expo Go.

**Standalone APK:** on your computer run
```bash
npm install -g eas-cli && eas login
npx eas build --platform android --profile preview
```
Download the `.apk` from the printed link onto your phone and install it.
Then attach that APK to the GitHub release so it shows as a downloadable asset:
```bash
gh release upload v1.0.0 ./app.apk
```
