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
