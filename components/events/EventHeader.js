import {Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { auth, db } from '../../firebase'
import { doc, getDoc } from '@firebase/firestore';

const EventHeader = ({}) => {
    
  return (
    <View style={styles.container}>

      <TouchableOpacity>
    <Text style={styles.headerText}>Saved Events</Text>
      </TouchableOpacity>
      
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

  export default EventHeader