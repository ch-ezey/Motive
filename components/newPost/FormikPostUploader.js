import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native'
import { useState, useEffect } from 'react'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { Button } from 'react-native-elements'

import { Formik } from 'formik'
import * as Yup from 'yup'
import { auth, db, storage } from '../../firebase'
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { uploadBytes, ref, getDownloadURL, } from 'firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker'

const uploadPostSchema = Yup.object().shape({
    caption: Yup.string().max(2200, 'Caption has reached the character limit'),
})


const FormikPostUploader = ({image, navigation}) => {

  const user = auth.currentUser

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
          setSelectedImage({ uri: image });
          setSelectedImageUrl(image);
        }
      }, [image]);

    const pickImageHandler = () => {
        launchImageLibrary(options, (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else {
            const uri = response.assets[0].uri;
            console.log('Images ' + uri);
            setSelectedImage({ uri: uri });
            setSelectedImageUrl(uri);
          }
        });
    };

    const uploadImage = async(user_uid) => {
        const uri = selectedImage.uri
        const filename = uri.substring(uri.lastIndexOf('/') + 1);


        console.log("image: " + selectedImage.uri)
        console.log("uri: " + uri)
        console.log("filename: " + filename)
        console.log(user.uid)

        let imageUri =
          uri.replace('file://', '');
    
        const postImageRef = ref(storage,  user_uid + '/' + 'posts/' + filename) //where the post is stored     

        const img = await fetch(uri);
        const bytes = await img.blob();
        
          console.log()

          try {
            await uploadBytes(postImageRef, bytes); 
            const downloadUrl = await getDownloadURL(postImageRef)
            console.log('Download Url :: ' + downloadUrl)
            return downloadUrl
        
            } catch (error) {
            console.log(error);
            }
    };

    const onUpload = async (caption) => {
      try {
          const postInput = {
            fileName: (selectedImage.uri).substring(selectedImage.uri.lastIndexOf('/') + 1),
            imageUrl: null,
            user: auth.currentUser.displayName,
            profile_picture: auth.currentUser.photoURL,
            owner_uid: auth.currentUser.uid,
            owner_email: auth.currentUser.email,
            caption: caption,
            createdAt: serverTimestamp(),
            users_going: [],
            comments: []
          }

          if(!(selectedImageUrl == null)) {
              const downloadUrl = await uploadImage(user.uid);
              postInput.imageUrl = downloadUrl;
          }

          // Upload the post without "postID" for now
          const postRef = await addDoc(collection(db, 'posts'), postInput);

          // Retrieve the generated document ID
          const postID = postRef.id;
          
          // Update the post document with "postID"
          await setDoc(doc(db, 'posts', postID), { postID }, { merge: true });
          
          console.log('Data Submitted');
      } catch (error) {
          Alert.alert('This is awkward...', error.message);
      }
  };

  return (
        <Formik
          initialValues={{caption: ''}}
          onSubmit={async (values) => {
            await onUpload(values.caption).then(navigation.goBack());
          }}
          validationSchema={uploadPostSchema}
          validateOnMount={true}
        >
        {({ 
          handleBlur, 
          handleChange, 
          handleSubmit, 
          values,
        }) => (
          <>
          <View 
              style={{
                  margin: 20, 
                  justifyContent: 'space-between', 
                  flexDirection: 'row',
                  }}
          >
              <View style={{justifyContent: 'center', borderWidth: 1, borderColor: 'white', width: 150, height: 150}}>
              {selectedImageUrl ? (
                   <Image source={{ uri: selectedImageUrl }} style={{ width: '100%', height: '100%' }} />
              ) : (
                  <Text style={{color: "white", textAlign: 'center'}}>No Image Selected</Text>
              )}
              </View>
              <View style={{flex: 1, marginLeft: 12}}>
              <TextInput
                  style={{color: 'white', fontSize: 17}}
                  placeholder='Write Your Caption...' 
                  placeholderTextColor='white'
                  multiline={true}
                  onChangeText={handleChange('caption')}
                  onBlur={handleBlur('caption')}
                  value={values.caption}
              />
              </View>
          </View>
          <View style={{marginLeft: 20, marginBottom: 10, flexDirection: "row"}}>
              <View style={{width: 150, marginRight: 10}}>
          <Button style={""} title="Pick Image" onPress={pickImageHandler} />
              </View>
          </View>
              <View style={{marginHorizontal: 20}}>
              <Button style={""} title="Share" onPress={handleSubmit} disabled={selectedImageUrl == null} />
              </View>
          </>
        )}
      </Formik>
  )
}

export default FormikPostUploader