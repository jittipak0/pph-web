# Runbook การปรับใช้ระบบ

เอกสารนี้ครอบคลุมขั้นตอนตั้งแต่สภาพแวดล้อม dev → staging → production เพื่อให้การปรับใช้และการแก้ไขปัญหามีความสอดคล้อง

## สcope
- **Dev**: ใช้สำหรับการพัฒนาและการทดสอบภายใน
- **Staging**: สภาพแวดล้อมก่อน production สำหรับการทดสอบครบถ้วน
- **Production**: ระบบจริงที่ให้บริการผู้ใช้

## Pre-Deploy Checklist
1. ตรวจสอบสถานะ pipeline/test ให้ผ่านทั้งหมด
2. อัปเดตเอกสารใน `docs/` ให้ตรงกับโค้ด
3. ตรวจสอบไฟล์ `.env` ว่าตรงกับเทมเพลตใน `docs/ENV.md`
4. เตรียม backup ฐานข้อมูลล่าสุดสำหรับ staging/production

## Deploy Steps
1. ดึงโค้ดล่าสุดจาก branch ที่ได้รับอนุมัติ
2. ติดตั้ง dependency (Composer, npm) ตามแต่ละส่วน
3. รันคำสั่ง build frontend หากมี (`npm run build`)
4. รัน `php artisan config:cache` และ `php artisan route:cache`
5. รัน `php artisan migrate --force`
6. ตรวจสอบ health check ที่ `/api/health`

## Post-Deploy
1. ตรวจสอบ log error ทั้ง backend/frontend
2. ยืนยันว่า TLS certificate และ security headers ทำงานตาม `docs/SECURITY.md`
3. ทดสอบ flow สำคัญ เช่น login, เรียกข่าว, อัปเดตข้อมูล staff
4. ตรวจสอบว่า CSRF/CORS ทำงานตามคาด

## Rollback
1. หากเกิดเหตุรุนแรง ให้สลับกลับ commit/tag ก่อนหน้า
2. กู้คืนฐานข้อมูลจาก backup ล่าสุด
3. รัน `php artisan migrate:rollback --step=1` หากต้องย้อน migration
4. ประสานงานแจ้งผู้ใช้/ทีมที่เกี่ยวข้อง

## Health Check
- Endpoint มาตรฐาน: `GET /api/health` ต้องตอบ 200 และข้อมูลสถานะเบื้องต้น

## หมายเหตุเพิ่มเติม
- เก็บบันทึกการ deploy ทุกครั้งในระบบ ticket หรือ changelog กลาง
- หากมีการเปลี่ยนค่า config สำคัญ ให้บันทึกไว้ใน `docs/ENV.md` และสื่อสารกับทีม
