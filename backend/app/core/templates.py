# ShopGround Era Transactional Email Templates (100% High Contrast & Gmail iOS Dark/Light Mode Compatible)

def get_warranty_registered_html(customer_name: str, warranty_code: str, order_id: str, product_name: str, purchase_date: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lifetime Guarantee Active</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 24px; text-align: center;">
              <img src="https://shopgroundera.com/logo.png" alt="ShopGround Era" style="height: 44px; width: auto; margin-bottom: 12px; display: inline-block;" />
              <h1 style="color: #f27e24; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.3px;">Lifetime Guarantee Active</h1>
              <p style="color: #fb923c; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 6px 0 0 0;">100-Year Guarantee Protection</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 24px; background-color: #ffffff;">
              <p style="color: #0f172a; font-size: 15px; font-weight: 600; line-height: 1.5; margin: 0 0 16px 0;">Dear {customer_name},</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                Your official <strong>ShopGround Era™</strong> Lifetime Guarantee registration is complete and active in our global warranty registry.
              </p>

              <!-- Certificate Details Box -->
              <table role="presentation" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <table role="presentation" width="100%" style="font-size: 13px; color: #334155;">
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Warranty Code:</td>
                        <td style="padding: 8px 0; text-align: right; font-family: monospace; font-weight: 800; color: #d97706; font-size: 15px;">{warranty_code}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Order ID:</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1e293b;">{order_id}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Product:</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1e293b;">{product_name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Purchase Date:</td>
                        <td style="padding: 8px 0; text-align: right; color: #475569;">{purchase_date}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0 0 0; color: #64748b; font-weight: 500; border-top: 1px dashed #cbd5e1;">Guarantee Status:</td>
                        <td style="padding: 10px 0 0 0; text-align: right; font-weight: 800; color: #16a34a; border-top: 1px dashed #cbd5e1;">LIFETIME GUARANTEE ACTIVE</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://shopgroundera.com/warranty" target="_blank" style="background-color: #f27e24; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 10px; display: inline-block;">
                      Verify Warranty Record &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #64748b; font-size: 12px; line-height: 1.5; text-align: center; margin: 24px 0 0 0;">
                File a claim anytime at <a href="https://shopgroundera.com/warranty" style="color: #ea580c; text-decoration: underline; font-weight: 600;">shopgroundera.com/warranty</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 18px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px; margin: 0; font-weight: 500;">&copy; 2026 ShopGround Era Inc. All rights reserved.</p>
              <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0;">Official Guarantee Portal &bull; info@shopgroundera.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


def get_claim_submitted_html(customer_name: str, claim_code: str, warranty_code: str, issue_category: str, description: str, evidence_count: int) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Warranty Claim Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 24px; text-align: center;">
              <img src="https://shopgroundera.com/logo.png" alt="ShopGround Era" style="height: 44px; width: auto; margin-bottom: 12px; display: inline-block;" />
              <h1 style="color: #f27e24; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.3px;">Defect Claim Received</h1>
              <p style="color: #38bdf8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 6px 0 0 0;">Status: Under Review (Est. 24 Hours)</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 24px; background-color: #ffffff;">
              <p style="color: #0f172a; font-size: 15px; font-weight: 600; line-height: 1.5; margin: 0 0 16px 0;">Dear {customer_name},</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                We have received your defect claim for Warranty Code <strong style="color: #ea580c;">{warranty_code}</strong>. Our Quality Engineering team has initiated an audit of your report and attached media evidence.
              </p>

              <!-- Claim Summary Box -->
              <table role="presentation" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <table role="presentation" width="100%" style="font-size: 13px; color: #334155;">
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Claim Code:</td>
                        <td style="padding: 8px 0; text-align: right; font-family: monospace; font-weight: 800; color: #0284c7; font-size: 15px;">{claim_code}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Defect Category:</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #0f172a;">{issue_category}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Media Evidence:</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #16a34a;">{evidence_count} Attached File(s)</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Audit Status:</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: 800; color: #d97706;">UNDER REVIEW</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 12px 0 0 0; border-top: 1px dashed #cbd5e1; color: #475569; font-size: 12px; line-height: 1.5;">
                          <strong>Description:</strong> "{description}"
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://shopgroundera.com/warranty" target="_blank" style="background-color: #0284c7; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 10px; display: inline-block;">
                      Track Audit Status Live &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #64748b; font-size: 12px; line-height: 1.5; text-align: center; margin: 24px 0 0 0;">
                You will receive an automated notification as soon as replacement dispatch is authorized.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 18px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px; margin: 0; font-weight: 500;">&copy; 2026 ShopGround Era Inc. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


# ─── 1. STATUS: REPLACEMENT APPROVED & DISPATCHED ────────────────────────────

def get_claim_replacement_approved_html(customer_name: str, claim_code: str, admin_notes: str = None, tracking_number: str = None) -> str:
    tracking_section = ""
    if tracking_number:
        tracking_section = f"""
        <div style="background-color: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 18px; margin: 20px 0;">
          <p style="color: #166534; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px 0;">Courier Tracking Number</p>
          <p style="color: #15803d; font-family: monospace; font-size: 20px; font-weight: 900; margin: 0; letter-spacing: 1px;">{tracking_number}</p>
          <p style="color: #166534; font-size: 12px; margin: 8px 0 0 0; line-height: 1.4;">
            Your brand new replacement unit has been dispatched via express shipping. Estimated delivery: <strong>2–4 Business Days</strong>.
          </p>
        </div>
        """
    else:
        tracking_section = """
        <div style="background-color: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="color: #166534; font-size: 13px; font-weight: 700; margin: 0;">Replacement Dispatch Authorized</p>
          <p style="color: #166534; font-size: 12px; margin: 4px 0 0 0;">Your replacement order is queued at our fulfillment center. Tracking will update once scanned by the courier.</p>
        </div>
        """

    notes_section = ""
    if admin_notes:
        notes_section = f"""
        <div style="background-color: #f8fafc; border-left: 4px solid #16a34a; padding: 14px 16px; border-radius: 4px 10px 10px 4px; margin: 16px 0;">
          <p style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; margin: 0 0 4px 0;">Auditor Engineering Notes</p>
          <p style="color: #1e293b; font-size: 13px; margin: 0; line-height: 1.5;">"{admin_notes}"</p>
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Replacement Unit Dispatched</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
          
          <!-- Banner -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 24px; text-align: center;">
              <img src="https://shopgroundera.com/logo.png" alt="ShopGround Era" style="height: 44px; width: auto; margin-bottom: 12px; display: inline-block;" />
              <h1 style="color: #10b981; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.3px;">Replacement Approved & Dispatched</h1>
              <p style="color: #a7f3d0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 6px 0 0 0;">100% Free Lifetime Guarantee Replacement</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 28px 24px; background-color: #ffffff;">
              <p style="color: #0f172a; font-size: 15px; font-weight: 600; line-height: 1.5; margin: 0 0 14px 0;">Dear {customer_name},</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 18px 0;">
                Great news! Our Quality Engineering team has reviewed your defect report for claim <strong style="color: #0284c7; font-family: monospace;">{claim_code}</strong> and authorized an immediate brand-new replacement unit at zero cost to you under your <strong>ShopGround Era™ Lifetime Guarantee</strong>.
              </p>

              {tracking_section}

              <!-- Status Box -->
              <table role="presentation" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 18px;">
                <tr>
                  <td>
                    <table role="presentation" width="100%" style="font-size: 13px; color: #334155;">
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Claim Reference:</td>
                        <td style="padding: 6px 0; text-align: right; font-family: monospace; font-weight: 800; color: #0f172a;">{claim_code}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Resolution:</td>
                        <td style="padding: 6px 0; text-align: right; font-weight: 800; color: #16a34a;">FREE REPLACEMENT UNIT DISPATCHED</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Defective Unit Return:</td>
                        <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #475569;">Not Required (Recycle Responsibly)</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              {notes_section}

              <!-- CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://shopgroundera.com/warranty" target="_blank" style="background-color: #10b981; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 10px; display: inline-block;">
                      View Live Claim Record &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 18px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px; margin: 0; font-weight: 500;">&copy; 2026 ShopGround Era Inc. All rights reserved.</p>
              <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0;">Customer Care & Support &bull; info@shopgroundera.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


# ─── 2. STATUS: FULL REFUND APPROVED ─────────────────────────────────────────

def get_claim_refund_approved_html(customer_name: str, claim_code: str, admin_notes: str = None, transaction_id: str = None) -> str:
    notes_section = ""
    if admin_notes:
        notes_section = f"""
        <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 14px 16px; border-radius: 4px 10px 10px 4px; margin: 18px 0;">
          <p style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; margin: 0 0 4px 0;">Auditor Quality Notes</p>
          <p style="color: #1e293b; font-size: 13px; margin: 0; line-height: 1.5;">"{admin_notes}"</p>
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Full Refund Approved</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
          
          <!-- Banner -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 24px; text-align: center;">
              <img src="https://shopgroundera.com/logo.png" alt="ShopGround Era" style="height: 44px; width: auto; margin-bottom: 12px; display: inline-block;" />
              <h1 style="color: #818cf8; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.3px;">Full Refund Approved</h1>
              <p style="color: #c7d2fe; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 6px 0 0 0;">100% Purchase Reimbursement</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 28px 24px; background-color: #ffffff;">
              <p style="color: #0f172a; font-size: 15px; font-weight: 600; line-height: 1.5; margin: 0 0 14px 0;">Dear {customer_name},</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 18px 0;">
                Our Quality Engineering and Support management team has completed the audit for claim <strong style="color: #0284c7; font-family: monospace;">{claim_code}</strong>. We have approved a <strong>100% Full Refund</strong> back to your original payment method.
              </p>

              <!-- Refund Info Box -->
              <div style="background-color: #eef2ff; border: 1.5px solid #c7d2fe; border-radius: 12px; padding: 18px; margin: 20px 0;">
                <p style="color: #3730a3; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 4px 0;">Refund Processing Status</p>
                <p style="color: #4338ca; font-size: 18px; font-weight: 800; margin: 0;">Processed to Original Payment Method</p>
                <p style="color: #4f46e5; font-size: 12px; margin: 6px 0 0 0;">
                  Funds typically appear in your account within <strong>3–5 Business Days</strong> depending on your banking institution.
                </p>
              </div>

              <!-- Summary Table -->
              <table role="presentation" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 18px;">
                <tr>
                  <td>
                    <table role="presentation" width="100%" style="font-size: 13px; color: #334155;">
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Claim Reference:</td>
                        <td style="padding: 6px 0; text-align: right; font-family: monospace; font-weight: 800; color: #0f172a;">{claim_code}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Decision:</td>
                        <td style="padding: 6px 0; text-align: right; font-weight: 800; color: #4338ca;">FULL REFUND ISSUED</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              {notes_section}

              <!-- CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://shopgroundera.com/warranty" target="_blank" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 10px; display: inline-block;">
                      View Lifetime Warranty Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 18px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px; margin: 0; font-weight: 500;">&copy; 2026 ShopGround Era Inc. All rights reserved.</p>
              <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0;">Customer Care & Support &bull; info@shopgroundera.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


# ─── 3. STATUS: UNDER REVIEW (NEED MORE PROOF) ────────────────────────────────

def get_claim_under_review_html(customer_name: str, claim_code: str, admin_notes: str = None) -> str:
    instructions_content = admin_notes if admin_notes else "Our engineers require additional media evidence (such as a clear video of the machine running or a photo of the bottom grip surface) to complete your audit."

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claim Under Engineering Audit</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
          
          <!-- Banner -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 24px; text-align: center;">
              <img src="https://shopgroundera.com/logo.png" alt="ShopGround Era" style="height: 44px; width: auto; margin-bottom: 12px; display: inline-block;" />
              <h1 style="color: #f59e0b; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.3px;">Claim Under Technical Review</h1>
              <p style="color: #fde68a; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 6px 0 0 0;">Information Requested by Engineering</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 28px 24px; background-color: #ffffff;">
              <p style="color: #0f172a; font-size: 15px; font-weight: 600; line-height: 1.5; margin: 0 0 14px 0;">Dear {customer_name},</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 18px 0;">
                Our Quality Engineering team is currently auditing your defect report for claim <strong style="color: #0284c7; font-family: monospace;">{claim_code}</strong>. To ensure accurate assessment and authorize the correct resolution, we need a bit more information.
              </p>

              <!-- Auditor Request Box -->
              <div style="background-color: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 18px; margin: 20px 0;">
                <p style="color: #92400e; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 4px 0;">Engineer's Request & Next Steps</p>
                <p style="color: #78350f; font-size: 13.5px; margin: 0; line-height: 1.5; font-weight: 500;">
                  "{instructions_content}"
                </p>
              </div>

              <p style="color: #334155; font-size: 13px; line-height: 1.6; margin: 0 0 20px 0;">
                You can reply directly to this email (<a href="mailto:info@shopgroundera.com" style="color: #ea580c; font-weight: 700;">info@shopgroundera.com</a>) with additional photos/videos attached, and our engineers will update your claim immediately.
              </p>

              <!-- CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="mailto:info@shopgroundera.com?subject=Additional%20Evidence%20for%20Claim%20{claim_code}" style="background-color: #d97706; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 10px; display: inline-block;">
                      Reply with Additional Evidence &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 18px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px; margin: 0; font-weight: 500;">&copy; 2026 ShopGround Era Inc. All rights reserved.</p>
              <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0;">Engineering & Quality Team &bull; info@shopgroundera.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


# ─── 4. STATUS: REJECTED (OUT OF SCOPE / LOGICAL RATIONALE) ───────────────────

def get_claim_rejected_html(customer_name: str, claim_code: str, admin_notes: str = None) -> str:
    explanation_content = admin_notes if admin_notes else "The reported issue was determined to be caused by external factors (such as uneven flooring or exceeding appliance weight ratings) rather than a manufacturing defect."

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Warranty Claim Audit Outcome</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
          
          <!-- Banner -->
          <tr>
            <td style="background-color: #1e293b; padding: 28px 24px; text-align: center;">
              <img src="https://shopgroundera.com/logo.png" alt="ShopGround Era" style="height: 44px; width: auto; margin-bottom: 12px; display: inline-block;" />
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.3px;">Warranty Claim Assessment</h1>
              <p style="color: #f87171; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 6px 0 0 0;">Audit Status: Declined (Out of Scope)</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 28px 24px; background-color: #ffffff;">
              <p style="color: #0f172a; font-size: 15px; font-weight: 600; line-height: 1.5; margin: 0 0 14px 0;">Dear {customer_name},</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 18px 0;">
                Thank you for contacting ShopGround Era support. Our Quality Engineering team has completed a thorough inspection of the details and media submitted for Claim Code <strong style="color: #0f172a; font-family: monospace;">{claim_code}</strong>.
              </p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 18px 0;">
                After detailed technical review, we regret to inform you that this specific claim cannot be approved under the terms of the manufacturer warranty at this time.
              </p>

              <!-- Engineering Explanation Box -->
              <div style="background-color: #fef2f2; border: 1.5px solid #fecaca; border-radius: 12px; padding: 18px; margin: 20px 0;">
                <p style="color: #991b1b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 0 0 6px 0;">Auditor Inspection Findings</p>
                <p style="color: #7f1d1d; font-size: 13.5px; margin: 0; line-height: 1.5;">
                  "{explanation_content}"
                </p>
              </div>

              <!-- Appeals & Support Info -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <p style="color: #0f172a; font-size: 13px; font-weight: 700; margin: 0 0 6px 0;">Questions or Appeal?</p>
                <p style="color: #64748b; font-size: 12.5px; margin: 0; line-height: 1.5;">
                  If you believe this determination was made in error or if you have further context or new photos to share, you can reply directly to this email or contact our senior team at <a href="mailto:info@shopgroundera.com" style="color: #ea580c; text-decoration: underline; font-weight: 600;">info@shopgroundera.com</a> referencing claim code <strong>{claim_code}</strong>.
                </p>
              </div>

              <!-- CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                <tr>
                  <td align="center">
                    <a href="https://shopgroundera.com/warranty" target="_blank" style="background-color: #334155; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13.5px; padding: 12px 24px; border-radius: 10px; display: inline-block;">
                      Review Warranty Policy Terms &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 18px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px; margin: 0; font-weight: 500;">&copy; 2026 ShopGround Era Inc. All rights reserved.</p>
              <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0;">Customer Care &amp; Quality Management &bull; info@shopgroundera.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


# ─── 5. STATUS: RESOLVED / CLOSED ─────────────────────────────────────────────

def get_claim_resolved_html(customer_name: str, claim_code: str, admin_notes: str = None, tracking_number: str = None) -> str:
    notes_section = ""
    if admin_notes:
        notes_section = f"""
        <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 14px 16px; border-radius: 4px 10px 10px 4px; margin: 18px 0;">
          <p style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; margin: 0 0 4px 0;">Resolution Summary</p>
          <p style="color: #1e293b; font-size: 13px; margin: 0; line-height: 1.5;">"{admin_notes}"</p>
        </div>
        """

    tracking_section = ""
    if tracking_number:
        tracking_section = f"""
        <p style="color: #64748b; font-size: 12px; margin: 8px 0 0 0;">Courier Tracking Reference: <strong style="font-family: monospace; color: #0f172a;">{tracking_number}</strong></p>
        """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claim Resolved</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
          
          <!-- Banner -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 24px; text-align: center;">
              <img src="https://shopgroundera.com/logo.png" alt="ShopGround Era" style="height: 44px; width: auto; margin-bottom: 12px; display: inline-block;" />
              <h1 style="color: #10b981; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.3px;">Claim Resolved &amp; Completed</h1>
              <p style="color: #a7f3d0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 6px 0 0 0;">Lifetime Guarantee Case Closed</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 28px 24px; background-color: #ffffff;">
              <p style="color: #0f172a; font-size: 15px; font-weight: 600; line-height: 1.5; margin: 0 0 14px 0;">Dear {customer_name},</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 18px 0;">
                This is a confirmation that defect claim <strong style="color: #0284c7; font-family: monospace;">{claim_code}</strong> has been marked as <strong>Resolved and Closed</strong> by our Customer Care and Engineering teams.
              </p>

              {tracking_section}
              {notes_section}

              <p style="color: #475569; font-size: 13px; line-height: 1.5; margin: 20px 0 0 0;">
                Thank you for choosing <strong>ShopGround Era™</strong>. Your Lifetime Guarantee remains fully active on your registered products.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 18px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px; margin: 0; font-weight: 500;">&copy; 2026 ShopGround Era Inc. All rights reserved.</p>
              <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0;">Customer Care &bull; info@shopgroundera.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


# ─── MASTER CLAIM DECISION ROUTER ─────────────────────────────────────────────

def get_claim_decision_html(customer_name: str, claim_code: str, new_status: str, admin_notes: str = None, tracking_number: str = None) -> str:
    status_str = str(new_status).lower()
    
    if "replacement" in status_str:
        return get_claim_replacement_approved_html(customer_name, claim_code, admin_notes, tracking_number)
    elif "refund" in status_str:
        return get_claim_refund_approved_html(customer_name, claim_code, admin_notes)
    elif "under review" in status_str or "review" in status_str:
        return get_claim_under_review_html(customer_name, claim_code, admin_notes)
    elif "rejected" in status_str or "declined" in status_str:
        return get_claim_rejected_html(customer_name, claim_code, admin_notes)
    elif "resolved" in status_str or "closed" in status_str:
        return get_claim_resolved_html(customer_name, claim_code, admin_notes, tracking_number)
    else:
        # Default fallback
        return get_claim_replacement_approved_html(customer_name, claim_code, admin_notes, tracking_number)


def get_inquiry_acknowledged_html(name: str, inquiry_id: str, target_quantity: int, company: str, message: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 24px; text-align: center;">
              <img src="https://shopgroundera.com/logo.png" alt="ShopGround Era" style="height: 44px; width: auto; margin-bottom: 12px; display: inline-block;" />
              <h1 style="color: #f27e24; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.3px;">Inquiry Received</h1>
              <p style="color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 6px 0 0 0;">GroundEra Anti-Vibration Systems</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 24px; background-color: #ffffff;">
              <p style="color: #0f172a; font-size: 15px; font-weight: 600; line-height: 1.5; margin: 0 0 16px 0;">Hello {name},</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                Thank you for your interest in <strong>GroundEra Anti-Vibration Pads with Leveling Shim & Mini Level</strong>. We have logged your details into our sales management system.
              </p>

              <!-- Inquiry Summary Box -->
              <table role="presentation" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <table role="presentation" width="100%" style="font-size: 13px; color: #334155;">
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Inquiry Reference:</td>
                        <td style="padding: 8px 0; text-align: right; font-family: monospace; font-weight: 800; color: #0f172a;">{inquiry_id}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Target Quantity:</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #ea580c;">{target_quantity} Unit(s)</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Company / Org:</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1e293b;">{company or "Individual / Retail"}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 12px 0 0 0; border-top: 1px dashed #cbd5e1; color: #475569; font-size: 12px; line-height: 1.5;">
                          <strong>Submitted Requirements:</strong> "{message}"
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #475569; font-size: 13px; line-height: 1.5; margin: 0 0 24px 0;">
                Our sales management team (<a href="mailto:info@shopgroundera.com" style="color: #ea580c; text-decoration: none; font-weight: 600;">info@shopgroundera.com</a>) will review your specifications and contact you directly with pricing, delivery schedules, or distribution terms within 24 hours.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://shopgroundera.com" target="_blank" style="background-color: #f27e24; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 10px; display: inline-block;">
                      Visit ShopGround Era &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 18px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px; margin: 0; font-weight: 500;">&copy; 2026 ShopGround Era Inc. All rights reserved.</p>
              <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0;">Sales & Wholesale Support &bull; info@shopgroundera.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
