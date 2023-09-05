import {Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { app, auth } from '../../firebase'
import { signOut } from 'firebase/auth'
import { clearIndexedDbPersistence } from '@firebase/firestore'

const handleSignout = async () => {
  try {
    console.log(auth.currentUser.displayName)
    await signOut(auth)
  } catch(error) {
  console.log(error)
  }
}


const Header = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSignout}>
        <Image style={styles.logo} 
          source={require('../../assets/logo/Long.png')}></Image>
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <TouchableOpacity 
          onPress={(() => {
          navigation.navigate('NewPostScreen');
          })}
        >
          <Image style={styles.icon} 
            source={require('../../assets/icons/add.png')}></Image>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={(() => {
          navigation.navigate('FriendScreen');
          })}
        >
          <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                99+
              </Text>
            </View>
          <Image style={styles.icon} 
            source={require('../../assets/icons/friends.png')}></Image>
                    
        </TouchableOpacity>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    logo: {
      width: 100,
      height: 38,
      resizeMode: 'contain',
    },
    container: { 
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      margin: 5,
    },
    iconContainer: {
      flexDirection: 'row',
    },
    icon: {
      tintColor: '#B93A21',
      marginTop: 10,
      margin: 6,
      marginHorizontal: 10,
      width: 32,
      height: 32,
      resizeMode: 'contain',
    },
    unreadBadge: {
      backgroundColor: 'white',
      position: 'absolute',
      left: 20,
      bottom: 27,
      width: 28,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    },

    unreadBadgeText: {
      color: '#2C394B',
      fontWeight: '600',
    }
  });

  export default Header