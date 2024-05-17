// useImagePicker.js
import {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';

export const useImagePicker = (initialImage = null) => {
  const [selectedImage, setSelectedImage] = useState(initialImage);
  const [imageError, setImageError] = useState(null);

  const options = {
    mediaType: 'photo',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    // quality: 0.8, // Adjust image quality (0 - 1)
    // maxWidth: 800, // Limit image dimensions to avoid large files
    // maxHeight: 600,
  };

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        setImageError(result.errorMessage);
      } else {
        setSelectedImage(result.assets[0].uri);
        setImageError(null);
      }
    } catch (error) {
      setImageError(error.message);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return {selectedImage, imageError, pickImage, removeImage};
};
