// netlify/functions/handle-recording.js
// Twilio recording callback > Deepgram transcription > Supabase lead > admin email

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const DEEPGRAM_KEY = process.env.DEEPGRAM_API_KEY
const RESEND_KEY = process.env.RESEND_API_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN

const getMST = () => new Date().toLocaleString('en-US', {
  timeZone: 'America/Denver',
  month: 'short', day: 'numeric', year: 'numeric',
  hour: 'numeric', minute: '2-digit', hour12: true,
}) + ' MST'

async function transcribeRecording(recordingUrl) {
  const audioUrl = `${recordingUrl}.mp3`
  const authedUrl = audioUrl.replace('https://', `https://${TWILIO_SID}:${TWILIO_TOKEN}@`)

  const audioRes = await fetch(authedUrl)
  if (!audioRes.ok) {
    console.error('Failed to fetch recording:', audioRes.status)
    return { transcript: '', summary: '' }
  }
  const audioBuffer = await audioRes.arrayBuffer()

  const dgRes = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&summarize=v2&detect_language=true', {
    method: 'POST',
    headers: {
      Authorization: `Token ${DEEPGRAM_KEY}`,
      'Content-Type': 'audio/mpeg'
    },
    body: audioBuffer
  })

  if (!dgRes.ok) {
    console.error('Deepgram error:', await dgRes.text())
    return { transcript: '', summary: '' }
  }

  const dgData = await dgRes.json()
  const transcript = dgData.results?.channels?.[0]?.alternatives?.[0]?.transcript || ''
  const summary = dgData.results?.summary?.short || ''

  console.log('Transcript length:', transcript.length)
  console.log('Summary:', summary)

  return { transcript, summary }
}

