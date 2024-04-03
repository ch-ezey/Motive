import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import SignupForm from '../components/signup/SignupForm';

const SignupScreen = ({navigation}) => (
  <View style={styles.container}>
    <View style={styles.logoContainer}></View>
    <SignupForm navigation={navigation} />
    <ImageBackground
      source={require('../assets/logo/Ellipse.png')}
      style={styles.ellipse}>
      <Text style={{color: 'white'}}>Already have an account? </Text>
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={{color: '#6BB0F5', fontWeight: 'bold'}}>Log In</Text>
      </TouchableOpacity>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#082032',
    // paddingTop: 10,
    paddingHorizontal: 12,
  },

  logoContainer: {
    alignItems: 'center',
    // marginTop: 10,
  },
  ellipse: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 136,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
    flexDirection: 'row',
  },
});
export default SignupScreen;
