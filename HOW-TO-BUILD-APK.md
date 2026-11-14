# ساخت فایل APK از «دنیای رنگ‌ها» / Build the APK

The game now ships as a **fully-offline Android APK**: all pages, sounds, the
20 categories (2000 drawings) and artwork storage live **inside the APK** —
no hosted server URL is needed anymore. Artworks are stored on the device
(IndexedDB) and the phone's hardware back button, real saving (Documents/
Downloads) and the native share sheet are handled by native Capacitor plugins.

---

## روش ۱ — ساخت سریع با یک دستور (پیشنهادی)

Requirements: Node.js 18+ (or Bun), JDK 17+, Android Studio (for the SDK).

```bash
# 1. inside the project folder
npm install            # (or: bun install)

# 2. build + sync + assemble — everything in one command
npm run build:apk      # (or: bun run build:apk)
```

The APK lands at:

```
download/color-world.apk
```

Copy it to the phone and install (allow "install from unknown sources").
Inside Android Studio you can also run **Build → Generate Signed Bundle/APK**
for a release/signed version.

> پلاگین‌های داخل بازی از قبل نصب هستند:
> - `@capacitor/app` → دکمه‌ی برگشت گوشی داخل بازی حرکت می‌کند؛ روی خانه دو بار بزنید تا خارج شود؛ بک روی پنجره‌ها اول پنجره را می‌بندد.
> - `@capacitor/filesystem` → دکمه‌ی ذخیره در «نقاشی‌های من» فایل PNG را واقعاً روی گوشی ذخیره می‌کند.
> - `@capacitor/share` → دکمه‌ی اشتراک‌گذاری شیت اشتراک‌گذاری خود اندروید را باز می‌کند.

## روش ۲ — نصب مستقیم بدون APK (PWA)

Open the hosted URL in **Chrome (Android)** → **⋮ → Add to Home screen /
Install app**. The back button also stays inside the game thanks to the
built-in history guard.

---

## مراحل دستی (همان کاری که build:apk انجام می‌دهد)

```bash
npm install
npm run build:web-apk      # next build (static export) → ./out
npx cap sync android       # copy ./out + plugins into android/
cd android && ./gradlew assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

### آیکون اپ (App icon)
Icons/splash are generated from `public/icons/icon-512.png` via
`bunx capacitor-assets generate --android`. To change them, replace that file
and re-run the command + `npx cap sync android`.

### وب هاست‌شده (Hosted web version)
The normal web/server build is untouched: `npm run build && npm start`
(standalone Next.js server with `/api/artworks` on SQLite). The screens
detect automatically whether the API exists (hosted) or not (APK) and store
artworks accordingly.

---

## فایل‌های تحویلی (Deliverables)

| فایل | مسیر |
|---|---|
| فایل APK آماده | `download/color-world.apk` |
| سورس کامل پروژه | `GET /api/download` (ZIP file) |
| کاتالوگ JSON همه‌ی ۲۰ دسته و ۲۰۰۰ نقاشی | `GET /api/catalog` |
| API ذخیره/لیست نقاشی‌ها (نسخه‌ی وب) | `GET/POST /api/artworks` |
