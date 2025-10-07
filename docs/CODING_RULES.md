# กฎการพัฒนาโค้ด (Coding & Design Rules)

เอกสารฉบับนี้กำหนดมาตรฐานการพัฒนาเชิงเทคนิคสำหรับแพลตฟอร์มโรงพยาบาล ทุกคนต้องอ่านและปฏิบัติตามก่อนเปิด Pull Request ใด ๆ

## 1. หลักการสำคัญ

- **รักษาความสอดคล้อง:** ยึดรูปแบบที่ใช้แล้วในโปรเจ็กต์มากกว่าความชอบส่วนตัว
- **คุณภาพมาก่อน:** ฟีเจอร์ต้องมาพร้อมการทดสอบอัตโนมัติและผ่านรีวิว
- **ทำงานเป็นส่วนย่อย:** จำกัดขอบเขต PR ให้แก้ปัญหาเดียว
- **คิดถึงความปลอดภัย:** ข้อมูลผู้ป่วยถือเป็นข้อมูลอ่อนไหว ห้ามใช้ทางลัดที่ลดความปลอดภัย
- **ระบบต้องตรวจสอบได้:** การทำ log, metric และการอัปเดตเอกสารเป็นส่วนหนึ่งของงาน

### 1.1 เทคนิคการเขียนโค้ดระดับมืออาชีพ

1. **ชื่อสื่อสารตรงประเด็น:** ตั้งชื่อไฟล์ คลาส ฟังก์ชัน และตัวแปรให้บอกความหมายตรงไปตรงมา ยึดคำศัพท์ทางการแพทย์และมาตรการในระบบ (ดูข้อ 3) เพื่อให้คนอ่านเข้าใจบริบทได้ทันที
2. **อย่าซ้ำ (DRY):** หากพบ logic ซ้ำทั้งฝั่ง React หรือ Laravel ให้ย้ายไปอยู่ใน helper, hook หรือ service ที่แชร์ได้ ลดความเสี่ยงที่แก้ไขไม่ครบทุกจุด
3. **รักษาความเรียบง่าย (KISS):** เริ่มจากคำตอบที่ง่ายที่สุดก่อนเสมอ หลีกเลี่ยงการออกแบบเชิงสถาปัตยกรรมเกินความจำเป็นต่อฟีเจอร์ที่กำลังทำอยู่
4. **แยกหน้าที่เดียว (Single Responsibility):** คอมโพเนนต์หนึ่งควรเรนเดอร์ UI หรือจัดการ state ที่เฉพาะเจาะจง ส่วน service/class ควรทำงานโดดเดี่ยว (เช่น จัดการข้อมูลคนไข้ หรือสร้างรายงาน) เพื่อให้ทดสอบได้ง่าย
5. **ยังไม่ต้องการก็อย่าเพิ่งทำ (YAGNI):** อย่าเพิ่ม option, flag หรือ abstraction ที่ยังไม่มี use case ชัดเจน ลดภาระการดูแลในอนาคต
6. **พึ่งพา Git ให้สม่ำเสมอ:** commit บ่อยๆ พร้อมข้อความที่อธิบายการเปลี่ยนแปลง เช่น "fix: correct patient discharge flow" และแยก branch ตามงาน เพื่อให้ rollback และโค้ดรีวิวทำได้เร็ว
7. **เขียนคอมเมนต์เมื่อจำเป็น:** ใช้คอมเมนต์เพื่ออธิบายเหตุผลหรือบริบทของ business rule ที่ซับซ้อน ไม่ใช่บรรยายว่าโค้ดทำอะไร หาก logic ยากให้ refactor ให้ชัดก่อน
8. **จัดรูปแบบให้ตรงมาตรฐาน:** ใช้ Prettier/ESLint/Fixers (frontend) และ Pint/PHPCS (backend) ทุกครั้งก่อน commit เพื่อให้โค้ดมีสไตล์เดียวกันทั้งทีม

## 2. โครงสร้าง Repository

