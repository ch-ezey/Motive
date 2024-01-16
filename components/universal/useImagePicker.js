// useImagePicker.js
import {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';

export const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const options = {
    mediaType: 'photo',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const pickImage = () => {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return {selectedImage, pickImage, removeImage};
};
