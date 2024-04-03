import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';
import LoginForm from '../components/login/LoginForm';

const LoginScreen = ({navigation}) => (
  <View style={styles.wrapper}>
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={{height: 100, width: 100}}
          source={require('../assets/logo/M.png')}
        />
      </View>
      <LoginForm navigation={navigation} />
    </View>
    <ImageBackground
      source={require('../assets/logo/Ellipse.png')}
      style={styles.ellipse}>
      <Text style={{color: 'white'}}>Don't have an account? </Text>
      <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
        <Text style={{color: '#6BB0F5', fontWeight: 'bold'}}>Sign Up</Text>
      </TouchableOpacity>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#082032',
  },
  container: {
    paddingTop: 50,
    paddingHorizontal: 12,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  ellipse: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 136,
    justifyContent: 'center',
    alignItems: 'center',
    // resizeMode: 'cover',
    flexDirection: 'row',
  },
});

export default LoginScreen;
