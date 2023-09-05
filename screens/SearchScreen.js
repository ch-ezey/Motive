import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import BottomTabs from '../components/universal/BottomTabs'
import { BottomTabIcons } from '../components/universal/BottomTabs'

const SearchScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
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

export default SearchScreen