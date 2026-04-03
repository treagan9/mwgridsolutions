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
  Text,
  Heading,
  Divider,
  HStack,
  Icon
} from '@chakra-ui/react'
import { HiOutlineShieldCheck } from 'react-icons/hi'
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
      <Container maxW="720px" px={{ base: 5, md: 8 }}>
        <Box
          bg="white"
          border="1px solid"
          borderColor="brand.gray200"
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 30px rgba(0, 0, 0, 0.06)"
        >
          {/* Form header */}
          <Box px={{ base: 6, md: 10 }} pt={{ base: 6, md: 8 }} pb={0}>
            <Heading
              fontFamily="heading"
              fontSize="lg"
              fontWeight="700"
              color="brand.gray900"
              mb={1}
            >
              Equipment Details
            </Heading>
            <Text fontSize="sm" color="brand.gray500">
              The more detail you share, the faster we can get you an offer.
            </Text>
          </Box>

          <Divider borderColor="brand.gray100" my={5} />

          {/* Contact info section */}
          <Box px={{ base: 6, md: 10 }}>
            <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="brand.teal" mb={4}>
              Your Information
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  placeholder="Full name"
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
          </Box>

          <Divider borderColor="brand.gray100" />

          {/* Equipment details section */}
          <Box px={{ base: 6, md: 10 }} py={6}>
            <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="brand.teal" mb={4}>
              Equipment Information
            </Text>
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

            <FormControl>
              <FormLabel>Photos</FormLabel>
              <PhotoUploader photos={photos} setPhotos={setPhotos} />
              <Text fontSize="xs" color="brand.gray400" mt={2}>
                Nameplate, overall condition, and any damage or details
              </Text>
            </FormControl>
          </Box>

          <Divider borderColor="brand.gray100" />

          {/* Submit section */}
          <Box px={{ base: 6, md: 10 }} py={{ base: 5, md: 6 }} bg="brand.gray50">
            <Button
              variant="primary"
              size="lg"
              w="full"
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Submitting..."
              mb={3}
            >
              Submit for Offer
            </Button>
            <HStack justify="center" spacing={1.5}>
              <Icon as={HiOutlineShieldCheck} boxSize={3.5} color="brand.gray400" />
              <Text fontSize="xs" color="brand.gray400">
                We typically respond within one hour during business hours
              </Text>
            </HStack>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default QuoteForm