- `frontend/` แอปเว็บ React + Vite
  - `src/pages/` คอมโพเนนต์ระดับเส้นทาง (route)
  - `src/components/` คอมโพเนนต์ที่นำกลับมาใช้ซ้ำได้
  - `src/lib/` ตัวช่วย, hooks, service สำหรับเรียก API
  - `src/styles/` สไตล์ส่วนกลางและ design tokens
- `backend/` บริการ Laravel API
  - `app/Http/Controllers/` คอนโทรลเลอร์ที่บางและเรียกใช้ service layer
  - `app/Services/` ชั้น business logic
  - `app/Models/` โมเดล Eloquent (หลีกเลี่ยงการใส่ logic หนัก)
  - `app/Http/Requests/` การ validate ข้อมูลเข้า
  - `app/Http/Resources/` การประกอบ response
  - `database/migrations|seeders|factories/` สคีมาและข้อมูลฉากทดสอบ
- `docs/` เอกสารระบบ, API, runbook
- `nginx/`, `systemd/`, `postman/` ทรัพยากรสำหรับ deployment และ ops

## 3. กติกาการตั้งชื่อ

- โฟลเดอร์และไฟล์หน้าจอ: `kebab-case` เช่น `patient-records/overview.tsx`
- React component และ TypeScript type/interface: `PascalCase`
- ตัวแปร, ฟังก์ชัน, hooks: `camelCase` เช่น `usePatientQuery`
- CSS Modules หรือ SCSS: `kebab-case` เช่น `patient-card.module.scss`
- Laravel class: `StudlyCase`, คอลัมน์ฐานข้อมูลใช้ `snake_case`
- ชื่อ branch: `feature/คำอธิบายสั้น`, `fix/หมายเลข-bug`, `chore/งานทั่วไป`

## 4. แนวทาง Frontend (React + Vite)

### 4.1 State และ Data
- ใช้ React Query เป็นหลักสำหรับ server state และกำหนด key รวมใน `src/lib/api`
- จำกัด global client state ให้เหลือเท่าที่จำเป็น ใช้ `zustand` เฉพาะ state ที่ครอบ UI หลายจุด
- หลีกเลี่ยงการเรียก API ตรงในคอมโพเนนต์ สร้าง hook เฉพาะใน `src/lib/hooks`

### 4.2 คอมโพเนนต์และสไตล์
- ไฟล์แต่ละคอมโพเนนต์ส่งออกคอมโพเนนต์หลักตัวเดียว พร้อมไฟล์ทดสอบ (`Component.test.tsx`) และ Storybook (`Component.stories.tsx`) อยู่ร่วมกัน
- ใช้แนวทาง composition แยก UI ซับซ้อนเป็นชิ้นเล็กที่เข้าใจง่าย
- ใช้ design tokens จาก `src/styles/tokens.scss` สีใหม่ต้องเพิ่มใน token ก่อนนำไปใช้
- ให้ความสำคัญกับ CSS Modules หรือ Tailwind (ถ้ามี) หลีกเลี่ยง inline style ยกเว้นค่าไดนามิก

### 4.3 TypeScript และ Lint
- ประกาศ type ให้ครบทุก props และผลลัพธ์จาก hook ห้ามใช้ `any` หากจำเป็นต้องมีคำอธิบาย TODO
- ต้องแก้ไข warning จาก TypeScript ให้หมดก่อน merge
- รันคำสั่ง lint ตามที่กำหนด (`npm run lint` หรือ `pnpm lint`) ก่อน push ทุกครั้ง

### 4.4 การเข้าถึง (Accessibility)
- องค์ประกอบที่โต้ตอบได้ต้องมี label ที่อ่านได้โดย screen reader
- ตรวจสอบ contrast ตามมาตรฐาน WCAG AA โดยใช้ Storybook accessibility addon
- จัดการสถานะ loading, empty, error ให้ครบถ้วน

