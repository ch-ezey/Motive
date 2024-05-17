import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';

import {Formik} from 'formik';
import * as Yup from 'yup';
import {validate} from 'email-validator';
import {auth, db} from '../../firebase';
import {doc, updateDoc} from 'firebase/firestore';
import {updateProfile} from 'firebase/auth';

const EditInputs = ({userInfo, onInputChange}) => {
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const SignupFormSchema = Yup.object().shape({
    name: Yup.string()
      .min(1, 'A username is required')
      .max(20, 'Username has reached character limit'),
    username: Yup.string()
      .min(5, 'A username is required')
      .max(20, 'Username has reached character limit')
      .required(),
    bio: Yup.string().max(200, 'Username has reached character limit'),
    email: Yup.string().email().required('An email is required'),
    number: Yup.string()
      //   .required('required')
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, 'too short')
      .max(10, 'too long'),
    //   .nullable(),
  });

  const onUpdate = async (name, username, bio, email, number) => {
    try {
      const userInput = {
        name: name,
        username: username,
        email: email,
        bio: bio,
        number: number,
      };

      await updateDoc(doc(db, 'users', auth.currentUser.uid), userInput).catch(
        error => {
          console.log(error.message);
        },
      );

      updateProfile(auth.currentUser, {
        displayName: username,
      }).catch(error => {
        Alert.alert('This is awkward...', error.message);
      });

      console.log(userInput);

      console.log('Data Submitted');
    } catch (error) {
      Alert.alert('This is awkward...', error.message);
    }
  };

  const [isUsernameValid, setIsUsernameValid] = useState(false);

  const toggleIsUsername = () => {
    setIsUsernameValid(!isUsernameValid);
    console.log(isUsernameValid);
  };

  return (
    <View style={styles.wrapper}>
      <Formik
        initialValues={userInfo} // Use spread syntax for cleaner initialization
        // onSubmit={async values => {
        //   setIsSubmitting(true); // Disable button during submission
        //   try {
        //     await onUpdate(
        //       values.name,
        //       values.username,
        //       values.bio,
        //       values.email,
        //       values.number,
        //     );
        //     navigation.navigate('ProfileScreen');
        //   } catch (error) {
        //     Alert.alert('Error', error.message); // More descriptive error message
        //   } finally {
        //     setIsSubmitting(false); // Re-enable button after submission
        //   }
        // }}
        validationSchema={SignupFormSchema}
        validateOnMount={false}>
        {({handleChange, handleBlur, handleSubmit, values, isValid}) => (
          <>
            <View>
              <View style={styles.inputContainer}>
                <Text
                  style={{
                    color: '#CCCCCC',
                    marginHorizontal: 18,
                    // marginVertical: 5,
                  }}>
                  Name
                </Text>
                <View
                  style={[
                    styles.inputField,
                    {
                      borderColor:
                        1 > values.name.length || values.name.length >= 5
                          ? '#52636F'
                          : '#fa4437',
                    },
                  ]}>
                  <TextInput
                    style={styles.input}
                    onChangeText={text => {
                      handleChange('name')(text); // Update Formik state
                      onInputChange('name', text); // Update parent state
                    }}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    placeholder="Name"
                    placeholderTextColor="#ACAFB0"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="name"
                  />
                </View>

                {/* {isUsernameValid ? (
                <Image
                  style={[styles.icons, {tintColor: '#D39D34'}]}
                  source={require('../../assets/icons/excla-circle.png')}
                />
              ) : (
                <Image
                  style={[styles.icons, {tintColor: '#D39D34'}]}
                  source={require('../../assets/icons/excla-circle.png')}
                />
              )} */}
              </View>

              <View style={styles.inputContainer}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      color: '#CCCCCC',
                      marginLeft: 18,
                      // marginVertical: 5,
                    }}>
                    Username
                  </Text>
                  <Text
                    style={{
                      color: '#B93A21',
                      marginHorizontal: 3,
                      // marginVertical: 5,
                    }}>
                    *
                  </Text>
                </View>
                <View
                  style={[
                    styles.inputField,
                    {
                      borderColor:
                        1 > values.username.length ||
                        values.username.length >= 5
                          ? '#52636F'
                          : '#fa4437',
                    },
                  ]}>
                  <TextInput
                    style={styles.input}
                    onChangeText={text => {
                      handleChange('username')(text);
                      onInputChange('username', text);
                    }}
                    onBlur={handleBlur('username')}
                    value={values.username.trim()}
                    placeholder="Username"
                    placeholderTextColor="#ACAFB0"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="username"
                  />
                </View>
                <Text
                  style={{
                    color: '#55646F',
                    marginHorizontal: 18,
                    fontSize: 12,
                    // marginVertical: 5,
                  }}>
                  You can only change your username once every 7 days.
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text
                  style={{
                    color: '#CCCCCC',
                    marginHorizontal: 18,
                    // marginVertical: 5,
                  }}>
                  Bio
                </Text>
                <View
                  style={[
                    styles.inputField,
                    {
                      borderColor:
                        1 > values.bio.length || values.bio.length <= 200
                          ? '#52636F'
                          : '#fa4437',
                      // height: 100,
                    },
                  ]}>
                  <TextInput
                    style={[styles.input, {textAlignVertical: 'top'}]}
                    placeholderTextColor="#ACAFB0"
                    placeholder="Bio"
                    autoCapitalize="none"
                    autoCorrect={true}
                    textContentType="none"
                    onChangeText={text => {
                      handleChange('bio')(text);
                      onInputChange('bio', text);
                    }}
                    onBlur={handleBlur('bio')}
                    value={values.bio}
                    multiline={true}
                    numberOfLines={5}
                    maxLength={200}
                  />
                </View>
                <Text
                  style={{
                    color: '#55646F',
                    marginHorizontal: 18,
                    fontSize: 12,
                    // marginVertical: 5,
                  }}>
                  Brief description of your profile. URLs are hyperlinked.
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      color: '#CCCCCC',
                      marginLeft: 18,
                      // marginVertical: 5,
                    }}>
                    Email Address
                  </Text>
                  <Text
                    style={{
                      color: '#B93A21',
                      marginHorizontal: 3,
                      // marginVertical: 5,
                    }}>
                    *
                  </Text>
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
                    style={styles.input}
                    placeholderTextColor="#ACAFB0"
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoFocus={false}
                    onChangeText={text => {
                      handleChange('email')(text);
                      onInputChange('email', text);
                    }}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
                  <TouchableOpacity
                    style={{
                      alignSelf: 'center',
                      // justifyContent: 'center',
                      backgroundColor: '#5034FF',
                      paddingHorizontal: 15,
                      paddingVertical: 7,
                      borderRadius: 20,
                    }}>
                    <Text style={{color: 'white'}}>Verify</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text
                  style={{
                    color: '#CCCCCC',
                    marginHorizontal: 18,
                    // marginVertical: 5,
                  }}>
                  Phone Number
                </Text>
                <View
                  style={[
                    styles.inputField,
                    {
                      borderColor:
                        values.number.length < 1 || values.number.length >= 10
                          ? '#52636F'
                          : '#fa4437',
                    },
                  ]}>
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="#ACAFB0"
                    placeholder="Phone Number"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="phone-pad"
                    textContentType="telephoneNumber"
                    onChangeText={text => {
                      handleChange('number')(text);
                      onInputChange('number', text);
                    }}
                    onBlur={handleBlur('number')}
                    value={values.number}
                  />
                  <TouchableOpacity
                    style={{
                      alignSelf: 'center',
                      backgroundColor: '#5034FF',
                      paddingHorizontal: 15,
                      paddingVertical: 7,
                      borderRadius: 20,
                    }}>
                    <Text style={{color: 'white'}}>Verify</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 25,
  },

  inputContainer: {paddingVertical: 2},

  inputField: {
    flexDirection: 'row',
    backgroundColor: '#213647',
    borderColor: '#52636F',
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 11,
    marginVertical: 6,
    marginHorizontal: 18,
    // alignItems: 'center',
    // justifyContent: 'space-between',
  },

  footerButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    elevation: 10,
    marginTop: 5,
    marginHorizontal: 18,
  },

  buttonText: {
    fontSize: 14,
    // fontFamily: 'Roboto-Black',
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

  icons: {
    height: 25,
    width: 25,
  },

  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
});
export default EditInputs;
