import { SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import Header from '../components/home/Header'
import BottomTabs from '../components/universal/BottomTabs'
import { BottomTabIcons } from '../components/universal/BottomTabs'
import PostScreen from './PostScreen'

const HomeScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <PostScreen navigation={navigation}/>
      <BottomTabs navigation={navigation} icons={BottomTabIcons} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
  backgroundColor: '#082032',
  flex: 1,
}
});

export default HomeScreen