// src/components/layout/Header.jsx
import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Flex,
  Button,
  IconButton,
  VStack,
  HStack,
  Text,
  Image,
  Link as ChakraLink
} from '@chakra-ui/react'
import { HiMenu, HiX } from 'react-icons/hi'

const NAV_ITEMS = [
  { label: 'Equipment', href: '#equipment' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Contact', href: '#contact' }
]

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (href) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={100}
      bg={scrolled ? 'rgba(8, 12, 22, 0.95)' : 'transparent'}
      backdropFilter={scrolled ? 'blur(16px) saturate(1.2)' : 'none'}
      borderBottom="1px solid"
      borderColor={scrolled ? 'brand.border' : 'transparent'}
      transition="all 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <Container maxW="1200px" px={{ base: 5, md: 8 }}>
        <Flex h={{ base: '68px', md: '76px' }} align="center" justify="space-between">

          {/* Logo */}
          <Flex
            align="center"
            cursor="pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            flexShrink={0}
          >
            <Image
              src="/logo-wide-transparent-background.png"
              alt="Power Equipment Buyers"
              h={{ base: '32px', md: '38px' }}
              objectFit="contain"
            />
          </Flex>

          {/* Desktop Nav */}
          <HStack spacing={1} display={{ base: 'none', md: 'flex' }}>
            {NAV_ITEMS.map((item) => (
              <ChakraLink
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                fontSize="sm"
                fontWeight="500"
                color="brand.textSecondary"
                px={4}
                py={2}
                borderRadius="lg"
                _hover={{
                  color: 'brand.text',
                  bg: 'whiteAlpha.50'
                }}
                cursor="pointer"
                transition="all 0.2s"
              >
                {item.label}
              </ChakraLink>
            ))}
            <Button
              variant="primary"
              size="sm"
              ml={3}
              onClick={() => handleNavClick('#contact')}
              fontFamily="heading"
              letterSpacing="-0.01em"
            >
              Get an Offer
            </Button>
          </HStack>

          {/* Mobile Toggle */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            aria-label="Toggle menu"
            icon={mobileOpen ? <HiX size={22} /> : <HiMenu size={22} />}
            variant="ghost"
            color="brand.text"
            onClick={() => setMobileOpen(!mobileOpen)}
            _hover={{ bg: 'whiteAlpha.100' }}
          />
        </Flex>

        {/* Mobile Menu */}
        {mobileOpen && (
          <Box
            display={{ base: 'block', md: 'none' }}
            pb={6}
            borderTop="1px solid"
            borderColor="brand.border"
            mt={-1}
          >
            <VStack spacing={1} align="stretch" pt={4}>
              {NAV_ITEMS.map((item) => (
                <ChakraLink
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  fontSize="md"
                  fontWeight="500"
                  color="brand.textSecondary"
                  _hover={{ color: 'brand.text', bg: 'whiteAlpha.50' }}
                  cursor="pointer"
                  py={3}
                  px={4}
                  borderRadius="lg"
                >
                  {item.label}
                </ChakraLink>
              ))}
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleNavClick('#contact')}
                w="full"
                mt={2}
                fontFamily="heading"
              >
                Get an Offer
              </Button>
            </VStack>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Header