### 4.5 เครื่องมือพัฒนาและการจัดรูปแบบ
- ใช้ Prettier เป็น formatter ส่วนกลาง (ตั้งค่าในรากโปรเจ็กต์ frontend เช่น `.prettierrc`)
- สคริปต์ที่ต้องมี: `format` (เรียก `prettier --check/--write`), `lint`, `test` และ `typecheck` หากมีการใช้ TypeScript แบบแยกคำสั่ง
- เปิดใช้ ESLint พร้อมกฎขั้นต่ำ: React, Hooks, Accessibility และ import/order
- กำหนดให้ Husky หรือ pre-commit hook เรียก `npm run lint` และ `npm run format` ในอนาคตเมื่อโครงสร้างพร้อม

## 5. แนวทาง Backend (Laravel API)

### 5.1 สถาปัตยกรรม
- Controller ต้องบาง ทำหน้าที่แค่รับอินพุตและเรียก service layer
- Business logic หลักอยู่ใน `app/Services/` หรือ `app/Domain/`
- ใช้ repository เฉพาะกรณีที่ query ซับซ้อนและอ่านยากกว่า scope

### 5.2 Requests และ Validation
- ทุก endpoint ต้องใช้ Form Request เพื่อ validate ข้อมูล
- รวมกฎ validate ที่ใช้ซ้ำด้วย rule object หรือ helper หลีกเลี่ยงการคัดลอก
- รูปแบบ error 422: `{ "errors": { "field": ["message"] } }`

### 5.3 Responses
- ตอบกลับผ่าน API Resource เสมอ รูปแบบ `{ data, meta?, error? }`
- ใช้ HTTP status code ให้ถูกต้อง (200/201, 204, 400/401/403/404/422, 500)
- จัดการ exception ใน Handler ให้แมปกับ response ที่คาดหวัง
- ตัวอย่าง response สำเร็จ

```json
{
  "data": {
    "id": "patient_123",
    "name": "สมชาย ใจดี"
  },
  "meta": {
    "request_id": "req-20250101-0001"
  }
}
```

- ตัวอย่าง response เมื่อเกิดข้อผิดพลาด (ไม่เปิดเผยข้อมูลอ่อนไหว)

```json
{
  "error": {
    "code": "E-APPT-409",
    "message": "ไม่สามารถจองคิวซ้ำในช่วงเวลาเดียวกันได้",
    "hint": "ตรวจสอบคิวเดิมของผู้ป่วย"
  }
}
```

### 5.4 Database และ Migrations
- Migration ต้องกลับด้านได้ (`down`) และ idempotent
- ชื่อคอลัมน์ `snake_case` คอลัมน์ boolean ใช้ `is_` หรือ `has_`
- ใส่ index ให้กับ foreign key และคอลัมน์ที่ query บ่อย พร้อมคอมเมนต์อธิบายใน migration
- Factory ต้องสะท้อนค่าปกติของโดเมน Seeder ใช้สำหรับข้อมูลตั้งต้นเท่านั้น

### 5.5 Logging และ Error
- Service ควรโยน exception เฉพาะโดเมน และให้ Handler แปลงเป็น response
- บันทึก log พร้อม context เช่น user id และ request id แต่ห้ามบันทึกข้อมูลส่วนตัว
- เปิดใช้งาน rate limit สำหรับ endpoint สาธารณะและ auth

#### Observability: Sequence Steps
- ใช้ `App\Support\Sequence::step(<layer>, <desc>, <meta>)` ใน service/repository เพื่อบันทึกขั้นตอนสำคัญ
- สร้างข้อความที่ปลอดภัย: อย่าส่ง credential หรือ PII ตรง ๆ ให้ระบุสถานะและจำนวนเรคคอร์ดแทน
- ตัวอย่าง:
```php
use App\Support\Sequence;

Sequence::step('AuthService', 'เริ่มตรวจ credential (masked)');
Sequence::step('UserRepository', 'ค้นผู้ใช้ตาม username', ['result' => 'found']);
```

