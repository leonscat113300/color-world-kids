# ساخت فایل APK از «دنیای رنگ‌ها» / Build the APK

The web app is a standard Next.js project, so you have two ways to get it on Android phones.

---

## روش ۱ — نصب مستقیم بدون نیاز به ساخت APK (سریع‌ترین راه) — PWA

The app ships with a full PWA manifest (`public/manifest.json`) and icons.

1. Open the app URL in **Chrome (Android)**.
2. Tap **⋮ → Add to Home screen / Install app**.
3. The app installs with its own icon, full-screen (standalone), exactly like an APK app — no store needed.

## روش ۲ — ساخت فایل APK واقعی با Capacitor (نیازمند Android Studio)

### پیش‌نیازها (Requirements)
- Node.js 18+
- Android Studio (this installs the Android SDK automatically)
- A hosted URL of this app (any hosting: Vercel, your own server, etc.)

### مراحل (Steps)

```bash
# 1. inside the unzipped project
npm install

# 2. add Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 3. create capacitor.config.json
#    replace https://YOUR-APP-URL with the address where this app is hosted
{
  "appId": "com.candyteam.colorworld",
  "appName": "Color World Kids",
  "webDir": "public",
  "server": { "url": "https://YOUR-APP-URL", "cleartext": false }
}

# 4. add the Android platform and open Android Studio
npx cap add android
npx cap open android
```

5. In Android Studio: **Build → Build Bundle(s)/APK(s) → Build APK(s)**.
6. Your APK is generated at:
   `android/app/build/outputs/apk/debug/app-debug.apk`
7. For a release/signed APK use **Build → Generate Signed Bundle / APK** and follow the wizard (keystore + signing).

### آیکون اپ (App icon)
Android Studio: right-click `res` → **New → Image Asset** → use `public/icons/icon-512.png` as the source image.

---

## فایل‌های تحویلی (Deliverables)

| فایل | مسیر |
|---|---|
| سورس کامل پروژه | `GET /api/download` (ZIP file) |
| کاتالوگ JSON همه‌ی ۲۰ دسته و ۲۰۰۰ نقاشی | `GET /api/catalog` |
| API ذخیره/لیست نقاشی‌ها | `GET/POST /api/artworks` |
