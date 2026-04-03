// netlify/functions/submit-lead.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const RESEND_KEY = process.env.RESEND_API_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const FROM_EMAIL = 'MWGridSolutions <team@mwgridsolutions.com>'

async function sendEmail(to, subject, html, replyTo) {
  const payload = { from: FROM_EMAIL, to, subject, html }
  if (replyTo) payload.reply_to = replyTo
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_KEY}`
    },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const err = await res.text()
    console.error('Resend error:', err)
  }
}

const getMST = () => new Date().toLocaleString('en-US', {
  timeZone: 'America/Denver',
  month: 'short', day: 'numeric', year: 'numeric',
  hour: 'numeric', minute: '2-digit', hour12: true,
}) + ' MST'

// ============================================
// EMAIL SHELL - light, clean, professional
// ============================================
const emailShell = (content) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <style>
    @media only screen and (max-width: 600px) {
      .mobile-pad { padding: 24px 16px !important; }
      .mobile-full { width: 99% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:28px 12px;">
    <tr>
      <td align="center">
        <table class="mobile-full" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

// ============================================
// CLIENT CONFIRMATION EMAIL
// ============================================
function clientEmailHtml(data) {
  return emailShell(`
    <!-- Header -->
    <tr>
      <td bgcolor="#0b1120" style="background:#0b1120;padding:32px 24px;text-align:center;">
        <img src="https://powerequipmentbuyers.netlify.app/power-equipment-buyers-sms-logo-1200x630.png" alt="MWGridSolutions" width="280" style="max-width:70%;height:auto;display:block;margin:0 auto;" />
      </td>
    </tr>

    <!-- Confirmation banner -->
    <tr>
      <td style="background:#f0fdfa;border-bottom:3px solid #0ea5a8;padding:28px 32px;text-align:center;">
        <h1 style="margin:0 0 6px 0;color:#0f172a;font-size:22px;font-weight:800;line-height:1.2;">
          We Received Your Submission
        </h1>
        <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">
          Thank you, ${data.name.split(' ')[0]}. Our buyer will review your equipment and respond with an offer.
        </p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td class="mobile-pad" style="padding:32px 40px;">

        <!-- Summary -->
        <table width="100%" cellpadding="0" cellspacing="0"
               style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:28px;">
          <tr>
            <td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;">
              <span style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Your Submission</span>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:5px 0;color:#64748b;font-size:12px;width:40%;">Name</td>
                  <td style="padding:5px 0;color:#0f172a;font-size:13px;font-weight:600;text-align:right;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;color:#64748b;font-size:12px;border-top:1px solid #f1f5f9;">Equipment</td>
                  <td style="padding:5px 0;color:#0f172a;font-size:13px;font-weight:600;text-align:right;border-top:1px solid #f1f5f9;">${data.equipment_type}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;color:#64748b;font-size:12px;border-top:1px solid #f1f5f9;">Submitted</td>
                  <td style="padding:5px 0;color:#0f172a;font-size:13px;text-align:right;border-top:1px solid #f1f5f9;">${getMST()}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- What happens next -->
        <p style="margin:0 0 14px 0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">
          What Happens Next
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          ${[
            ['1', 'We review your submission', 'Our buyer evaluates your equipment based on the details and photos you provided.'],
            ['2', 'You receive an offer', 'We come back with a competitive offer, typically within one hour during business hours.'],
            ['3', 'We pick up and pay', 'Accept the offer and we coordinate freight pickup and fast payment.'],
          ].map(([num, title, desc]) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:36px;vertical-align:top;">
                    <div style="width:28px;height:28px;border-radius:50%;background:#0ea5a8;text-align:center;line-height:28px;color:#ffffff;font-size:12px;font-weight:800;">${num}</div>
                  </td>
                  <td style="padding-left:12px;vertical-align:top;">
                    <p style="margin:0 0 2px 0;color:#0f172a;font-size:13px;font-weight:700;">${title}</p>
                    <p style="margin:0;color:#64748b;font-size:12px;line-height:1.6;">${desc}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`).join('')}
        </table>

        <!-- Contact -->
        <table width="100%" cellpadding="0" cellspacing="0"
               style="background:#0b1120;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:18px 22px;">
              <p style="margin:0 0 10px 0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Questions?</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:3px 0;color:#64748b;font-size:12px;">Email</td>
                  <td style="padding:3px 0;text-align:right;">
                    <a href="mailto:info@mwgridsolutions.com" style="color:#0ea5a8;font-size:12px;font-weight:600;text-decoration:none;">info@mwgridsolutions.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:16px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
        <p style="margin:0 0 3px 0;color:#0f172a;font-size:12px;font-weight:700;">MWGridSolutions</p>
        <p style="margin:0;color:#94a3b8;font-size:11px;">Direct buyer of transformers and switchgear</p>
      </td>
    </tr>
  `)
}

