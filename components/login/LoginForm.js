import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { Button } from 'react-native-elements'

import { Formik } from 'formik'
import * as Yup from 'yup'
import { validate, Validator } from 'email-validator'

import { app, auth } from '../../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const LoginForm = ({navigation}) => {

    const LoginFormSchema = Yup.object().shape({
        email: Yup
            .string()
            .email()
            .required('An email is required'),
        password: Yup
            .string()
            .min(8, 'Your password has to have at least 8 characters')
            .required(),
    })

    const onLogin = async (auth, email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then(async() => {
                console.log('Firebase Login Successful', email, password)
            })
            .catch(
                (error) => {
                    Alert.alert(
                    'Uh oh...',
                    'The password is invalid or the user does not exist' + '\n\n What would you like to do next',
                    [
                        {
                            text: 'Ok',
                            onPress: () => console.log('Ok'),
                            style: 'cancel',
                        },
                        {
                            text: 'Sign Up',
                            onPress: () => navigation.navigate('SignupScreen')
                        }
                    ]
                )
            })
    }

  return (
    <View style={styles.wrapper}>

        <Formik
            initialValues={{auth: auth, email: '', password: ''}}
            onSubmit={(values) => {
                onLogin(auth, values.email, values.password)
            }}
            validationSchema={LoginFormSchema}
            validateOnMount={true}
        >
            {({
                handleChange, 
                handleBlur, 
                handleSubmit, 
                values, 
                isValid
            }) => (
                <>

    <View 
        style={[
            styles.inputField,
            {
                borderColor: 
                    values.email.length < 1 || validate(values.email)
                        ? '#ccc' 
                        : '#fa4437'
            },
            ]}>
        <TextInput 
            style={{color: 'white', fontSize: 17}}
            placeholderTextColor='grey'
            placeholder='Email'
            autoCapitalize='none'
            keyboardType='email-address'
            textContentType='emailAddress'
            autoFocus={true}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
        /> 
    </View>

    <View style={[
            styles.inputField,
            {
                borderColor: 
                    1 > values.password.length || values.password.length >= 8
                        ? '#ccc' 
                        : '#fa4437'
            },
            ]}>
        <TextInput
            style={{color: 'white', fontSize: 17}}
            placeholderTextColor='grey'
            placeholder='Password'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
            textContentType='password'
            onChangeText={handleChange('password')}
            onBlur={handleBlur('passowrd')}
            value={values.password}
        />
    </View>
    <View style={{alignItems: 'flex-end', marginBottom: 10}}>
        <TouchableOpacity>
        <Text style={{color: '#6BB0F5'}}>Forgot Password?</Text>
        </TouchableOpacity>
    </View>    
        <Button 
            onPress={handleSubmit} 
            title={'Log In'} 
            disabled={!isValid}
        />
        <View style={styles.signupContainer}>
            <Text style={{color: 'white'}}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
                <Text style={{color: '#6BB0F5'}}> Sign Up</Text>
            </TouchableOpacity>
        </View> 
        </>
        )}
        </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
    
    wrapper: {
        marginTop: 50
    },

    inputField: {
        borderRadius: 20,
        padding: 4,
        backgroundColor: '#082032',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'white'
    },

    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    
    button: {
        backgroundColor: '#0096F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    }
})
export default LoginForm