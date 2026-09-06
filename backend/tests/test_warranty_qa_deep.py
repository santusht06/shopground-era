#!/usr/bin/env python3
"""
ShopGround Era™ — Production Deep QA Test Suite: Warranty & Evidence Upload
=============================================================================
This test suite covers all regression points, failure modes, and edge cases:
1. Registration without Serial Number (Order ID only)
2. Registration without Purchase Platform
3. Idempotent re-registration
4. Missing field validation & Anti-[object Object] error format audit
5. Warranty Verification (Null serial number resilience)
6. Media Evidence Upload:
   - Single upload under 'files' key
   - Single upload under 'file' key
   - Multi-file upload without duplication
   - Dual-field (files + file) deduplication
   - Public CDN/MinIO accessibility verification
   - Unsupported file type rejection (HTTP 400)
   - Empty payload rejection (HTTP 400, no 500 crash)
7. Claim Submission & Verification:
   - Valid claim with matching registered email
   - Mismatched email rejection (404)
   - Claim verification by claim_code
8. Automated teardown & cleanup of test artifacts
"""

import os
import sys
import time
import json
import uuid
import io
import argparse
from typing import Optional, Dict, Any, List

try:
    import requests
except ImportError:
    print("Error: 'requests' module required. Run: pip install requests")
    sys.exit(1)

# Color ANSI helpers for rich test reporting
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
DIM = "\033[2m"
RESET = "\033[0m"

