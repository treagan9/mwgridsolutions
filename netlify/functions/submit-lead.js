// netlify/functions/submit-lead.js
import { createClient } from '@supabase/supabase-js'
import Busboy from 'busboy'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const RESEND_KEY = process.env.RESEND_API_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const FROM_EMAIL = 'MWGridSolutions <team@mwgridsolutions.com>'

const ADMIN_RECIPIENTS = [
  ADMIN_EMAIL,
  'info@mwgridsolutions.com'
].filter((v, i, a) => v && a.indexOf(v) === i)

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

function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const fields = {}
    const files = []

    const busboy = Busboy({
      headers: {
        'content-type': event.headers['content-type'] || event.headers['Content-Type']
      }
    })

    busboy.on('field', (name, value) => {
      fields[name] = value
    })

    busboy.on('file', (name, stream, info) => {
      const { filename, mimeType } = info
      const chunks = []
      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('end', () => {
        if (filename && chunks.length > 0) {
          files.push({
            name: filename,
            type: mimeType,
            buffer: Buffer.concat(chunks)
          })
        }
      })
    })

    busboy.on('finish', () => resolve({ fields, files }))
    busboy.on('error', reject)

    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body)

    busboy.end(body)
  })
}

const getMST = () => new Date().toLocaleString('en-US', {
  timeZone: 'America/Denver',
  month: 'short', day: 'numeric', year: 'numeric',
  hour: 'numeric', minute: '2-digit', hour12: true,
}) + ' MST'

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

