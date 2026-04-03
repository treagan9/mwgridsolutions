// src/components/home/EquipmentGrid.jsx
import { Box, SimpleGrid, Text, Button, Flex, Heading, Icon } from '@chakra-ui/react'
import { HiLightningBolt, HiCube, HiChip, HiServer, HiViewGrid, HiDatabase } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import Section from '../layout/Section'
import SectionHeading from '../layout/SectionHeading'

function EquipmentCard({ icon, title, description, tags }) {
  return (
    <Box
      bg="brand.darkSurface"
      border="1px solid"
      borderColor="brand.darkBorder"
      borderRadius="xl"
      p={{ base: 5, md: 6 }}
      transition="all 0.2s"
      _hover={{
        borderColor: 'brand.accentLight',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
      }}
    >
      <Flex
        w={10}
        h={10}
        bg="rgba(14, 165, 168, 0.1)"
        borderRadius="lg"
        align="center"
        justify="center"
        mb={4}
      >
        <Icon as={icon} boxSize={5} color="brand.tealLight" />
      </Flex>
      <Heading
        as="h3"
        fontFamily="heading"
        fontSize="md"
        fontWeight="700"
        color="white"
        mb={2}
      >
        {title}
      </Heading>
      <Text fontSize="sm" color="brand.gray400" lineHeight="1.7" mb={4}>
        {description}
      </Text>
      <Flex gap={2} flexWrap="wrap">
        {tags.map((tag) => (
          <Box
            key={tag}
            bg="rgba(255, 255, 255, 0.05)"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.08)"
            borderRadius="md"
            px={2.5}
            py={1}
          >
            <Text fontSize="xs" color="brand.gray400" fontWeight="500">
              {tag}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  )
}

const TRANSFORMERS = [
  {
    icon: HiCube,
    title: 'Padmount Transformers',
    description: 'Single and three phase, any kVA rating. The green boxes you see in every commercial lot and residential subdivision. We buy them all.',
    tags: ['Single Phase', 'Three Phase', 'All kVA', 'New or Used']
  },
  {
    icon: HiDatabase,
    title: 'Substation Transformers',
    description: 'Power transformers from utility substations and industrial facilities. Oil-filled units of any voltage class. We will come inspect high-value pieces on site.',
    tags: ['Power Class', 'Oil-Filled', 'All Voltages', 'Any Condition']
  },
  {
    icon: HiChip,
    title: 'Dry Type Transformers',
    description: 'Low and medium voltage dry types including cast coil and VPI encapsulated units. Common in commercial buildings and data centers.',
    tags: ['Low Voltage', 'Medium Voltage', 'Cast Coil', 'VPI/VPE']
  }
]

const SWITCHGEAR = [
  {
    icon: HiLightningBolt,
    title: 'Low Voltage Switchgear',
    description: 'Circuit breakers, motor control centers, and complete lineups under 1kV. All manufacturers, any vintage, working or not.',
    tags: ['Breakers', 'MCCs', 'All Manufacturers', 'Under 1kV']
  },
  {
    icon: HiServer,
    title: 'Medium Voltage Switchgear',
    description: 'Metal-clad, metal-enclosed, and pad-mounted switchgear from 5kV to 38kV. Vacuum and SF6 interrupters from any manufacturer.',
    tags: ['Metal-Clad', 'Metal-Enclosed', '5kV to 38kV', 'Pad-Mounted']
  },
  {
    icon: HiViewGrid,
    title: 'High Voltage Switchgear',
    description: 'Transmission class equipment, SF6 breakers, and complete substation packages. If you are decommissioning a facility, we want to talk.',
    tags: ['Transmission Class', 'SF6', 'Vacuum', 'Complete Substations']
  }
]

function EquipmentGrid() {
  const navigate = useNavigate()

  return (
    <Section id="equipment" variant="dark">
      <SectionHeading
        label="What We Buy"
        title="Every Type of Power Equipment"
        subtitle="All major brands, any age, any condition. Whether it is a single unit or an entire facility decommission, we make an offer."
        dark
      />

      <Text
        fontSize="11px"
        fontWeight="700"
        textTransform="uppercase"
        letterSpacing="0.1em"
        color="brand.gray500"
        mb={4}
      >
        Transformers
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={10}>
        {TRANSFORMERS.map((item) => (
          <EquipmentCard key={item.title} {...item} />
        ))}
      </SimpleGrid>

      <Text
        fontSize="11px"
        fontWeight="700"
        textTransform="uppercase"
        letterSpacing="0.1em"
        color="brand.gray500"
        mb={4}
      >
        Switchgear
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={10}>
        {SWITCHGEAR.map((item) => (
          <EquipmentCard key={item.title} {...item} />
        ))}
      </SimpleGrid>

      <Box
        bg="rgba(255, 255, 255, 0.03)"
        border="1px solid"
        borderColor="brand.darkBorder"
        borderRadius="xl"
        p={{ base: 6, md: 8 }}
        textAlign="center"
      >
        <Text fontSize="md" fontWeight="600" color="white" mb={2}>
          Not sure if we buy it?
        </Text>
        <Text fontSize="sm" color="brand.gray400" mb={6} maxW="480px" mx="auto">
          We also purchase breakers, control panels, disconnects, and other electrical distribution equipment. If it carries power, reach out.
        </Text>
        <Button
          bg="white"
          color="brand.accent"
          size="lg"
          onClick={() => navigate('/contact/')}
          px={8}
          fontFamily="heading"
          fontWeight="700"
          _hover={{
            bg: 'brand.gray100',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
          }}
          _active={{ transform: 'translateY(0)' }}
          transition="all 0.2s"
        >
          Request an Offer
        </Button>
      </Box>
    </Section>
  )
}

export default EquipmentGrid