async function getCallerInfo(callSid) {
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Calls/${callSid}.json`
    const res = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64')
      }
    })
    if (res.ok) {
      const data = await res.json()
      return {
        from: data.from_formatted || data.from,
        callerCity: data.caller_name || '',
        duration: parseInt(data.duration) || 0,
        status: data.status
      }
    }
  } catch (err) {
    console.error('Twilio call lookup error:', err)
  }
  return { from: '', callerCity: '', duration: 0, status: '' }
}

function adminCallEmailHtml(data) {
  const isVoicemail = data.voicemail
  const durationMin = Math.floor((data.call_duration || 0) / 60)
  const durationSec = (data.call_duration || 0) % 60
  const durationStr = data.call_duration ? `${durationMin}:${String(durationSec).padStart(2, '0')}` : 'Unknown'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      .mobile-pad { padding: 24px 16px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:28px 12px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">

          <tr>
            <td bgcolor="#0b1120" style="background:#0b1120;padding:28px 24px;text-align:center;">
              <img src="https://mwgridsolutions.netlify.app/power-equipment-buyers-sms-logo-1200x630.png" alt="MWGridSolutions" width="280" style="max-width:70%;height:auto;display:block;margin:0 auto;" />
            </td>
          </tr>

          <tr>
            <td style="background:${isVoicemail ? '#fef3c7' : '#f0fdfa'};border-bottom:3px solid ${isVoicemail ? '#f59e0b' : '#0ea5a8'};padding:20px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="color:${isVoicemail ? '#d97706' : '#0ea5a8'};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px;">
                      ${isVoicemail ? 'New Voicemail' : 'Incoming Call'}
                    </div>
                    <div style="color:#0f172a;font-size:20px;font-weight:800;line-height:1.2;">${data.caller_phone}</div>
                    <div style="color:#94a3b8;font-size:11px;margin-top:4px;">${getMST()}</div>
                  </td>
                  <td style="text-align:right;vertical-align:top;">
                    <div style="background:${isVoicemail ? '#f59e0b' : '#0ea5a8'};color:#ffffff;font-size:11px;font-weight:800;padding:5px 12px;border-radius:20px;display:inline-block;text-transform:uppercase;">
                      ${durationStr}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="mobile-pad" style="padding:28px 40px;">

              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">
                    <span style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Call Details</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:5px 0;color:#64748b;font-size:12px;width:35%;">Caller</td>
                        <td style="padding:5px 0;text-align:right;">
                          <a href="tel:${data.caller_phone.replace(/\D/g, '')}" style="color:#1a3a6b;font-size:13px;font-family:monospace;font-weight:700;text-decoration:none;">${data.caller_phone}</a>
                        </td>
                      </tr>
                      ${data.caller_city ? `
                      <tr>
                        <td style="padding:5px 0;color:#64748b;font-size:12px;border-top:1px solid #f1f5f9;">Location</td>
                        <td style="padding:5px 0;color:#0f172a;font-size:13px;text-align:right;border-top:1px solid #f1f5f9;">${data.caller_city}</td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding:5px 0;color:#64748b;font-size:12px;border-top:1px solid #f1f5f9;">Duration</td>
                        <td style="padding:5px 0;color:#0f172a;font-size:13px;text-align:right;border-top:1px solid #f1f5f9;">${durationStr}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#64748b;font-size:12px;border-top:1px solid #f1f5f9;">Type</td>
                        <td style="padding:5px 0;text-align:right;border-top:1px solid #f1f5f9;">
                          <span style="background:${isVoicemail ? '#fef3c7' : '#f0fdfa'};color:${isVoicemail ? '#d97706' : '#0ea5a8'};padding:3px 10px;border-radius:5px;font-weight:700;font-size:11px;">${isVoicemail ? 'Voicemail' : 'Answered Call'}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${data.summary ? `
              <p style="margin:0 0 10px 0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">AI Summary</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 18px;background:#f0fdfa;border:1px solid #ccfbf1;border-left:4px solid #0ea5a8;border-radius:4px;">
                    <p style="margin:0;color:#334155;font-size:14px;line-height:1.7;font-weight:600;">${data.summary}</p>
                  </td>
                </tr>
              </table>` : ''}

              ${data.transcript ? `
              <p style="margin:0 0 10px 0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Full Transcript</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 18px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;">
                    <p style="margin:0;color:#475569;font-size:13px;line-height:1.8;white-space:pre-wrap;">${data.transcript}</p>
                  </td>
                </tr>
              </table>` : ''}

              ${data.recording_url ? `
              <p style="margin:0 0 10px 0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Recording</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td>
                    <a href="${data.recording_url}" style="color:#1a3a6b;font-size:13px;font-weight:600;text-decoration:none;">Listen to recording</a>
                  </td>
                </tr>
              </table>` : ''}

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align:center;padding-top:8px;">
                    <a href="tel:${data.caller_phone.replace(/\D/g, '')}"
                       style="display:inline-block;background:#1a3a6b;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:7px;font-weight:800;font-size:13px;margin:4px;">
                      Call Back
                    </a>
                    <a href="sms:${data.caller_phone.replace(/\D/g, '')}?body=Hi, this is MW Grid Solutions following up on your call. "
                       style="display:inline-block;background:#ffffff;color:#1a3a6b;text-decoration:none;padding:13px 28px;border-radius:7px;font-weight:700;font-size:13px;margin:4px;border:1px solid #e2e8f0;">
                      Send Text
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td style="padding:14px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:11px;">MWGridSolutions Call Tracking &middot; ${getMST()}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  try {
    const params = new URLSearchParams(event.body)
    const recordingUrl = params.get('RecordingUrl')
    const recordingSid = params.get('RecordingSid')
    const callSid = params.get('CallSid')
    const recordingStatus = params.get('RecordingStatus')
    const recordingDuration = params.get('RecordingDuration')

    console.log(`Recording callback: ${recordingSid}, status: ${recordingStatus}, duration: ${recordingDuration}s`)

    if (recordingStatus !== 'completed') {
      return { statusCode: 200, body: 'skipped' }
    }

    const callerInfo = await getCallerInfo(callSid)
    const callerPhone = callerInfo.from || params.get('From') || 'Unknown'
    const duration = parseInt(recordingDuration) || callerInfo.duration || 0
    const isVoicemail = callerInfo.status !== 'completed'

    let transcript = ''
    let summary = ''
    if (recordingUrl) {
      const result = await transcribeRecording(recordingUrl)
      transcript = result.transcript
      summary = result.summary
    }

    const { error: dbError } = await supabase.from('call_leads').insert({
      caller_phone: callerPhone,
      caller_city: callerInfo.callerCity || null,
      caller_state: null,
      call_duration: duration,
      call_status: callerInfo.status || 'completed',
      call_sid: callSid,
      recording_url: recordingUrl || null,
      recording_sid: recordingSid || null,
      transcript: transcript || null,
      summary: summary || null,
      voicemail: isVoicemail,
      status: 'new'
    })

    if (dbError) console.error('DB error:', dbError)

    if (RESEND_KEY && ADMIN_EMAIL) {
      const emailData = {
        caller_phone: callerPhone,
        caller_city: callerInfo.callerCity,
        call_duration: duration,
        voicemail: isVoicemail,
        transcript,
        summary,
        recording_url: recordingUrl
      }

      const subject = isVoicemail
        ? `New Voicemail from ${callerPhone}`
        : `Call Completed: ${callerPhone} (${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')})`

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_KEY}`
        },
        body: JSON.stringify({
          from: 'MWGridSolutions <leads@mwgridsolutions.com>',
          to: ADMIN_EMAIL,
          subject,
          html: adminCallEmailHtml(emailData)
        })
      })

      if (!res.ok) console.error('Email error:', await res.text())
      else console.log('Admin notification sent')
    }

    return { statusCode: 200, body: 'OK' }
  } catch (err) {
    console.error('handle-recording error:', err)
    return { statusCode: 500, body: 'Server error' }
  }
}