# แนวทางฐานข้อมูล

## Engine
- ใช้ MySQL หรือ MariaDB รองรับ utf8mb4
- ตั้งชื่อฐานข้อมูล ตัวแปร และไฟล์ migration ให้สื่อความหมายชัดเจน

## การตั้งชื่อและดัชนี
- ชื่อตารางใช้พหูพจน์ เช่น `users`, `news`
- ชื่อคอลัมน์ใช้ snake_case เช่น `published_at`
- ตั้งค่า primary key เป็น unsigned big integer โดยใช้ auto increment
- สร้างดัชนีสำคัญ เช่น `users.email` unique, `news.published_at` index สำหรับการเรียง

## Migration และ Seed
- แต่ละ migration ต้อง reversible
- แยก seed สำหรับข้อมูลทดสอบและข้อมูลเริ่มต้นที่จำเป็น เช่น role พื้นฐาน

## สคีมาตั้งต้น (รอขยาย)

### users
- id, name, email, password, email_verified_at, remember_token, created_at, updated_at

### news
- id, title, slug, body, cover_image_path, published_at, status, created_at, updated_at

### แบบฟอร์ม (ตัวอย่าง 4 ตาราง)
1. `contact_forms`: id, name, email, phone, message, status, created_at
2. `event_registrations`: id, user_id, event_id, remark, registered_at
3. `feedback_forms`: id, user_id, rating, comment, submitted_at
4. `support_tickets`: id, user_id, category, priority, description, resolved_at, created_at

## แนวทาง Index เพิ่มเติม
- `contact_forms.status` สำหรับติดตามงาน
- `event_registrations.user_id` และ `event_registrations.event_id` พร้อม composite index
- `feedback_forms.user_id` เพื่อค้นหาประวัติผู้ใช้
- `support_tickets.category` และ `support_tickets.priority` สำหรับจัดคิวงาน
