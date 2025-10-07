# นโยบายความปลอดภัยระบบ

## HTTPS
- ทุกสภาพแวดล้อม (staging, production) ต้องบังคับใช้ HTTPS และปิดการตอบสนอง HTTP ปกติด้วยการ redirect 301

## Security Headers
- กำหนดตัวอย่างค่า: `Strict-Transport-Security`, `X-Content-Type-Options=nosniff`, `X-Frame-Options=SAMEORIGIN`, `Content-Security-Policy` จำกัดแหล่งทรัพยากร, `Referrer-Policy=no-referrer`

## CORS
- จำกัด origin ตามโดเมน frontend ที่ได้รับอนุญาต และกำหนด allow credentials เฉพาะเมื่อจำเป็น

## CSRF
- สำหรับ SPA ให้ใช้ Laravel Sanctum หรือโทเคน CSRF ผ่าน cookie + header `X-XSRF-TOKEN` และตรวจสอบทุกคำร้องที่แก้ไขข้อมูล

## Rate Limiting
- ใช้มาตรการจำกัดการเรียก API เช่น 60 ครั้งต่อนาทีต่อผู้ใช้/ที่อยู่ IP ตามลักษณะ endpoint

## การอัปโหลดไฟล์
- เก็บไฟล์ไว้ในตำแหน่งที่อยู่นอก webroot เช่น `storage/app/private`
- ตรวจสอบ MIME type และขนาดไฟล์ก่อนบันทึก รวมถึงสแกนไวรัสหากมีเครื่องมือ

## การจัดการความลับ
- ห้าม commit ค่า API key, password หรือความลับใด ๆ ลงใน repository
- ใช้ตัวแปรสภาพแวดล้อมและ Secret Manager สำหรับการปรับใช้จริง

## แนวทาง Code Review และ Merge
- ทุก Pull Request ต้องผ่าน code review อย่างน้อย 1 คน
- ตรวจสอบว่าเอกสารใน `docs/` ถูกอัปเดตให้ตรงกับโค้ดก่อนอนุมัติ
- ใช้การตรวจสอบอัตโนมัติ (CI) เพื่อเช็กการทดสอบและมาตรฐานโค้ดก่อน merge
