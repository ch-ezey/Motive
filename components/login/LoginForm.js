import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {Image} from 'react-native-elements';

import {Formik} from 'formik';
import * as Yup from 'yup';
import {validate} from 'email-validator';

import {auth} from '../../firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';

const LoginForm = ({navigation}) => {
  const LoginFormSchema = Yup.object().shape({
    email: Yup.string().email().required('An email is required'),
    password: Yup.string()
      .min(8, 'Your password has to have at least 8 characters')
      .max(50, 'Your password has to have at most 50 characters')
      .required(),
  });

  const onLogin = async (auth, email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        console.log('Firebase Login Successful', email, password);
      })
      .catch(error => {
        Alert.alert(
          'Uh oh...',
          'The password is invalid or the user does not exist' +
            '\n\n What would you like to do next',
          [
            {
              text: 'Ok',
              onPress: () => console.log('Ok'),
              style: 'cancel',
            },
            {
              text: 'Sign Up',
              onPress: () => navigation.navigate('SignupScreen'),
            },
          ],
        );
      });
  };

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    console.log(showPassword);
  };

  return (
    <View style={styles.wrapper}>
      <Formik
        initialValues={{auth: auth, email: '', password: ''}}
        onSubmit={values => {
          onLogin(auth, values.email, values.password);
        }}
        validationSchema={LoginFormSchema}
        validateOnMount={true}>
        {({handleChange, handleBlur, handleSubmit, values, isValid}) => (
          <>
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
                placeholderTextColor="#CCCCCC"
                placeholder="Email"
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
                    1 > values.password.length || values.password.length >= 8
                      ? '#52636F'
                      : '#fa4437',
                },
              ]}>
              <TextInput
                style={styles.input}
                placeholderTextColor="#CCCCCC"
                placeholder="Password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showPassword}
                textContentType="password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('passowrd')}
                value={values.password}
              />

              <TouchableOpacity onPress={toggleShowPassword}>
                {showPassword ? (
                  <Image
                    style={styles.icons}
                    source={require('../../assets/icons/eye.png')}
                  />
                ) : (
                  <Image
                    style={styles.icons}
                    source={require('../../assets/icons/eye-cross.png')}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'flex-end', marginBottom: 10}}>
              <TouchableOpacity>
                <Text
                  style={{
                    color: '#6BB0F5',
                    fontWeight: 'normal',
                    fontFamily: 'Inter-Medium',
                  }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
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
                LOG IN
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
    // borderWidth: 1,
    borderColor: 'white',
  },

  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 11,
    // padding: 2,
    marginBottom: 10,
    backgroundColor: '#213647',
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
    // fontFamily: 'Roboto-Black',
    fontWeight: 'bold',
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
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
});
export default LoginForm;
