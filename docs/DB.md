# DB.md – สคีมาฐานข้อมูลและแนวปฏิบัติ

ระบบ PPH Hospital API ใช้แนวคิด Hexagonal Architecture โดยทุก service เข้าถึงข้อมูลผ่าน repository interface ที่ผูกกับ adapter ตามค่า `DATASTORE_DRIVER`. เอกสารนี้สรุปตารางที่มีอยู่, index, ฟิลด์อ่อนไหวที่ต้องเข้ารหัส/แฮช และแนวทาง retention เพื่อให้ทีมพัฒนากับ Ops ใช้เป็น single source of truth

## 1. Ports & Adapters
```
Domain Service → Contracts (interfaces)
                     ↓
          Infrastructure Adapter (Eloquent / Memory)
                     ↓
                Database Connection (จาก DATASTORE_CONNECTION)
```
- `config/datastore.php` กำหนด mapping interface → adapter → connection
- `App\Providers\DatastoreServiceProvider` อ่านค่า `DATASTORE_DRIVER` และ bind repository runtime
- โหมด `memory` ใช้ array-backed repository สำหรับทดสอบ/รันใน CI ส่วน `eloquent` อิงตาม connection alias ใน `config/database.php`

## 2. ตารางปัจจุบัน

### 2.1 `users`
| คอลัมน์ | ชนิด | หมายเหตุ |
| --- | --- | --- |
| `id` | bigint PK | Auto increment |
| `username` | varchar(255) | Unique, ใช้เข้าสู่ระบบ |
| `name` | varchar(255) | ชื่อแสดง |
| `email` | varchar(255) nullable | Unique, optional |
| `role` | enum(`viewer`,`staff`,`admin`) | ควบคุม Sanctum ability |
| `email_verified_at` | timestamp nullable | เก็บเวลายืนยันอีเมล |
| `last_login_at` | timestamp nullable | อัปเดตเมื่อ login สำเร็จ |
| `password` | varchar | เก็บ bcrypt hash |
| `remember_token` | varchar nullable | ใช้เมื่อเปิด remember me |
| timestamps | | Laravel standard |

**Index:** unique บน `username`, `email`

**เกี่ยวข้อง:**
- `personal_access_tokens` (สร้างโดย Sanctum) ใช้เก็บ access token + ability (column `abilities` เป็น JSON)
- `sessions`, `password_reset_tokens` รองรับ CSRF/session-based middleware

**Retention:** บัญชีผู้ใช้ต้องตรวจสอบสิทธิ์ทุกไตรมาส (ดู `docs/SECURITY.md`). ลบบัญชีที่ไม่มีการใช้งานเกิน 365 วันหลังแจ้งเตือน

### 2.2 `news`
| คอลัมน์ | ชนิด | หมายเหตุ |
| --- | --- | --- |
| `id` | bigint PK |
| `title` | varchar(200) |
| `body` | longtext nullable |
| `published_at` | timestamp nullable | ใช้ควบคุมการแสดงผล |
| timestamps | |

**Index:** index บน `published_at` เพื่อให้ sort/filter เร็ว

**Retention:** เก็บข่าว 3 ปี จากนั้นพิจารณาย้ายไป archive table หรือ object storage

### 2.3 `medical_record_requests`
| คอลัมน์ | ชนิด | หมายเหตุ |
| --- | --- | --- |
| `id` | bigint PK |
| `full_name` | varchar(255) | ไม่บันทึก prefix/คำนำหน้าที่ไม่จำเป็น |
| `hn` | varchar(50) | index สำหรับอ้างอิงซ้ำ |
| `citizen_id_hash` | char(64) | SHA-256 ของ citizen_id + `APP_KEY` |
| `citizen_id_masked` | varchar(32) | ค่า mask เช่น `1234******23` |
| `phone` | varchar(30) |
| `email` | varchar(255) nullable |
| `address` | text |
| `reason` | text nullable |
| `consent` | boolean | true เมื่อผู้ใช้ยินยอม PDPA |
| `idcard_path` | varchar(255) nullable | เก็บ path ภายใต้ `storage/app/private/forms/medical-records` |
| `ip_address` | varchar(45) nullable |
| `user_agent` | varchar(255) nullable |
| timestamps | |

