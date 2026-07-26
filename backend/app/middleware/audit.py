from datetime import datetime
from app.core.database import get_database

async def log_audit_event(
    user_id: str,
    role: str,
    action: str,
    target_id: str,
    target_type: str,
    changes: dict,
    ip_address: str = "127.0.0.1"
):
    """
    Persist operational mutation events to the audit_logs collection.
    """
    audit_entry = {
        "user_id": user_id,
        "role": role,
        "action": action,
        "target_id": target_id,
        "target_type": target_type,
        "changes": changes,
        "ip_address": ip_address,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    db = get_database()
    if db:
        try:
            await db.audit_logs.insert_one(audit_entry)
        except Exception as e:
            print(f"[Audit Log Warning] Failed to log audit event: {e}")
    else:
        print(f"[Audit Log Console] {audit_entry}")
