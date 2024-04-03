import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Pressable,
} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-gesture-handler';

import {Formik} from 'formik';
import * as Yup from 'yup';
import {validate} from 'email-validator';
import {auth, db, storage} from '../../firebase';
import {doc, setDoc} from 'firebase/firestore';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {uploadBytes, ref, getDownloadURL} from 'firebase/storage';
import {useImagePicker} from '../universal/useImagePicker';

const SignupForm = ({}) => {
  const {selectedImage, pickImage, removeImage} = useImagePicker();

  const uploadImage = async owner_uid => {
    const uri = selectedImage;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);

    console.log('image: ' + selectedImage);
    console.log('uri: ' + uri);
    console.log('filename: ' + filename);

    const pfpImageRef = ref(storage, owner_uid + '/' + 'pfp');

    const metadata = {
      name: 'hello',
      contentType: 'image/jpeg',
    };

    const img = await fetch(uri);
    const bytes = await img.blob();

    try {
      await uploadBytes(pfpImageRef, bytes);
      const downloadUrl = await getDownloadURL(pfpImageRef);
      console.log('Download Url :: ' + downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const SignupFormSchema = Yup.object().shape({
    email: Yup.string().email().required('An email is required'),
    username: Yup.string().min(5, 'A username is required').required(),
    password: Yup.string()
      .min(8, 'Your password has to have at least 8 characters')
      .required(),
  });

  const onSignup = async (auth, email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const userInput = {
        owner_uid: userCredential.user.uid,
        username: username,
        email: userCredential.user.email,
        profile_picture:
          'https://firebasestorage.googleapis.com/v0/b/motive-8c0ca.appspot.com/o/assets%2FuserA.png?alt=media&token=45b8abe6-13ac-4635-b44a-2faddf35a3c3',
      };

      if (!(selectedImage == null)) {
        const downloadUrl = await uploadImage(userCredential.user.uid);
        userInput.profile_picture = downloadUrl;
      }

      await setDoc(doc(db, 'users', userInput.owner_uid), userInput).catch(
        error => {
          console.log(error.message);
        },
      );

      updateProfile(auth.currentUser, {
        displayName: userInput.username,
        photoURL: userInput.profile_picture,
      }).catch(error => {
        Alert.alert('This is awkward...', error.message);
      });

      console.log(userInput);

      console.log('Data Submitted');
    } catch (error) {
      Alert.alert('This is awkward...', error.message);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Formik
        initialValues={{auth: auth, email: '', username: '', password: ''}}
        onSubmit={values => {
          onSignup(auth, values.email, values.password, values.username);
        }}
        validationSchema={SignupFormSchema}
        validateOnMount={true}>
        {({handleChange, handleBlur, handleSubmit, values, isValid}) => (
          <>
            <View style={styles.pfp}>
              {selectedImage ? (
                <TouchableOpacity onPress={removeImage}>
                  <Image
                    source={{uri: selectedImage}}
                    style={{
                      borderRadius: 100,
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    borderRadius: 100,
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    backgroundColor: '#213647',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../../assets/icons/user.png')}
                    style={{
                      width: 100,
                      height: 100,
                      tintColor: '#C3C9CD',
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    values.email.length < 1 || validate(values.email)
                      ? '#52636F'
                      : '#fa4437',
                },
              ]}>
              <TextInput
                style={{color: 'white', fontSize: 16}}
                placeholderTextColor="#CCCCCC"
                placeholder="Enter Email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoFocus={true}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    1 > values.username.length || values.username.length >= 5
                      ? '#52636F'
                      : '#fa4437',
                },
              ]}>
              <TextInput
                style={{color: 'white', fontSize: 16}}
                placeholderTextColor="#CCCCCC"
                placeholder="Create Username"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
              />
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    1 > values.password.length || values.password.length >= 8
                      ? '#52636F'
                      : '#fa4437',
                },
              ]}>
              <TextInput
                style={{color: 'white', fontSize: 16}}
                placeholderTextColor="#CCCCCC"
                placeholder="Create Password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
                textContentType="password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('passowrd')}
                value={values.password}
              />
            </View>
            <View style={{alignItems: 'flex-end', marginBottom: 10}}></View>
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
                SIGN UP
              </Text>
            </Pressable>
          </>
        )}
      </Formik>
      <View>
        <View
          style={{
            position: 'absolute',
            alignSelf: 'center',
            backgroundColor: '#082032',
            paddingHorizontal: 8,
            top: 15,
            zIndex: 1,
          }}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14.5}}>
            OR
          </Text>
        </View>
        <View
          style={{
            padding: 0.75,
            backgroundColor: 'white',
            marginTop: 25,
            marginHorizontal: 20,
          }}
        />
        <View style={styles.logoContainer}>
          <TouchableOpacity style={{marginHorizontal: 60}}>
            <Image
              style={styles.logo}
              source={require('../../assets/logo/google.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{marginHorizontal: 60}}>
            <Image
              style={styles.logo}
              source={require('../../assets/logo/facebook.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 50,
  },

  inputField: {
    borderRadius: 15,
    paddingHorizontal: 11,
    padding: 2,
    backgroundColor: '#213647',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#52636F',
  },

  footerButton: {
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    elevation: 10,
  },

  buttonText: {
    fontSize: 14,
    fontFamily: 'Roboto-Black',
    fontWeight: 'bold',
  },

  pfp: {
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#838383',
    width: 150,
    height: 150,
    // elevation: 10,
  },

  pfpcancel: {
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 100,
  },

  logoContainer: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },

  logo: {
    height: 50,
    width: 50,
  },
});
export default SignupForm;
