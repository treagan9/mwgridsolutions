// src/components/layout/Footer.jsx
import {
  Box,
  Container,
  Flex,
  Text,
  HStack,
  VStack,
  SimpleGrid,
  Image,
  Link as ChakraLink,
  Divider,
  Icon
} from '@chakra-ui/react'
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

function Footer() {
  const year = new Date().getFullYear()
  const navigate = useNavigate()

  const handleNav = (href) => {
    if (href.startsWith('#')) {
      navigate('/')
      setTimeout(() => {
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      navigate(href)
    }
  }

  return (
    <Box as="footer" bg="brand.gray950">
      <Container maxW="1200px" px={{ base: 5, md: 8 }} pt={{ base: 12, md: 16 }} pb={8}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 10, md: 8 }} mb={12}>

          {/* Brand column */}
          <VStack align={{ base: 'center', md: 'flex-start' }} spacing={4} gridColumn={{ base: '1', md: 'span 1' }}>
            <Image
              src="/logo-wide-transparent-background.png"
              alt="MWGridSolutions"
              h="52px"
              objectFit="contain"
              filter="brightness(0) invert(1)"
            />
            <Text
              fontSize="sm"
              color="brand.gray400"
              lineHeight="1.7"
              textAlign={{ base: 'center', md: 'left' }}
            >
              Direct buyer of surplus transformers and switchgear. Nationwide service. All major brands, any condition.
            </Text>
          </VStack>

          {/* Navigation column */}
          <VStack align={{ base: 'center', md: 'flex-start' }} spacing={3}>
            <Text
              fontSize="11px"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.1em"
              color="brand.tealLight"
              mb={1}
            >
              Company
            </Text>
            {[
              { label: 'Equipment We Buy', href: '#equipment' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Why Sell to Us', href: '#why-us' },
              { label: 'Request an Offer', href: '/contact/' }
            ].map((link) => (
              <ChakraLink
                key={link.href}
                onClick={() => handleNav(link.href)}
                fontSize="sm"
                color="brand.gray400"
                _hover={{ color: 'white' }}
                cursor="pointer"
                transition="color 0.15s"
              >
                {link.label}
              </ChakraLink>
            ))}
          </VStack>

          {/* Equipment column */}
          <VStack align={{ base: 'center', md: 'flex-start' }} spacing={3}>
            <Text
              fontSize="11px"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.1em"
              color="brand.tealLight"
              mb={1}
            >
              Equipment
            </Text>
            {[
              'Padmount Transformers',
              'Substation Transformers',
              'Dry Type Transformers',
              'Low Voltage Switchgear',
              'Medium Voltage Switchgear',
              'High Voltage Switchgear'
            ].map((item) => (
              <Text key={item} fontSize="sm" color="brand.gray500">
                {item}
              </Text>
            ))}
          </VStack>

          {/* Contact column */}
          <VStack align={{ base: 'center', md: 'flex-start' }} spacing={3}>
            <Text
              fontSize="11px"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.1em"
              color="brand.tealLight"
              mb={1}
            >
              Contact
            </Text>
            <ChakraLink
              href="mailto:info@mwgridsolutions.com"
              fontSize="sm"
              color="brand.gray400"
              _hover={{ color: 'white' }}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Icon as={HiOutlineMail} boxSize={4} />
              info@mwgridsolutions.com
            </ChakraLink>
          </VStack>

        </SimpleGrid>

        <Divider borderColor="brand.darkBorder" mb={6} />

        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={3}
        >
          <Text fontSize="xs" color="brand.gray500">
            {year} MWGridSolutions. All rights reserved.
          </Text>
          <HStack spacing={5}>
            <ChakraLink fontSize="xs" color="brand.gray500" _hover={{ color: 'brand.gray300' }} href="#">
              Privacy Policy
            </ChakraLink>
            <ChakraLink fontSize="xs" color="brand.gray500" _hover={{ color: 'brand.gray300' }} href="#">
              Terms of Service
            </ChakraLink>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Footer
