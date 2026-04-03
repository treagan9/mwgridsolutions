// src/pages/Contact.jsx
import { useEffect } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ContactHero from '../components/contact/ContactHero'
import QuoteForm from '../components/contact/QuoteForm'

function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Header />
      <main>
        <ContactHero />
        <QuoteForm />
      </main>
      <Footer />
    </>
  )
}

export default Contact
