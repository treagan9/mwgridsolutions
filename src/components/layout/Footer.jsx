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
    <Box as="footer" bg="brand.gray950" borderTop="1px solid" borderColor="brand.darkBorder">
      <Container maxW="1200px" px={{ base: 5, md: 8 }} py={10}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'center', md: 'flex-start' }}
          gap={8}
        >
          <VStack align={{ base: 'center', md: 'flex-start' }} spacing={3}>
            <Image
              src="/logo-wide-transparent-background.png"
              alt="Power Equipment Buyers"
              h="30px"
              objectFit="contain"
              filter="brightness(0) invert(1)"
            />
            <Text
              fontSize="sm"
              color="brand.gray400"
              maxW="320px"
              textAlign={{ base: 'center', md: 'left' }}
              lineHeight="1.7"
            >
              Direct buyer of surplus transformers and switchgear.
              Nationwide service. Fast offers. All major brands.
            </Text>
          </VStack>

          <VStack align={{ base: 'center', md: 'flex-end' }} spacing={2}>
            <Text
              fontSize="11px"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.1em"
              color="brand.accentLight"
            >
              Contact
            </Text>
            <ChakraLink
              href="mailto:info@powerequipmentbuyers.com"
              fontSize="sm"
              color="brand.gray400"
              _hover={{ color: 'white' }}
            >
              info@powerequipmentbuyers.com
            </ChakraLink>
          </VStack>
        </Flex>

        <Divider borderColor="brand.darkBorder" my={6} />

        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={3}
        >
          <Text fontSize="xs" color="brand.gray500">
            {year} Power Equipment Buyers. All rights reserved.
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