**Index:** `citizen_id_hash`, `hn`

**การเข้ารหัส/แฮช:**
- `citizen_id_hash` = `hash('sha256', citizen_id.APP_KEY)`
- `citizen_id_masked` ใช้ `Str::mask` เพื่อให้ทีมตรวจสอบได้โดยไม่เห็นเลขเต็ม
- ไฟล์แนบถูกเปลี่ยนชื่อเป็น hash (SHA-256) ก่อนเก็บ

**Retention:** เก็บข้อมูล 365 วัน (รวมไฟล์แนบ) แล้วลบอัตโนมัติ ยกเว้นกรณีมีข้อกำหนดตามกฎหมายให้เก็บนานขึ้น (ปรับใน batch job)

### 2.4 `donations`
| คอลัมน์ | ชนิด | หมายเหตุ |
| --- | --- | --- |
| `id` | bigint PK |
| `donor_name` | varchar(255) |
| `amount` | decimal(12,2) |
| `channel` | varchar(20) | ค่าจำกัดใน Form Request (`cash|bank|promptpay`)
| `phone` | varchar(30) nullable |
| `email` | varchar(255) nullable |
| `note` | text nullable |
| `reference_code` | varchar(32) unique | ใช้ติดตามการออกใบเสร็จ |
| `ip_address` | varchar(45) nullable |
| `user_agent` | varchar(255) nullable |
| timestamps | |

**Retention:** เก็บ 5 ปี เพื่อรองรับการตรวจสอบทางการเงิน จากนั้น anonymise (ลบ `donor_name`, `phone`, `email`, `note`)

### 2.5 `satisfaction_surveys`
| คอลัมน์ | ชนิด | หมายเหตุ |
| --- | --- | --- |
| `id` | bigint PK |
| `score_overall` | tinyint unsigned |
| `score_waittime` | tinyint unsigned |
| `score_staff` | tinyint unsigned |
| `comment` | text nullable |
| `service_date` | date nullable |
| `ip_address` | varchar(45) nullable |
| `user_agent` | varchar(255) nullable |
| timestamps | |

**Retention:** เก็บ 2 ปี แล้วรวมสถิติ (aggregated report) ก่อนลบข้อมูลระดับ record

### 2.6 `health_rider_applications`
| คอลัมน์ | ชนิด | หมายเหตุ |
| --- | --- | --- |
| `id` | bigint PK |
| `full_name` | varchar(255) |
| `hn` | varchar(50) nullable | index |
| `address` | text |
| `district` | varchar(120) | index |
| `province` | varchar(120) |
| `zipcode` | varchar(10) |
| `phone` | varchar(30) |
| `line_id` | varchar(100) nullable |
| `consent` | boolean | true เมื่อยินยอมเงื่อนไข |
| `ip_address` | varchar(45) nullable |
| `user_agent` | varchar(255) nullable |
| timestamps | |

**Retention:** เก็บ 2 ปี หลังจากนั้นลบหรือ anonymise เบอร์โทร/ที่อยู่ให้เหลือเฉพาะ district เพื่อใช้วิเคราะห์เชิงสถิติ

### 2.7 ตารางระบบอื่น
- `personal_access_tokens` – จาก Sanctum เก็บคีย์ hash (`token` เป็น SHA-256) + abilities
- `cache`, `jobs`, `job_batches` – รองรับ queue/database cache

