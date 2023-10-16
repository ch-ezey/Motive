import { Image, View, Text, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Comment from '../components/home/Comment'

const CommentScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
        <Header navigation={navigation}/>
        <Comment/>
    </SafeAreaView>
  )
}

const Header = ({navigation}) => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image 
          style={{tintColor: 'white', height: 30, width:30}}
          source={require('../assets/icons/back.png')}>
        </Image>
      </TouchableOpacity>
      <Text style={styles.headerText}>COMMENTS</Text>
      <Text></Text>
    </View>
  )

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#082032',
        flex: 1,
    },

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 7,
        marginVertical: 10,
    },

    headerText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 22,
        marginRight: 25,
    }
});

export default CommentScreen