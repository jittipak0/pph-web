# กฎการเขียนโค้ดและมาตรฐาน

## Backend (Laravel)
- Controller ต้องบาง รับผิดชอบเฉพาะ orchestration เท่านั้น
- แยก business logic ไปยัง Service class และ FormRequest สำหรับการ validate
- ใช้ Resource/Collection ในการตอบ API เพื่อควบคุมรูปแบบข้อมูล
- ตั้งชื่อไฟล์และ namespace ให้สอดคล้องกับโครงสร้าง PSR-4 เช่น `App\\Http\\Controllers`

## Frontend (React + Vite + TypeScript)
- โครงสร้าง `src/` ควรแยก `pages/`, `components/`, `lib/`, `styles/`, `hooks/`
- ใช้ React Query สำหรับ data fetching และ caching
- ตั้งค่า ESLint + Prettier ให้ทำงานก่อน commit/CI
- จัดการ code splitting เพื่อลดขนาด bundle และรองรับ lazy loading

## การทดสอบและความครอบคลุม
- Backend: มี PHPUnit/Feature test ครอบคลุม use case สำคัญ
- Frontend: ใช้ Vitest/React Testing Library ตรวจสอบ component และ hook หลัก
- ตั้งเป้าความครอบคลุมขั้นต่ำรวม ≥ 80% และติดตามผ่าน CI

## แนวทางทั่วไป
- คอมเมนต์เฉพาะจุดที่มีเหตุผลยาก ไม่ใช้เพื่ออธิบายโค้ดที่ชัดเจนอยู่แล้ว
- ห้าม hardcode secret หรือ URL Production ในโค้ด ให้ใช้ config หรือ environment variable
- ทุก Pull Request ต้องแนบผลทดสอบและอัปเดตเอกสารที่เกี่ยวข้องใน `docs/`
