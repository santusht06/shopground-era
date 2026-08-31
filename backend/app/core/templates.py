# ShopGround Era Transactional Email Templates (100% High Contrast & Gmail iOS Dark/Light Mode Compatible)

def get_warranty_registered_html(customer_name: str, warranty_code: str, serial_number: str, order_id: str, product_name: str, purchase_date: str) -> str:
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
                        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Serial Number:</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #0f172a; font-family: monospace;">{serial_number}</td>
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


def get_claim_decision_html(customer_name: str, claim_code: str, new_status: str, admin_notes: str = None, tracking_number: str = None) -> str:
    is_approved = "Approved" in new_status
    is_replacement = "Replacement" in new_status
    status_color = "#16a34a" if is_approved else "#dc2626"
    status_title = "APPROVED & DISPATCH AUTHORIZED" if is_replacement else ("CLAIM APPROVED" if is_approved else "AUDIT REJECTED")

    tracking_html = ""
    if tracking_number:
        tracking_html = f"""
        <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 16px; margin: 16px 0;">
          <p style="color: #166534; font-size: 11px; font-weight: 700; text-transform: uppercase; margin: 0 0 4px 0;">Courier Tracking Number</p>
          <p style="color: #15803d; font-family: monospace; font-size: 18px; font-weight: 800; margin: 0;">{tracking_number}</p>
          <p style="color: #166534; font-size: 12px; margin: 6px 0 0 0;">Express replacement dispatch initiated via courier gateway.</p>
        </div>
        """

    notes_html = ""
    if admin_notes:
        notes_html = f"""
        <div style="background-color: #f8fafc; border-left: 4px solid {status_color}; padding: 14px; border-radius: 4px 10px 10px 4px; margin: 16px 0;">
          <p style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; margin: 0 0 4px 0;">Auditor Quality Notes</p>
          <p style="color: #1e293b; font-size: 13px; margin: 0; line-height: 1.5;">"{admin_notes}"</p>
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claim Decision Update</title>
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
              <h1 style="color: #f27e24; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.3px;">Claim Decision Update</h1>
              <p style="color: {status_color}; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin: 6px 0 0 0;">{status_title}</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 24px; background-color: #ffffff;">
              <p style="color: #0f172a; font-size: 15px; font-weight: 600; line-height: 1.5; margin: 0 0 16px 0;">Dear {customer_name},</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                The Quality Audit for Claim Code <strong style="color: #ea580c; font-family: monospace;">{claim_code}</strong> has been finalized by our Engineering Management team.
              </p>

              <!-- Decision Status Box -->
              <table role="presentation" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <table role="presentation" width="100%" style="font-size: 13px; color: #334155;">
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Claim Code:</td>
                        <td style="padding: 6px 0; text-align: right; font-family: monospace; font-weight: 700; color: #0f172a;">{claim_code}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Final Status:</td>
                        <td style="padding: 6px 0; text-align: right; font-weight: 800; color: {status_color}; font-size: 14px;">{new_status}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              {tracking_html}
              {notes_html}

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://shopgroundera.com/warranty" target="_blank" style="background-color: #f27e24; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 10px; display: inline-block;">
                      View Complete Audit Details &rarr;
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
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


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