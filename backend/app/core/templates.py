# ShopGround Era Email Templates Engine

def get_warranty_registered_html(customer_name: str, warranty_code: str, serial_number: str, order_id: str, product_name: str, purchase_date: str) -> str:
    return f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Lifetime Guarantee Active</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050507; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #050507; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #0c0c12; border: 1px solid #1e1e2d; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #141420 0%, #0c0c12 100%); padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #1a1a29;">
              <img src="https://shopgroundera.com/logo.png" alt="ShopGround Era" style="height: 48px; width: auto; margin-bottom: 12px;" />
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Lifetime Guarantee Active</h1>
              <p style="color: #f27e24; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 6px 0 0 0;">100-Year Commercial & Residential Protection</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="color: #e4e4e7; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">Dear <strong>{customer_name}</strong>,</p>
              <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                Congratulations! Your official <strong>ShopGround Era™</strong> Lifetime Guarantee registration is complete and active in our global registry.
              </p>

              <!-- Certificate Details Box -->
              <table role="presentation" width="100%" style="background-color: #12121c; border: 1px solid #27273a; border-radius: 14px; padding: 20px; margin-bottom: 28px;">
                <tr>
                  <td>
                    <table role="presentation" width="100%" style="font-size: 13px; color: #d4d4d8;">
                      <tr>
                        <td style="padding: 6px 0; color: #71717a;">Warranty Code:</td>
                        <td style="padding: 6px 0; text-align: right; font-family: monospace; font-weight: 700; color: #f27e24; font-size: 15px;">{warranty_code}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #71717a;">Serial Number:</td>
                        <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #ffffff; font-family: monospace;">{serial_number}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #71717a;">Order ID:</td>
                        <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #e4e4e7;">{order_id}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #71717a;">Product:</td>
                        <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #e4e4e7;">{product_name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #71717a;">Purchase Date:</td>
                        <td style="padding: 6px 0; text-align: right; color: #a1a1aa;">{purchase_date}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0 0 0; color: #71717a; border-top: 1px dashed #27273a;">Guarantee Period:</td>
                        <td style="padding: 8px 0 0 0; text-align: right; font-weight: 700; color: #22c55e; border-top: 1px dashed #27273a;">LIFETIME GUARANTEE</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://shopgroundera.com/warranty" target="_blank" style="background: linear-gradient(135deg, #f27e24 0%, #d96914 100%); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(242, 126, 36, 0.4);">
                      Verify Warranty Status Live &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #71717a; font-size: 12px; line-height: 1.5; text-align: center; margin: 28px 0 0 0;">
                If you ever experience vibration dampening failure or structural cracking, file a claim anytime at <a href="https://shopgroundera.com/warranty" style="color: #f27e24; text-decoration: underline;">shopgroundera.com/warranty</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #08080e; padding: 20px; text-align: center; border-top: 1px solid #181824;">
              <p style="color: #52525b; font-size: 12px; margin: 0;">&copy; 2026 ShopGround Era Inc. All rights reserved.</p>
              <p style="color: #3f3f46; font-size: 11px; margin: 4px 0 0 0;">Official Guarantee Portal &bull; info@shopgroundera.com</p>
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
    return f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Warranty Claim Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050507; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #050507; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #0c0c12; border: 1px solid #1e1e2d; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #141420 0%, #0c0c12 100%); padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #1a1a29;">
              <img src="https://shopgroundera.com/logo.png" alt="ShopGround Era" style="height: 48px; width: auto; margin-bottom: 12px;" />
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Defect Claim Received</h1>
              <p style="color: #38bdf8; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 6px 0 0 0;">Status: Under Review (Est. 24 Hours)</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="color: #e4e4e7; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">Dear <strong>{customer_name}</strong>,</p>
              <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                We have received your defect claim for Warranty Code <strong style="color: #f27e24;">{warranty_code}</strong>. Our Senior Quality Engineering team has initiated an audit of your report and attached media evidence.
              </p>

              <!-- Claim Summary Box -->
              <table role="presentation" width="100%" style="background-color: #12121c; border: 1px solid #27273a; border-radius: 14px; padding: 20px; margin-bottom: 28px;">
                <tr>
                  <td>
                    <table role="presentation" width="100%" style="font-size: 13px; color: #d4d4d8;">
                      <tr>
                        <td style="padding: 6px 0; color: #71717a;">Claim Code:</td>
                        <td style="padding: 6px 0; text-align: right; font-family: monospace; font-weight: 700; color: #38bdf8; font-size: 15px;">{claim_code}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #71717a;">Defect Category:</td>
                        <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #ffffff;">{issue_category}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #71717a;">Media Evidence:</td>
                        <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #22c55e;">{evidence_count} Attached File(s)</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #71717a;">Audit Status:</td>
                        <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #eab308;">UNDER REVIEW</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 12px 0 0 0; border-top: 1px dashed #27273a; color: #a1a1aa; font-size: 12px; line-height: 1.5;">
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
                    <a href="https://shopgroundera.com/warranty" target="_blank" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);">
                      Track Claim Audit Status &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #71717a; font-size: 12px; line-height: 1.5; text-align: center; margin: 28px 0 0 0;">
                You will receive another automated notification as soon as our Quality Engineers authorize replacement dispatch or resolution.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #08080e; padding: 20px; text-align: center; border-top: 1px solid #181824;">
              <p style="color: #52525b; font-size: 12px; margin: 0;">&copy; 2026 ShopGround Era Inc. All rights reserved.</p>
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
    status_color = "#22c55e" if is_approved else "#ef4444"
    status_title = "APPROVED & DISPATCH AUTHORIZED" if is_replacement else ("CLAIM APPROVED" if is_approved else "AUDIT REJECTED")

    tracking_html = ""
    if tracking_number:
        tracking_html = f"""
        <div style="background-color: #064e3b; border: 1px solid #059669; border-radius: 12px; padding: 16px; margin: 16px 0;">
          <p style="color: #6ee7b7; font-size: 12px; font-weight: 700; text-transform: uppercase; margin: 0 0 4px 0;">Courier Tracking Number</p>
          <p style="color: #ffffff; font-family: monospace; font-size: 18px; font-weight: 800; margin: 0;">{tracking_number}</p>
          <p style="color: #a7f3d0; font-size: 12px; margin: 6px 0 0 0;">Express replacement dispatch initiated via courier gateway.</p>
        </div>
        """

    notes_html = ""
    if admin_notes:
        notes_html = f"""
        <div style="background-color: #12121c; border-left: 4px solid {status_color}; padding: 14px; border-radius: 4px 12px 12px 4px; margin: 16px 0;">
          <p style="color: #71717a; font-size: 11px; font-weight: 700; text-transform: uppercase; margin: 0 0 4px 0;">Auditor Quality Notes</p>
          <p style="color: #e4e4e7; font-size: 13px; margin: 0; line-height: 1.5;">"{admin_notes}"</p>
        </div>
        """

    return f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Claim Decision Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050507; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #050507; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #0c0c12; border: 1px solid #1e1e2d; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #141420 0%, #0c0c12 100%); padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #1a1a29;">
              <img src="https://shopgroundera.com/logo.png" alt="ShopGround Era" style="height: 48px; width: auto; margin-bottom: 12px;" />
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Claim Decision Update</h1>
              <p style="color: {status_color}; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin: 6px 0 0 0;">{status_title}</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="color: #e4e4e7; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">Dear <strong>{customer_name}</strong>,</p>
              <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                The Quality Audit for Claim Code <strong style="color: #f27e24; font-family: monospace;">{claim_code}</strong> has been finalized by our Engineering Management team.
              </p>

              <!-- Decision Status Box -->
              <table role="presentation" width="100%" style="background-color: #12121c; border: 1px solid #27273a; border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <table role="presentation" width="100%" style="font-size: 13px; color: #d4d4d8;">
                      <tr>
                        <td style="padding: 6px 0; color: #71717a;">Claim Code:</td>
                        <td style="padding: 6px 0; text-align: right; font-family: monospace; font-weight: 700; color: #ffffff;">{claim_code}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #71717a;">Final Status:</td>
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
                    <a href="https://shopgroundera.com/warranty" target="_blank" style="background: linear-gradient(135deg, #f27e24 0%, #d96914 100%); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(242, 126, 36, 0.4);">
                      View Complete Audit Details &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #08080e; padding: 20px; text-align: center; border-top: 1px solid #181824;">
              <p style="color: #52525b; font-size: 12px; margin: 0;">&copy; 2026 ShopGround Era Inc. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
