// netlify/functions/handle-call.js
// Twilio webhook: incoming call > forward to client cell, voicemail fallback

const FORWARD_PHONE = process.env.FORWARD_PHONE || '+17138236276'
const SITE_URL = process.env.URL || 'https://mwgridsolutions.netlify.app'

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  try {
    const params = new URLSearchParams(event.body)
    const from = params.get('From')
    const callStatus = params.get('CallStatus')

    console.log(`Incoming call from ${from}, status: ${callStatus}`)

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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/xml' },
      body: twiml
    }
  } catch (err) {
    console.error('handle-call error:', err)

    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Matthew-Neural">You've reached MW Grid Solutions. Please leave your name, number, and what equipment you're looking to sell. We'll get back to you fast.</Say>
  <Record
    maxLength="120"
    recordingStatusCallback="${process.env.URL || 'https://mwgridsolutions.netlify.app'}/.netlify/functions/handle-recording"
    recordingStatusCallbackMethod="POST"
  />
</Response>`

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/xml' },
      body: fallback
    }
  }
}