# โครงสร้างเส้นทาง API

เอกสารนี้สรุปเส้นทาง API ปัจจุบันและวิธีการบันทึกเมื่อมี endpoint ใหม่

## Public Endpoints
| Method | Path | รายละเอียด |
| --- | --- | --- |
| GET | /api/health | ตรวจสอบสถานะระบบ |
| GET | /api/news | ดึงรายการข่าวที่เผยแพร่ |

## Authenticated Endpoints
| Method | Path | รายละเอียด |
| --- | --- | --- |
| POST | /api/login | เข้าสู่ระบบและรับ token |
| POST | /api/logout | ออกจากระบบและเพิกถอน token |
| GET | /api/me | ดึงข้อมูลผู้ใช้ปัจจุบัน |

## Staff Endpoints
| Method | Path | รายละเอียด |
| --- | --- | --- |
| GET | /api/staff/news | ดึงรายการข่าวสำหรับจัดการ |
| POST | /api/staff/news | สร้างข่าวใหม่ |
| GET | /api/staff/news/{id} | ดูรายละเอียดข่าว |
| PUT | /api/staff/news/{id} | อัปเดตข่าว |
| DELETE | /api/staff/news/{id} | ลบข่าว |

## วิธีบันทึก Endpoint ใหม่
1. เพิ่มแถวในตารางที่เกี่ยวข้องพร้อมคำอธิบายสั้น ๆ
2. ระบุรูปแบบ request/response ที่สำคัญในส่วนท้ายเอกสารหรือไฟล์แยกหากซับซ้อน
3. แนบตัวอย่าง response เช่น
   ```json
   {
     "data": [
       {
         "id": 1,
         "title": "ตัวอย่างข่าว",
         "published_at": "2024-01-01T00:00:00Z"
       }
     ]
   }
   ```
4. ตรวจสอบว่าอัปเดตเอกสารนี้ใน Pull Request พร้อมกับโค้ดที่เกี่ยวข้อง

## รูปแบบ Error มาตรฐาน
| สถานะ | เงื่อนไข | Payload |
| --- | --- | --- |
| 400 | Validation ไม่ผ่าน | `{ "error": { "message": "The given data was invalid.", "details": { "field": ["message"] } }, "meta": {"request_id": "..."} }` |
| 401 | ไม่มีสิทธิ์/ token ผิด | `{ "error": { "message": "Authentication failed." }, "meta": {"request_id": "..."} }` |
| 403 | สิทธิ์ไม่เพียงพอ | `{ "error": { "message": "This action is unauthorized." }, "meta": {"request_id": "..."} }` |
| 404 | ไม่พบข้อมูล | `{ "error": { "message": "News article not found." }, "meta": {"request_id": "..."} }` |
| 419 | CSRF ผิด | `{ "error": { "message": "CSRF token mismatch." }, "meta": {"request_id": "..."} }` |
| 429 | เกิน rate limit | `{ "error": { "message": "Too many requests." }, "meta": {"request_id": "..."} }` |
| 500 | ข้อผิดพลาดภายใน | `{ "error": { "message": "Internal server error." }, "meta": {"request_id": "..."} }` |

## หมายเหตุเพิ่มเติม
- ทุก log ที่ระดับ DEBUG จะมี context `request_id`, `user_id` (ถ้ามี), `ip`, `user_agent` แต่จะไม่บันทึกข้อมูล PII/credential
- เมื่อเพิ่ม endpoint ใหม่ ต้องเพิ่ม test (Feature + Unit), อัปเดตเอกสารนี้ และ sync Postman collection พร้อม environment

