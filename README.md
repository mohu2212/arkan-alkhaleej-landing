# صفحة هبوط — شركة أركان الخليج للترميم والمقاولات

صفحة هبوط ثابتة (static) عربية بالكامل (RTL)، بدون أي خطوة build وبدون اعتماديات خارجية وقت التشغيل. مصمّمة لتُرفع مباشرة على استضافة **Hostinger**.

## محتوى المشروع
```
index.html            ← الصفحة الكاملة (كل وسوم SEO / Open Graph / JSON-LD بداخلها)
site.webmanifest
robots.txt , sitemap.xml , favicon.ico
assets/
 ├─ css/styles.css     ← التصميم (RTL، ألوان الهوية، responsive)
 ├─ js/main.js         ← القائمة، الفلترة، المعرض، نموذج الواتساب
 ├─ fonts/             ← خطوط Tajawal و Cairo (مستضافة ذاتياً)
 └─ img/               ← اللوجو، الأيقونات، og-image، صور المعرض (مُحسّنة)
```
> ملاحظة: مجلد `project 2/` هو **مصدر الداتا الخام** (الصور الأصلية + ملف Word) ولا يُرفع على الاستضافة.

## النشر على Hostinger (خطوات)
1. ادخل **hPanel → File Manager** ثم افتح مجلد `public_html`.
2. ارفع **محتويات هذا المجلد** (وليس مجلد `project 2/`): `index.html` و `assets/` وبقية الملفات.
   - أسهل طريقة: اضغط الملفات في `arkan.zip` وارفعه ثم Extract داخل `public_html`.
3. تأكد أن `index.html` في جذر `public_html` مباشرة.
4. افتح الدومين — الصفحة جاهزة.

## بعد ربط الدومين (مهم لمعاينة اللينك)
حالياً الروابط المطلقة تستخدم `https://example.com` مؤقتاً. عند توفّر الدومين النهائي، استبدله في الأماكن التالية:
- `index.html`: وسوم `og:url` و `og:image` و `twitter:image` و `canonical` و الـ JSON-LD.
- `robots.txt` و `sitemap.xml`: رابط الـ Sitemap و `loc`.

استبدال سريع (نفّذه داخل مجلد المشروع، وضع دومينك بدل `your-domain.com`):
```bash
grep -rl "example.com" . --include="*.html" --include="*.xml" --include="*.txt" \
  | xargs sed -i '' "s#https://example.com#https://your-domain.com#g"
```
ثم أعد رفع `index.html` و `sitemap.xml` و `robots.txt`.

بعدها افحص معاينة اللينك عبر:
- فيسبوك: https://developers.facebook.com/tools/debug/
- تويتر/إكس: https://cards-dev.twitter.com/validator
- واتساب يلتقط صورة `og-image` تلقائياً بعد أول مشاركة.

## رقم التواصل (الواتساب)
كل أزرار الواتساب تشير إلى `966552171713` (العرض المحلي `0552171713`). لتغيير الرقم:
- `assets/js/main.js`: المتغير `WA_NUMBER`.
- `index.html`: روابط `wa.me/...` و `tel:...` و الـ JSON-LD.

## إعادة توليد الصور / الأصول (اختياري)
الأصول جاهزة. لإعادة التوليد تحتاج macOS مع `sips` و `cwebp` و Python+Pillow و Google Chrome (لـ og-image). انظر سكربتات المعالجة في سجل الإنشاء.