## 3. แนวปฏิบัติด้าน Migration และ Seed
1. ทุก migration ต้องมี `down()` เพื่อรองรับ rollback
2. ตั้งชื่อไฟล์ด้วย timestamp (YYYY_MM_DD_HHMMSS) ให้เรียงตามลำดับการรัน
3. ใช้ `php artisan migrate --force` บน production หลังสำรองข้อมูลแล้วเท่านั้น
4. Seeder เริ่มต้นสร้างผู้ใช้ admin จากค่า `ADMIN_INITIAL_*`; อย่าฝังรหัสผ่านลงในโค้ด
5. เมื่อเพิ่มฟอร์มหรือ resource ใหม่ ต้องอัปเดต `docs/DB.md`, `docs/db.drawio` และสร้าง Factory สำหรับการทดสอบ

## 4. การออกแบบและชนิดข้อมูล
- ใช้ `snake_case` สำหรับชื่อคอลัมน์และหลีกเลี่ยงคำย่อที่ไม่จำเป็น
- เก็บเวลาเป็น UTC เสมอ ให้ frontend แปลง timezone เอง
- ค่าที่เป็น boolean ให้ตั้ง default ชัดเจน (`->default(false)`) เพื่อป้องกัน null
- ใช้ `decimal` สำหรับจำนวนเงินและตั้ง precision/scale ให้รองรับกรณีใช้งานจริง

## 5. การจัดการข้อมูลอ่อนไหว
- หลีกเลี่ยงการเก็บ citizen_id แบบ plain text; ใช้ hash + mask ตามตัวอย่างใน service
- ไม่ log ค่า PII/PHI ให้ log เฉพาะ context (`request_id`, `user_id`, `ip`, `user_agent`) และ identifier ที่แฮชแล้ว
- ไฟล์อัปโหลดเก็บใน `storage/app/private/forms/` (อยู่นอก webroot) พร้อมสิทธิ์ 750 และเจ้าของเป็น web user
- หากต้องถ่ายโอนไปยังระบบอื่น ให้เข้ารหัสที่ rest (เช่น S3 SSE-KMS) และลบไฟล์ต้นฉบับเมื่อไม่จำเป็น

## 6. Retention & Archiving
| ตาราง | ระยะเวลาที่เก็บ | วิธีการหลังครบกำหนด |
| --- | --- | --- |
| `medical_record_requests` | 12 เดือน | ลบไฟล์แนบ + บันทึก record เป็น anonymised summary |
| `donations` | 5 ปี | ลบข้อมูลผู้บริจาค เหลือเฉพาะยอด/ช่องทาง/รหัสอ้างอิง |
| `satisfaction_surveys` | 24 เดือน | สรุปค่าเฉลี่ยรายเดือนแล้วลบ record รายบุคคล |
| `health_rider_applications` | 24 เดือน | ลบหรือเบลอข้อมูลติดต่อ เหลือข้อมูลพื้นที่ให้วิเคราะห์ |
| `news` | 36 เดือน | ย้ายไป archive table หรือ object storage |
| `personal_access_tokens` | 90 วัน | cron job เพื่อลบ token หมดอายุ |

## 7. Backup & Restore
- สำรองฐานข้อมูลรายวัน (full) + รายชั่วโมง (incremental) แล้วเก็บอย่างน้อย 7 ชุดล่าสุด
- ทดสอบการกู้คืนบน staging ทุกไตรมาส พร้อมจดผลลง runbook
- เก็บสำเนา schema (`php artisan schema:dump`) ทุกครั้งที่ตัด release สำคัญ

## 8. Checklist ก่อน merge การเปลี่ยน schema
- [ ] Migration + `down()` ครบถ้วนและผ่าน CI
- [ ] มี Factory/Seeder ที่จำเป็นสำหรับ test
- [ ] อัปเดต `docs/DB.md` และ `docs/db.drawio`
- [ ] แจ้ง DevOps เตรียมสำรองข้อมูลหากเป็น breaking change
- [ ] เตรียม script backfill (ถ้ามีข้อมูลเก่า) และทดสอบบน staging

> ER Diagram เวอร์ชันล่าสุดเก็บใน `docs/db.drawio` (เปิดด้วย draw.io) โปรดอัปเดตพร้อม commit เมื่อ schema เปลี่ยน
