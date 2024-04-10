import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
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

const FormikPostUploader = ({user, navigation}) => {
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
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    Select An Image
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={{}}>
              <TextInput
                placeholder="Title..."
                placeholderTextColor="grey"
                multiline={true}
                style={[
                  styles.titleInput,
                  {
                    borderColor:
                      1 > values.title.length || values.title.length >= 3
                        ? 'grey'
                        : '#fa4437',
                  },
                ]}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
              />
              <TextInput
                placeholder="Description..."
                placeholderTextColor="grey"
                multiline={true}
                numberOfLines={6}
                style={styles.descriptionInput}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
              />
            </View>
            <View style={styles.shareButton}>
              <Button
                title="Share"
                onPress={handleSubmit}
                disabled={!isValid || selectedImage == null}
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
    borderColor: 'white',
    padding: 10,
    justifyContent: 'center',
  },
  imageContainer: {
    // justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'grey',
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
    fontSize: 17,
    borderWidth: 1,
    borderColor: 'grey',
    textAlignVertical: 'top',
    width: 320,
    marginVertical: 10,
    paddingTop: 10,
    paddingLeft: 10,
  },

  titleInput: {
    color: 'white',
    fontSize: 17,
    borderWidth: 1,
    borderColor: 'grey',
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

export default FormikPostUploader;
