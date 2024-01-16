// useImageUploader.js
import {useState} from 'react';
import {uploadBytes, ref, getDownloadURL} from 'firebase/storage';

export const useImageUploader = (storage, userUid, selectedImage) => {
  const [imageUrl, setImageUrl] = useState(null);

  const uploadImage = async () => {
    // Ensure an image has been selected
    if (!selectedImage) return;

    const fileName = selectedImage.substring(
      selectedImage.lastIndexOf('/') + 1,
    );
    const imageRef = ref(storage, `${userUid}/posts/${fileName}`);

    const imageBlob = await fetch(selectedImage).then(r => r.blob());

    try {
      await uploadBytes(imageRef, imageBlob);
      const downloadUrl = await getDownloadURL(imageRef);

      setImageUrl(downloadUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return {imageUrl, uploadImage};
};
