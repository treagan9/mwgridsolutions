// src/components/ui/StepCard.jsx
import { Box, Flex, Heading, Text } from '@chakra-ui/react'

function StepCard({ number, title, description }) {
  return (
    <Box textAlign="center">
      <Flex
        w={16}
        h={16}
        bg="brand.accent"
        borderRadius="full"
        align="center"
        justify="center"
        mb={5}
        mx="auto"
      >
        <Text fontSize="2xl" fontWeight="800" color="white" fontFamily="heading">
          {number}
        </Text>
      </Flex>
      <Heading
        as="h3"
        fontFamily="heading"
        fontSize="lg"
        fontWeight="700"
        color="brand.gray900"
        mb={2}
      >
        {title}
      </Heading>
      <Text
        fontSize="sm"
        color="brand.gray500"
        lineHeight="1.75"
        maxW="300px"
        mx="auto"
      >
        {description}
      </Text>
    </Box>
  )
}

export default StepCard
