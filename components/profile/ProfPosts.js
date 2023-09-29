import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const ProfPosts = ({postInfo}) => {
  return (
    <View>
      <Text>ProfPosts</Text>
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
    borderWidth: 1,
    // borderRadius: 10
    
  },
});

export default ProfPosts