// src/components/layout/SectionHeading.jsx
import { Box, Heading, Text } from '@chakra-ui/react'

function SectionHeading({ label, title, subtitle, dark = false }) {
  return (
    <Box textAlign="center" mb={{ base: 10, md: 14 }}>
      {label && (
        <Text
          fontSize="11px"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="0.1em"
          color={dark ? 'brand.tealLight' : 'brand.teal'}
          mb={3}
        >
          {label}
        </Text>
      )}
      <Heading
        as="h2"
        fontFamily="heading"
        fontSize={{ base: '2xl', md: '36px' }}
        fontWeight="700"
        lineHeight="1.15"
        letterSpacing="-0.025em"
        color={dark ? 'white' : 'brand.gray900'}
        mb={4}
      >
        {title}
      </Heading>
      {subtitle && (
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          color={dark ? 'brand.gray400' : 'brand.gray500'}
          maxW="580px"
          mx="auto"
          lineHeight="1.7"
        >
          {subtitle}
        </Text>
      )}
    </Box>
  )
}

export default SectionHeading
