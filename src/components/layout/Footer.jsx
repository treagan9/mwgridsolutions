// src/components/layout/Footer.jsx
import {
  Box,
  Container,
  Flex,
  Text,
  HStack,
  VStack,
  Image,
  Link as ChakraLink,
  Divider
} from '@chakra-ui/react'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <Box as="footer" bg="brand.surface" borderTop="1px solid" borderColor="brand.border">
      <Container maxW="1200px" px={{ base: 5, md: 8 }} py={12}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'center', md: 'flex-start' }}
          gap={10}
        >
          <VStack align={{ base: 'center', md: 'flex-start' }} spacing={4}>
            <Image
              src="/logo-wide-transparent-background.png"
              alt="Power Equipment Buyers"
              h="34px"
              objectFit="contain"
            />
            <Text
              fontSize="sm"
              color="brand.textSecondary"
              maxW="340px"
              textAlign={{ base: 'center', md: 'left' }}
              lineHeight="1.7"
            >
              Direct buyer of surplus transformers and switchgear.
              Nationwide service. Fast offers. All major brands.
            </Text>
          </VStack>

          <VStack align={{ base: 'center', md: 'flex-end' }} spacing={3}>
            <Text
              fontSize="xs"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.12em"
              color="brand.accent"
            >
              Contact
            </Text>
            <ChakraLink
              href="mailto:info@powerequipmentbuyers.com"
              fontSize="sm"
              color="brand.textSecondary"
              _hover={{ color: 'brand.accent' }}
            >
              info@powerequipmentbuyers.com
            </ChakraLink>
          </VStack>
        </Flex>

        <Divider borderColor="brand.border" my={8} />

        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={4}
        >
          <Text fontSize="xs" color="brand.textDim">
            {year} Power Equipment Buyers. All rights reserved.
          </Text>
          <HStack spacing={6}>
            <ChakraLink
              fontSize="xs"
              color="brand.textDim"
              _hover={{ color: 'brand.textSecondary' }}
              href="#"
            >
              Privacy Policy
            </ChakraLink>
            <ChakraLink
              fontSize="xs"
              color="brand.textDim"
              _hover={{ color: 'brand.textSecondary' }}
              href="#"
            >
              Terms of Service
            </ChakraLink>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Footer
