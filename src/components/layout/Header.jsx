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
  Link as ChakraLink,
  Text
} from '@chakra-ui/react'
import { HiMenu, HiX, HiPhone } from 'react-icons/hi'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Equipment', href: '#equipment', homeOnly: true },
  { label: 'How It Works', href: '#how-it-works', homeOnly: true },
  { label: 'Why Us', href: '#why-us', homeOnly: true },
  { label: 'Contact', href: '/contact/', isRoute: true }
]

const DARK_HERO_PAGES = ['/', '/contact/']
const PHONE = '(866) 861-8383'
const PHONE_HREF = 'tel:+18668618383'

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
        <Flex h={{ base: '76px', md: '88px' }} align="center" justify="space-between">

          <Flex
            align="center"
            cursor="pointer"
            onClick={() => navigate('/')}
            flexShrink={0}
          >
            <Image
              src="/logo-wide-transparent-background.png"
              alt="MWGridSolutions"
              h={{ base: '58px', md: '76px' }}
              maxW={{ base: '170px', md: '240px' }}
              objectFit="contain"
              filter={isTransparent ? 'brightness(0) invert(1)' : 'none'}
              transition="filter 0.3s"
            />
          </Flex>

          <HStack spacing={1} display={{ base: 'none', md: 'flex' }} align="center">
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

            {/* Phone number */}
            <ChakraLink
              href={PHONE_HREF}
              display="flex"
              alignItems="center"
              gap={1.5}
              px={3}
              py={2}
              borderRadius="lg"
              fontSize="sm"
              fontWeight="600"
              color={isTransparent ? 'brand.tealLight' : 'brand.teal'}
              _hover={{
                color: isTransparent ? 'white' : 'brand.accent',
                bg: isTransparent ? 'whiteAlpha.100' : 'brand.gray50'
              }}
              transition="all 0.15s"
            >
              <HiPhone size={14} />
              <Text as="span" fontFamily="mono" letterSpacing="0.02em">{PHONE}</Text>
            </ChakraLink>

            <Button
              variant={isTransparent ? 'unstyled' : 'primary'}
              size="sm"
              ml={1}
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
              Get Offer
            </Button>
          </HStack>

          {/* Mobile: phone icon + menu toggle */}
          <HStack spacing={2} display={{ base: 'flex', md: 'none' }}>
            <IconButton
              as="a"
              href={PHONE_HREF}
              aria-label="Call us"
              icon={<HiPhone size={18} />}
              variant="ghost"
              color={isTransparent ? 'brand.tealLight' : 'brand.teal'}
              _hover={{ bg: isTransparent ? 'whiteAlpha.100' : 'brand.gray50' }}
              size="sm"
            />
            <IconButton
              aria-label="Toggle menu"
              icon={mobileOpen ? <HiX size={20} /> : <HiMenu size={20} />}
              variant="ghost"
              color={isTransparent ? 'white' : 'brand.gray700'}
              onClick={() => setMobileOpen(!mobileOpen)}
              _hover={{ bg: isTransparent ? 'whiteAlpha.100' : 'brand.gray50' }}
            />
          </HStack>
        </Flex>

        {mobileOpen && (
          <Box
            display={{ base: 'block', md: 'none' }}
            pb={5}
            borderTop="1px solid"
            borderColor={isTransparent ? 'whiteAlpha.200' : 'brand.gray100'}
            bg={isTransparent ? 'rgba(8, 12, 22, 0.95)' : 'white'}
            mx={-5}
            px={5}
          >
            <VStack spacing={1} align="stretch" pt={3}>
              {visibleItems.map((item) => (
                <ChakraLink
                  key={item.href}
                  onClick={() => handleNavClick(item)}
                  fontSize="md"
                  fontWeight="500"
                  color={isTransparent ? 'whiteAlpha.800' : 'brand.gray600'}
                  _hover={{
                    color: isTransparent ? 'white' : 'brand.gray900',
                    bg: isTransparent ? 'whiteAlpha.100' : 'brand.gray50'
                  }}
                  cursor="pointer"
                  py={2.5}
                  px={4}
                  borderRadius="lg"
                >
                  {item.label}
                </ChakraLink>
              ))}
              <ChakraLink
                href={PHONE_HREF}
                display="flex"
                alignItems="center"
                gap={2}
                py={2.5}
                px={4}
                borderRadius="lg"
                fontSize="md"
                fontWeight="600"
                color={isTransparent ? 'brand.tealLight' : 'brand.teal'}
              >
                <HiPhone size={16} />
                {PHONE}
              </ChakraLink>
              <Button
                variant="primary"
                size="md"
                onClick={() => { setMobileOpen(false); navigate('/contact/') }}
                w="full"
                mt={2}
              >
                Get Offer
              </Button>
            </VStack>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Header