// ============================================
// ADMIN NOTIFICATION EMAIL
// ============================================
function adminEmailHtml(data, photoUrls) {
  const photoHtml = photoUrls.length > 0
    ? photoUrls.map((url) => `<a href="${url}" style="display:inline-block;margin:0 4px 4px 0;"><img src="${url}" style="width:100px;height:100px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;" /></a>`).join('')
    : '<p style="color:#94a3b8;font-size:13px;margin:0;">No photos uploaded</p>'

  const descriptionHtml = data.description
    ? `<p style="margin:0;color:#334155;font-size:13px;line-height:1.8;white-space:pre-wrap;">${data.description}</p>`
    : '<p style="color:#94a3b8;font-size:13px;margin:0;">No description provided</p>'

  return emailShell(`
    <!-- Header -->
    <tr>
      <td bgcolor="#0b1120" style="background:#0b1120;padding:28px 24px;text-align:center;">
        <img src="https://powerequipmentbuyers.netlify.app/power-equipment-buyers-sms-logo-1200x630.png" alt="MWGridSolutions" width="280" style="max-width:70%;height:auto;display:block;margin:0 auto;" />
      </td>
    </tr>

    <!-- Alert banner -->
    <tr>
      <td style="background:#f0fdfa;border-bottom:3px solid #0ea5a8;padding:20px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div style="color:#0ea5a8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px;">New Lead</div>
              <div style="color:#0f172a;font-size:20px;font-weight:800;line-height:1.2;">${data.equipment_type}</div>
              <div style="color:#94a3b8;font-size:11px;margin-top:4px;">${getMST()}</div>
            </td>
            <td style="text-align:right;vertical-align:top;">
              <div style="background:#0ea5a8;color:#ffffff;font-size:11px;font-weight:800;padding:5px 12px;border-radius:20px;display:inline-block;text-transform:uppercase;">
                ${photoUrls.length} Photo${photoUrls.length !== 1 ? 's' : ''}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td class="mobile-pad" style="padding:28px 40px;">

        <!-- Client info -->
        <table width="100%" cellpadding="0" cellspacing="0"
               style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
          <tr>
            <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">
              <span style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Contact</span>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:5px 0;color:#64748b;font-size:12px;width:35%;">Name</td>
                  <td style="padding:5px 0;color:#0f172a;font-size:13px;font-weight:700;text-align:right;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;color:#64748b;font-size:12px;border-top:1px solid #f1f5f9;">Email</td>
                  <td style="padding:5px 0;text-align:right;border-top:1px solid #f1f5f9;">
                    <a href="mailto:${data.email}" style="color:#1a3a6b;font-size:13px;font-weight:600;text-decoration:none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:5px 0;color:#64748b;font-size:12px;border-top:1px solid #f1f5f9;">Phone</td>
                  <td style="padding:5px 0;text-align:right;border-top:1px solid #f1f5f9;">
                    <a href="tel:${data.phone.replace(/\D/g, '')}" style="color:#1a3a6b;font-size:13px;font-family:monospace;font-weight:600;text-decoration:none;">${data.phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:5px 0;color:#64748b;font-size:12px;border-top:1px solid #f1f5f9;">Equipment</td>
                  <td style="padding:5px 0;text-align:right;border-top:1px solid #f1f5f9;">
                    <span style="background:#f0fdfa;color:#0ea5a8;padding:3px 10px;border-radius:5px;font-weight:700;font-size:11px;border:1px solid #ccfbf1;">${data.equipment_type}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Description -->
        <p style="margin:0 0 10px 0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">
          Description
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td style="padding:16px 18px;background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #0ea5a8;border-radius:4px;">
              ${descriptionHtml}
            </td>
          </tr>
        </table>

        <!-- Photos -->
        <p style="margin:0 0 10px 0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">
          Equipment Photos
        </p>
        <div style="margin-bottom:24px;line-height:0;">
          ${photoHtml}
        </div>

        <!-- Action buttons -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center;padding-top:8px;">
              <a href="mailto:${data.email}?subject=Re: Your ${data.equipment_type} Submission to MWGridSolutions&body=%0A%0A-------- Original Submission --------%0AName: ${encodeURIComponent(data.name)}%0APhone: ${encodeURIComponent(data.phone)}%0AEquipment: ${encodeURIComponent(data.equipment_type)}%0ADescription: ${encodeURIComponent(data.description || 'None')}%0APhotos: ${encodeURIComponent(photoUrls.join(', ') || 'None')}"
                 style="display:inline-block;background:#1a3a6b;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:7px;font-weight:800;font-size:13px;margin:4px;">
                Reply to Lead
              </a>
              <a href="tel:${data.phone.replace(/\D/g, '')}"
                 style="display:inline-block;background:#ffffff;color:#1a3a6b;text-decoration:none;padding:13px 28px;border-radius:7px;font-weight:700;font-size:13px;margin:4px;border:1px solid #e2e8f0;">
                Call ${data.name.split(' ')[0]}
              </a>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:14px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
        <p style="margin:0;color:#94a3b8;font-size:11px;">MWGridSolutions Lead Notification &middot; ${getMST()}</p>
      </td>
    </tr>
  `)
}

