import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {useState, useEffect} from 'react';
import React from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {Button} from 'react-native-elements';

import {Formik} from 'formik';
import * as Yup from 'yup';
import {auth, db, storage} from '../../firebase';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import {uploadBytes, ref, getDownloadURL} from 'firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';

const uploadPostSchema = Yup.object().shape({
  caption: Yup.string().max(2200, 'Caption has reached the character limit'),
});

const FormikPostUploader = ({image, navigation}) => {
  const user = auth.currentUser;

  const options = {
    title: 'Pick An Image',
    maxWidth: 800,
    maxHeight: 600,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const [selectedImage, setSelectedImage] = useState();
  const [selectedImageUrl, setSelectedImageUrl] = useState();

  useEffect(() => {
    if (image) {
      console.log('useEffect ' + image);
      setSelectedImage({uri: image});
      setSelectedImageUrl(image);
    }
  }, [image]);

  const pickImageHandler = () => {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0].uri;
        console.log('Images ' + uri);
        setSelectedImage({uri: uri});
        setSelectedImageUrl(uri);
      }
    });
  };

  const uploadImage = async user_uid => {
    const uri = selectedImage.uri;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);

    console.log('image: ' + selectedImage.uri);
    console.log('uri: ' + uri);
    console.log('filename: ' + filename);
    console.log(user.uid);

    let imageUri = uri.replace('file://', '');

    const postImageRef = ref(storage, user_uid + '/' + 'posts/' + filename); //where the post is stored

    const img = await fetch(uri);
    const bytes = await img.blob();

    console.log();

    try {
      await uploadBytes(postImageRef, bytes);
      const downloadUrl = await getDownloadURL(postImageRef);
      console.log('Download Url :: ' + downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const onUpload = async caption => {
    try {
      const ownerDocRef = doc(db, 'users', auth.currentUser.uid);

      const postInput = {
        file_name: selectedImage.uri.substring(
          selectedImage.uri.lastIndexOf('/') + 1,
        ),
        owner_uid: auth.currentUser.uid,
        caption: caption,
        created_at: serverTimestamp(),
        users_going: [],
        owner_doc: ownerDocRef,
      };

      if (!(selectedImageUrl == null)) {
        const downloadUrl = await uploadImage(user.uid);
        postInput.image_url = downloadUrl;
      }

      // Upload the post without "postID" for now
      const postRef = await addDoc(collection(db, 'posts'), postInput);

      // Retrieve the generated document ID
      const post_id = postRef.id;

      // Update the post document with "postID"
      await setDoc(doc(db, 'posts', post_id), {post_id}, {merge: true});

      console.log('Data Submitted');
    } catch (error) {
      Alert.alert('This is awkward...', error.message);
    }
  };

  return (
    <Formik
      initialValues={{caption: ''}}
      onSubmit={async values => {
        await onUpload(values.caption).then(navigation.goBack());
      }}
      validationSchema={uploadPostSchema}
      validateOnMount={true}>
      {({handleBlur, handleChange, handleSubmit, values}) => (
        <>
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              {selectedImageUrl ? (
                <Image source={{uri: selectedImageUrl}} style={styles.image} />
              ) : (
                <Text style={{color: 'white', textAlign: 'center'}}>
                  No Image Selected
                </Text>
              )}
            </View>
            <View style={styles.captionInput}>
              <TextInput
                placeholder="Write Your Caption..."
                placeholderTextColor="white"
                multiline={true}
                style={styles.captionInput}
                onChangeText={handleChange('caption')}
                onBlur={handleBlur('caption')}
                value={values.caption}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.pickImageButton}>
              <Button title="Pick Image" onPress={pickImageHandler} />
            </View>
          </View>
          <View style={styles.shareButton}>
            <Button
              title="Share"
              onPress={handleSubmit}
              disabled={selectedImageUrl == null}
            />
          </View>
        </>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  imageContainer: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
    width: 150,
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  captionInput: {
    flex: 1,
    marginLeft: 12,
    color: 'white',
    fontSize: 17,
  },
  buttonContainer: {
    marginLeft: 20,
    marginBottom: 10,
    flexDirection: 'row',
  },
  pickImageButton: {
    width: 150,
    marginRight: 10,
  },
  shareButton: {
    marginHorizontal: 20,
  },
});

export default FormikPostUploader;
