import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {Button} from 'react-native-elements';

import {Formik} from 'formik';
import * as Yup from 'yup';
import {validate} from 'email-validator';
import {auth, db, storage} from '../../firebase';
import {doc, setDoc} from 'firebase/firestore';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {uploadBytes, ref, getDownloadURL} from 'firebase/storage';
import {useImagePicker} from '../universal/useImagePicker';

const SignupForm = ({navigation}) => {
  const {selectedImage, pickImage, removeImage} = useImagePicker();

  const uploadImage = async owner_uid => {
    const uri = selectedImage;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);

    console.log('image: ' + selectedImage);
    console.log('uri: ' + uri);
    console.log('filename: ' + filename);

    // const pfpImageRef = ref(storage, owner_uid + '/' + 'pfp/' + filename) //where the pfp is stored
    const pfpImageRef = ref(storage, owner_uid + '/' + 'pfp'); //where the pfp is stored

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
            <View style={{borderWidth: 0, marginBottom: 10}}>
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
                    }}>
                    <Text style={{color: 'white', textAlign: 'center'}}>
                      Select Profile Picture
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    values.email.length < 1 || validate(values.email)
                      ? '#ccc'
                      : '#fa4437',
                },
              ]}>
              <TextInput
                style={{color: 'white', fontSize: 17}}
                placeholderTextColor="grey"
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
                      ? '#ccc'
                      : '#fa4437',
                },
              ]}>
              <TextInput
                style={{color: 'white', fontSize: 17}}
                placeholderTextColor="grey"
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
                      ? '#ccc'
                      : '#fa4437',
                },
              ]}>
              <TextInput
                style={{color: 'white', fontSize: 17}}
                placeholderTextColor="grey"
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
            <Button
              onPress={handleSubmit}
              title={'Sign Up'}
              disabled={!isValid}
            />
            <View style={styles.signupContainer}>
              <Text style={{color: 'white'}}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={{color: '#6BB0F5'}}> Log In</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 50,
  },

  inputField: {
    borderRadius: 20,
    padding: 1.5,
    backgroundColor: '#082032',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'white',
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  button: {
    backgroundColor: '#0096F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },

  pfp: {
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'white',
    width: 150,
    height: 150,
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
});
export default SignupForm;
