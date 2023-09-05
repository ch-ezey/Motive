import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import SignupForm from '../components/signup/SignupForm'

const SignupScreen = ({navigation}) => (
    <View style={styles.container}>
        <View style={styles.logoContainer}>
            {/* <Image style={{height: 100, width: 100, borderWidth: 10,}} source={require('../assets/logo/M.png')}/> */}
        </View>
        <SignupForm navigation={navigation}/>
    </View>
  )

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#082032',
        paddingTop: 50,
        paddingHorizontal: 12,
    },

    logoContainer:{
        alignItems: 'center',
        marginTop: 60
    }
})
export default SignupScreen