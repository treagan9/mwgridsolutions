// src/components/contact/PhotoUploader.jsx
import { useRef } from 'react'
import {
  Box,
  Flex,
  Text,
  Icon,
  Image,
  IconButton,
  SimpleGrid
} from '@chakra-ui/react'
import { HiPhotograph, HiX } from 'react-icons/hi'

const MAX_PHOTOS = 5
const ACCEPTED = 'image/jpeg,image/png,image/webp,image/heic'

function PhotoUploader({ photos, setPhotos }) {
  const inputRef = useRef(null)

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    const remaining = MAX_PHOTOS - photos.length
    setPhotos((prev) => [...prev, ...files.slice(0, remaining)])
    if (inputRef.current) inputRef.current.value = ''
  }

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        onChange={handleFiles}
        style={{ display: 'none' }}
      />

      {photos.length > 0 && (
        <SimpleGrid columns={{ base: 3, md: 5 }} spacing={3} mb={4}>
          {photos.map((file, i) => (
            <Box
              key={i}
              position="relative"
              borderRadius="lg"
              overflow="hidden"
              border="1px solid"
              borderColor="brand.gray200"
            >
              <Image
                src={URL.createObjectURL(file)}
                alt={`Upload ${i + 1}`}
                w="full"
                h="80px"
                objectFit="cover"
              />
              <IconButton
                aria-label="Remove photo"
                icon={<HiX />}
                size="xs"
                position="absolute"
                top={1}
                right={1}
                bg="blackAlpha.600"
                color="white"
                borderRadius="full"
                _hover={{ bg: 'red.500' }}
                onClick={() => removePhoto(i)}
              />
            </Box>
          ))}
        </SimpleGrid>
      )}

      {photos.length < MAX_PHOTOS && (
        <Flex
          border="1.5px dashed"
          borderColor="brand.gray300"
          borderRadius="xl"
          p={8}
          direction="column"
          align="center"
          justify="center"
          cursor="pointer"
          bg="brand.gray50"
          transition="all 0.15s"
          _hover={{
            borderColor: 'brand.accent',
            bg: 'brand.accentSoft'
          }}
          onClick={() => inputRef.current?.click()}
        >
          <Icon as={HiPhotograph} boxSize={7} color="brand.gray400" mb={2} />
          <Text fontSize="sm" fontWeight="600" color="brand.gray600">
            Upload equipment photos
          </Text>
          <Text fontSize="xs" color="brand.gray400" mt={1}>
            Nameplate, overall condition, details
          </Text>
        </Flex>
      )}
    </Box>
  )
}

export default PhotoUploader