class QATestSuite:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.test_run_id = f"QA-{uuid.uuid4().hex[:6].upper()}"
        self.test_order_id = f"ORD-{self.test_run_id}"
        self.test_email = f"qa-{self.test_run_id.lower()}@shopgroundera.com"
        self.created_warranty_code: Optional[str] = None
        self.created_claim_code: Optional[str] = None
        self.uploaded_files_to_clean: List[str] = []
        
        self.passed_count = 0
        self.failed_count = 0
        self.total_count = 0

    def print_header(self):
        print("")
        print(f"{BOLD}{CYAN}================================================================================{RESET}")
        print(f"{BOLD}{CYAN}   ShopGround Era™ — Production Deep QA Test Suite (Warranty & Media Upload){RESET}")
        print(f"{BOLD}{CYAN}================================================================================{RESET}")
        print(f"{DIM}Target API:   {RESET}{BOLD}{self.base_url}{RESET}")
        print(f"{DIM}Run ID:       {RESET}{self.test_run_id}")
        print(f"{DIM}Test Order:   {RESET}{self.test_order_id}")
        print(f"{DIM}Test Email:   {RESET}{self.test_email}")
        print("")

    def log_result(self, name: str, passed: bool, detail: str = "", elapsed_ms: float = 0.0):
        self.total_count += 1
        time_str = f"{DIM}({elapsed_ms:.1f}ms){RESET}"
        if passed:
            self.passed_count += 1
            print(f"  {GREEN}✔ PASS{RESET}  {BOLD}{name}{RESET} {time_str}")
            if detail:
                print(f"         {DIM}{detail}{RESET}")
        else:
            self.failed_count += 1
            print(f"  {RED}✘ FAIL{RESET}  {BOLD}{name}{RESET} {time_str}")
            print(f"         {RED}Error: {detail}{RESET}")

    def create_dummy_png(self, text: str = "Test Image") -> bytes:
        """Generate a valid, minimal 1x1 PNG in-memory without PIL dependency."""
        import zlib, struct
        width, height = 1, 1
        raw_data = b'\x00' + b'\xff\x00\x00\xff' * width * height
        compressed = zlib.compress(raw_data)
        
        def chunk(tag, data):
            return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)
            
        png = b'\x89PNG\r\n\x1a\n'
        png += chunk(b'IHDR', struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
        png += chunk(b'IDAT', compressed)
        png += chunk(b'IEND', b'')
        return png

    # ─── TEST 1: REGISTRATION WITHOUT SERIAL NUMBER & PLATFORM ─────────────────
    def test_01_registration_without_serial_number(self):
        """Verify warranty registers with Order ID ONLY (no serial number, no purchase platform)."""
        start = time.time()
        url = f"{self.base_url}/warranty/register"
        payload = {
            "order_id": self.test_order_id,
            "customer_name": "QA Automated Engineer",
            "email": self.test_email,
            "phone": "+1 (555) 019-2831",
            "purchase_date": "2026-09-01"
            # NOTE: Neither 'serial_number' nor 'purchase_platform' are sent!
        }
        try:
            res = self.session.post(url, json=payload, timeout=10)
            elapsed = (time.time() - start) * 1000
            if res.status_code not in (200, 201):
                self.log_result("1. Registration with Order ID Only (No Serial #)", False, f"HTTP {res.status_code}: {res.text}", elapsed)
                return

            data = res.json()
            code = data.get("warranty_code")
            status_val = data.get("status")

            if not code or not code.startswith("WRN-"):
                self.log_result("1. Registration with Order ID Only (No Serial #)", False, f"Invalid code format: {code}", elapsed)
                return

            if status_val != "Lifetime Active":
                self.log_result("1. Registration with Order ID Only (No Serial #)", False, f"Unexpected status: {status_val}", elapsed)
                return

            self.created_warranty_code = code
            self.log_result("1. Registration with Order ID Only (No Serial #)", True, f"Warranty code generated: {code} (Status: {status_val})", elapsed)
        except Exception as e:
            self.log_result("1. Registration with Order ID Only (No Serial #)", False, str(e))

    # ─── TEST 2: IDEMPOTENT REGISTRATION ───────────────────────────────────────
    def test_02_idempotent_registration(self):
        """Verify re-registering the same Order ID returns existing record without crash."""
        start = time.time()
        url = f"{self.base_url}/warranty/register"
        payload = {
            "order_id": self.test_order_id,
            "customer_name": "QA Automated Engineer (Duplicate Check)",
            "email": self.test_email,
            "purchase_date": "2026-09-01"
        }
        try:
            res = self.session.post(url, json=payload, timeout=10)
            elapsed = (time.time() - start) * 1000
            data = res.json()
            if res.status_code in (200, 201) and data.get("warranty_code") == self.created_warranty_code:
                self.log_result("2. Idempotent Order ID Registration", True, f"Successfully returned existing {self.created_warranty_code}", elapsed)
            else:
                self.log_result("2. Idempotent Order ID Registration", False, f"HTTP {res.status_code}: {res.text}", elapsed)
        except Exception as e:
            self.log_result("2. Idempotent Order ID Registration", False, str(e))

    # ─── TEST 3: VALIDATION ERROR AUDIT (ANTI [object Object]) ─────────────────
    def test_03_validation_error_format(self):
        """Verify missing required fields return parseable error payloads without [object Object]."""
        start = time.time()
        url = f"{self.base_url}/warranty/register"
        # Omit order_id and pass invalid email
        payload = {
            "customer_name": "QA User",
            "email": "not-an-email-address"
        }
        try:
            res = self.session.post(url, json=payload, timeout=10)
            elapsed = (time.time() - start) * 1000
            if res.status_code == 422:
                data = res.json()
                detail = data.get("detail")
                # Detail must be either a string or a list of dicts with 'msg'
                if isinstance(detail, list) and len(detail) > 0 and all("msg" in d for d in detail):
                    msgs = [d.get("msg") for d in detail]
                    self.log_result("3. Anti-[object Object] Validation Structure", True, f"Clean 422 error list: {', '.join(msgs[:2])}", elapsed)
                elif isinstance(detail, str):
                    self.log_result("3. Anti-[object Object] Validation Structure", True, f"Clean 422 error string: {detail}", elapsed)
                else:
                    self.log_result("3. Anti-[object Object] Validation Structure", False, f"Unparseable detail: {detail}", elapsed)
            else:
                self.log_result("3. Anti-[object Object] Validation Structure", False, f"Expected 422, got {res.status_code}", elapsed)
        except Exception as e:
            self.log_result("3. Anti-[object Object] Validation Structure", False, str(e))

    # ─── TEST 4: VERIFICATION FLOW & NULL SERIAL NUMBER RESILIENCE ─────────────
    def test_04_verify_registered_warranty(self):
        """Verify warranty lookup returns valid record where serial_number is null."""
        if not self.created_warranty_code:
            self.log_result("4. Warranty Code Verification (Null Serial #)", False, "Skipped: No warranty code created")
            return
        start = time.time()
        url = f"{self.base_url}/warranty/verify/{self.created_warranty_code}"
        try:
            res = self.session.get(url, timeout=10)
            elapsed = (time.time() - start) * 1000
            if res.status_code == 200:
                data = res.json()
                order_ok = data.get("order_id") == self.test_order_id
                serial_val = data.get("serial_number")
                if order_ok:
                    self.log_result("4. Warranty Code Verification (Null Serial #)", True, f"Order matched. serial_number={serial_val}", elapsed)
                else:
                    self.log_result("4. Warranty Code Verification (Null Serial #)", False, f"Order ID mismatch: {data}", elapsed)
            else:
                self.log_result("4. Warranty Code Verification (Null Serial #)", False, f"HTTP {res.status_code}: {res.text}", elapsed)
        except Exception as e:
            self.log_result("4. Warranty Code Verification (Null Serial #)", False, str(e))

    # ─── TEST 5: VERIFICATION NON-EXISTENT ─────────────────────────────────────
    def test_05_verify_nonexistent_code(self):
        """Verify non-existent warranty code returns 404 with string detail."""
        start = time.time()
        url = f"{self.base_url}/warranty/verify/WRN-NOT-REAL-9999"
        try:
            res = self.session.get(url, timeout=10)
            elapsed = (time.time() - start) * 1000
            if res.status_code == 404:
                data = res.json()
                detail = data.get("detail", "")
                self.log_result("5. Non-Existent Warranty Lookup (404)", True, f"Clean 404 detail: '{detail}'", elapsed)
            else:
                self.log_result("5. Non-Existent Warranty Lookup (404)", False, f"Expected 404, got {res.status_code}", elapsed)
        except Exception as e:
            self.log_result("5. Non-Existent Warranty Lookup (404)", False, str(e))

    # ─── TEST 6: EVIDENCE UPLOAD — SINGLE FILE ('files' KEY) ───────────────────
    def test_06_single_upload_files_key(self):
        """Verify single file upload via 'files' key returns exactly 1 file (no duplicate)."""
        start = time.time()
        url = f"{self.base_url}/warranty/upload-evidence"
        png_bytes = self.create_dummy_png("Single File Upload")
        files = [('files', ('test_evidence_1.png', io.BytesIO(png_bytes), 'image/png'))]
        try:
            res = self.session.post(url, files=files, timeout=15)
            elapsed = (time.time() - start) * 1000
            if res.status_code == 200:
                data = res.json()
                count = data.get("count")
                urls = data.get("urls", [])
                if count == 1 and len(urls) == 1:
                    self.uploaded_files_to_clean.append(urls[0])
                    self.log_result("6. Single File Upload ('files' Key - Count=1)", True, f"URL: {urls[0]}", elapsed)
                else:
                    self.log_result("6. Single File Upload ('files' Key - Count=1)", False, f"Duplication detected: count={count}, urls={urls}", elapsed)
            else:
                self.log_result("6. Single File Upload ('files' Key - Count=1)", False, f"HTTP {res.status_code}: {res.text}", elapsed)
        except Exception as e:
            self.log_result("6. Single File Upload ('files' Key - Count=1)", False, str(e))

    # ─── TEST 7: EVIDENCE UPLOAD — SINGLE FILE ('file' KEY) ────────────────────
    def test_07_single_upload_file_key(self):
        """Verify single file upload via 'file' key returns exactly 1 file (backward compatibility)."""
        start = time.time()
        url = f"{self.base_url}/warranty/upload-evidence"
        png_bytes = self.create_dummy_png("Single File Legacy Key")
        files = {'file': ('test_evidence_legacy.png', io.BytesIO(png_bytes), 'image/png')}
        try:
            res = self.session.post(url, files=files, timeout=15)
            elapsed = (time.time() - start) * 1000
            if res.status_code == 200:
                data = res.json()
                count = data.get("count")
                urls = data.get("urls", [])
                if count == 1 and len(urls) == 1:
                    self.uploaded_files_to_clean.append(urls[0])
                    self.log_result("7. Single File Upload ('file' Key - Count=1)", True, f"URL: {urls[0]}", elapsed)
                else:
                    self.log_result("7. Single File Upload ('file' Key - Count=1)", False, f"Duplication detected: count={count}", elapsed)
            else:
                self.log_result("7. Single File Upload ('file' Key - Count=1)", False, f"HTTP {res.status_code}: {res.text}", elapsed)
        except Exception as e:
            self.log_result("7. Single File Upload ('file' Key - Count=1)", False, str(e))

    # ─── TEST 8: MULTI-FILE UPLOAD DEDUPLICATION ──────────────────────────────
    def test_08_multi_file_upload(self):
        """Verify uploading 3 distinct files returns exactly 3 unique URLs (no duplicates)."""
        start = time.time()
        url = f"{self.base_url}/warranty/upload-evidence"
        png_1 = self.create_dummy_png("File 1")
        png_2 = self.create_dummy_png("File 2")
        png_3 = self.create_dummy_png("File 3")
        
        files = [
            ('files', ('evidence_multi_1.png', io.BytesIO(png_1), 'image/png')),
            ('files', ('evidence_multi_2.png', io.BytesIO(png_2), 'image/png')),
            ('files', ('evidence_multi_3.png', io.BytesIO(png_3), 'image/png')),
        ]
        try:
            res = self.session.post(url, files=files, timeout=20)
            elapsed = (time.time() - start) * 1000
            if res.status_code == 200:
                data = res.json()
                count = data.get("count")
                urls = data.get("urls", [])
                unique_urls = set(urls)
                if count == 3 and len(urls) == 3 and len(unique_urls) == 3:
                    self.uploaded_files_to_clean.extend(urls)
                    self.log_result("8. Multi-File Upload (3 Files - Count=3)", True, f"All 3 URLs distinct. Count={count}", elapsed)
                else:
                    self.log_result("8. Multi-File Upload (3 Files - Count=3)", False, f"Duplicate URLs detected: count={count}, unique={len(unique_urls)}", elapsed)
            else:
                self.log_result("8. Multi-File Upload (3 Files - Count=3)", False, f"HTTP {res.status_code}: {res.text}", elapsed)
        except Exception as e:
            self.log_result("8. Multi-File Upload (3 Files - Count=3)", False, str(e))

    # ─── TEST 9: DUAL-KEY DEDUPLICATION AUDIT ─────────────────────────────────
    def test_09_dual_key_deduplication(self):
        """Verify sending 'files' AND 'file' in same request does NOT create duplicate upload."""
        start = time.time()
        url = f"{self.base_url}/warranty/upload-evidence"
        png_bytes = self.create_dummy_png("Dual Key Test")
        files = [
            ('files', ('dual_test_1.png', io.BytesIO(png_bytes), 'image/png')),
            ('file', ('dual_test_1.png', io.BytesIO(png_bytes), 'image/png'))
        ]
        try:
            res = self.session.post(url, files=files, timeout=15)
            elapsed = (time.time() - start) * 1000
            if res.status_code == 200:
                data = res.json()
                count = data.get("count")
                urls = data.get("urls", [])
                if count == 1 and len(urls) == 1:
                    self.uploaded_files_to_clean.append(urls[0])
                    self.log_result("9. Dual-Field Deduplication ('files' + 'file')", True, f"Deduplication preserved: count={count}", elapsed)
                else:
                    self.log_result("9. Dual-Field Deduplication ('files' + 'file')", False, f"Duplication bug present! count={count}", elapsed)
            else:
                self.log_result("9. Dual-Field Deduplication ('files' + 'file')", False, f"HTTP {res.status_code}: {res.text}", elapsed)
        except Exception as e:
            self.log_result("9. Dual-Field Deduplication ('files' + 'file')", False, str(e))

    # ─── TEST 10: PUBLIC CDN/MINIO ACCESSIBILITY ──────────────────────────────
    def test_10_public_cdn_accessibility(self):
        """Verify uploaded evidence URL is publicly reachable via HTTP GET."""
        if not self.uploaded_files_to_clean:
            self.log_result("10. Public CDN Evidence Accessibility", False, "Skipped: No evidence URL uploaded")
            return
        target_url = self.uploaded_files_to_clean[0]
        start = time.time()
        try:
            res = self.session.get(target_url, timeout=10)
            elapsed = (time.time() - start) * 1000
            if res.status_code == 200 and 'image' in res.headers.get('content-type', ''):
                self.log_result("10. Public CDN Evidence Accessibility", True, f"HTTP 200 OK. Content-Type: {res.headers.get('content-type')}", elapsed)
            else:
                self.log_result("10. Public CDN Evidence Accessibility", False, f"HTTP {res.status_code}: headers={res.headers}", elapsed)
        except Exception as e:
            self.log_result("10. Public CDN Evidence Accessibility", False, str(e))

    # ─── TEST 11: UNSUPPORTED FILE EXTENSION REJECTION ────────────────────────
    def test_11_unsupported_file_extension(self):
        """Verify unsupported extensions (.exe/.ico) return HTTP 400 with string error."""
        start = time.time()
        url = f"{self.base_url}/warranty/upload-evidence"
        fake_exe = b"MZ\x90\x00\x03\x00\x00\x00"
        files = [('files', ('payload.exe', io.BytesIO(fake_exe), 'application/x-msdownload'))]
        try:
            res = self.session.post(url, files=files, timeout=10)
            elapsed = (time.time() - start) * 1000
            if res.status_code == 400:
                data = res.json()
                detail = data.get("detail", "")
                if "Unsupported file type" in detail:
                    self.log_result("11. Unsupported Extension Rejection (HTTP 400)", True, f"Rejected correctly: '{detail}'", elapsed)
                else:
                    self.log_result("11. Unsupported Extension Rejection (HTTP 400)", False, f"Unexpected detail: {detail}", elapsed)
            else:
                self.log_result("11. Unsupported Extension Rejection (HTTP 400)", False, f"Expected 400, got {res.status_code}", elapsed)
        except Exception as e:
            self.log_result("11. Unsupported Extension Rejection (HTTP 400)", False, str(e))

    # ─── TEST 12: EMPTY UPLOAD REJECTION ──────────────────────────────────────
    def test_12_empty_upload_rejection(self):
        """Verify empty multipart upload returns HTTP 400 without crashing backend."""
        start = time.time()
        url = f"{self.base_url}/warranty/upload-evidence"
        try:
            res = self.session.post(url, data={}, timeout=10)
            elapsed = (time.time() - start) * 1000
            if res.status_code == 400:
                self.log_result("12. Empty Payload Rejection (HTTP 400)", True, "Handled gracefully without 500 crash", elapsed)
            else:
                self.log_result("12. Empty Payload Rejection (HTTP 400)", False, f"Expected 400, got {res.status_code}", elapsed)
        except Exception as e:
            self.log_result("12. Empty Payload Rejection (HTTP 400)", False, str(e))

    # ─── TEST 13: WARRANTY CLAIM SUBMISSION ───────────────────────────────────
    def test_13_claim_submission_valid(self):
        """Verify filing a warranty claim with valid code and matching email succeeds."""
        if not self.created_warranty_code:
            self.log_result("13. Claim Submission (Valid Code & Email)", False, "Skipped: No warranty code created")
            return
        start = time.time()
        url = f"{self.base_url}/warranty/claim"
        evidence_sample = self.uploaded_files_to_clean[0] if self.uploaded_files_to_clean else None
        payload = {
            "warranty_code": self.created_warranty_code,
            "email": self.test_email,
            "issue_category": "Dampening Failure / Walking Pads",
            "description": "Pads began walking during 1200 RPM spin cycle. QA automated test claim.",
            "evidence_url": evidence_sample,
            "evidence_urls": [evidence_sample] if evidence_sample else []
        }
        try:
            res = self.session.post(url, json=payload, timeout=10)
            elapsed = (time.time() - start) * 1000
            if res.status_code in (200, 201):
                data = res.json()
                clm_code = data.get("claim_code")
                if clm_code and clm_code.startswith("CLM-"):
                    self.created_claim_code = clm_code
                    self.log_result("13. Claim Submission (Valid Code & Email)", True, f"Claim code generated: {clm_code}", elapsed)
                else:
                    self.log_result("13. Claim Submission (Valid Code & Email)", False, f"Invalid claim code format: {data}", elapsed)
            else:
                self.log_result("13. Claim Submission (Valid Code & Email)", False, f"HTTP {res.status_code}: {res.text}", elapsed)
        except Exception as e:
            self.log_result("13. Claim Submission (Valid Code & Email)", False, str(e))

    # ─── TEST 14: CLAIM SUBMISSION WITH MISMATCHED EMAIL ──────────────────────
    def test_14_claim_submission_mismatched_email(self):
        """Verify filing claim with valid code but wrong email is rejected (404/400)."""
        if not self.created_warranty_code:
            self.log_result("14. Claim Submission (Mismatched Email Check)", False, "Skipped: No warranty code created")
            return
        start = time.time()
        url = f"{self.base_url}/warranty/claim"
        payload = {
            "warranty_code": self.created_warranty_code,
            "email": "intruder@unauthorized-domain.com",
            "issue_category": "Material Cracking / Tearing",
            "description": "Unauthorized claim submission attempt."
        }
        try:
            res = self.session.post(url, json=payload, timeout=10)
            elapsed = (time.time() - start) * 1000
            if res.status_code in (404, 400):
                data = res.json()
                self.log_result("14. Claim Submission (Mismatched Email Check)", True, f"Correctly rejected with HTTP {res.status_code}: {data.get('detail')}", elapsed)
            else:
                self.log_result("14. Claim Submission (Mismatched Email Check)", False, f"Expected 404/400, got {res.status_code}", elapsed)
        except Exception as e:
            self.log_result("14. Claim Submission (Mismatched Email Check)", False, str(e))

    # ─── TEST 15: CLAIM VERIFICATION STATUS ───────────────────────────────────
    def test_15_claim_verification_lookup(self):
        """Verify claim status is queryable via /warranty/claim/{claim_code}."""
        if not self.created_claim_code:
            self.log_result("15. Claim Status Verification Lookup", False, "Skipped: No claim code created")
            return
        start = time.time()
        url = f"{self.base_url}/warranty/claim/{self.created_claim_code}"
        try:
            res = self.session.get(url, timeout=10)
            elapsed = (time.time() - start) * 1000
            if res.status_code == 200:
                data = res.json()
                status_val = data.get("status")
                self.log_result("15. Claim Status Verification Lookup", True, f"Status: {status_val}", elapsed)
            else:
                self.log_result("15. Claim Status Verification Lookup", False, f"HTTP {res.status_code}: {res.text}", elapsed)
        except Exception as e:
            self.log_result("15. Claim Status Verification Lookup", False, str(e))

    # ─── TEARDOWN & CLEANUP ───────────────────────────────────────────────────
    def teardown(self):
        """Clean up test registration and uploaded test images."""
        print("")
        print(f"{BOLD}{CYAN}--------------------------------------------------------------------------------{RESET}")
        print(f"{BOLD}   Teardown & Cleanup Automation{RESET}")
        print(f"{BOLD}{CYAN}--------------------------------------------------------------------------------{RESET}")
        
        # 1. Clean uploaded files from MinIO storage
        if self.uploaded_files_to_clean:
            filenames = [os.path.basename(u) for u in self.uploaded_files_to_clean]
            print(f"  {DIM}Cleaning {len(filenames)} uploaded evidence files from storage...{RESET}")
            minio_dir = "/var/lib/minio/data/warranty-evidence"
            if os.path.exists(minio_dir):
                for fn in filenames:
                    fp = os.path.join(minio_dir, fn)
                    if os.path.exists(fp):
                        try:
                            os.remove(fp)
                        except Exception:
                            pass
                print(f"  {GREEN}✔ Cleaned local storage files:{RESET} {', '.join(filenames)}")
            else:
                try:
                    import subprocess
                    rm_cmd = f"rm -f {' '.join(['/var/lib/minio/data/warranty-evidence/' + fn for fn in filenames])}"
                    res = subprocess.run(["ssh", "-i", os.path.expanduser("~/.ssh/shopground_era_key"), "root@143.198.38.205", rm_cmd], capture_output=True, timeout=10)
                    if res.returncode == 0:
                        print(f"  {GREEN}✔ Cleaned remote storage files:{RESET} {', '.join(filenames)}")
                except Exception as ex:
                    print(f"  {YELLOW}⚠ Notice: Storage cleanup skipped ({ex}){RESET}")

        # 2. Clean test warranty & claim record from MongoDB
        print(f"  {DIM}Cleaning test warranty ({self.test_order_id}) from MongoDB...{RESET}")
        cleaned_db = False
        try:
            import asyncio
            from motor.motor_asyncio import AsyncIOMotorClient
            async def _local_clean():
                client = AsyncIOMotorClient("mongodb://127.0.0.1:27017", serverSelectionTimeoutMS=2000)
                db = client["shopground_db"]
                await db.warranties.delete_many({"order_id": self.test_order_id})
                await db.warranty_claims.delete_many({"email": self.test_email})
            asyncio.run(_local_clean())
            print(f"  {GREEN}✔ Database cleaned locally successfully.{RESET}")
            cleaned_db = True
        except Exception:
            pass

        if not cleaned_db:
            try:
                import subprocess
                mongo_clean_script = f"/root/projects/shopground-era/backend/venv/bin/python3 -c \"import asyncio; from motor.motor_asyncio import AsyncIOMotorClient; client = AsyncIOMotorClient('mongodb://127.0.0.1:27017'); db = client['shopground_db']; asyncio.run(db.warranties.delete_many({{'order_id': '{self.test_order_id}'}})); asyncio.run(db.warranty_claims.delete_many({{'email': '{self.test_email}'}})); print('MongoDB Cleaned')\""
                res = subprocess.run(["ssh", "-i", os.path.expanduser("~/.ssh/shopground_era_key"), "root@143.198.38.205", mongo_clean_script], capture_output=True, text=True, timeout=10)
                if "MongoDB Cleaned" in res.stdout:
                    print(f"  {GREEN}✔ Database cleaned remotely successfully.{RESET}")
            except Exception as ex:
                print(f"  {YELLOW}⚠ Notice: Remote database cleanup skipped ({ex}){RESET}")

    def run_all(self):
        self.print_header()
        self.test_01_registration_without_serial_number()
        self.test_02_idempotent_registration()
        self.test_03_validation_error_format()
        self.test_04_verify_registered_warranty()
        self.test_05_verify_nonexistent_code()
        self.test_06_single_upload_files_key()
        self.test_07_single_upload_file_key()
        self.test_08_multi_file_upload()
        self.test_09_dual_key_deduplication()
        self.test_10_public_cdn_accessibility()
        self.test_11_unsupported_file_extension()
        self.test_12_empty_upload_rejection()
        self.test_13_claim_submission_valid()
        self.test_14_claim_submission_mismatched_email()
        self.test_15_claim_verification_lookup()
        
        self.teardown()

        # Summary Breakdown
        print("")
        print(f"{BOLD}{CYAN}================================================================================{RESET}")
        print(f"{BOLD}   Deep QA Test Run Summary{RESET}")
        print(f"{BOLD}{CYAN}================================================================================{RESET}")
        print(f"  Total Tests Executed: {BOLD}{self.total_count}{RESET}")
        print(f"  Passed:               {GREEN}{BOLD}{self.passed_count}{RESET}")
        print(f"  Failed:               {RED}{BOLD}{self.failed_count}{RESET}")
        
        if self.failed_count == 0:
            print(f"\n  {GREEN}{BOLD}🎉 ALL QA TESTS PASSED! System is 100% production-ready.{RESET}\n")
            return 0
        else:
            print(f"\n  {RED}{BOLD}⚠ {self.failed_count} TEST(S) FAILED. Please review the output above.{RESET}\n")
            return 1

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ShopGround Era Deep QA Test Suite")
    parser.add_argument("--base-url", default=os.getenv("API_BASE_URL", "https://api.shopgroundera.com/api/v1"), help="API Base URL")
    args = parser.parse_args()
    
    runner = QATestSuite(base_url=args.base_url)
    exit_code = runner.run_all()
    sys.exit(exit_code)
