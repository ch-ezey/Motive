import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {useImagePicker} from '../universal/useImagePicker';
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

const uploadPostSchema = Yup.object().shape({
  description: Yup.string().max(
    2200,
    'Decription has reached the character limit',
  ),
  title: Yup.string()
    .max(2200, 'Decription has reached the character limit')
    .required(),
});

const FormikPostUploader = ({navigation}) => {
  const user = auth.currentUser;

  const {selectedImage, pickImage} = useImagePicker();

  const uploadImage = async user_uid => {
    const uri = selectedImage;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);

    console.log('image: ' + selectedImage);
    console.log('uri: ' + uri);
    console.log('filename: ' + filename);
    console.log(user.uid);

    const postImageRef = ref(storage, user_uid + '/' + 'posts/' + filename);

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

  const onUpload = async (title, description) => {
    try {
      const ownerDocRef = doc(db, 'users', auth.currentUser.uid);

      const postInput = {
        file_name: selectedImage.substring(selectedImage.lastIndexOf('/') + 1),
        owner_uid: auth.currentUser.uid,
        description: description,
        title: title,
        created_at: serverTimestamp(),
        users_going: [],
        owner_doc: ownerDocRef,
      };

      if (!(selectedImage == null)) {
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
      initialValues={{title: '', description: ''}}
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
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {selectedImage ? (
                  <Image source={{uri: selectedImage}} style={styles.image} />
                ) : (
                  <Image
                    style={{
                      tintColor: '#C3C9CD',
                      height: 30,
                      width: 30,
                    }}
                    source={require('../../assets/icons/upload.png')}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.titleInput,
                {
                  borderColor:
                    1 > values.title.length || values.title.length >= 5
                      ? '#52636F'
                      : '#fa4437',
                },
              ]}>
              <TextInput
                style={{color: 'white', fontSize: 16}}
                placeholder="Title..."
                placeholderTextColor="#CCCCCC"
                multiline={true}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
              />
            </View>
            <View style={[styles.descriptionInput]}>
              <TextInput
                style={{textAlignVertical: 'top', color: 'white', fontSize: 16}}
                placeholder="Description..."
                placeholderTextColor="#CCCCCC"
                multiline={true}
                numberOfLines={8}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
              />
            </View>
            <View
              style={{
                // marginBottom: 2,
                flexDirection: 'row',
                // justifyContent: 'space-between',
              }}>
              <View style={[styles.dropDown]}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#CCCCCC',
                      fontSize: 16,
                      paddingVertical: 6,
                    }}>
                    Tags
                  </Text>

                  <View style={{paddingTop: 5}}>
                    <Image
                      style={{tintColor: '#CCCCCC', height: 25, width: 25}}
                      source={require('../../assets/icons/downdrop-arrow.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[styles.calendar]}>
                <TouchableOpacity style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      color: '#CCCCCC',
                      fontSize: 16,
                      paddingVertical: 5,
                    }}>
                    23/10/2001
                  </Text>
                  <View
                    style={{
                      paddingLeft: 10,
                      paddingVertical: 5,
                    }}>
                    <Image
                      style={{tintColor: '#CCCCCC', height: 20, width: 20}}
                      source={require('../../assets/icons/calendar.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <Pressable
              style={({pressed}) => [
                styles.footerButton,
                {
                  backgroundColor: isValid ? '#238ddc' : '#cccccc',
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
              onPress={handleSubmit}
              disabled={!isValid}>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: isValid ? 'white' : '#838383',
                  },
                ]}>
                POST
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderColor: 'white',
    padding: 10,
  },
  imageContainer: {
    backgroundColor: '#213647',
    alignSelf: 'center',
    borderRadius: 15,
    // borderWidth: 1,
    borderColor: 'grey',
    width: 202,
    height: 260,
    marginBottom: 20,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 15,
  },

  descriptionInput: {
    borderRadius: 15,
    paddingHorizontal: 11,
    padding: 2,
    backgroundColor: '#213647',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#52636F',
  },

  titleInput: {
    borderRadius: 15,
    paddingHorizontal: 11,
    padding: 2,
    backgroundColor: '#213647',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#52636F',
  },
  dropDown: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 11,
    backgroundColor: '#213647',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#52636F',
    marginRight: 10,
  },
  calendar: {
    flexDirection: 'row',
    borderRadius: 10,
    paddingHorizontal: 11,
    padding: 2,
    backgroundColor: '#213647',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#52636F',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  footerButton: {
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    elevation: 10,
  },

  buttonText: {
    fontSize: 14,
    // fontFamily: 'Roboto-Black',
    fontWeight: 'bold',
  },
});

export default FormikPostUploader;
