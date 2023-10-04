import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Image } from 'react-native-elements';

const ProfPosts = ({postInfo}) => {

  // console.log(postInfo[0].imageUrl);

  return (
    <View style={styles.container}>
      
      {/* <View style={{
          width: '33%',
          height: 100,
          // flex: 1,
        }}>
       <Image source={{uri: postInfo[0].imageUrl}} style={{height: '100%', width: '100%',}}/>
      </View>
      <View style={{
          width: '33%',
          height: 100,
          // flex: 1,
        }}>
       <Image source={{uri: postInfo[0].imageUrl}} style={{height: '100%', width: '100%',}}/>
      </View>
      <View style={{
          width: '33%',
          height: 100,
          // flex: 1,
        }}>
       <Image source={{uri: postInfo[0].imageUrl}} style={{height: '100%', width: '100%',}}/>
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
    
  container: { 
    // justifyContent: 'space-around',
    // alignItems: 'center',
    // flexDirection: 'row',
    margin: 5,
    // height: "auto",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderColor: 'white',
    borderWidth: 1,
    // borderRadius: 10
    
  },
});

export default ProfPosts