# ตัวแปรสภาพแวดล้อม

ไฟล์นี้เป็นต้นแบบตัวแปรสภาพแวดล้อมสำหรับแต่ละส่วนของระบบ โปรดใช้เพื่อสร้างไฟล์ `.env` เฉพาะสภาพแวดล้อม โดยห้าม commit ค่า Production จริง

## ตารางตัวแปรหลัก

### Backend (Laravel)
| ตัวแปร | คำอธิบาย |
| --- | --- |
| APP_ENV | โหมดการทำงาน เช่น local, staging, production |
| APP_KEY | กุญแจแอปพลิเคชัน ใช้ placeholder ระหว่างพัฒนา |
| APP_URL | URL หลักของ backend |
| DB_HOST | โฮสต์ฐานข้อมูล |
| DB_PORT | พอร์ตฐานข้อมูล |
| DB_DATABASE | ชื่อฐานข้อมูล |
| DB_USERNAME | ผู้ใช้ฐานข้อมูล |
| DB_PASSWORD | รหัสผ่านฐานข้อมูล |
| SESSION_DRIVER | ตัวเลือกตัวจัดการเซสชัน |
| SANCTUM_STATEFUL_DOMAINS | รายการโดเมนที่อนุญาตสำหรับ Sanctum |
| FRONTEND_URL | ตำแหน่งของ frontend ที่จะเรียกใช้ API |

### Frontend (React + Vite)
| ตัวแปร | คำอธิบาย |
| --- | --- |
| VITE_API_BASE_URL | URL หลักของ API |
| VITE_API_PREFIX | Prefix เส้นทาง API หากมี |

## ตัวอย่างไฟล์ `.env.example`

> หมายเหตุ: ห้ามใส่ค่า Production จริงลงไฟล์ตัวอย่าง

### Backend
```
APP_ENV=local
APP_KEY=base64:PLACEHOLDERKEY=
APP_URL=http://localhost

DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=pph_web
DB_USERNAME=pph_user
DB_PASSWORD=secret

SESSION_DRIVER=file
SANCTUM_STATEFUL_DOMAINS=localhost:3000
FRONTEND_URL=http://localhost:3000
```

### Frontend
```
VITE_API_BASE_URL=http://localhost:8000
VITE_API_PREFIX=/api
```

## แนวทางจัดการค่า ENV
- สร้างไฟล์ `.env.example` พร้อม placeholder เพื่อช่วย onboarding แต่ห้ามบันทึกค่า secret จริง
- Production ควรโหลดค่า ENV ผ่านระบบจัดการความลับ (เช่น AWS SSM, GCP Secret Manager) แล้ว inject ระหว่าง deploy
- ทดสอบค่าที่ตั้งไว้ด้วย `php artisan config:cache` และ `php artisan config:show` บน staging ก่อนนำขึ้น production
- หมุนเวียน secret สำคัญ (APP_KEY, DB_PASSWORD, tokens) อย่างน้อยปีละหนึ่งครั้ง หรือเมื่อเกิดเหตุ security incident
- เก็บสเปรดชีต/CMDB สำหรับ ENV สำคัญพร้อมผู้รับผิดชอบ เพื่อให้ตรวจสอบการเปลี่ยนแปลงย้อนหลังได้
