import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Image } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

const Lists = ({}) => {

  return (
    <ScrollView style={styles.container}>
      
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    
  container: {
    margin: 5,
    height: "100%",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderColor: 'white',    
  },
});

export default Lists