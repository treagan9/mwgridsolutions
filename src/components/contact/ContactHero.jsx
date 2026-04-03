// src/components/contact/ContactHero.jsx
import { Box, Container, Heading, Text, HStack, Icon, Link as ChakraLink } from '@chakra-ui/react'
import { HiClock, HiPhone, HiPhotograph } from 'react-icons/hi'

function ContactHero() {
  return (
    <Box
      position="relative"
      overflow="hidden"
      pt={{ base: 28, md: 36 }}
      pb={{ base: 12, md: 16 }}
    >
      <Box
        position="absolute"
        inset={0}
        backgroundImage="url('/hero-substation.png')"
        backgroundSize="cover"
        backgroundPosition="center top"
        backgroundRepeat="no-repeat"
      />

      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(180deg, rgba(8, 12, 22, 0.88) 0%, rgba(8, 12, 22, 0.92) 100%)"
      />

      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h="80px"
        bg="linear-gradient(to bottom, transparent, brand.gray50)"
        pointerEvents="none"
      />

      <Container maxW="680px" px={{ base: 5, md: 8 }} position="relative" textAlign="center">
        <Text
          fontSize="11px"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="0.1em"
          color="brand.tealLight"
          mb={4}
        >
          Get Your Offer
        </Text>

        <Heading
          as="h1"
          fontFamily="heading"
          fontSize={{ base: '2xl', md: '40px' }}
          fontWeight="800"
          lineHeight="1.12"
          letterSpacing="-0.025em"
          color="white"
          mb={4}
        >
          Tell Us About Your Equipment
        </Heading>

        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          color="whiteAlpha.700"
          lineHeight="1.7"
          maxW="480px"
          mx="auto"
          mb={5}
        >
          Fill out the form below or give us a call. We typically respond
          with an offer within one hour during business hours.
        </Text>

        <ChakraLink
          href="tel:+18668618383"
          display="inline-flex"
          alignItems="center"
          gap={2}
          bg="whiteAlpha.100"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="full"
          px={5}
          py={2}
          mb={8}
          _hover={{ bg: 'whiteAlpha.200' }}
          transition="all 0.15s"
        >
          <Icon as={HiPhone} color="brand.tealLight" boxSize={4} />
          <Text fontSize="sm" fontWeight="700" color="white" fontFamily="mono" letterSpacing="0.02em">
            (866) 861-8383
          </Text>
        </ChakraLink>

        <HStack
          spacing={{ base: 4, md: 7 }}
          justify="center"
          flexWrap="wrap"
          fontSize="sm"
          color="whiteAlpha.600"
        >
          <HStack>
            <Icon as={HiClock} color="brand.tealLight" boxSize={4} />
            <Text>1 hour response</Text>
          </HStack>
          <HStack>
            <Icon as={HiPhone} color="brand.tealLight" boxSize={4} />
            <Text>Direct to buyer</Text>
          </HStack>
          <HStack>
            <Icon as={HiPhotograph} color="brand.tealLight" boxSize={4} />
            <Text>Photo upload</Text>
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}

export default ContactHero
