import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Image } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

const Results = ({}) => {

  // console.log(postInfo[0].imageUrl);

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

export default Results