// src/components/contact/PhotoUploader.jsx
import { useRef } from 'react'
import {
  Box,
  Flex,
  Text,
  Icon,
  Image,
  IconButton,
  SimpleGrid,
  HStack
} from '@chakra-ui/react'
import { HiOutlinePhotograph, HiOutlinePlus, HiX } from 'react-icons/hi'

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

      <SimpleGrid columns={{ base: 3, md: 5 }} spacing={3}>
        {/* Rendered photo thumbnails */}
        {photos.map((file, i) => (
          <Box
            key={i}
            position="relative"
            borderRadius="xl"
            overflow="hidden"
            border="2px solid"
            borderColor="brand.gray200"
            aspectRatio="1"
          >
            <Image
              src={URL.createObjectURL(file)}
              alt={`Upload ${i + 1}`}
              w="full"
              h="full"
              objectFit="cover"
            />
            <IconButton
              aria-label="Remove photo"
              icon={<HiX size={12} />}
              size="xs"
              position="absolute"
              top={1.5}
              right={1.5}
              bg="blackAlpha.700"
              color="white"
              borderRadius="full"
              minW="20px"
              h="20px"
              _hover={{ bg: 'red.500' }}
              onClick={() => removePhoto(i)}
            />
          </Box>
        ))}

        {/* Add photo button (always visible if under max) */}
        {photos.length < MAX_PHOTOS && (
          <Flex
            border="2px dashed"
            borderColor="brand.gray200"
            borderRadius="xl"
            direction="column"
            align="center"
            justify="center"
            cursor="pointer"
            aspectRatio="1"
            transition="all 0.15s"
            _hover={{
              borderColor: 'brand.teal',
              bg: 'brand.tealSoft'
            }}
            onClick={() => inputRef.current?.click()}
          >
            {photos.length === 0 ? (
              <>
                <Icon as={HiOutlinePhotograph} boxSize={6} color="brand.gray400" mb={1.5} />
                <Text fontSize="xs" fontWeight="600" color="brand.gray500" textAlign="center" px={2}>
                  Add Photos
                </Text>
              </>
            ) : (
              <Icon as={HiOutlinePlus} boxSize={5} color="brand.gray400" />
            )}
          </Flex>
        )}
      </SimpleGrid>
    </Box>
  )
}

export default PhotoUploader
