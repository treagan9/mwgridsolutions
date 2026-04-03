// src/components/home/Hero.jsx
import { Box, Container, Heading, Text, Button, Flex, HStack, Icon } from '@chakra-ui/react'
import { HiGlobe } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

function Hero() {
  const navigate = useNavigate()

  return (
    <Box
      position="relative"
      overflow="hidden"
      pt={{ base: 32, md: 44 }}
      pb={{ base: 20, md: 32 }}
      minH={{ base: 'auto', md: '85vh' }}
      display="flex"
      alignItems="center"
    >
      <Box
        position="absolute"
        inset={0}
        backgroundImage="url('/hero-substation.png')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
      />

      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(135deg, rgba(8, 12, 22, 0.92) 0%, rgba(8, 12, 22, 0.75) 50%, rgba(8, 12, 22, 0.6) 100%)"
      />

      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h="120px"
        bg="linear-gradient(to bottom, transparent, rgba(8, 12, 22, 0.95))"
        pointerEvents="none"
      />

      <Container maxW="1200px" px={{ base: 5, md: 8 }} position="relative">
        <Box maxW="680px">

          <HStack
            spacing={2}
            bg="whiteAlpha.100"
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="full"
            px={3.5}
            py={1}
            mb={7}
            w="fit-content"
            backdropFilter="blur(8px)"
          >
            <Icon as={HiGlobe} boxSize={3.5} color="brand.tealLight" />
            <Text fontSize="11px" fontWeight="600" color="whiteAlpha.900" letterSpacing="0.01em">
              Serving all 50 states
            </Text>
          </HStack>

          <Text
            fontSize="11px"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.1em"
            color="brand.tealLight"
            mb={4}
          >
            Direct Buyer of Power Equipment
          </Text>

          <Heading
            as="h2"
            fontFamily="heading"
            fontSize={{ base: '32px', md: '48px', lg: '56px' }}
            fontWeight="800"
            lineHeight="1.08"
            letterSpacing="-0.035em"
            color="white"
            mb={6}
          >
            Sell Your Transformers{' '}
            <Box as="br" display={{ base: 'none', lg: 'block' }} />
            and Switchgear
          </Heading>

          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color="whiteAlpha.800"
            lineHeight="1.75"
            maxW="540px"
            mb={9}
          >
            We buy all types of electrical equipment. Fast evaluation.
            Competitive offers. We handle pickup and payment nationwide.
            All brands, any condition.
          </Text>

          <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
            <Button
              bg="white"
              color="brand.accent"
              size="lg"
              onClick={() => navigate('/contact/')}
              px={7}
              fontFamily="heading"
              fontWeight="700"
              _hover={{
                bg: 'brand.gray100',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
              }}
              _active={{ transform: 'translateY(0)' }}
              transition="all 0.2s"
            >
              Request an Offer
            </Button>
            <Button
              variant="unstyled"
              size="lg"
              color="white"
              border="1.5px solid"
              borderColor="whiteAlpha.400"
              px={7}
              fontFamily="heading"
              fontWeight="600"
              display="flex"
              alignItems="center"
              onClick={() => navigate('/contact/')}
              _hover={{
                bg: 'whiteAlpha.100',
                borderColor: 'whiteAlpha.600'
              }}
              transition="all 0.2s"
            >
              Upload Equipment Photos
            </Button>
          </Flex>
        </Box>
      </Container>
    </Box>
  )
}

export default Hero
