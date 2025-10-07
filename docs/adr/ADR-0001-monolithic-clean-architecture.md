# ADR-0001: Monolithic + Clean Architecture

## Status
Accepted

## Context
- ทีมมีขนาดเล็กและต้องการความเร็วในการส่งมอบฟีเจอร์
- ระบบเป็นเว็บแอปที่มีทั้ง frontend (React+Vite) และ backend (Laravel) ภายใต้ repository เดียว
- ความต้องการยังไม่ซับซ้อนระดับที่ต้องแยก service เป็น microservices และยังไม่มีภาระจาก domain ที่แยก ownership ชัดเจน
- ต้องการให้ CI/CD เรียบง่าย มีแหล่งความจริงเดียว และลดค่าใช้จ่ายการสังเกต/บำรุงรักษาในระยะเริ่มต้น

## Decision
- ใช้สถาปัตยกรรม Monolithic Repository (Monorepo แบบ 2 โฟลเดอร์ `frontend/` และ `backend/`) ควบคู่กับแนวคิด Clean Architecture ภายในแต่ละส่วน
- โครงสร้างรีโปมาตรฐาน: `frontend/`, `backend/`, `docs/`, และเตรียมโฟลเดอร์สำหรับ `nginx/`, `systemd/`, `.github/workflows/`
- Controller บาง (Thin Controller), แยก Validation เป็น Form Request, Response ผ่าน Resource, ธุรกิจอยู่ใน Service/Domain
- รักษากฎด้านความปลอดภัยตาม `docs/SECURITY.md` และกระบวนการปรับใช้ตาม `docs/RUNBOOK.md`

## Consequences
### ข้อดี
- ความเรียบง่าย: โค้ดอยู่ชุดเดียว ลดค่าใช้จ่ายด้าน orchestration และ communication
- ความเร็วในการพัฒนา: PR, review, test และ release ง่ายขึ้น เหมาะกับทีมเล็ก
- การแชร์โค้ด/สัญญา: ระหว่าง FE/BE สื่อสารผ่านเอกสารกลางและตัวอย่างที่ตรงกันได้รวดเร็ว

### ข้อเสีย
- ขยายตัวอาจยาก: เมื่อระบบใหญ่ขึ้น อาจต้องแตกเป็น service ในอนาคต
- ขอบเขต deploy ร่วม: การปล่อยโค้ดต้องตรวจสอบทั้งระบบ และควบคุมผลกระทบ (ใช้ feature flag/CI แยกงาน)
- สเกลแนวขวางจำกัด: ตราบใดที่ยังรันรวมกัน การสเกลอิสระทำได้ยากกว่า microservices

### ผลกระทบต่อทีม/CI/CD/Deploy
- ทีม: กระบวนการรีวิวรวม ใช้มาตรฐานเดียวใน `docs/CODING_RULES.md`
- CI/CD: Workflow เดียว ตรวจ `lint`, `test`, `build` ทั้งสองฝั่ง และตรวจเอกสารอัปเดต
- Deploy: ตาม `docs/RUNBOOK.md` พร้อม Health Check `/api/health` ใช้สำหรับ readiness

## Alternatives considered
1. Microservices: แยกบริการย่อยตั้งแต่แรก
   - ข้อดี: สเกลง่าย แยก ownership ชัดเจน
   - ข้อเสีย: ซับซ้อนสูง ค่าใช้จ่าย CI/CD และ observability สูง ไม่คุ้มในช่วงเริ่มต้น
2. Modular Monolith: แยกโมดูลชัดเจนใน repo เดียว
   - ข้อดี: ได้ boundary ที่ชัดกว่า monolith ธรรมดา
   - ข้อเสีย: ต้องลงทุนกับ tooling และ guideline เพิ่ม ยังเร็วเกินไปสำหรับ scope ปัจจุบัน

## References
- `docs/CODING_RULES.md`, `docs/SECURITY.md`, `docs/RUNBOOK.md`, `docs/ROUTES.md`
- ThoughtWorks: ADRs
- keepachangelog.com, semver.org
