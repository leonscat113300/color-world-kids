package com.candyteam.colorworld;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

/**
 * GallerySaver — tiny native bridge so kids can keep and share their artwork
 * on the phone. The Android WebView supports neither <a download> nor
 * navigator.share, so the web app calls these methods through the injected
 * Capacitor bridge (window.Capacitor.Plugins.GallerySaver).
 *
 * saveImage():  writes the PNG into the phone gallery under
 *               Pictures/Color World Kids (MediaStore, no permissions needed
 *               on Android 10+; app-specific folder on older devices).
 * shareImage(): opens the standard Android share sheet for the PNG.
 */
@CapacitorPlugin(name = "GallerySaver")
public class GallerySaver extends Plugin {

    private static final String FOLDER = "Color World Kids";

    private static byte[] decode(PluginCall call) {
        String data = call.getString("data");
        if (data == null || data.isEmpty()) return null;
        // accept both raw base64 and data URLs
        if (data.startsWith("data:")) {
            int comma = data.indexOf(',');
            if (comma >= 0) data = data.substring(comma + 1);
        }
        try {
            return Base64.decode(data, Base64.DEFAULT);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private static String safeName(String name) {
        if (name == null || name.trim().isEmpty()) name = "artwork.png";
        name = name.replaceAll("[\\\\/:*?\"<>|]+", "_").trim();
        if (name.length() > 80) name = name.substring(name.length() - 80);
        if (!name.toLowerCase().endsWith(".png")) name = name + ".png";
        return name;
    }

    @PluginMethod
    public void saveImage(PluginCall call) {
        byte[] bytes = decode(call);
        if (bytes == null) {
            call.reject("missing or invalid image data");
            return;
        }
        String name = safeName(call.getString("name"));
        try {
            ContentResolver cr = getContext().getContentResolver();
            ContentValues v = new ContentValues();
            v.put(MediaStore.Images.Media.DISPLAY_NAME, name);
            v.put(MediaStore.Images.Media.MIME_TYPE, "image/png");
            Uri uri;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // scoped storage: insert into the shared pictures collection —
                // no storage permission required for media the app creates
                v.put(MediaStore.Images.Media.RELATIVE_PATH,
                        Environment.DIRECTORY_PICTURES + "/" + FOLDER);
                v.put(MediaStore.Images.Media.IS_PENDING, 1);
                uri = cr.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, v);
                if (uri == null) {
                    call.reject("could not create the gallery entry");
                    return;
                }
                OutputStream os = cr.openOutputStream(uri);
                if (os == null) {
                    call.reject("could not open the output stream");
                    return;
                }
                os.write(bytes);
                os.flush();
                os.close();
                v.clear();
                v.put(MediaStore.Images.Media.IS_PENDING, 0);
                cr.update(uri, v, null, null);
            } else {
                // legacy devices (Android 7-9): app-specific external folder,
                // writable without any permission
                File dir = new File(
                        getContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES), FOLDER);
                if (!dir.exists() && !dir.mkdirs()) {
                    call.reject("could not create the pictures folder");
                    return;
                }
                File out = new File(dir, System.currentTimeMillis() + "_" + name);
                FileOutputStream fo = new FileOutputStream(out);
                fo.write(bytes);
                fo.flush();
                fo.close();
                uri = Uri.fromFile(out);
            }
            JSObject ret = new JSObject();
            ret.put("uri", uri.toString());
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("save failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void shareImage(PluginCall call) {
        byte[] bytes = decode(call);
        if (bytes == null) {
            call.reject("missing or invalid image data");
            return;
        }
        String name = safeName(call.getString("name"));
        String title = call.getString("title", "");
        try {
            File dir = new File(getContext().getCacheDir(), "share");
            if (!dir.exists() && !dir.mkdirs()) {
                call.reject("could not create the cache folder");
                return;
            }
            File out = new File(dir, name);
            FileOutputStream fo = new FileOutputStream(out);
            fo.write(bytes);
            fo.flush();
            fo.close();

            Uri uri = FileProvider.getUriForFile(
                    getContext(), getContext().getPackageName() + ".fileprovider", out);
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType("image/png");
            send.putExtra(Intent.EXTRA_STREAM, uri);
            if (title != null && !title.isEmpty()) {
                send.putExtra(Intent.EXTRA_SUBJECT, title);
            }
            send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            Intent chooser = Intent.createChooser(send,
                    (title == null || title.isEmpty()) ? null : title);
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(chooser);
            call.resolve();
        } catch (Exception e) {
            call.reject("share failed: " + e.getMessage());
        }
    }
}
