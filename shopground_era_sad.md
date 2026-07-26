# ShopGround Era — Software Architecture Document (SAD)

**Version:** 1.0.0  
**Classification:** Internal Engineering  
**Status:** Production  
**Author:** Principal Software Architect  
**Last Updated:** 2026-07-26  
**Repository:** [github.com/santusht06/shopground-era](https://github.com/santusht06/shopground-era)

---

## Table of Contents

1. Executive Summary
2. Technology Stack
3. High-Level Architecture
4. Component Architecture
5. Database Architecture
6. Authentication & Authorization
7. RBAC Design
8. Product Architecture
9. Inventory Architecture
10. Order Processing
11. Payment Architecture
12. Logistics Architecture
13. Cloudinary Integration
14. Search Architecture
15. API Architecture
16. Folder Structure
17. Database Schema
18. MongoDB Indexing Strategy
19. Redis Caching Strategy
20. Security Architecture
21. Performance Optimizations
22. Scalability Roadmap
23. Deployment Architecture
24. DevOps Pipeline
25. Monitoring & Logging
26. Disaster Recovery
27. UI/UX Design System
28. Production Readiness Checklist
29. Future Enhancements

---

## 1. Executive Summary

ShopGround Era is an enterprise-grade, cloud-native, full-stack e-commerce platform engineered to serve from startup scale to millions of concurrent users. This document describes the complete software architecture, data models, security posture, operational playbooks, and scalability roadmap.

**Design Principles:**

- **Separation of Concerns** — Every module is independently deployable and testable.
- **Defense in Depth** — Multiple security layers at every boundary.
- **Fail-Safe Defaults** — Graceful degradation, circuit breakers, and Redis fallbacks at every service boundary.
- **Observability-First** — Every request, mutation, and failure is traceable via structured logs and audit trails.
- **Stateless APIs** — All backend services are stateless to enable horizontal scaling.
- **Eventual Consistency** — MongoDB replica sets + Redis pub/sub enable high availability with tunable consistency.

**Outcome Goals:**

| Metric | Target |
|---|---|
| API P95 Response Time | < 120ms |
| System Availability | 99.9% SLA |
| Concurrent Users (v1) | 10,000 |
| Concurrent Users (v2 / scaled) | 1,000,000+ |
| Order Processing SLA | < 500ms from checkout to confirmation |
| Image Delivery | < 50ms via Cloudinary CDN |
| Search Latency | < 80ms |

---

## 2. Technology Stack

### Frontend Layer

| Component | Technology | Rationale |
|---|---|---|
| UI Framework | React 18 + Vite | Component model, HMR, tree-shaking |
| State Management | Redux Toolkit + RTK Query | Predictable state, normalized cache |
| Routing | React Router v6 | File-based routing, nested layouts |
| Styling | TailwindCSS v4 | Utility-first, zero-runtime CSS |
| Animation | Framer Motion | Declarative spring physics |
| Forms | React Hook Form + Zod | Performance-first uncontrolled forms |
| HTTP Client | Axios + interceptors | Token refresh, retry, error boundary |
| Design Language | Apple-inspired Premium Dark | High-end consumer e-commerce UX |

### Backend Layer

| Component | Technology | Rationale |
|---|---|---|
| API Framework | FastAPI 0.110 | Async-first, Pydantic V2, auto OpenAPI |
| Data Validation | Pydantic V2 | Type-safe schemas, serialization |
| Auth | JWT RS256 + OAuth2 Ready | Asymmetric signing, JWKS-compatible |
| Background Workers | FastAPI BackgroundTasks + Redis Queue | Non-blocking email/notification dispatch |
| Web Server | Uvicorn + Gunicorn | ASGI event loop, production workers |
| Reverse Proxy | Nginx | TLS termination, rate limiting, routing |
| Containerization | Docker + Docker Compose | Immutable deployments, env parity |

### Data Layer

| Component | Technology | Rationale |
|---|---|---|
| Primary Database | MongoDB 7 (Motor async) | Flexible document model, horizontal scale |
| Replica Strategy | 3-Node Replica Set | High availability, read scaling |
| Caching | Redis 7.2 | Sub-millisecond response for hot data |
| File Storage | Cloudinary | Managed CDN, on-the-fly transformations |
| Search | MongoDB Atlas Text Search + Aggregation | Integrated full-text search |

### Infrastructure

| Component | Technology |
|---|---|
| DNS & CDN | Cloudflare |
| SSL | Cloudflare + Let's Encrypt |
| Deployment | Docker Compose (v1), Kubernetes-ready (v2) |
| CI/CD | GitHub Actions |
| Secrets | Environment Variables + `.env` vault |
| Monitoring | Prometheus + Grafana (planned) |

---

## 3. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLOUDFLARE CDN / DNS                               │
│                    DDoS Protection · SSL Termination · WAF                      │
└──────────────────────────────┬──────────────────────────────────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
    ┌─────────▼──────────┐           ┌──────────▼──────────┐
    │   myapp.com        │           │  admin.myapp.com     │
    │ Customer Frontend  │           │   Admin Frontend     │
    │  React + Vite      │           │   React + Vite       │
    │  Port 5173         │           │   Port 5174          │
    └─────────┬──────────┘           └──────────┬──────────┘
              │                                 │
              └──────────────┬──────────────────┘
                             │ HTTPS / REST
                    ┌────────▼────────┐
                    │     NGINX       │
                    │  Reverse Proxy  │
                    │  Rate Limiting  │
                    │  SSL Offload    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────────────────────┐
                    │       FastAPI Application        │
                    │   (Uvicorn / Gunicorn ASGI)      │
                    │                                  │
                    │  ┌─────────┐  ┌──────────────┐  │
                    │  │  Auth   │  │  Background   │  │
                    │  │ Router  │  │   Workers     │  │
                    │  └────┬────┘  └──────┬───────┘  │
                    │       │              │           │
                    │  ┌────▼──────────────▼────────┐  │
                    │  │      Core Business Logic    │  │
                    │  │  Products · Orders · Cart   │  │
                    │  │  Payments · Logistics       │  │
                    │  └──────────────┬─────────────┘  │
                    └─────────────────┼────────────────┘
                                      │
            ┌─────────────────────────┼──────────────────────────┐
            │                         │                          │
   ┌────────▼────────┐      ┌─────────▼─────────┐   ┌──────────▼──────────┐
   │    MongoDB       │      │      Redis          │   │    Cloudinary       │
   │  Replica Set     │      │  Cache + Queues     │   │   Media CDN         │
   │  Primary +2      │      │  Sessions · OTP     │   │   Image Transform   │
   └─────────────────┘      └────────────────────┘   └────────────────────┘
```

---

## 4. Component Architecture

### 4.1 Layered Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Presentation Layer                 │
│         React Components + Redux Store               │
├──────────────────────────────────────────────────────┤
│                    API Gateway Layer                  │
│              Nginx + Rate Limiting + CORS             │
├──────────────────────────────────────────────────────┤
│                   Application Layer                   │
│             FastAPI Routers + Dependency Injection    │
├──────────────────────────────────────────────────────┤
│                    Service Layer                      │
│     ProductService · OrderService · AuthService      │
│     PaymentService · LogisticsService · Cache        │
├──────────────────────────────────────────────────────┤
│                  Repository Layer                     │
│       MongoDB Motor Collections + Query Builders     │
├──────────────────────────────────────────────────────┤
│                  Infrastructure Layer                 │
│     MongoDB · Redis · Cloudinary · SMTP · SMS        │
└──────────────────────────────────────────────────────┘
```

### 4.2 Bounded Context Map

Each module owns its data — no direct cross-collection mutations:

| Module | Owns | Reads From |
|---|---|---|
| Auth | users, refresh_tokens, sessions, otp_codes | — |
| Catalog | products, categories, brands, attributes | inventory |
| Inventory | inventory, warehouses, stock_movements | products |
| Orders | orders, order_items, order_timeline | products, users, inventory |
| Payments | payments, refunds, invoices | orders, users |
| Logistics | shipments, awb_records, tracking_events | orders |
| Reviews | reviews, ratings | products, users, orders |
| Promotions | coupons, campaigns, discount_rules | products, orders |
| Notifications | notification_queue, notification_logs | users, orders |

---

## 5. Database Architecture

### 5.1 MongoDB Replica Set Topology

```
┌────────────────────────────────────────────────┐
│              MongoDB Replica Set               │
│                                                │
│   ┌──────────────┐    ┌──────────────────┐     │
│   │   PRIMARY     │───▶│   SECONDARY 1    │     │
│   │  Port 27017  │    │   Port 27018     │     │
│   │  R/W Traffic │    │  Read Traffic    │     │
│   └──────┬───────┘    └──────────────────┘     │
│          │                                     │
│          │             ┌──────────────────┐    │
│          └────────────▶│   SECONDARY 2    │    │
│                        │   Port 27019     │    │
│                        │   Read / Arbiter │    │
│                        └──────────────────┘    │
└────────────────────────────────────────────────┘
```

**Write Concern:** `{ w: "majority", j: true }` on all order/payment mutations.  
**Read Preference:** `secondaryPreferred` on analytics and report queries.  
**Oplog-Based Replication:** Near-zero lag on commodity hardware.

---

## 6. Authentication & Authorization

### 6.1 Sharexpress-Inspired Auth Flow

```
Client                       FastAPI                     MongoDB           Redis
  │                              │                           │               │
  │  POST /api/v1/auth/login     │                           │               │
  │─────────────────────────────▶│                           │               │
  │                              │  find_one({email})        │               │
  │                              │─────────────────────────▶│               │
  │                              │◀─────────────────────────│               │
  │                              │  bcrypt.verify()          │               │
  │                              │  create_access_token()    │               │
  │                              │  (RS256 RSA Private Key)  │               │
  │                              │  create_refresh_token()   │               │
  │                              │  store refresh_token ─────────────────────▶│
  │◀─────────────────────────────│  {access_token, refresh_token, user}      │
  │                              │                           │               │
  │  GET /api/v1/products        │                           │               │
  │  Authorization: Bearer {JWT} │                           │               │
  │─────────────────────────────▶│                           │               │
  │                              │  decode_token(RS256 Public Key)           │
  │                              │  validate expiry + role   │               │
  │◀─────────────────────────────│  200 OK + data            │               │
```

### 6.2 OTP Email Magic Link Flow

```
Client                       FastAPI                     Redis           Email Queue
  │                              │                           │               │
  │  POST /auth/request-otp      │                           │               │
  │  { email: "user@x.com" }     │                           │               │
  │─────────────────────────────▶│                           │               │
  │                              │  generate_otp_code()      │               │
  │                              │  SET otp:{email} {code}   │               │
  │                              │  EXPIRE 300 (5 min TTL) ─▶│               │
  │                              │  enqueue_email_task() ────────────────────▶│
  │◀─────────────────────────────│  { status: "OTP sent" }   │               │
  │                              │                           │               │
  │  POST /auth/verify-otp       │                           │               │
  │  { email, otp_code }         │                           │               │
  │─────────────────────────────▶│                           │               │
  │                              │  GET otp:{email} ────────▶│               │
  │                              │◀──────────────────────────│               │
  │                              │  compare + DEL key        │               │
  │                              │  create JWT tokens        │               │
  │◀─────────────────────────────│  { access_token, refresh_token }          │
```

### 6.3 Refresh Token Rotation

- Refresh tokens are stored in Redis with a 7-day TTL key: `refresh:{user_id}:{token_hash}`.
- On every `/auth/refresh` request, the old refresh token is **atomically deleted** and a new one is issued.
- Replayed refresh tokens are immediately flagged — all sessions for that user are revoked (token family invalidation).
- Refresh tokens are **never stored in the JWT** itself — only the access token travels in Authorization headers.

### 6.4 JWT RS256 Architecture

```python
# Private Key — Backend only, never exposed
RSA_PRIVATE_KEY = os.getenv("JWT_PRIVATE_KEY")

# Public Key — Shared with API gateways / microservices for verification
RSA_PUBLIC_KEY = os.getenv("JWT_PUBLIC_KEY")

# JWT Payload Structure
{
  "sub": "user@shopground.era",
  "role": "customer",
  "permissions": ["read:products", "write:cart", "write:orders"],
  "iat": 1785017971,
  "exp": 1785021571,
  "type": "access",
  "device_id": "dev_abc123"
}
```

**Why RS256?**  
Unlike HS256 (shared secret), RS256 uses asymmetric keys. Any microservice, API gateway (Nginx, Kong), or CDN edge worker can verify tokens using the **public key** without access to the signing secret — critical for zero-trust microservice architectures.

---

## 7. RBAC Design

### 7.1 Permission Matrix

Permissions are stored in MongoDB `permissions` collection — **never hardcoded in source code**.

| Resource | super_admin | store_manager | inventory_mgr | fulfillment_agent | support_exec | customer |
|---|---|---|---|---|---|---|
| products:read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| products:create | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| products:update | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| products:delete | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| orders:read_all | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| orders:read_own | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| orders:update_status | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| inventory:read | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| inventory:update | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| users:read | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| users:update | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| users:delete | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| analytics:read | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| coupons:manage | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| refunds:approve | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| audit_logs:read | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| warehouse:manage | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |

### 7.2 Permission-Based FastAPI Middleware

```python
# Dependency Injection — Not hardcoded per route
def require_permission(permission: str):
    async def _check(current_user: UserInDB = Depends(get_current_user)):
        user_permissions = await get_permissions_for_role(current_user.role)
        if permission not in user_permissions:
            raise HTTPException(403, detail=f"Insufficient permissions: requires '{permission}'")
        return current_user
    return _check

# Usage per route
@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    _user: UserInDB = Depends(require_permission("products:delete"))
):
    ...
```

### 7.3 MongoDB Permission Documents

```json
{
  "_id": "perm_001",
  "role": "store_manager",
  "permissions": [
    "products:read", "products:create", "products:update",
    "orders:read_all", "orders:update_status",
    "inventory:read", "inventory:update",
    "coupons:manage", "refunds:approve",
    "analytics:read", "users:read"
  ],
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-07-26T00:00:00Z"
}
```

---

## 8. Product Architecture

### 8.1 Product Data Model

```json
{
  "_id": "prod_apex_hd_001",
  "name": "Apex Pro Headphones X1",
  "slug": "apex-pro-headphones-x1",
  "subtitle": "Wireless ANC — Studio Grade Audio",
  "description": "60-word SEO-friendly long-form product description...",
  "brand_id": "brand_apex_audio",
  "category_id": "cat_electronics",
  "subcategory_id": "subcat_audio",
  "price": 249.99,
  "original_price": 299.99,
  "discount_percent": 16.67,
  "sku": "APEX-HD-X1-BLK",
  "stock": 18,
  "low_stock_threshold": 5,
  "weight_grams": 285,
  "dimensions": { "l": 18, "w": 8, "h": 18, "unit": "cm" },
  "variants": [
    {
      "sku": "APEX-HD-X1-BLK",
      "color": "Midnight Black",
      "size": null,
      "stock": 10,
      "price_override": null,
      "images": ["cloudinary_public_id_1", "cloudinary_public_id_2"]
    },
    {
      "sku": "APEX-HD-X1-WHT",
      "color": "Glacier White",
      "size": null,
      "stock": 8,
      "price_override": 259.99,
      "images": ["cloudinary_public_id_3"]
    }
  ],
  "images": [
    { "public_id": "shopground/products/apex-hd-1", "url": "https://res.cloudinary.com/...", "is_primary": true }
  ],
  "specs": [
    { "key": "Bluetooth", "value": "5.3" },
    { "key": "Battery Life", "value": "30 Hours" },
    { "key": "Noise Cancellation", "value": "Active ANC" }
  ],
  "tags": ["wireless", "anc", "premium", "audio"],
  "seo": {
    "meta_title": "Apex Pro Headphones X1 | ShopGround Era",
    "meta_description": "60-character optimized meta description...",
    "og_image": "https://res.cloudinary.com/..."
  },
  "ratings": {
    "average": 4.9,
    "count": 128,
    "distribution": { "5": 98, "4": 22, "3": 6, "2": 2, "1": 0 }
  },
  "status": "active",
  "visibility": "public",
  "is_featured": true,
  "is_new": true,
  "is_bestseller": false,
  "related_product_ids": ["prod_002", "prod_003"],
  "recently_viewed_count": 1248,
  "warehouse_id": "warehouse_alpha_usw",
  "created_at": "2026-01-15T10:00:00Z",
  "updated_at": "2026-07-25T12:00:00Z"
}
```

### 8.2 Category Taxonomy

```
Electronics
├── Audio
│   ├── Headphones
│   ├── Earbuds
│   └── Speakers
├── Wearables
│   ├── Smartwatches
│   └── Fitness Trackers
└── Computers
    ├── Laptops
    └── Accessories

Fashion
├── Men
│   ├── Shirts
│   └── Shoes
└── Women
    ├── Dresses
    └── Bags
```

Each category document stores its full path for efficient breadcrumb generation:
```json
{
  "_id": "subcat_headphones",
  "name": "Headphones",
  "slug": "headphones",
  "parent_id": "cat_audio",
  "ancestors": ["cat_electronics", "cat_audio"],
  "path": "Electronics > Audio > Headphones",
  "image": "cloudinary_public_id",
  "is_active": true
}
```

---

## 9. Inventory Architecture

### 9.1 Inventory Document Schema

```json
{
  "_id": "inv_apex_hd_001",
  "product_id": "prod_apex_hd_001",
  "sku": "APEX-HD-X1-BLK",
  "warehouse_id": "warehouse_alpha_usw",
  "quantity_on_hand": 18,
  "quantity_reserved": 2,
  "quantity_available": 16,
  "reorder_point": 5,
  "reorder_quantity": 50,
  "last_restock_date": "2026-07-10T00:00:00Z",
  "stock_movements": [
    {
      "type": "inbound",
      "quantity": 50,
      "reference": "PO-20260710",
      "timestamp": "2026-07-10T08:00:00Z"
    },
    {
      "type": "reserved",
      "quantity": -2,
      "reference": "ORD-89241",
      "timestamp": "2026-07-25T14:22:00Z"
    }
  ]
}
```

### 9.2 Inventory Reservation Flow

On checkout, inventory is **reserved** (not deducted) until payment confirmation:

```
Checkout Initiated
      │
      ▼
  Reserve Inventory (atomic MongoDB $inc on quantity_reserved)
      │
      ├── Success → Proceed to Payment
      │
      └── Insufficient Stock → Return 409 Conflict
                  │
                  ├── Payment Success → Deduct from quantity_on_hand, release reservation
                  │
                  └── Payment Failed → Release reservation (TTL job after 15 min)
```

---

## 10. Order Processing

### 10.1 Complete Order Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ORDER PROCESSING LIFECYCLE                          │
└─────────────────────────────────────────────────────────────────────────────┘

 CART            CHECKOUT           PAYMENT           FULFILLMENT        DELIVERY
   │                │                  │                  │                 │
   ▼                ▼                  ▼                  ▼                 ▼
Add Items ──▶ Apply Coupon ──▶ Reserve Inventory ──▶ Packed ──────▶ Out for Delivery
             Address Select    Payment Gateway       Pickup Requested   Delivered
             Tax Calculation   Webhook Received      AWB Generated      Proof of Delivery
             Shipping Calc     Order Confirmed       Shipped            ─────────────────
             ─────────────     Invoice Created       ──────────────     CANCELLED
             GUEST / AUTH      Email Receipt         Tracking Active    Refund Initiated
                               OTP Verification      ──────────────     Refund Processed
                                                     SMS Updates        Return Requested
                                                                        Return Approved
```

### 10.2 Order State Machine

```
PENDING_PAYMENT ──▶ PAYMENT_CONFIRMED ──▶ PROCESSING ──▶ PACKED ──▶ SHIPPED ──▶ DELIVERED
       │                                       │
       └──▶ PAYMENT_FAILED                    └──▶ CANCELLED ──▶ REFUND_INITIATED ──▶ REFUNDED
```

### 10.3 Order Document Schema

```json
{
  "_id": "ORD-2026072589241",
  "order_number": "SG-89241",
  "customer_id": "usr_001",
  "customer_email": "customer@shopground.era",
  "status": "processing",
  "items": [
    {
      "product_id": "prod_apex_hd_001",
      "sku": "APEX-HD-X1-BLK",
      "name": "Apex Pro Headphones X1",
      "quantity": 1,
      "unit_price": 249.99,
      "total_price": 249.99,
      "image": "https://res.cloudinary.com/..."
    }
  ],
  "pricing": {
    "subtotal": 249.99,
    "discount": 25.00,
    "coupon_code": "SAVE10",
    "tax_amount": 18.75,
    "shipping_cost": 0.00,
    "grand_total": 243.74
  },
  "shipping_address": {
    "full_name": "Lorem Customer",
    "address_line_1": "124 Lorem Avenue",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94107",
    "country": "US",
    "phone": "+1 (555) 234-5678"
  },
  "payment": {
    "method": "card",
    "gateway": "stripe",
    "gateway_transaction_id": "pi_3Qx9aZ2eZvKYlo2C",
    "status": "captured",
    "paid_at": "2026-07-25T14:22:05Z"
  },
  "logistics": {
    "provider": "FedEx Express",
    "awb_number": "AWB-99824102",
    "tracking_url": "https://fedex.com/track?AWB=99824102",
    "warehouse_id": "warehouse_alpha_usw",
    "estimated_delivery": "2026-07-28"
  },
  "timeline": [
    { "status": "order_placed", "timestamp": "2026-07-25T14:22:00Z" },
    { "status": "payment_confirmed", "timestamp": "2026-07-25T14:22:05Z" },
    { "status": "processing", "timestamp": "2026-07-25T14:25:00Z" }
  ],
  "invoice_id": "INV-2026072589241",
  "created_at": "2026-07-25T14:22:00Z",
  "updated_at": "2026-07-25T14:25:00Z"
}
```

---

## 11. Payment Architecture

### 11.1 Payment Gateway Strategy

```
Customer Checkout
       │
       ├── CARD ──▶ Stripe (International)
       │            Razorpay (India / South Asia)
       │
       ├── UPI ──▶ Razorpay UPI
       │
       └── COD ──▶ No gateway — order placed directly
                   Payment collected on delivery
```

### 11.2 Stripe Payment Flow

```
Frontend                    FastAPI                   Stripe
    │                           │                        │
    │  POST /payments/intent    │                        │
    │──────────────────────────▶│                        │
    │                           │  stripe.PaymentIntent  │
    │                           │  .create(amount, cur) ▶│
    │                           │◀───────────────────────│
    │◀──────────────────────────│  { client_secret }     │
    │                           │                        │
    │  Stripe Elements confirm  │                        │
    │──────────────────────────────────────────────────▶│
    │◀──────────────────────────────────────────────────│
    │                           │                        │
    │  Stripe Webhook fires     │                        │
    │                           │◀─ payment_intent.succeeded
    │                           │  verify webhook sig    │
    │                           │  update order status   │
    │                           │  enqueue receipt email │
```

### 11.3 Refund Flow

```
Support/Admin triggers refund
          │
          ▼
  POST /api/v1/orders/{id}/refund
          │
          ├── Partial Refund → stripe.Refund.create(amount)
          └── Full Refund → stripe.Refund.create(payment_intent_id)
                    │
                    ▼
             Webhook: charge.refunded
                    │
                    ▼
          Update order.status = "refunded"
          Update payment.refund_amount
          Enqueue refund confirmation email
          Restore inventory reservation
```

---

## 12. Logistics Architecture

### 12.1 3PL Integration Map

```
Order Packed (Admin marks "Ready for Pickup")
          │
          ▼
  POST /api/v1/logistics/create-shipment
  { order_id, provider: "fedex" | "delhivery" | "shiprocket" }
          │
          ├── Shiprocket API ──▶ createOrder() + generateAWB()
          ├── Delhivery API  ──▶ createPackage() + schedulePickup()
          └── FedEx API      ──▶ createShipment() + printLabel()
                    │
                    ▼
          AWB stored in orders.logistics.awb_number
          Label URL stored for warehouse printing
          Tracking URL embedded in customer notification
```

### 12.2 Webhook Status Synchronization

Each logistics provider fires webhook events. Our endpoint:

`POST /api/v1/logistics/webhooks/{provider}`

Normalizes events into our canonical status:

| Provider Event | Our Status | Customer Notification |
|---|---|---|
| `pickup_scheduled` | `PACKED` | Email + SMS |
| `in_transit` | `SHIPPED` | Email + SMS + Push |
| `out_for_delivery` | `OUT_FOR_DELIVERY` | SMS + Push |
| `delivered` | `DELIVERED` | Email + SMS + Push |
| `delivery_failed` | `DELIVERY_EXCEPTION` | SMS + Push |
| `returned_to_origin` | `RETURNED` | Email |

---

## 13. Cloudinary Integration

### 13.1 Upload Architecture

```
Admin Dashboard (React)
        │
        │  1. Request upload signature
        ▼
FastAPI /api/v1/media/sign-upload
        │  2. Generate signed upload params
        │  (timestamp, signature, api_key)
        ▼
React → Cloudinary Upload API (direct upload, never via backend)
        │  3. Direct upload to Cloudinary CDN
        ▼
Cloudinary fires upload webhook → FastAPI saves public_id to product doc
```

### 13.2 Cloudinary Folder Structure

```
shopground/
├── products/
│   ├── electronics/
│   │   └── apex-hd-x1/
│   │       ├── primary.webp
│   │       └── variant-white.webp
│   └── fashion/
├── categories/
├── banners/
├── brands/
└── avatars/
    └── {user_id}/
        └── profile.webp
```

### 13.3 Image Transformation Pipeline

On-the-fly Cloudinary URL transformations (zero backend code):

```
https://res.cloudinary.com/shopground/image/upload/
  w_600,h_600,c_fill,         ← Resize + crop
  f_auto,                     ← Auto format (WebP for Chrome, AVIF for modern)
  q_auto:good,                ← Smart quality compression
  e_sharpen:50,               ← Subtle sharpening
  /shopground/products/apex-hd-x1/primary

Thumbnail (lazy-load placeholder):
  w_20,h_20,c_fill,f_auto,q_1 ← LQIP base64 for blur-up
```

---

## 14. Search Architecture

### 14.1 MongoDB Text Search Pipeline

```javascript
// Text search with filters + sorting + pagination
db.products.aggregate([
  {
    $match: {
      $text: { $search: "apex headphones wireless" },
      status: "active",
      "pricing.price": { $gte: 100, $lte: 500 },
      category_id: "cat_electronics",
      "ratings.average": { $gte: 4.0 }
    }
  },
  {
    $addFields: {
      relevance_score: { $meta: "textScore" },
      discount_badge: {
        $cond: {
          if: { $gt: ["$discount_percent", 10] },
          then: "SALE",
          else: null
        }
      }
    }
  },
  { $sort: { relevance_score: { $meta: "textScore" }, "ratings.average": -1 } },
  { $skip: 0 },
  { $limit: 24 },
  {
    $project: {
      name: 1, slug: 1, price: 1, original_price: 1,
      images: { $slice: ["$images", 1] },
      "ratings.average": 1,
      "ratings.count": 1,
      discount_percent: 1,
      relevance_score: 1
    }
  }
])
```

### 14.2 Autocomplete Strategy

Redis `ZADD` + `ZRANGEBYLEX` for O(log N) autocomplete suggestions:

```
ZADD product_autocomplete 0 "apex headphones"
ZADD product_autocomplete 0 "apple airpods"
ZADD product_autocomplete 0 "apex earbuds"

ZRANGEBYLEX product_autocomplete "[apex" "[apex\xff" LIMIT 0 5
→ ["apex earbuds", "apex headphones"]
```

---

## 15. API Architecture

### 15.1 API Versioning & Design Principles

- Base path: `/api/v1/`
- All responses use consistent envelope:
  ```json
  { "status": "success", "data": {}, "meta": { "page": 1, "total": 120 } }
  ```
- Error responses:
  ```json
  { "status": "error", "code": "PRODUCT_NOT_FOUND", "message": "Product with ID prod_001 not found", "details": {} }
  ```

### 15.2 Complete API Endpoint Reference

#### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register new account |
| POST | `/auth/login` | Public | Email + password login |
| POST | `/auth/request-otp` | Public | Send magic link OTP |
| POST | `/auth/verify-otp` | Public | Verify OTP + issue tokens |
| POST | `/auth/refresh` | Bearer(refresh) | Rotate access/refresh tokens |
| POST | `/auth/logout` | Bearer | Revoke current session |
| POST | `/auth/forgot-password` | Public | Initiate password reset |
| POST | `/auth/reset-password` | Public | Complete password reset |
| GET | `/auth/me` | Bearer | Current user profile |

#### Products
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/products` | Public | List products (filters, search, pagination) |
| GET | `/products/{id}` | Public | Product detail + variants |
| POST | `/products` | Admin | Create product |
| PUT | `/products/{id}` | Admin | Full product update |
| PATCH | `/products/{id}` | Admin | Partial update (status, stock) |
| DELETE | `/products/{id}` | Super Admin | Delete product |
| GET | `/products/{id}/reviews` | Public | Product reviews |
| POST | `/products/{id}/reviews` | Customer | Submit review |

#### Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/orders` | Admin | All orders (admin view) |
| GET | `/orders/my` | Customer | Own orders |
| POST | `/orders` | Customer | Place new order |
| GET | `/orders/{id}` | Bearer | Order detail |
| PATCH | `/orders/{id}/status` | Admin | Update order status |
| POST | `/orders/{id}/cancel` | Bearer | Cancel order |
| POST | `/orders/{id}/refund` | Admin/Support | Initiate refund |

#### Cart
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/cart` | Bearer | Get cart |
| POST | `/cart/items` | Bearer | Add item |
| PATCH | `/cart/items/{sku}` | Bearer | Update item quantity |
| DELETE | `/cart/items/{sku}` | Bearer | Remove item |
| POST | `/cart/coupon` | Bearer | Apply coupon |
| DELETE | `/cart/coupon` | Bearer | Remove coupon |

#### Payments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/payments/intent` | Bearer | Create payment intent |
| POST | `/payments/webhooks/stripe` | Public+Sig | Stripe webhook |
| POST | `/payments/webhooks/razorpay` | Public+Sig | Razorpay webhook |
| GET | `/payments/{id}` | Admin | Payment detail |

#### Inventory & Warehouse
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/inventory` | Admin | All inventory |
| PATCH | `/inventory/{sku}` | Inventory Mgr | Update stock |
| GET | `/warehouses` | Admin | All warehouses |
| POST | `/warehouses` | Super Admin | Create warehouse |

#### Admin Analytics
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/analytics/dashboard` | Admin | KPI summary |
| GET | `/analytics/sales` | Admin | Revenue time-series |
| GET | `/analytics/orders` | Admin | Order funnel metrics |
| GET | `/analytics/products/top` | Admin | Top products by revenue |
| GET | `/audit-logs` | Super Admin | Audit trail |

---

## 16. Folder Structure

### 16.1 Backend

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py          # Pydantic Settings — env vars
│   │   ├── database.py        # Motor MongoDB async connection
│   │   ├── redis.py           # Redis async client
│   │   ├── security.py        # RS256 JWT, bcrypt, OTP
│   │   └── logging.py         # Structured JSON logging
│   │
│   ├── models/                # Pydantic V2 schemas
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── cart.py
│   │   ├── payment.py
│   │   ├── inventory.py
│   │   ├── logistics.py
│   │   ├── coupon.py
│   │   ├── review.py
│   │   └── notification.py
│   │
│   ├── routes/                # FastAPI routers
│   │   ├── auth.py
│   │   ├── products.py
│   │   ├── orders.py
│   │   ├── cart.py
│   │   ├── payments.py
│   │   ├── inventory.py
│   │   ├── logistics.py
│   │   ├── reviews.py
│   │   ├── coupons.py
│   │   ├── categories.py
│   │   ├── wishlist.py
│   │   ├── analytics.py
│   │   ├── admin.py
│   │   └── health.py
│   │
│   ├── services/              # Business logic
│   │   ├── auth_service.py
│   │   ├── product_service.py
│   │   ├── order_service.py
│   │   ├── payment_service.py
│   │   ├── logistics_service.py
│   │   ├── inventory_service.py
│   │   ├── cache.py
│   │   ├── queue.py           # Redis email task queue
│   │   └── cloudinary.py
│   │
│   ├── middleware/
│   │   ├── auth.py            # JWT extraction + decode
│   │   ├── rbac.py            # Permission enforcement
│   │   ├── rate_limit.py      # Redis-based rate limiting
│   │   └── audit.py           # Request audit logging
│   │
│   ├── workers/
│   │   ├── email_worker.py    # Redis queue consumer
│   │   ├── notification_worker.py
│   │   └── scheduler.py       # Cron jobs (inventory alerts, campaign start/end)
│   │
│   └── main.py                # FastAPI app assembly
│
├── seed_data.py               # MongoDB initializer
├── requirements.txt
├── Dockerfile
└── .env.example
```

### 16.2 Frontend (Customer Store)

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── PageWrapper.jsx
│   │   ├── ecommerce/
│   │   │   ├── HeroBanner.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CategoryGridCards.jsx
│   │   │   ├── DealsCarousel.jsx
│   │   │   ├── BrandStrip.jsx
│   │   │   ├── CartDrawer.jsx
│   │   │   └── CheckoutModal.jsx
│   │   └── ui/                # shadcn primitives
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── OrdersPage.jsx
│   │   └── UserProfilePage.jsx
│   │
│   ├── store/
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── cartSlice.js
│   │       ├── productSlice.js
│   │       └── ordersSlice.js
│   │
│   ├── services/
│   │   ├── apiClient.js       # Axios + interceptors + refresh
│   │   ├── authService.js
│   │   ├── productService.js
│   │   └── orderService.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   └── useProducts.js
│   │
│   └── styles.css             # Tailwind + @theme tokens
│
├── index.html
├── vite.config.js
└── package.json
```

### 16.3 Admin Frontend

```
admin-frontend/
├── src/
│   ├── components/admin/
│   │   ├── AdminSidebar.jsx
│   │   ├── AdminHeader.jsx
│   │   ├── DashboardOverview.jsx
│   │   ├── ProductManagement.jsx
│   │   ├── OrderFulfillment.jsx
│   │   ├── SchedulingView.jsx
│   │   ├── LogisticsView.jsx
│   │   ├── RbacView.jsx
│   │   ├── AnalyticsView.jsx
│   │   └── AuditLogsView.jsx
│   ├── store/
│   │   └── adminSlice.js
│   └── App.jsx
├── index.html
└── package.json
```

---

## 17. Database Schema

### 17.1 Collections Reference

| Collection | Purpose | Key Indexes |
|---|---|---|
| `users` | Customer + staff accounts | `email` unique, `role` |
| `roles` | Role definitions | `name` unique |
| `permissions` | Role → permission map | `role` |
| `sessions` | Active login sessions | `user_id`, TTL on `expires_at` |
| `refresh_tokens` | RS256 refresh tokens | `token_hash` unique, TTL |
| `otp_codes` | Email OTP codes | `email` + TTL 300s |
| `products` | Full product catalog | Text search, `slug` unique, `category_id` |
| `categories` | Product taxonomy | `slug` unique, `parent_id` |
| `brands` | Brand entities | `slug` unique |
| `inventory` | Stock per SKU per warehouse | `sku` + `warehouse_id` compound |
| `warehouses` | Warehouse locations | `code` unique |
| `stock_movements` | Inventory audit trail | `sku`, `type`, `timestamp` |
| `orders` | Customer orders | `order_number` unique, `customer_id`, `status` |
| `payments` | Payment transactions | `gateway_transaction_id` unique, `order_id` |
| `refunds` | Refund records | `payment_id`, `order_id` |
| `invoices` | PDF invoice metadata | `order_id` |
| `coupons` | Discount codes | `code` unique, TTL on `expires_at` |
| `cart` | Per-user cart state | `user_id` unique, TTL |
| `wishlist` | Saved products | `user_id` + `product_id` compound |
| `reviews` | Product reviews | `product_id`, `customer_id`, `rating` |
| `addresses` | Saved shipping addresses | `user_id` |
| `shipments` | Logistics records | `order_id`, `awb_number` |
| `tracking_events` | Logistics webhook events | `awb_number`, `timestamp` |
| `notifications` | Notification queue | `user_id`, `status`, `type` |
| `audit_logs` | System mutation trail | `user_id`, `action`, `timestamp` |
| `support_tickets` | Customer support | `customer_id`, `status` |
| `campaigns` | Flash sales / promotions | `start_date`, `end_date`, `status` |

---

## 18. MongoDB Indexing Strategy

### 18.1 Critical Indexes

```javascript
// Products — text search + filter combinations
db.products.createIndex({ "$**": "text" });  // Wildcard text for name/desc/tags
db.products.createIndex({ category_id: 1, status: 1, "ratings.average": -1 });
db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ price: 1, category_id: 1, status: 1 });  // Price filter

// Orders — customer dashboard + admin fulfillment
db.orders.createIndex({ customer_id: 1, created_at: -1 });
db.orders.createIndex({ status: 1, created_at: -1 });
db.orders.createIndex({ order_number: 1 }, { unique: true });
db.orders.createIndex({ "logistics.awb_number": 1 });

// Inventory — SKU + warehouse compound
db.inventory.createIndex({ sku: 1, warehouse_id: 1 }, { unique: true });
db.inventory.createIndex({ quantity_available: 1 });  // Low stock alerts

// Users — auth critical path
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Sessions + OTP — TTL automatic cleanup
db.sessions.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
db.otp_codes.createIndex({ created_at: 1 }, { expireAfterSeconds: 300 });
db.refresh_tokens.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });

// Reviews — aggregation by product
db.reviews.createIndex({ product_id: 1, created_at: -1 });
db.reviews.createIndex({ product_id: 1, rating: 1 });

// Audit logs — admin timeline
db.audit_logs.createIndex({ user_id: 1, timestamp: -1 });
db.audit_logs.createIndex({ action: 1, timestamp: -1 });
```

---

## 19. Redis Caching Strategy

### 19.1 Cache Key Naming Convention

```
shopground:{entity}:{id}:{variant}

Examples:
  shopground:product:prod_apex_hd_001              → Full product doc (TTL: 300s)
  shopground:products:category:cat_electronics     → Category listing (TTL: 60s)
  shopground:cart:usr_001                          → User cart (TTL: 7200s)
  shopground:session:sess_abc123                   → Session data (TTL: 3600s)
  shopground:otp:user@shopground.era               → OTP code (TTL: 300s)
  shopground:refresh:usr_001:{token_hash}          → Refresh token (TTL: 604800s)
  shopground:rate_limit:ip:192.168.1.1:auth        → Rate limit counter (TTL: 60s)
  shopground:email_queue                           → Redis List for email tasks
  shopground:product_autocomplete                  → Sorted set for autocomplete
```

### 19.2 Cache Layer Strategy

| Data | Cache Type | TTL | Invalidation |
|---|---|---|---|
| Product detail | `GET/SET` | 5 min | On product update webhook |
| Category listing | `GET/SET` | 1 min | On category update |
| User cart | `HSET` | 2 hours | On cart mutation |
| Auth sessions | `SET` | 1 hour | On logout / token revoke |
| OTP codes | `SET` | 5 min | On verify (DEL) |
| Autocomplete | Sorted Set | 24 hours | Nightly rebuild job |
| Rate limiting | Counter | 60 seconds | TTL expiry |
| Email queue | Redis List | Persistent | Worker dequeues (LPOP) |

---

## 20. Security Architecture

### 20.1 Defense in Depth Layers

```
Layer 1: Cloudflare WAF
  ├── DDoS mitigation
  ├── Bot protection
  └── Geo-blocking (configurable)

Layer 2: Nginx
  ├── Rate limiting (limit_req_zone)
  ├── Request size limits (client_max_body_size)
  ├── Security headers (X-Frame-Options, X-XSS-Protection)
  └── HTTPS enforcement (301 redirect HTTP → HTTPS)

Layer 3: FastAPI Middleware
  ├── CORS validation (origin whitelist)
  ├── JWT RS256 token validation (every protected route)
  ├── Permission checks (RBAC middleware per route)
  └── Rate limiting (Redis counter per IP + user)

Layer 4: Application Layer
  ├── Pydantic V2 strict input validation (no raw dict access)
  ├── MongoDB query parameterization (Motor driver — no string interpolation)
  ├── bcrypt password hashing (cost factor 12)
  └── Webhook HMAC signature verification (Stripe, Razorpay, logistics)

Layer 5: Database Layer
  ├── MongoDB auth (username + password, not open)
  ├── Field-level encryption for PII (card data never stored)
  └── Audit logs for all mutations
```

### 20.2 Secret Management

All secrets are environment variables — never in source code:

```bash
# .env.production (never committed to Git)
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n..."
MONGODB_URL="mongodb+srv://shopground:SECRET@cluster.mongodb.net/shopground_db"
REDIS_URL="rediss://shopground:SECRET@redis.host:6380/0"  # rediss = TLS
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
CLOUDINARY_API_SECRET="..."
SMTP_PASSWORD="..."
```

---

## 21. Performance Optimizations

### 21.1 API Response Optimization

- **Projection**: Never fetch full documents — always `$project` only needed fields.
- **Pagination**: Cursor-based (`_id` based) for large collections, offset-based for small.
- **Connection Pooling**: Motor maintains a pool of 10–50 MongoDB connections (configurable).
- **Redis Pipeline**: Batch Redis commands in pipelines to reduce round-trips.
- **Gzip Compression**: Nginx `gzip on` for API JSON and static assets.

### 21.2 Background Jobs

All time-consuming work is offloaded to Redis task queues:

| Task | Trigger | Queue Key |
|---|---|---|
| Welcome email | User registration | `shopground:email_queue` |
| OTP email | Auth OTP request | `shopground:email_queue` |
| Order confirmation | Order placed | `shopground:email_queue` |
| Shipment notification | AWB generated | `shopground:email_queue` |
| Low stock alert | Inventory < reorder_point | `shopground:admin_alerts` |
| Campaign start/end | Scheduled cron | `shopground:scheduler_queue` |

### 21.3 Image Optimization

- **WebP Auto-Format**: `f_auto` Cloudinary parameter — serves WebP to supporting browsers.
- **Responsive Images**: `srcset` with 3 breakpoints: 300w, 600w, 1200w.
- **LQIP**: Low-Quality Image Placeholders at `w_20,q_1` for blur-up lazy loading.
- **Lazy Loading**: `loading="lazy"` on all below-fold product images.

---

## 22. Scalability Roadmap

### 22.1 Phase 1 — Current (0–10K users)

- Single-server Docker Compose deployment.
- MongoDB 3-node replica set for availability.
- Redis single-node with persistence.
- Cloudflare CDN for static assets + image delivery.

### 22.2 Phase 2 — Growth (10K–100K users)

- Separate API, MongoDB, Redis onto dedicated servers.
- Nginx upstream with 3 Uvicorn worker instances (load balanced).
- Redis Sentinel for cache HA.
- MongoDB Atlas M30+ with dedicated IOPS.
- Implement RTK Query (frontend) for client-side data deduplication.

### 22.3 Phase 3 — Scale (100K–1M+ users)

- Kubernetes (EKS / GKE) with HPA on CPU + request rate.
- MongoDB Atlas sharding on `customer_id` for orders collection.
- Redis Cluster (6 nodes, 3 primary + 3 replica).
- Celery + RabbitMQ for durable multi-worker task queues.
- Event-driven microservice extraction: Notification Service, Analytics Service.
- Elasticsearch for full-text search (replace MongoDB text).
- GraphQL API layer for efficient frontend data fetching.
- CDN edge caching for product listing pages (Cloudflare Workers).

---

## 23. Deployment Architecture

### 23.1 Docker Compose Production Stack

```yaml
version: '3.9'

services:
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on: [api]

  api:
    build: ./backend
    environment:
      - MONGODB_URL=${MONGODB_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_PRIVATE_KEY=${JWT_PRIVATE_KEY}
      - JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
    command: gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
    depends_on: [mongodb, redis]
    restart: unless-stopped

  mongodb:
    image: mongo:7
    command: mongod --replSet rs0 --auth
    volumes: [mongo_data:/data/db]
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes: [redis_data:/data]
    restart: unless-stopped

  email_worker:
    build: ./backend
    command: python3 -m app.workers.email_worker
    depends_on: [redis]
    restart: unless-stopped

volumes:
  mongo_data:
  redis_data:
```

### 23.2 Nginx Configuration

```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

server {
    listen 443 ssl http2;
    server_name api.myapp.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    location /api/v1/auth {
        limit_req zone=auth burst=10 nodelay;
        proxy_pass http://api:8000;
    }

    location /api/v1 {
        limit_req zone=api burst=50 nodelay;
        proxy_pass http://api:8000;
    }
}
```

---

## 24. DevOps Pipeline

```
Developer Push → Git Branch (santusht / dev)
        │
        ▼
GitHub Actions CI Pipeline
  ├── 1. Lint (Ruff / ESLint)
  ├── 2. Unit Tests (Pytest / Vitest)
  ├── 3. Build Docker Image
  └── 4. Push to Container Registry (GHCR)
        │
        ▼ (on merge to main)
GitHub Actions CD Pipeline
  ├── 1. SSH into production server
  ├── 2. Pull latest images
  ├── 3. docker compose up -d --no-deps api
  └── 4. Health check → Rollback if unhealthy
```

### 24.1 Branch Strategy

| Branch | Purpose | Deploy Target |
|---|---|---|
| `santusht` | Personal feature development | Local |
| `dev` | Integration / PR base | Staging server |
| `test` | QA / regression testing | Test environment |
| `main` | Production-stable | Production server |

---

## 25. Monitoring & Logging

### 25.1 Structured Logging

All FastAPI logs emit JSON (structured) with trace IDs:

```json
{
  "timestamp": "2026-07-26T07:15:00.000Z",
  "level": "INFO",
  "service": "shopground-api",
  "trace_id": "abc-123-def-456",
  "method": "POST",
  "path": "/api/v1/orders",
  "status_code": 201,
  "duration_ms": 43,
  "user_id": "usr_001",
  "ip": "192.168.1.1"
}
```

### 25.2 Health Check Endpoints

| Endpoint | Response | Monitors |
|---|---|---|
| `GET /api/v1/health` | `{ mongodb, redis, email_queue }` | Full system |
| `GET /api/v1/health/live` | `{ status: "ok" }` | Kubernetes liveness probe |
| `GET /api/v1/health/ready` | `{ mongodb, redis }` | Kubernetes readiness probe |

### 25.3 Audit Logging

Every state-changing API mutation writes an audit log entry:

```json
{
  "_id": "audit_2026072589241",
  "user_id": "usr_admin_001",
  "role": "store_manager",
  "action": "order.status.updated",
  "target_id": "ORD-2026072589241",
  "target_type": "order",
  "changes": { "from": "processing", "to": "packed" },
  "ip_address": "10.0.1.5",
  "user_agent": "Mozilla/5.0...",
  "timestamp": "2026-07-26T07:15:00Z"
}
```

---

## 26. Disaster Recovery

### 26.1 Backup Strategy

| Asset | Backup Method | Frequency | Retention |
|---|---|---|---|
| MongoDB | `mongodump` + S3 upload | Every 6 hours | 30 days |
| Redis | RDB snapshot + AOF log | Continuous | 7 days |
| Cloudinary assets | Cloudinary backup | Daily | 90 days |
| Environment secrets | HashiCorp Vault / AWS Secrets Manager | On change | Versioned |

### 26.2 RTO / RPO Targets

| Scenario | RTO (Recovery Time) | RPO (Data Loss) |
|---|---|---|
| API server crash | < 2 min (Docker restart) | 0 |
| MongoDB primary failure | < 30 sec (replica election) | 0 (oplog sync) |
| Redis failure | < 5 min (restart + AOF replay) | < 1 sec |
| Full datacenter failure | < 4 hours (restore from backup) | < 6 hours |

---

## 27. UI/UX Design System

### 27.1 Color Palette

```css
/* ShopGround Era — Dark Premium Theme */
--color-bg-base:       #0F1115;   /* Page background */
--color-bg-surface:    #171A21;   /* Elevated panels */
--color-bg-card:       #1F2430;   /* Cards, modals */
--color-bg-input:      #252B38;   /* Form inputs */

/* Text Hierarchy */
--color-text-primary:  #FFFFFF;
--color-text-secondary:#9CA3AF;
--color-text-tertiary: #6B7280;
--color-text-inverse:  #0F1115;

/* Brand & Accent */
--color-accent-indigo: #6366F1;   /* Primary CTA */
--color-accent-violet: #7C3AED;   /* Secondary gradient */
--color-accent-gradient: linear-gradient(135deg, #6366F1, #7C3AED);

/* Semantic States */
--color-success:       #22C55E;
--color-warning:       #F59E0B;
--color-danger:        #EF4444;
--color-info:          #3B82F6;

/* Borders */
--color-border:        rgba(255,255,255,0.08);
--color-border-strong: rgba(255,255,255,0.16);
```

### 27.2 Typography

```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

--font-heading:  'Outfit', sans-serif;         /* H1–H4, Branding, CTAs */
--font-body:     'Plus Jakarta Sans', sans-serif; /* Body, Labels, UI Text */
--font-mono:     'JetBrains Mono', monospace;  /* Code, SKUs, Order IDs */

/* Type Scale */
--text-xs:   0.75rem  / 1.125rem;  /* 12px — labels, badges */
--text-sm:   0.875rem / 1.25rem;   /* 14px — body, descriptions */
--text-base: 1rem     / 1.5rem;    /* 16px — default */
--text-lg:   1.125rem / 1.75rem;   /* 18px — section headers */
--text-xl:   1.25rem  / 1.75rem;   /* 20px — card titles */
--text-2xl:  1.5rem   / 2rem;      /* 24px — page titles */
--text-3xl:  1.875rem / 2.25rem;   /* 30px — hero headers */
```

### 27.3 Component Design Principles

- **Glassmorphism Cards**: `background: rgba(31, 36, 48, 0.8)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.08)`
- **Micro-animations**: Framer Motion `spring` physics — `stiffness: 300, damping: 25`
- **Hover States**: `transform: translateY(-2px)` + `box-shadow` elevation
- **Loading Skeletons**: Animated shimmer placeholders before data loads
- **Responsive Grid**: 12-column grid, breakpoints at 640px, 768px, 1024px, 1280px, 1536px

---

## 28. Production Readiness Checklist

### Security
- [x] JWT RS256 asymmetric signing
- [x] bcrypt password hashing (cost factor ≥ 12)
- [x] OTP email verification
- [x] Refresh token rotation with family invalidation
- [x] RBAC permission middleware on every protected route
- [x] Webhook HMAC signature verification
- [x] MongoDB query parameterization (no string interpolation)
- [x] Nginx rate limiting on auth + API endpoints
- [x] CORS origin whitelist
- [x] Security response headers (HSTS, X-Frame-Options, etc.)
- [ ] WAF rules on Cloudflare (enable per domain)
- [ ] PII field-level encryption for sensitive addresses

### Reliability
- [x] MongoDB 3-node replica set
- [x] Redis persistence (AOF + RDB)
- [x] Redis fallback handling (graceful degradation)
- [x] Background task queue for email (non-blocking)
- [x] Health check endpoint
- [ ] Circuit breakers on external API calls (Stripe, logistics)
- [ ] Dead letter queue for failed email tasks

### Performance
- [x] MongoDB compound indexes on all query patterns
- [x] TTL indexes for sessions, OTPs, refresh tokens
- [x] Redis caching for hot product data
- [x] Cloudinary CDN for all image delivery
- [x] Nginx gzip compression
- [ ] API response time monitoring (P95 < 120ms)
- [ ] Frontend bundle analysis (keep < 400KB gzipped)

### Observability
- [x] Structured JSON logging
- [x] Audit trail for all mutations
- [x] Health diagnostic endpoint (MongoDB + Redis + queue)
- [ ] Prometheus metrics endpoint `/metrics`
- [ ] Grafana dashboards (API latency, error rate, queue depth)
- [ ] Alerting on error rate > 1% (PagerDuty / Slack webhook)

---

## 29. Future Enhancements

| Enhancement | Priority | Complexity | Phase |
|---|---|---|---|
| Elasticsearch full-text search | High | Medium | Phase 2 |
| Real-time order tracking via WebSockets | High | Medium | Phase 2 |
| Recommendation engine (collaborative filtering) | Medium | High | Phase 2 |
| Multi-vendor seller portal | High | Very High | Phase 3 |
| GraphQL API layer | Medium | High | Phase 3 |
| AI-powered dynamic pricing engine | Medium | Very High | Phase 3 |
| Mobile apps (React Native) | High | High | Phase 2 |
| B2B wholesale pricing tiers | Low | Medium | Phase 3 |
| Loyalty points & rewards program | Medium | Medium | Phase 2 |
| A/B testing framework for UI experiments | Medium | Medium | Phase 2 |
| Kubernetes with HPA | High | High | Phase 3 |
| Multi-currency + multi-language (i18n) | Medium | Medium | Phase 2 |
| Stripe Connect for marketplace payments | High | High | Phase 3 |
| Advanced analytics with Apache Kafka | Low | Very High | Phase 3 |

---

*Document prepared by Principal Software Architect — ShopGround Era Engineering Team*  
*For questions, contact: architecture@shopground.era*