// ============================================
// HANDLER
// ============================================
export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const formData = await req.formData()
    const name = formData.get('name')
    const email = formData.get('email')
    const phone = formData.get('phone')
    const equipment_type = formData.get('equipment_type')
    const description = formData.get('description')
    const photoFiles = formData.getAll('photos')

    // Upload photos to Supabase storage
    const photoUrls = []
    for (const file of photoFiles) {
      if (!file || !file.name) continue
      const timestamp = Date.now()
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const path = `leads/${timestamp}-${safeName}`
      const buffer = Buffer.from(await file.arrayBuffer())

      const { error: uploadError } = await supabase.storage
        .from('lead-photos')
        .upload(path, buffer, {
          contentType: file.type,
          upsert: false
        })

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('lead-photos')
          .getPublicUrl(path)
        photoUrls.push(urlData.publicUrl)
      } else {
        console.error('Upload error:', uploadError)
      }
    }

    // Insert lead into database
    const { error: dbError } = await supabase.from('leads').insert({
      name,
      email,
      phone,
      equipment_type,
      description,
      photos: photoUrls,
      status: 'new'
    })

    if (dbError) {
      console.error('DB error:', dbError)
      return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 })
    }

    // Send emails
    const data = { name, email, phone, equipment_type, description }

    await Promise.all([
      sendEmail(
        email,
        `We Received Your ${equipment_type} Submission`,
        clientEmailHtml(data)
      ),
      sendEmail(
        ADMIN_EMAIL,
        `New Lead: ${equipment_type} from ${name}`,
        adminEmailHtml(data, photoUrls),
        `${name} <${email}>`
      )
    ])

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Function error:', err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}

export const config = {
  path: '/.netlify/functions/submit-lead'
}
