import {Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { auth, db } from '../../firebase'
import { doc, getDoc } from '@firebase/firestore';

const test = async () => {
  try {
    console.log(auth.currentUser.displayName)
  } catch(error) {
  console.log(error)
  }
}

const ProfHeader = ({userInfo}) => {

  // const user = auth.currentUser
  
  const profile_picture = userInfo.profile_picture;
  const username = userInfo.username;

  console.log(userInfo);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={test}
        >
    <Text style={styles.headerText}>{username}</Text>
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Image style={styles.icon} 
            source={require('../../assets/icons/menu.png')}></Image>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    
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
      tintColor: 'white',
      marginTop: 0,
      marginHorizontal: 10,
      width: 32,
      height: 32,
      resizeMode: 'contain',
    },

    headerText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 26,
        marginLeft: 5,
        textTransform: 'uppercase'
      }
  });

  export default ProfHeader