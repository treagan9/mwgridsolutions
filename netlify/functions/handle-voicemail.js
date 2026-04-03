// netlify/functions/handle-voicemail.js
// Twilio action URL: triggered when Dial ends (no answer / busy / failed)

const SITE_URL = process.env.URL || 'https://powerequipmentbuyers.netlify.app'

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const formData = await req.formData()
    const dialStatus = formData.get('DialCallStatus')

    console.log(`Dial ended with status: ${dialStatus}`)

    if (dialStatus === 'completed') {
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Hangup/>
</Response>`
      return new Response(twiml, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' }
      })
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

    return new Response(twiml, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' }
    })
  } catch (err) {
    console.error('handle-voicemail error:', err)
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<Response><Hangup/></Response>`
    return new Response(fallback, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' }
    })
  }
}

export const config = {
  path: '/.netlify/functions/handle-voicemail'
}
