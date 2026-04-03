// netlify/functions/handle-call.js
// Twilio webhook: incoming call > forward to client cell, record, voicemail fallback

const FORWARD_PHONE = process.env.FORWARD_PHONE || '+17138236276'
const SITE_URL = process.env.URL || 'https://powerequipmentbuyers.netlify.app'

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const formData = await req.formData()
    const callStatus = formData.get('CallStatus')
    const from = formData.get('From')

    console.log(`Incoming call from ${from}, status: ${callStatus}`)

    // TwiML: ring client cell for 25 seconds with recording
    // If no answer, play voicemail greeting and record message
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial
    timeout="25"
    record="record-from-answer-dual"
    recordingStatusCallback="${SITE_URL}/.netlify/functions/handle-recording"
    recordingStatusCallbackMethod="POST"
    action="${SITE_URL}/.netlify/functions/handle-voicemail"
    method="POST"
  >
    <Number>${FORWARD_PHONE}</Number>
  </Dial>
</Response>`

    return new Response(twiml, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' }
    })
  } catch (err) {
    console.error('handle-call error:', err)
    // Fallback TwiML so the caller does not get dead air
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Matthew-Neural">You've reached MW Grid Solutions. Leave your name, number, and what equipment you're looking to sell. We'll get back to you fast.</Say>
  <Record
    maxLength="120"
    recordingStatusCallback="${process.env.URL || 'https://powerequipmentbuyers.netlify.app'}/.netlify/functions/handle-recording"
    recordingStatusCallbackMethod="POST"
  />
</Response>`
    return new Response(fallback, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' }
    })
  }
}

export const config = {
  path: '/.netlify/functions/handle-call'
}
