// src/components/ui/SectionHeading.jsx
import { Box, Heading, Text } from '@chakra-ui/react'

function SectionHeading({ label, title, subtitle }) {
  return (
    <Box textAlign="center" mb={{ base: 10, md: 14 }}>
      {label && (
        <Text
          fontSize="xs"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="0.14em"
          color="brand.accent"
          mb={4}
        >
          {label}
        </Text>
      )}
      <Heading
        as="h2"
        fontFamily="heading"
        fontSize={{ base: '2xl', md: '4xl' }}
        fontWeight="700"
        lineHeight="1.12"
        letterSpacing="-0.02em"
        mb={4}
      >
        {title}
      </Heading>
      {subtitle && (
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          color="brand.textSecondary"
          maxW="620px"
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
