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
  Image,
  Link as ChakraLink
} from '@chakra-ui/react'
import { HiMenu, HiX } from 'react-icons/hi'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Equipment', href: '#equipment', homeOnly: true },
  { label: 'How It Works', href: '#how-it-works', homeOnly: true },
  { label: 'Why Us', href: '#why-us', homeOnly: true },
  { label: 'Contact', href: '/contact/', isRoute: true }
]

// Pages that have a dark hero image background
const DARK_HERO_PAGES = ['/', '/contact/']

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const hasDarkHero = DARK_HERO_PAGES.includes(location.pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (item) => {
    setMobileOpen(false)
    if (item.isRoute) {
      navigate(item.href)
      return
    }
    if (!isHome) {
      navigate('/')
      setTimeout(() => {
        const el = document.querySelector(item.href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return
    }
    const el = document.querySelector(item.href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.homeOnly && !isHome) return false
    return true
  })

  const isTransparent = hasDarkHero && !scrolled && !mobileOpen

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={100}
      bg={isTransparent ? 'transparent' : 'rgba(255, 255, 255, 0.96)'}
      backdropFilter={!isTransparent ? 'blur(12px)' : 'none'}
      borderBottom="1px solid"
      borderColor={isTransparent ? 'transparent' : 'brand.gray200'}
      transition="all 0.3s"
    >
      <Container maxW="1200px" px={{ base: 5, md: 8 }}>
        <Flex h={{ base: '64px', md: '72px' }} align="center" justify="space-between">

          <Flex
            align="center"
            cursor="pointer"
            onClick={() => navigate('/')}
            flexShrink={0}
          >
            <Image
              src="/logo-wide-transparent-background.png"
              alt="Power Equipment Buyers"
              h={{ base: '30px', md: '36px' }}
              objectFit="contain"
              filter={isTransparent ? 'brightness(0) invert(1)' : 'none'}
              transition="filter 0.3s"
            />
          </Flex>

          <HStack spacing={1} display={{ base: 'none', md: 'flex' }}>
            {visibleItems.map((item) => (
              <ChakraLink
                key={item.href}
                onClick={() => handleNavClick(item)}
                fontSize="sm"
                fontWeight="500"
                color={isTransparent ? 'whiteAlpha.800' : 'brand.gray600'}
                px={3.5}
                py={2}
                borderRadius="lg"
                _hover={{
                  color: isTransparent ? 'white' : 'brand.gray900',
                  bg: isTransparent ? 'whiteAlpha.100' : 'brand.gray50'
                }}
                cursor="pointer"
                transition="all 0.15s"
              >
                {item.label}
              </ChakraLink>
            ))}
            <Button
              variant={isTransparent ? 'unstyled' : 'primary'}
              size="sm"
              ml={2}
              onClick={() => navigate('/contact/')}
              px={5}
              {...(isTransparent && {
                bg: 'whiteAlpha.200',
                color: 'white',
                border: '1px solid',
                borderColor: 'whiteAlpha.300',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'heading',
                fontWeight: '600',
                fontSize: 'sm',
                h: '32px',
                _hover: {
                  bg: 'whiteAlpha.300'
                }
              })}
            >
              Get an Offer
            </Button>
          </HStack>

          <IconButton
            display={{ base: 'flex', md: 'none' }}
            aria-label="Toggle menu"
            icon={mobileOpen ? <HiX size={20} /> : <HiMenu size={20} />}
            variant="ghost"
            color={isTransparent ? 'white' : 'brand.gray700'}
            onClick={() => setMobileOpen(!mobileOpen)}
            _hover={{ bg: isTransparent ? 'whiteAlpha.100' : 'brand.gray50' }}
          />
        </Flex>

        {mobileOpen && (
          <Box
            display={{ base: 'block', md: 'none' }}
            pb={5}
            borderTop="1px solid"
            borderColor="brand.gray100"
          >
            <VStack spacing={1} align="stretch" pt={3}>
              {visibleItems.map((item) => (
                <ChakraLink
                  key={item.href}
                  onClick={() => handleNavClick(item)}
                  fontSize="md"
                  fontWeight="500"
                  color="brand.gray600"
                  _hover={{ color: 'brand.gray900', bg: 'brand.gray50' }}
                  cursor="pointer"
                  py={2.5}
                  px={4}
                  borderRadius="lg"
                >
                  {item.label}
                </ChakraLink>
              ))}
              <Button
                variant="primary"
                size="md"
                onClick={() => { setMobileOpen(false); navigate('/contact/') }}
                w="full"
                mt={2}
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
