// src/components/contact/QuoteForm.jsx
import { useState } from 'react'
import {
  Box,
  Container,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Text
} from '@chakra-ui/react'
import toast from 'react-hot-toast'
import PhotoUploader from './PhotoUploader'

const EQUIPMENT_TYPES = [
  'Padmount Transformer',
  'Substation Transformer',
  'Dry Type Transformer',
  'Low Voltage Switchgear',
  'Medium Voltage Switchgear',
  'High Voltage Switchgear',
  'Mixed Lot / Multiple Items',
  'Other'
]

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  equipment_type: '',
  description: ''
}

function QuoteForm() {
  const [form, setForm] = useState(INITIAL)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.equipment_type) {
      toast.error('Please fill in all required fields.')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('email', form.email)
      formData.append('phone', form.phone)
      formData.append('equipment_type', form.equipment_type)
      formData.append('description', form.description)
      photos.forEach((photo) => formData.append('photos', photo))

      const res = await fetch('/.netlify/functions/submit-lead', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Submission failed')

      toast.success('Submission received. We will be in touch shortly.')
      setForm(INITIAL)
      setPhotos([])
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again or call us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box py={{ base: 8, md: 14 }} bg="brand.gray50">
      <Container maxW="680px" px={{ base: 5, md: 8 }}>
        <Box
          bg="white"
          border="1px solid"
          borderColor="brand.gray200"
          borderRadius="2xl"
          p={{ base: 6, md: 10 }}
          boxShadow="0 1px 3px rgba(0, 0, 0, 0.04), 0 6px 24px rgba(0, 0, 0, 0.06)"
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mb={5}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={form.phone}
                onChange={handleChange}
              />
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mb={5}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Equipment Type</FormLabel>
              <Select
                name="equipment_type"
                placeholder="Select type"
                value={form.equipment_type}
                onChange={handleChange}
              >
                {EQUIPMENT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </FormControl>
          </SimpleGrid>

          <FormControl mb={5}>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              placeholder="Brand, model, kVA/voltage ratings, age, condition, quantity, location..."
              rows={4}
              value={form.description}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={8}>
            <FormLabel>Equipment Photos</FormLabel>
            <PhotoUploader photos={photos} setPhotos={setPhotos} />
          </FormControl>

          <Button
            variant="primary"
            size="lg"
            w="full"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Submitting..."
          >
            Submit for Offer
          </Button>

          <Text fontSize="xs" color="brand.gray400" textAlign="center" mt={4}>
            We typically respond within one hour during business hours.
          </Text>
        </Box>
      </Container>
    </Box>
  )
}

export default QuoteForm
