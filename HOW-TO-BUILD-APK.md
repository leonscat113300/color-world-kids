# ساخت فایل APK از «دنیای رنگ‌ها» / Build the APK

The game now ships as a **fully-offline Android APK**: all pages, sounds, the
20 categories (2000 drawings) and artwork storage live **inside the APK** —
no hosted server URL is needed anymore. Artworks are stored on the device
(IndexedDB) and the phone's hardware back button, real saving (Documents/
Downloads) and the native share sheet are handled by native Capacitor plugins.

## دو نسخه‌ی APK / Two localized APKs

| فایل | زبان | نام روی گوشی | package (applicationId) |
|---|---|---|---|
| `download/color-world-fa.apk` | فارسی — مخصوص ایران | دنیای رنگ‌ها | `com.candyteam.colorworld` |
| `download/color-world-en.apk` | English — international | Color World Kids | `com.candyteam.colorworld.en` |

- هر دو نسخه **بدون صفحه‌ی انتخاب زبان** باز می‌شوند؛ نسخه‌ی فارسی از اول فارسی
  و نسخه‌ی انگلیسی از اول انگلیسی است (تعویض زبان در تنظیمات همیشه هست).
- آیکون این نسخه‌ها یکی است؛ چون `applicationId` نسخه‌ی انگلیسی فرق دارد، هر دو
  می‌توانند همزمان روی یک گوشی نصب باشند. نسخه‌ی فارسی روی نصب قبلی آپدیت
  می‌شود و نقاشی‌های ذخیره‌شده حفظ می‌شوند.
- The splash screen at app start is a plain sky-blue screen — **no logo**.

---

## روش ۱ — ساخت سریع با یک دستور (پیشنهادی)

Requirements: Node.js 18+ (or Bun), **JDK 21+**, Android SDK
(`ANDROID_HOME` or `android/local.properties`).

```bash
# 1. inside the project folder
npm install            # (or: bun install)

# 2. build + sync + assemble — everything in one command
npm run build:apk          # → download/color-world-fa.apk (فارسی)
npm run build:apk:en       # → download/color-world-en.apk (English)
# (or directly: bash scripts/build-apk.sh fa | en)
```

Copy an APK to the phone and install (allow "install from unknown sources").
Inside Android Studio you can also run **Build → Generate Signed Bundle/APK**
for a release/signed version.

> پلاگین‌های داخل بازی از قبل نصب هستند:
> - `@capacitor/app` → دکمه‌ی برگشت گوشی داخل بازی حرکت می‌کند؛ روی خانه دو بار بزنید تا خارج شود؛ بک روی پنجره‌ها اول پنجره را می‌بندد.
> - `@capacitor/filesystem` → دکمه‌ی ذخیره در «نقاشی‌های من» فایل PNG را واقعاً روی گوشی ذخیره می‌کند.
> - `@capacitor/share` → دکمه‌ی اشتراک‌گذاری شیت اشتراک‌گذاری خود اندروید را باز می‌کند (واتساپ، تلگرام، گالری و...).

## روش ۲ — نصب مستقیم بدون APK (PWA)

Open the hosted URL in **Chrome (Android)** → **⋮ → Add to Home screen /
Install app**. The back button also stays inside the game thanks to the
built-in history guard.

---

## مراحل دستی (همان کاری که build:apk انجام می‌دهد)

```bash
npm install
NEXT_PUBLIC_DEFAULT_LANG=fa npm run build:web-apk   # next build (static export) → ./out
npx cap sync android                                # copy ./out + plugins into android/
cd android && ./gradlew assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

(`NEXT_PUBLIC_DEFAULT_LANG=fa` یا `en` زبان پیش‌فرض داخل بازی را ثابت می‌کند.)

### آیکون اپ (App icon)
Icons are generated from the app logo (`upload/gyf-Photoroom.png`) via
`node scripts/make-icons.js` → `assets/*` + `public/*`, then
`bunx capacitor-assets generate --android` → `android/**/mipmap-*`.
The launch splash (`assets/splash.png`) is intentionally a solid color
with **no logo**. To change the artwork, replace the source file and re-run
both commands + `npx cap sync android`.

### وب هاست‌شده (Hosted web version)
The normal web/server build is untouched: `npm run build && npm start`
(standalone Next.js server with `/api/artworks` on SQLite). The screens
detect automatically whether the API exists (hosted) or not (APK) and store
artworks accordingly.

---

## فایل‌های تحویلی (Deliverables)

| فایل | مسیر |
|---|---|
| APK فارسی (ایران) | `download/color-world-fa.apk` |
| APK انگلیسی (بین‌المللی) | `download/color-world-en.apk` |
| سورس کامل پروژه | `GET /api/download` (ZIP file) |
| کاتالوگ JSON همه‌ی ۲۰ دسته و ۲۰۰۰ نقاشی | `GET /api/catalog` |
| API ذخیره/لیست نقاشی‌ها (نسخه‌ی وب) | `GET/POST /api/artworks` |
