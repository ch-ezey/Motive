import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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
import EditProfileScreen from './screens/EditProfileScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const screenOptions = {
  headerShown: false,
};

const PostStack = createStackNavigator();

const TabStack = createBottomTabNavigator();

// Tried Nesting BottomTabNavigator in StackNavigator but whenever
// I tried to go back to the HomeScreen with "animationEnabled: false", a
// commentSheet opens that's not connected to a post. Need to fix so I can
// properly implement nesting.

// export const SignedInStack = () => (
//   <GestureHandlerRootView style={{flex: 1}}>
//     <NavigationContainer>
//       <PostStack.Navigator
//         initialRouteName="HomeTabs"
//         screenOptions={
//           ([screenOptions], {headerShown: false, animationEnabled: false})
//         }>
//         <PostStack.Screen name="HomeTabs" component={BottomTab} />
//         <PostStack.Screen name="SearchScreen" component={SearchScreen} />
//         <PostStack.Screen name="NewPostScreen" component={NewPostScreen} />
//         <PostStack.Screen name="EventScreen" component={EventScreen} />
//         <PostStack.Screen name="ProfileScreen" component={ProfileScreen} />
//         {/* <PostStack.Screen
//           name="EditProfileScreen"
//           component={EditProfileScreen}
//         /> */}
//         <PostStack.Screen name="FriendScreen" component={FriendScreen} />
//         {/* <PostStack.Screen name="UserScreen" component={UserScreen} /> */}
//       </PostStack.Navigator>
//     </NavigationContainer>
//   </GestureHandlerRootView>
// );

// export const BottomTab = () => (
//   <TabStack.Navigator tabBar={() => null} screenOptions={screenOptions}>
//     <TabStack.Screen name="HomeScreen" component={HomeScreen} />
//     <TabStack.Screen name="SearchScreen" component={SearchScreen} />
//     <TabStack.Screen name="EventScreen" component={EventScreen} />
//     <TabStack.Screen
//       name="ProfileScreen"
//       component={ProfileScreen}
//       options={{unmountOnBlur: true}}
//     />
//     <TabStack.Screen
//       name="EditProfileScreen"
//       component={EditProfileScreen}
//       options={{unmountOnBlur: true}}
//     />
//     <TabStack.Screen
//       name="UserScreen"
//       component={UserScreen}
//       options={{unmountOnBlur: true}}
//     />
//   </TabStack.Navigator>
// );

export const SignedInStack = () => (
  <GestureHandlerRootView style={{flex: 1}}>
    <NavigationContainer>
      <TabStack.Navigator
        backBehavior="history"
        tabBar={() => null}
        screenOptions={screenOptions}>
        <TabStack.Screen name="HomeScreen" component={HomeScreen} />
        <TabStack.Screen name="SearchScreen" component={SearchScreen} />
        <TabStack.Screen
          name="NewPostScreen"
          component={NewPostScreen}
          options={{unmountOnBlur: true}}
        />
        <TabStack.Screen name="EventScreen" component={EventScreen} />
        <TabStack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{unmountOnBlur: true}}
        />
        <TabStack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{unmountOnBlur: true}}
        />
        <TabStack.Screen name="FriendScreen" component={FriendScreen} />
        <TabStack.Screen
          name="UserScreen"
          component={UserScreen}
          options={{unmountOnBlur: true}}
        />
      </TabStack.Navigator>
    </NavigationContainer>
  </GestureHandlerRootView>
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
