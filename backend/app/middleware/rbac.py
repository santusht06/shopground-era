from typing import List
from fastapi import Depends, HTTPException, status
from app.middleware.auth import get_current_user
from app.core.database import get_database

ROLE_PERMISSIONS_MAP = {
    "super_admin": [
        "products:read", "products:create", "products:update", "products:delete",
        "orders:read_all", "orders:read_own", "orders:update_status",
        "inventory:read", "inventory:update",
        "users:read", "users:update", "users:delete",
        "analytics:read", "coupons:manage", "refunds:approve",
        "audit_logs:read", "warehouse:manage"
    ],
    "store_manager": [
        "products:read", "products:create", "products:update",
        "orders:read_all", "orders:read_own", "orders:update_status",
        "inventory:read", "inventory:update",
        "users:read", "analytics:read", "coupons:manage", "refunds:approve"
    ],
    "inventory_mgr": [
        "products:read", "products:create", "products:update",
        "inventory:read", "inventory:update", "warehouse:manage"
    ],
    "fulfillment_agent": [
        "products:read", "orders:read_all", "orders:update_status", "inventory:read"
    ],
    "support_exec": [
        "products:read", "orders:read_all", "users:read", "refunds:approve"
    ],
    "customer": [
        "products:read", "orders:read_own"
    ]
}

def require_permission(permission: str):
    """
    Dependency injection for granular permission enforcement.
    Permissions are validated dynamically against the user's role.
    """
    async def _permission_checker(current_user: dict = Depends(get_current_user)):
        user_role = current_user.get("role", "customer")
        
        # Query MongoDB permissions collection if available
        db = get_database()
        permissions: List[str] = []
        if db:
            role_doc = await db.permissions.find_one({"role": user_role})
            if role_doc:
                permissions = role_doc.get("permissions", [])

        # Fallback to in-memory RBAC matrix
        if not permissions:
            permissions = ROLE_PERMISSIONS_MAP.get(user_role, ROLE_PERMISSIONS_MAP["customer"])

        if permission not in permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Requires permission '{permission}' for role '{user_role}'."
            )
        return current_user

    return _permission_checker
