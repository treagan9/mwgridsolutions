// src/components/home/WhySellToUs.jsx
import { Box, SimpleGrid, Text, Heading, Icon } from '@chakra-ui/react'
import {
  HiOutlineCurrencyDollar,
  HiOutlineTruck,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineBadgeCheck,
  HiOutlinePhone
} from 'react-icons/hi'
import Section from '../layout/Section'
import SectionHeading from '../layout/SectionHeading'

function TrustItem({ icon, title, description }) {
  return (
    <Box textAlign="center" px={{ base: 2, md: 4 }}>
      <Icon
        as={icon}
        boxSize={8}
        color="brand.teal"
        mb={4}
        strokeWidth={1.5}
      />
      <Heading
        as="h3"
        fontFamily="heading"
        fontSize="md"
        fontWeight="700"
        color="brand.gray900"
        mb={2}
      >
        {title}
      </Heading>
      <Text
        fontSize="sm"
        color="brand.gray500"
        lineHeight="1.7"
        maxW="260px"
        mx="auto"
      >
        {description}
      </Text>
    </Box>
  )
}

const ADVANTAGES = [
  {
    icon: HiOutlineCurrencyDollar,
    title: 'Competitive Offers',
    description: 'We price based on real market value, not lowball estimates. Fair and transparent on every piece.'
  },
  {
    icon: HiOutlineTruck,
    title: 'We Handle Freight',
    description: 'Our carrier network picks up from your site. No coordinating trucks or paying for shipping.'
  },
  {
    icon: HiOutlineClock,
    title: 'One Hour Response',
    description: 'Send us details and photos. We come back with an offer fast, typically within an hour.'
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Guaranteed Payment',
    description: 'Accept the offer and get paid. Wire transfer or check, no waiting around for invoices to clear.'
  },
  {
    icon: HiOutlineBadgeCheck,
    title: 'Any Brand, Any Condition',
    description: 'New, used, working, or not. We buy all major manufacturers regardless of age or condition.'
  },
  {
    icon: HiOutlinePhone,
    title: 'Talk to the Buyer',
    description: 'No sales reps, no call centers. You deal directly with the person making the purchasing decision.'
  }
]

function WhySellToUs() {
  return (
    <Section id="why-us" variant="subtle">
      <SectionHeading
        label="The Advantage"
        title="Why Sell to Us"
        subtitle="We are a direct buyer, not a broker. That means faster decisions, better offers, and zero hassle."
      />
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 10, md: 12 }}>
        {ADVANTAGES.map((item) => (
          <TrustItem key={item.title} {...item} />
        ))}
      </SimpleGrid>
    </Section>
  )
}

export default WhySellToUs
