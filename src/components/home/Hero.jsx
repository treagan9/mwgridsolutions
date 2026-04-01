// src/components/home/Hero.jsx
import { Box, Container, Heading, Text, Button, Flex, HStack, Icon } from '@chakra-ui/react'
import { HiArrowRight, HiShieldCheck, HiClock, HiGlobe } from 'react-icons/hi'

function Hero() {
  const handleClick = () => {
    const el = document.querySelector('#contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Box
      position="relative"
      overflow="hidden"
      pt={{ base: 32, md: 44 }}
      pb={{ base: 20, md: 32 }}
      bg="brand.heroGradient"
    >
      {/* Glow orbs */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="50vw"
        h="50vw"
        maxW="700px"
        maxH="700px"
        bg="radial-gradient(circle, rgba(59, 130, 246, 0.07) 0%, transparent 65%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-15%"
        left="-5%"
        w="40vw"
        h="40vw"
        maxW="500px"
        maxH="500px"
        bg="radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 65%)"
        pointerEvents="none"
      />

      {/* Grid texture overlay */}
      <Box
        position="absolute"
        inset={0}
        opacity={0.03}
        backgroundImage="linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)"
        backgroundSize="60px 60px"
        pointerEvents="none"
      />

      <Container maxW="1200px" px={{ base: 5, md: 8 }} position="relative">
        <Box maxW="820px">
          <Text
            fontSize="xs"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.14em"
            color="brand.accent"
            mb={6}
          >
            Direct Buyer of Power Equipment
          </Text>

          <Heading
            as="h2"
            fontFamily="heading"
            fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
            fontWeight="800"
            lineHeight="1.06"
            letterSpacing="-0.03em"
            mb={7}
          >
            Sell Your Transformers
            <Box as="br" display={{ base: 'none', md: 'block' }} />
            <Box as="span" color="brand.accent"> and Switchgear</Box>
          </Heading>

          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="brand.textSecondary"
            lineHeight="1.7"
            maxW="580px"
            mb={10}
          >
            Fast evaluation. Competitive offers. We handle pickup and payment.
            All brands, new or used, anywhere in the US.
          </Text>

          <Flex gap={4} mb={14} direction={{ base: 'column', sm: 'row' }}>
            <Button
              variant="primary"
              size="lg"
              rightIcon={<HiArrowRight />}
              onClick={handleClick}
              px={8}
              fontFamily="heading"
              fontWeight="700"
              letterSpacing="-0.01em"
            >
              Get Your Offer
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleClick}
              px={8}
            >
              Upload Equipment Photos
            </Button>
          </Flex>

          <HStack
            spacing={{ base: 4, md: 8 }}
            flexWrap="wrap"
            fontSize="sm"
          >
            <HStack color="brand.textMuted">
              <Icon as={HiClock} color="brand.accent" boxSize={4} />
              <Text>Offers in under 1 hour</Text>
            </HStack>
            <HStack color="brand.textMuted">
              <Icon as={HiGlobe} color="brand.accent" boxSize={4} />
              <Text>Nationwide pickup</Text>
            </HStack>
            <HStack color="brand.textMuted">
              <Icon as={HiShieldCheck} color="brand.accent" boxSize={4} />
              <Text>Fast, guaranteed payment</Text>
            </HStack>
          </HStack>
        </Box>
      </Container>
    </Box>
  )
}

export default Hero
