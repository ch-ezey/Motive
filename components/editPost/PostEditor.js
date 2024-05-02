import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {Button} from 'react-native-elements';
import {useImagePicker} from '../universal/useImagePicker';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {auth, db, storage} from '../../firebase';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {uploadBytes, ref, getDownloadURL} from 'firebase/storage';

const uploadPostSchema = Yup.object().shape({
  description: Yup.string().max(
    2200,
    'Decription has reached the character limit',
  ),
  title: Yup.string()
    .max(2200, 'Decription has reached the character limit')
    .required(),
});

const PostEditor = ({navigation, postID, postURL, postTitle, postDes}) => {
  console.log('Post editor:');

  const imageURI = {uri: postURL};
  const {selectedImage, pickImage} = useImagePicker();
  console.log(selectedImage);

  const uploadImage = async user_uid => {
    const uri = selectedImage;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);

    const postImageRef = ref(storage, user_uid + '/' + 'posts/' + filename);

    const img = await fetch(uri);
    const bytes = await img.blob();

    try {
      await uploadBytes(postImageRef, bytes);
      const downloadUrl = await getDownloadURL(postImageRef);
      console.log('Download Url :: ' + downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const onUpload = async (title, description) => {
    try {
      const ownerDocRef = doc(db, 'users', auth.currentUser.uid);

      // Assume file_name is the name of the image file for the post.
      const postInput = {
        file_name: selectedImage.substring(selectedImage.lastIndexOf('/') + 1),
        // owner_uid: auth.currentUser.uid,
        description: description,
        title: title,
        Last_Updated_at: serverTimestamp(),
        // users_going: [],
        // owner_doc: ownerDocRef,
      };

      if (!(selectedImage == null)) {
        const downloadUrl = await uploadImage(user.uid);
        postInput.image_url = downloadUrl;
      }

      await updateDoc(doc(db, 'posts', postID), postInput);

      // When u get it working try adding an update TimeStamp ----
      // Update the timestamp field with the value from the server
      // const updateTimestamp = await updateDoc(docRef, {
      //   timestamp: serverTimestamp()
      // });

      console.log('Data Updated');
    } catch (error) {
      Alert.alert('This is awkward...', error.message);
    }
  };

  return (
    <Formik
      initialValues={{title: postTitle, description: postDes}}
      onSubmit={async values => {
        await onUpload(values.title, values.description).then(
          navigation.goBack(),
        );
      }}
      validationSchema={uploadPostSchema}
      validateOnMount={true}>
      {({handleBlur, handleChange, handleSubmit, values, isValid}) => (
        <>
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              {selectedImage ? (
                <TouchableOpacity onPress={pickImage}>
                  <Image source={{uri: selectedImage}} style={styles.image} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    // borderRadius: 100,
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                  }}>
                  <ImageBackground source={imageURI} style={styles.image}>
                    <View>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 19,
                          color: 'white',
                          textAlign: 'center',
                          justifyContent: 'center',
                        }}>
                        Click to edit post image...
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>

                // Image component can't contain children consider using absolute value or <imageBackground>
              )}
            </View>
            <View style={{}}>
              <TextInput
                placeholder={postTitle}
                placeholderTextColor="grey"
                multiline={true}
                style={[
                  styles.titleInput,
                  {
                    borderColor:
                      1 > values.title.length || values.title.length >= 3
                        ? 'green'
                        : '#B93A21',
                  },
                ]}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
              />
              <TextInput
                placeholder={postDes}
                placeholderTextColor="white"
                multiline={true}
                numberOfLines={6}
                style={[
                  styles.descriptionInput,
                  {
                    borderColor:
                      1 > values.description.length ||
                      values.description.length >= 3
                        ? 'green'
                        : '#B93A21',
                  },
                ]}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                // onChange={validSet(values.title, values.description)}
              />
            </View>
            <View style={styles.shareButton}>
              <Button
                title="Edit Post"
                onPress={handleSubmit}
                disabled={
                  values.title == postTitle &&
                  values.description == postDes &&
                  selectedImage == null
                }
              />
            </View>
          </View>
        </>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    margin: 10,
    // flexDirection: 'column',
    // borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    justifyContent: 'center',
  },

  image: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },

  imageContainer: {
    // justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'green',
    width: 250,
    height: 250,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  descriptionInput: {
    color: 'white',
    fontSize: 19,
    borderWidth: 1,
    borderColor: '#B93A21',
    textAlignVertical: 'top',
    width: 320,
    marginVertical: 10,
    paddingTop: 10,
    paddingLeft: 10,
  },

  titleInput: {
    color: 'white',
    fontSize: 19,
    borderWidth: 1,
    borderColor: '#B93A21',
    width: 320,
    marginVertical: 10,
    paddingTop: 10,
    paddingLeft: 10,
  },

  shareButton: {
    marginVertical: 10,
    width: 150,
  },
});

export default PostEditor;
