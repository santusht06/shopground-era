# ShopGround Era Transactional Email Templates (Clean & Minimal Professional)

def get_warranty_registered_html(customer_name: str, warranty_code: str, serial_number: str, order_id: str, product_name: str, purchase_date: str) -> str:
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Warranty Registration Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px 20px; border-bottom: 1px solid #e2e8f0;">
              <table role="presentation" width="100%">
                <tr>
                  <td style="font-size: 16px; font-weight: 700; color: #0f172a; letter-spacing: -0.2px;">ShopGround Era</td>
                  <td align="right" style="font-size: 12px; color: #64748b;">Warranty Confirmation</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">Warranty Registration Confirmed</h2>
              <p style="font-size: 14px; color: #334155; line-height: 1.5; margin: 0 0 24px 0;">
                Hello {customer_name},<br>
                Your warranty registration has been recorded. Below are your official record details.
              </p>

              <!-- Minimal Data Table -->
              <table role="presentation" width="100%" style="border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;">Warranty Code</td>
                  <td style="padding: 10px 0; text-align: right; font-family: monospace; font-weight: 700; color: #0f172a; font-size: 14px;">{warranty_code}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;">Serial Number</td>
                  <td style="padding: 10px 0; text-align: right; font-family: monospace; font-weight: 600; color: #334155;">{serial_number}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;">Order ID</td>
                  <td style="padding: 10px 0; text-align: right; color: #334155;">{order_id}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;">Product</td>
                  <td style="padding: 10px 0; text-align: right; color: #334155;">{product_name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;">Purchase Date</td>
                  <td style="padding: 10px 0; text-align: right; color: #334155;">{purchase_date}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b;">Coverage</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #16a34a;">Lifetime Guarantee</td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 24px 0;">
                To check warranty coverage status anytime, visit <a href="https://shopgroundera.com/warranty" style="color: #2563eb; text-decoration: none;">shopgroundera.com/warranty</a> and enter your Warranty Code.
              </p>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8;">
                ShopGround Era Customer Support &bull; <a href="mailto:info@shopgroundera.com" style="color: #64748b; text-decoration: none;">info@shopgroundera.com</a>
              </div>
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
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Warranty Claim Acknowledgement</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px 20px; border-bottom: 1px solid #e2e8f0;">
              <table role="presentation" width="100%">
                <tr>
                  <td style="font-size: 16px; font-weight: 700; color: #0f172a; letter-spacing: -0.2px;">ShopGround Era</td>
                  <td align="right" style="font-size: 12px; color: #64748b;">Claim Acknowledgement</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">Claim Submission Received</h2>
              <p style="font-size: 14px; color: #334155; line-height: 1.5; margin: 0 0 24px 0;">
                Hello {customer_name},<br>
                We have received your claim for Warranty Code <strong>{warranty_code}</strong>. The details of your submission are provided below.
              </p>

              <!-- Minimal Data Table -->
              <table role="presentation" width="100%" style="border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;">Claim Code</td>
                  <td style="padding: 10px 0; text-align: right; font-family: monospace; font-weight: 700; color: #2563eb; font-size: 14px;">{claim_code}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;">Issue Category</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #334155;">{issue_category}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;">Evidence Files</td>
                  <td style="padding: 10px 0; text-align: right; color: #334155;">{evidence_count} file(s) attached</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;">Current Status</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #d97706;">Under Review</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0; color: #64748b; vertical-align: top;">Description</td>
                  <td style="padding: 12px 0 0 0; text-align: right; color: #334155; font-size: 13px; line-height: 1.4;">{description}</td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 24px 0;">
                Our technical audit team will review your report within 24 hours. You can check updates live at <a href="https://shopgroundera.com/warranty" style="color: #2563eb; text-decoration: none;">shopgroundera.com/warranty</a>.
              </p>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8;">
                ShopGround Era Customer Support &bull; <a href="mailto:info@shopgroundera.com" style="color: #64748b; text-decoration: none;">info@shopgroundera.com</a>
              </div>
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
    status_color = "#16a34a" if is_approved else "#dc2626"

    tracking_section = ""
    if tracking_number:
        tracking_section = f"""
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin-bottom: 24px;">
          <div style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase; margin-bottom: 4px;">Courier Tracking Number</div>
          <div style="font-family: monospace; font-size: 16px; font-weight: 700; color: #15803d;">{tracking_number}</div>
        </div>
        """

    notes_section = ""
    if admin_notes:
        notes_section = f"""
        <div style="background-color: #f8fafc; border-left: 3px solid #cbd5e1; padding: 12px 16px; margin-bottom: 24px;">
          <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Audit Notes</div>
          <div style="font-size: 13px; color: #334155; line-height: 1.4;">{admin_notes}</div>
        </div>
        """

    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Warranty Claim Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px 20px; border-bottom: 1px solid #e2e8f0;">
              <table role="presentation" width="100%">
                <tr>
                  <td style="font-size: 16px; font-weight: 700; color: #0f172a; letter-spacing: -0.2px;">ShopGround Era</td>
                  <td align="right" style="font-size: 12px; color: #64748b;">Claim Status Update</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">Claim Status Updated</h2>
              <p style="font-size: 14px; color: #334155; line-height: 1.5; margin: 0 0 24px 0;">
                Hello {customer_name},<br>
                The audit review for Claim Code <strong>{claim_code}</strong> has been updated.
              </p>

              <!-- Minimal Data Table -->
              <table role="presentation" width="100%" style="border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;">Claim Code</td>
                  <td style="padding: 10px 0; text-align: right; font-family: monospace; font-weight: 700; color: #0f172a;">{claim_code}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b;">Updated Status</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: 700; color: {status_color}; font-size: 14px;">{new_status}</td>
                </tr>
              </table>

              {tracking_section}
              {notes_section}

              <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 24px 0;">
                You can review your claim details anytime at <a href="https://shopgroundera.com/warranty" style="color: #2563eb; text-decoration: none;">shopgroundera.com/warranty</a>.
              </p>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8;">
                ShopGround Era Customer Support &bull; <a href="mailto:info@shopgroundera.com" style="color: #64748b; text-decoration: none;">info@shopgroundera.com</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