### 5.6 เครื่องมืออัตโนมัติ
- ใช้ Laravel Pint หรือ PHP-CS-Fixer (`vendor/bin/pint`) เป็น formatter มาตรฐาน
- เพิ่มสคริปต์ใน `composer.json` เช่น `"format": "vendor/bin/pint"`, `"lint": "vendor/bin/pint --test"`, `"test": "php artisan test"`
- เปิดใช้ PHPStan หรือ Larastan ระดับ `max` สำหรับ static analysis เมื่อโค้ดฐานพร้อม

## 6. การออกแบบ API

- ใช้ RESTful resource เช่น `/api/patients/{patient}/records`
- ชื่อ collection เป็นพหูพจน์ ชื่อ resource เป็นเอกพจน์
- Filtering, Sorting, Pagination ใช้ query string เช่น `?status=active&sort=-created_at&page=1&limit=20`
- อัปเดต `docs/ROUTES.md` และชุด Postman ทุกครั้งที่มี endpoint ใหม่หรือเปลี่ยนพฤติกรรม
- การเปลี่ยนแปลงที่ breaking ให้เพิ่ม version เช่น `/api/v2/...`

## 7. Git Workflow และ Code Review

- `main` ต้อง deploy ได้เสมอ Merge ผ่าน Pull Request เท่านั้น
- สร้าง branch จาก `main` และ rebase เป็นประจำเพื่อลด conflict
- Commit message ใช้ Conventional Commit เช่น `feat: add patient vitals widget`
- Pull Request ต้องแนบ
  - เลข issue หรืองานที่เกี่ยวข้อง
  - สรุปการเปลี่ยนแปลง พร้อมภาพหรือวิดีโอสำหรับ UI
  - Test plan ระบุคำสั่งที่รันและผลลัพธ์
  - Checklist ว่า lint, format, typecheck และ test ผ่านแล้ว
- Reviewer ตรวจทั้ง correctness, security, performance, accessibility, maintainability
- หลังแก้ไข comment ให้ตอบกลับและ squash commit ก่อน merge

## 8. กลยุทธ์การทดสอบ

- **Frontend**
  - ทดสอบ unit และ component ด้วย Vitest + Testing Library
  - ทดสอบ end-to-end flow สำคัญ (login, ค้นหาผู้ป่วย, จองคิว) ด้วย Cypress
  - ใช้ snapshot เฉพาะคอมโพเนนต์ที่เป็นการแสดงผลนิ่ง
- **Backend**
  - Feature test ครอบคลุมทุก controller (`tests/Feature`)
  - Unit test สำหรับ services และ helper (`tests/Unit`)
  - ใช้ transaction และ factory ในการเตรียมข้อมูลทดสอบ
- **Coverage**
  - ทั้ง frontend และ backend ต้องมี coverage >= 85 เปอร์เซ็นต์ หากต่ำกว่าต้องเพิ่มการทดสอบก่อน merge
  - CI (`.github/workflows`) ต้องผ่าน lint และ test ทั้งหมด ห้าม merge หากยังล้มเหลว

## 9. Performance และ Reliability

- ป้องกัน N+1 query ด้วยการ eager load และตรวจสอบด้วย Laravel Telescope หรือ Debugbar
- ใช้ cache สำหรับงานที่หนักหรือเรียกซ้ำ เช่น Laravel cache หรือ React Query cache
- ควบคุมขนาด bundle หลักให้อยู่ใต้ 250KB (gzip) ใช้ dynamic import สำหรับหน้าที่ไม่ค่อยใช้
- ตรวจสอบ latency ของ endpoint สำคัญและตั้งเป้า p95 น้อยกว่า 300ms
- เก็บ log และ metric ตามแนวทางใน `docs/RUNBOOK.md`

## 10. ความปลอดภัย

