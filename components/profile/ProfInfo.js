import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { auth, db, storage } from '../../firebase'
import { Image } from 'react-native-elements'
import { collection, collectionGroup, getCountFromServer, onSnapshot, query, where } from '@firebase/firestore'

const ProfInfo = ({userInfo}) => {

  // console.log(profile_picture);

  return (
    <View style={styles.container}>

      <View style={{
          width: 100,
          height: 100,
        }}>
       <Image source={{ uri: userInfo.profile_picture }} style={styles.pfp}/>
      </View>

      <View style={styles.infoContainer}>

        <View style={styles.info}>
          <Text style={{color: 'white', textAlign: 'center'}}>0</Text>
          <Text style={styles.infoText}>Posts</Text>
        </View>

        <View style={styles.info}>
          <Text style={{color: 'white', textAlign: 'center'}}>0</Text>
          <Text style={styles.infoText}>Followers</Text>
        </View>

        <View style={styles.info}>
          <Text style={{color: 'white', textAlign: 'center'}}>0</Text>
          <Text style={styles.infoText}>Following</Text>
        </View>

      </View>

    </View>
  )
}

const styles = StyleSheet.create({
    
  container: { 
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderColor: 'white',
    // borderWidth: 1,
    // borderRadius: 10
    
  },

  infoContainer: {
    flexDirection: 'row',
    borderColor: 'white',
    // borderWidth: 1,
  },
  
  info: {
    margin: 10,
    flexDirection: 'column',
    borderColor: 'white',
    // borderWidth: 1,
  },

  infoText: {
    color: 'white',
    fontWeight: '500'
  },

  pfp: {
    height: '100%', 
    width: '100%', 
    borderRadius: 100, 
    borderColor: 'white', 
    // borderWidth: 1.5
  }
});

export default ProfInfo