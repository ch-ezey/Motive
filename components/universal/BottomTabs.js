import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import React, { useState } from 'react'
import { Divider } from 'react-native-elements'
import { useIsFocused, useRoute } from '@react-navigation/native'
import { auth } from '../../firebase'

export const BottomTabIcons = [
  {
    name: 'Homepage',
    active: require('../../assets/icons/homeA.png'),
    inactive: require('../../assets/icons/home.png'),
    screen: 'HomeScreen',
  },
  {
    name: 'Search',
    active: require('../../assets/icons/searchA.png'),
    inactive: require('../../assets/icons/search.png'),
    screen: 'SearchScreen',
  },
  {
    name: 'Events',
    active: require('../../assets/icons/listA.png'),
    inactive: require('../../assets/icons/list.png'),
    screen: 'EventScreen'
  },
  {
    name: 'Profile',
    active: require('../../assets/icons/userA.png'),
    inactive: require('../../assets/icons/user.png'),
    screen: 'ProfileScreen',
    // pfp: auth.currentUser.photoURL ? auth.currentUser.photoURL : null
  },
]

const BottomTabs = ({icons, navigation}) => {
  const [activeTab, setActiveTab] = useState('Home')

  const Icon = ({icon}) => (
    <TouchableOpacity 
      onPress={(() => {
          setActiveTab(icon.name);
          navigation.navigate(icon.screen);
      })}
    >
      <Image 
        source={
          (useRoute().name == icon.screen
          ? icon.active 
          : icon.inactive)
        } 
        style={[
          styles.icon,
           icon.name == 'Profile' 
           ? styles.profilePic() 
           : null,
        // activeTab == 'Profile' && icon.name == activeTab 
        //   ? styles.profilePic(activeTab) 
        //   : null,
          ]}
        />
    </TouchableOpacity>
  )
  return (
    <View style={styles.wrapper}>
      <Divider width={1} orientation={'horizontal'}/>
      <View style={styles.container}>
        {icons.map((icon, index) => (
          <Icon key={index} icon={icon}/>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    // position: 'absolute',
    width: '100%',
    bottom: '0%',
    // zIndex: 999,
    backgroundColor: '#082032',
    // height: 0
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
    paddingTop: 10,
  },

  icon: {
    width: 30,
    height: 30,
  },

  // dynamic styling
  profilePic: (activeTab = '' ) => ({
    borderRadius: 50,
    borderWidth: activeTab == 'Profile' ? 2 : 0,
    borderColor: '#fff'
  })
})

export default BottomTabs