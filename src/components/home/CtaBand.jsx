// src/components/home/CtaBand.jsx
import { Box, Container, Heading, Text, Button, Flex } from '@chakra-ui/react'
import { HiArrowRight } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

function CtaBand() {
  const navigate = useNavigate()

  return (
    <Box
      py={{ base: 16, md: 20 }}
      bg="brand.accent"
      position="relative"
      overflow="hidden"
    >
      {/* Subtle pattern */}
      <Box
        position="absolute"
        inset={0}
        opacity={0.06}
        backgroundImage="linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)"
        backgroundSize="40px 40px"
        pointerEvents="none"
      />

      <Container maxW="800px" px={{ base: 5, md: 8 }} position="relative" textAlign="center">
        <Heading
          as="h2"
          fontFamily="heading"
          fontSize={{ base: '2xl', md: '36px' }}
          fontWeight="800"
          lineHeight="1.15"
          letterSpacing="-0.025em"
          color="white"
          mb={4}
        >
          Ready to Sell Your Equipment?
        </Heading>
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          color="whiteAlpha.800"
          lineHeight="1.7"
          maxW="500px"
          mx="auto"
          mb={8}
        >
          Get a competitive offer today. No obligation, no hassle.
          We handle everything from evaluation to pickup.
        </Text>
        <Flex gap={3} justify="center" direction={{ base: 'column', sm: 'row' }}>
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
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
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
            Upload Photos
          </Button>
        </Flex>
      </Container>
    </Box>
  )
}

export default CtaBand
