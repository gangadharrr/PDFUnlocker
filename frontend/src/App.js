import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Input,
  Button,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        toast({
          title: 'Error',
          description: 'Please upload a PDF file',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a PDF file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!password) {
      toast({
        title: 'Error',
        description: 'Please enter the password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    setLoading(true);

    try {
      // Use relative URL that works on both desktop and mobile
      const response = await axios.post('/upload', formData, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `unlocked_${file.name}`;

      // Handle file download based on platform
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        // For mobile devices, open in new tab
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        // For desktop, use download link
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      toast({
        title: 'Success',
        description: 'PDF unlocked successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setFile(null);
      setPassword('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unlock PDF. Please check the password and try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Box minH="100vh" py={10} px={4} bg="gray.50">
        <VStack spacing={8} maxW="container.sm" mx="auto">
          <Heading>PDF Unlocker</Heading>

          <Box
            {...getRootProps()}
            w="full"
            p={6}
            border="2px dashed"
            borderColor={isDragActive ? 'blue.400' : 'gray.200'}
            borderRadius="lg"
            bg="white"
            cursor="pointer"
            textAlign="center"
          >
            <input {...getInputProps()} />
            {file ? (
              <Text>Selected file: {file.name}</Text>
            ) : (
              <Text>
                {isDragActive
                  ? 'Drop the PDF here'
                  : 'Drag and drop a PDF file here, or click to select'}
              </Text>
            )}
          </Box>

          <Input
            placeholder="Enter PDF password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Unlocking..."
            w="full"
          >
            Unlock PDF
          </Button>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