function clientEmailHtml(data) {
  return emailShell(`
    <tr><td bgcolor="#0b1120" style="background:#0b1120;padding:32px 24px;text-align:center;"><img src="https://mwgridsolutions.netlify.app/power-equipment-buyers-sms-logo-1200x630.png" alt="MWGridSolutions" width="280" style="max-width:70%;height:auto;display:block;margin:0 auto;" /></td></tr>
    <tr><td style="background:#f0fdfa;border-bottom:3px solid #0ea5a8;padding:28px 32px;text-align:center;">
      <h1 style="margin:0 0 6px 0;color:#0f172a;font-size:22px;font-weight:800;line-height:1.2;">We Received Your Submission</h1>
      <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">Thank you, ${data.name.split(' ')[0]}. Our buyer will review your equipment and respond with an offer.</p>
    </td></tr>
    <tr><td class="mobile-pad" style="padding:32px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:28px;">
        <tr><td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;"><span style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Your Submission</span></td></tr>
        <tr><td style="padding:14px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:5px 0;color:#64748b;font-size:12px;width:40%;">Name</td><td style="padding:5px 0;color:#0f172a;font-size:13px;font-weight:600;text-align:right;">${data.name}</td></tr>
            <tr><td style="padding:5px 0;color:#64748b;font-size:12px;border-top:1px solid #f1f5f9;">Equipment</td><td style="padding:5px 0;color:#0f172a;font-size:13px;font-weight:600;text-align:right;border-top:1px solid #f1f5f9;">${data.equipment_type}</td></tr>
            <tr><td style="padding:5px 0;color:#64748b;font-size:12px;border-top:1px solid #f1f5f9;">Submitted</td><td style="padding:5px 0;color:#0f172a;font-size:13px;text-align:right;border-top:1px solid #f1f5f9;">${getMST()}</td></tr>
          </table>
        </td></tr>
      </table>
      <p style="margin:0 0 14px 0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">What Happens Next</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        ${[['1','We review your submission','Our buyer evaluates your equipment based on the details and photos you provided.'],['2','You receive an offer','We come back with a competitive offer, typically within one hour during business hours.'],['3','We pick up and pay','Accept the offer and we coordinate freight pickup and fast payment.']].map(([n,t,d])=>`<tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;"><table cellpadding="0" cellspacing="0"><tr><td style="width:36px;vertical-align:top;"><div style="width:28px;height:28px;border-radius:50%;background:#0ea5a8;text-align:center;line-height:28px;color:#ffffff;font-size:12px;font-weight:800;">${n}</div></td><td style="padding-left:12px;vertical-align:top;"><p style="margin:0 0 2px 0;color:#0f172a;font-size:13px;font-weight:700;">${t}</p><p style="margin:0;color:#64748b;font-size:12px;line-height:1.6;">${d}</p></td></tr></table></td></tr>`).join('')}
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
        <tr><td style="padding:14px 16px;border-bottom:1px solid #e2e8f0;"><span style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Business Hours</span></td></tr>
        <tr><td style="padding:14px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:4px 0;color:#64748b;font-size:12px;">Mon - Fri</td><td style="padding:4px 0;color:#0f172a;font-size:13px;font-weight:600;text-align:right;">8:00 AM - 5:00 PM</td></tr>
            <tr><td style="padding:4px 0;color:#64748b;font-size:12px;border-top:1px solid #f1f5f9;">Saturday</td><td style="padding:4px 0;color:#0f172a;font-size:13px;font-weight:600;text-align:right;border-top:1px solid #f1f5f9;">9:00 AM - 2:00 PM</td></tr>
            <tr><td style="padding:4px 0;color:#64748b;font-size:12px;border-top:1px solid #f1f5f9;">Sunday</td><td style="padding:4px 0;color:#94a3b8;font-size:13px;text-align:right;border-top:1px solid #f1f5f9;">Closed</td></tr>
          </table>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b1120;border-radius:8px;overflow:hidden;">
        <tr><td style="padding:18px 22px;">
          <p style="margin:0 0 10px 0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Questions?</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:3px 0;color:#64748b;font-size:12px;">Email</td><td style="padding:3px 0;text-align:right;"><a href="mailto:info@mwgridsolutions.com" style="color:#0ea5a8;font-size:12px;font-weight:600;text-decoration:none;">info@mwgridsolutions.com</a></td></tr>
            <tr><td style="padding:3px 0;color:#64748b;font-size:12px;border-top:1px solid rgba(255,255,255,0.06);">Phone</td><td style="padding:3px 0;text-align:right;border-top:1px solid rgba(255,255,255,0.06);"><a href="tel:+18668618383" style="color:#0ea5a8;font-size:12px;font-weight:600;text-decoration:none;">(866) 861-8383</a></td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:16px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
      <p style="margin:0 0 3px 0;color:#0f172a;font-size:12px;font-weight:700;">MWGridSolutions</p>
      <p style="margin:0;color:#94a3b8;font-size:11px;">Direct buyer of transformers and switchgear</p>
    </td></tr>
  `)
}

function adminEmailHtml(data, photoUrls) {
  const photoHtml = photoUrls.length > 0
    ? photoUrls.map((url) => `<a href="${url}" style="display:inline-block;margin:0 4px 4px 0;"><img src="${url}" style="width:100px;height:100px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;" /></a>`).join('')
    : '<p style="color:#94a3b8;font-size:13px;margin:0;">No photos uploaded</p>'
  const descriptionHtml = data.description
    ? `<p style="margin:0;color:#334155;font-size:13px;line-height:1.8;white-space:pre-wrap;">${data.description}</p>`
    : '<p style="color:#94a3b8;font-size:13px;margin:0;">No description provided</p>'

  return emailShell(`
    <tr><td bgcolor="#0b1120" style="background:#0b1120;padding:28px 24px;text-align:center;"><img src="https://mwgridsolutions.netlify.app/power-equipment-buyers-sms-logo-1200x630.png" alt="MWGridSolutions" width="280" style="max-width:70%;height:auto;display:block;margin:0 auto;" /></td></tr>
    <tr><td style="background:#f0fdfa;border-bottom:3px solid #0ea5a8;padding:20px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td><div style="color:#0ea5a8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px;">New Lead</div><div style="color:#0f172a;font-size:20px;font-weight:800;line-height:1.2;">${data.equipment_type}</div><div style="color:#94a3b8;font-size:11px;margin-top:4px;">${getMST()}</div></td>
        <td style="text-align:right;vertical-align:top;"><div style="background:#0ea5a8;color:#ffffff;font-size:11px;font-weight:800;padding:5px 12px;border-radius:20px;display:inline-block;text-transform:uppercase;">${photoUrls.length} Photo${photoUrls.length !== 1 ? 's' : ''}</div></td>
      </tr></table>
    </td></tr>
    <tr><td class="mobile-pad" style="padding:28px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
        <tr><td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;"><span style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Contact</span></td></tr>
        <tr><td style="padding:14px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:5px 0;color:#64748b;font-size:12px;width:35%;">Name</td><td style="padding:5px 0;color:#0f172a;font-size:13px;font-weight:700;text-align:right;">${data.name}</td></tr>
            <tr><td style="padding:5px 0;color:#64748b;font-size:12px;border-top:1px solid #f1f5f9;">Email</td><td style="padding:5px 0;text-align:right;border-top:1px solid #f1f5f9;"><a href="mailto:${data.email}" style="color:#1a3a6b;font-size:13px;font-weight:600;text-decoration:none;">${data.email}</a></td></tr>
            <tr><td style="padding:5px 0;color:#64748b;font-size:12px;border-top:1px solid #f1f5f9;">Phone</td><td style="padding:5px 0;text-align:right;border-top:1px solid #f1f5f9;"><a href="tel:${data.phone.replace(/\D/g,'')}" style="color:#1a3a6b;font-size:13px;font-family:monospace;font-weight:600;text-decoration:none;">${data.phone}</a></td></tr>
            <tr><td style="padding:5px 0;color:#64748b;font-size:12px;border-top:1px solid #f1f5f9;">Equipment</td><td style="padding:5px 0;text-align:right;border-top:1px solid #f1f5f9;"><span style="background:#f0fdfa;color:#0ea5a8;padding:3px 10px;border-radius:5px;font-weight:700;font-size:11px;border:1px solid #ccfbf1;">${data.equipment_type}</span></td></tr>
          </table>
        </td></tr>
      </table>
      <p style="margin:0 0 10px 0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Description</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td style="padding:16px 18px;background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #0ea5a8;border-radius:4px;">${descriptionHtml}</td></tr></table>
      <p style="margin:0 0 10px 0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Equipment Photos</p>
      <div style="margin-bottom:24px;line-height:0;">${photoHtml}</div>
      <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="text-align:center;padding-top:8px;">
        <a href="mailto:${data.email}?subject=Re: Your ${data.equipment_type} Submission to MWGridSolutions&body=%0A%0A-------- Original Submission --------%0AName: ${encodeURIComponent(data.name)}%0APhone: ${encodeURIComponent(data.phone)}%0AEquipment: ${encodeURIComponent(data.equipment_type)}%0ADescription: ${encodeURIComponent(data.description || 'None')}%0APhotos: ${encodeURIComponent(photoUrls.join(', ') || 'None')}" style="display:inline-block;background:#1a3a6b;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:7px;font-weight:800;font-size:13px;margin:4px;">Reply to Lead</a>
        <a href="tel:${data.phone.replace(/\D/g,'')}" style="display:inline-block;background:#ffffff;color:#1a3a6b;text-decoration:none;padding:13px 28px;border-radius:7px;font-weight:700;font-size:13px;margin:4px;border:1px solid #e2e8f0;">Call ${data.name.split(' ')[0]}</a>
      </td></tr></table>
    </td></tr>
    <tr><td style="padding:14px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;"><p style="margin:0;color:#94a3b8;font-size:11px;">MWGridSolutions Lead Notification &middot; ${getMST()}</p></td></tr>
  `)
}

// ============================================
// HANDLER - ESM named export (Cimarron Pulse pattern)
// ============================================
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  try {
    const { fields, files } = await parseMultipart(event)

    console.log('Lead received:', { name: fields.name, email: fields.email, phone: fields.phone, equipment_type: fields.equipment_type })
    console.log('Photo files count:', files.length)

    if (fields.website_url) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) }
    }

    if (fields._loaded) {
      const elapsed = Date.now() - parseInt(fields._loaded, 10)
      if (elapsed < 3000) {
        return { statusCode: 200, body: JSON.stringify({ success: true }) }
      }
    }

    const name = fields.name
    const email = fields.email
    const phone = fields.phone
    const equipment_type = fields.equipment_type
    const description = fields.description || ''

    const photoUrls = []
    for (const file of files) {
      try {
        const timestamp = Date.now()
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const path = `leads/${timestamp}-${safeName}`

        console.log('Uploading:', safeName, 'size:', file.buffer.length, 'type:', file.type)

        const { error: uploadError } = await supabase.storage
          .from('lead-photos')
          .upload(path, file.buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: false
          })

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('lead-photos')
            .getPublicUrl(path)
          photoUrls.push(urlData.publicUrl)
          console.log('Uploaded:', path)
        } else {
          console.error('Upload error:', uploadError.message)
        }
      } catch (uploadErr) {
        console.error('Photo upload failed:', uploadErr.message)
      }
    }

    console.log('Total photos uploaded:', photoUrls.length)

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
      console.error('DB error:', dbError.message)
      return { statusCode: 500, body: JSON.stringify({ error: 'Database error' }) }
    }

    console.log('Lead saved to database')

    const data = { name, email, phone, equipment_type, description }

    await Promise.all([
      sendEmail(
        email,
        `We Received Your ${equipment_type} Submission`,
        clientEmailHtml(data)
      ),
      sendEmail(
        ADMIN_RECIPIENTS,
        `New Lead: ${equipment_type} from ${name}`,
        adminEmailHtml(data, photoUrls),
        `${name} <${email}>`
      )
    ])

    console.log('Emails sent')

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    }
  } catch (err) {
    console.error('Function error:', err.message, err.stack)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    }
  }
}