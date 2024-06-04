import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';

import {ErrorMessage, Formik} from 'formik';
import * as Yup from 'yup';
import {validate} from 'email-validator';
import {auth, db} from '../../firebase';
import {doc, updateDoc} from 'firebase/firestore';
import {updateProfile} from 'firebase/auth';
import {Image} from 'react-native-elements';

const EditInputs = ({userInfo, onInputChange, onValidationChange}) => {
  const phoneRegExp =
    /^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|\#)\d{3,4})?$/;

  const SignupFormSchema = Yup.object().shape({
    name: Yup.string()
      // .min(1, 'Name must be at least 1 characters')
      .max(20, 'Name has reached character limit'),
    username: Yup.string()
      .min(5, 'Username must be at least 5 characters')
      .max(20, 'Username has reached character limit')
      .matches(
        /^[A-Za-z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
      ) // New regex
      .required('A username is required'),
    bio: Yup.string().max(200, 'Username has reached character limit'),
    email: Yup.string().email().required('An email is required'),
    number: Yup.string()
      //   .required('required')
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, 'too short')
      .max(11, 'too long'),
    //   .nullable(),
  });

  const [isUsernameValid, setIsUsernameValid] = useState(false);

  const formikRef = useRef();

  const toggleIsUsername = () => {
    setIsUsernameValid(!isUsernameValid);
    console.log(isUsernameValid);
  };

  // New validation function for username
  function validateUsername(username) {
    return (
      username.length >= 5 &&
      username.length <= 20 &&
      /^[A-Za-z0-9_]+$/.test(username)
    );
  }

  // useEffect(() => {
  //   // if (formikRef.current) {
  //   console.log(formikRef.current.isValid);
  //   onValidationChange(formikRef.current.isValid);
  //   // }
  // }, [formikRef.current.isValid]); // Only call when isValid changes

  return (
    <View style={styles.wrapper}>
      <Formik
        innerRef={formikRef}
        initialValues={userInfo} // Use spread syntax for cleaner initialization
        validationSchema={SignupFormSchema}
        validateOnChange={true}
        validateOnMount={true}
        onSubmit={values => {
          onInputChange(values, isValid); // Pass the whole 'values' object along with isValid
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          isValid,
          validateForm,
        }) => (
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
                    // {
                    //   borderColor:
                    //     1 < values.name.length ? '#52636F' : '#fa4437',
                    // },
                  ]}>
                  <TextInput
                    style={styles.input}
                    onChangeText={text => {
                      console.log(isValid);
                      handleChange('name')(text); // Update Formik state
                      onInputChange('name', text); // Pass isValid here
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
                      borderColor: validateUsername(values.username)
                        ? '#52636F'
                        : '#fa4437',
                    },
                  ]}>
                  <TextInput
                    style={styles.input}
                    onChangeText={text => {
                      // console.log(isValid);
                      handleChange('username')(text);
                      onInputChange('username', text); // Pass isValid here
                    }}
                    onBlur={handleBlur('username')}
                    value={values.username}
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
                      onInputChange('bio', text); // Pass isValid here
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
                      onInputChange('email', text); // Pass isValid here
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
                        values.number === ''
                          ? '#52636F' // Default gray border if empty
                          : values.number.length > 11 ||
                              !phoneRegExp.test(values.number)
                            ? '#fa4437' // Red border for invalid input
                            : '#52636F', // Default grey border for valid input
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
                      onInputChange('number', text); // Pass isValid here
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
                <ErrorMessage
                  name="number"
                  component={Text}
                  style={styles.errorText}
                />
              </View>
            </View>
            {
              useEffect(() => {
                onValidationChange(isValid);
              }, [isValid]) // Only call when isValid changes
            }
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 25,
    // flex: 1,
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

  errorText: {
    // New style for the error message
    color: '#fa4437', // Red text
    fontSize: 12,
    marginLeft: 11, // Align with the input field
    marginTop: 2, // Add some spacing
  },

  saveButton: {
    backgroundColor: '#B93A21',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    elevation: 10,
    height: 57,
    width: 57,
  },
  icon: {
    tintColor: '#DADADA',
    margin: 10,
    width: 30,
    height: 30,
  },
});
export default EditInputs;
