// src/components/home/HowItWorks.jsx
import { Box, SimpleGrid, Button, Flex } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import Section from '../layout/Section'
import SectionHeading from '../ui/SectionHeading'
import StepCard from '../ui/StepCard'

const STEPS = [
  {
    number: '1',
    title: 'Tell Us What You Have',
    description: 'Fill out our form or give us a call. Share the basics: brand, model, kVA or voltage rating, age, and condition. Upload photos of the nameplate and overall unit to help us move faster.'
  },
  {
    number: '2',
    title: 'Get a Competitive Offer',
    description: 'We evaluate your equipment and come back with an offer, typically within an hour. For larger lots or high-value pieces, we will send someone to your facility to inspect in person.'
  },
  {
    number: '3',
    title: 'We Pick Up and Pay',
    description: 'Once you accept, we handle everything. We coordinate freight with our carrier network, load the equipment at your site, and guarantee fast payment by wire transfer or check.'
  }
]

function HowItWorks() {
  const navigate = useNavigate()

  return (
    <Section id="how-it-works" variant="subtle">
      <SectionHeading
        label="How Selling Works"
        title="From Contact to Payment in Days"
        subtitle="No brokers, no back and forth. You talk directly to our buyer and we handle the rest."
      />

      <Box position="relative">
        <Box
          display={{ base: 'none', md: 'block' }}
          position="absolute"
          top="32px"
          left="calc(16.66% + 32px)"
          right="calc(16.66% + 32px)"
          h="2px"
          bg="brand.gray200"
          zIndex={0}
        />
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} position="relative" zIndex={1}>
          {STEPS.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </SimpleGrid>
      </Box>

      <Flex justify="center" mt={12}>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/contact/')}
          px={8}
        >
          Request an Offer
        </Button>
      </Flex>
    </Section>
  )
}

export default HowItWorks
