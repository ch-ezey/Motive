import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import HomeScreen from './screens/HomeScreen';
import NewPostScreen from './screens/NewPostScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import EventScreen from './screens/EventScreen';
import FriendScreen from './screens/FriendScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import UserScreen from './screens/UserScreen';

const screenOptions = {
  headerShown: false,
  // cardShadowEnabled: false,
  // cardStyle: {background: 'black'},
  // animationEnabled: true,
  // animation: 'flip',
};

const PostStack = createStackNavigator();
// const DrawerStack = createDrawerNavigator();

export const SignedInStack = () => (
  <NavigationContainer>
    <PostStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={screenOptions}>
      <PostStack.Screen name="HomeScreen" component={HomeScreen} />
      <PostStack.Screen name="SearchScreen" component={SearchScreen} />
      <PostStack.Screen name="NewPostScreen" component={NewPostScreen} />
      <PostStack.Screen name="EventScreen" component={EventScreen} />
      <PostStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <PostStack.Screen name="FriendScreen" component={FriendScreen} />
      <PostStack.Screen name="UserScreen" component={UserScreen} />
    </PostStack.Navigator>
  </NavigationContainer>
);
export const SignedOutStack = () => (
  <NavigationContainer>
    <PostStack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={screenOptions}>
      <PostStack.Screen name="SignupScreen" component={SignupScreen} />
      <PostStack.Screen name="LoginScreen" component={LoginScreen} />
    </PostStack.Navigator>
  </NavigationContainer>
);

// export const NavDrawer = () => (
//     <NavigationContainer>
//         <Drawer.Navigator useLegacyImplementation
//             initialRouteName="ProfileScreen">

//             <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
//             {/* <Drawer.Screen name="Notifications" component={NotificationsScreen} /> */}

//         </Drawer.Navigator>
//     </NavigationContainer>
// )