- เก็บความลับไว้ใน environment variables เท่านั้น ห้าม commit ไฟล์ `.env`
- บังคับ HTTPS ทุกช่องทาง และตรวจสอบ `X-Forwarded-For` เมื่ออยู่หลัง proxy
- ใช้ policy หรือ gate สำหรับการกำหนดสิทธิ์ตามบทบาท
- กรองและทำความสะอาดข้อมูลผู้ใช้ก่อนบันทึก และ encode ก่อนแสดงผลใน frontend
- ป้องกัน OWASP Top 10 เช่น CSRF, XSS, SQL injection, SSRF
- เปิดใช้การ throttling สำหรับ endpoint การยืนยันตัวตนและสาธารณะ

## 11. เอกสารและการแบ่งปันความรู้

- อัปเดต `docs/README.md` เมื่อมีฟีเจอร์หรือแนวคิดโดเมนใหม่
- บันทึกการเปลี่ยนแปลงสำคัญใน `docs/CHANGELOG.md` หากยังไม่มีให้สร้างไฟล์
- เก็บบันทึกการตัดสินใจสถาปัตยกรรมใน `docs/ADR/` พร้อม template
- อัปเดตชุด Postman และ environment ให้สอดคล้องกับ API ปัจจุบัน

## 12. Checklist ก่อนส่ง PR

1. โครงสร้างไฟล์และชื่อสอดคล้องกับกฎข้อ 2-3
2. Migration และ Seeder ครบและรักษาความสอดคล้องของ schema
3. รัน formatter, lint, typecheck, unit/integration test ทั้งฝั่ง frontend และ backend (เช่น `npm run format`, `pnpm lint`, `php artisan test`, `vendor/bin/pint --test`) และต้องผ่านทั้งหมด
4. เอกสารที่เกี่ยวข้องได้รับการอัปเดต
5. ตรวจสอบประเด็น security และ performance เช่น rate limit, index, eager loading
6. UI มี screenshot หมายเหตุ accessibility และตรวจสอบ responsive แล้ว
7. CI เขียว และ reviewer ยืนยันว่า comment สำคัญถูกปิด

## 13. กรณียกเว้น

- หากต้องเบี่ยงเบนจากกฎ ต้องขออนุมัติจาก Tech Lead ก่อนลงมือ
- ระบุเหตุผลการยกเว้นในคำอธิบาย PR และถ้าเกิดซ้ำควรเพิ่ม ADR

## 14. การบังคับใช้

- CI ตรวจ lint, test และ coverage โดยอัตโนมัติ
- Reviewer ต้องไม่อนุมัติ PR ที่ละเมิดเอกสารฉบับนี้
- หากละเมิดซ้ำ จะถูก escalated ไปยัง Engineering Manager

## 15. การจัดการ Dependencies

- ใช้ lockfile (`package-lock.json`, `pnpm-lock.yaml`, `composer.lock`) เป็นแหล่งความจริง ห้ามแก้ไขมือหรือ commit โดยไม่มีการรัน install ที่ถูกต้อง
- ตรวจสอบ dependency เก่าทุกสปรินต์ด้วย `npm outdated` / `pnpm outdated` และ `composer outdated` แล้ววางแผนอัปเดตแบบค่อยเป็นค่อยไป
- รัน `npm audit` / `pnpm audit` และ `composer audit` เพื่อหาช่องโหว่ หากต้องยกเว้นให้บันทึกเหตุผลไว้ใน PR
- ห้ามเพิ่มไลบรารีที่ไม่มีใบอนุญาตชัดเจน หรือขัดต่อนโยบาย open-source ขององค์กร ตรวจสอบ license ก่อนทุกครั้ง
- ลบ dependency ที่ไม่ได้ใช้ออกทันทีเพื่อลดพื้นผิวโจมตีและขนาด build
- ใช้ Dependabot หรือ Renovate (ถ้าตั้งค่าแล้ว) เพื่อช่วยจับอัปเดตอัตโนมัติ แต่ต้องรีวิวผลกระทบก่อน merge เสมอ

---

โปรดอัปเดตเอกสารนี้ทุกครั้งที่มีการเปลี่ยนแปลงเครื่องมือหรือสถาปัตยกรรม เพื่อให้ทีมทำงานบนมาตรฐานเดียวกันเสมอ
