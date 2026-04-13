// netlify/functions/handle-voicemail.js
// Twilio action URL: triggered when Dial ends (no answer / busy / failed)

const SITE_URL = process.env.URL || 'https://mwgridsolutions.netlify.app'

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  try {
    const params = new URLSearchParams(event.body)
    const dialStatus = params.get('DialCallStatus')

    console.log(`Dial ended with status: ${dialStatus}`)

    if (dialStatus === 'completed') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/xml' },
        body: `<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`
      }
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Matthew-Neural">You've reached MW Grid Solutions. Leave your name, number, and what equipment you're looking to sell. We'll get back to you fast.</Say>
  <Record
    maxLength="120"
    playBeep="true"
    recordingStatusCallback="${SITE_URL}/.netlify/functions/handle-recording"
    recordingStatusCallbackMethod="POST"
  />
  <Say voice="Polly.Matthew-Neural">No message received. Visit mwgridsolutions.com to submit your equipment details online.</Say>
</Response>`

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/xml' },
      body: twiml
    }
  } catch (err) {
    console.error('handle-voicemail error:', err)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/xml' },
      body: `<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`
    }
  }
}