# ساخت فایل APK از «دنیای رنگ‌ها» / Build the APK

The app is a **fully offline** kids' coloring book (drawings are generated in the browser,
artworks are saved on-device in IndexedDB), so the Android APK needs **no server at all**.

---

## روش ۰ — فایل آماده (Prebuilt APK)

A ready, installable debug APK ships with this repository:

```
download/color-world-kids.apk      (~7 MB, Android 7.0+)
```

Copy it to a phone and tap it (allow "install from unknown sources" when asked).
App id: `com.candyteam.colorworld` — launcher name: «دنیای رنگ‌ها».

## روش ۱ — ساخت مجدد با یک دستور (One-command rebuild)

On any machine with Node.js/Bun + JDK 17+ + Android SDK (Android Studio counts):

```bash
bash apk-kit/build-apk.sh
```

The script (in `apk-kit/build-apk.sh`) automatically:
1. Builds the web app as a **static export** (`out/`),
2. Copies it into `apk-kit/web/`,
3. Installs Capacitor, creates/syncs the Android project,
4. Regenerates the launcher icons from `public/icons/icon-512.png`,
5. Runs `gradlew assembleDebug`,
6. Copies the result to `download/color-world-kids.apk`.

Environment: set `ANDROID_HOME` (and `JAVA_HOME` if javac is not on PATH).
Without an Android SDK, install Android Studio first — nothing else is needed.

## روش ۲ — نصب مستقیم به‌عنوان اپ (PWA، بدون APK)

The web app ships with a full PWA manifest (`public/manifest.json`) and icons.

1. Open the app URL in **Chrome (Android)**.
2. Tap **⋮ → Add to Home screen / Install app**.
3. The app installs with its own icon, full-screen (standalone), exactly like an APK app — no store needed.

## روش ۳ — ساخت دستی با Capacitor (Android Studio)

```bash
# 1. inside the project
npm install
cd apk-kit
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android        # uses apk-kit/capacitor.config.json
npx cap open android       # opens Android Studio
```

Then: **Build → Build Bundle(s)/APK(s) → Build APK(s)** →
`apk-kit/android/app/build/outputs/apk/debug/app-debug.apk`.

For a release/signed APK use **Build → Generate Signed Bundle / APK** and follow the wizard.

---

## فایل‌های تحویلی (Deliverables)

| فایل | مسیر |
|---|---|
| APK آماده نصب | `download/color-world-kids.apk` + `GET /api/download?file=apk` |
| سورس کامل پروژه (ZIP) | `GET /api/download` |
| کاتالوگ JSON همه‌ی ۲۰ دسته و ۲۰۰۰ نقاشی | `GET /api/catalog` |
| API ذخیره/لیست نقاشی‌ها (برای سرویس‌های بیرونی) | `GET/POST /api/artworks` |

> نکته: خودِ اپ نقاشی‌ها را روی همان دستگاه (IndexedDB) ذخیره می‌کند و کاملاً آفلاین کار می‌کند؛
> APIها برای اتصال سرویس‌های بیرونی و بکاپ گرفتن در نسخه‌ی وب در دسترس‌اند.
