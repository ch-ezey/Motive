import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';

import EditHeader from '../components/editProfile/EditHeader';
import EditInputs from '../components/editProfile/EditInputs';
import EditImages from '../components/editProfile/EditImages';
import {auth, db} from '../firebase';
import {doc, updateDoc} from '@firebase/firestore';
import {updateProfile} from '@firebase/auth';

const EditProfileScreen = ({route, navigation}) => {
  const initialUserInfo = route.params?.info;
  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValues, setInputValues] = useState(initialUserInfo);

  const handleInputChange = (name, value) => {
    setInputValues(prevValues => ({...prevValues, [name]: value}));
    setHasChanges(true);
  };

  // Update hasChanges whenever userInfo changes
  useEffect(() => {
    console.log(inputValues),
      setHasChanges(
        JSON.stringify(inputValues) !== JSON.stringify(initialUserInfo),
      );
  }, [userInfo, initialUserInfo, inputValues]);

  const handleUserInfoChange = newInfo => {
    setUserInfo(newInfo);
    setHasChanges(true); // Set hasChanges to true whenever inputs change
  };

  const onUpdate = async values => {
    try {
      const userInput = {
        name: values.name,
        username: values.username,
        email: values.email,
        bio: values.bio,
        number: values.number,
      };

      await updateDoc(doc(db, 'users', auth.currentUser.uid), userInput).catch(
        error => {
          console.log(error.message);
        },
      );

      updateProfile(auth.currentUser, {
        displayName: values.username,
      }).catch(error => {
        Alert.alert('This is awkward...', error.message);
      });

      console.log(userInput);

      console.log('Data Submitted');
    } catch (error) {
      Alert.alert('This is awkward...', error.message);
    }
  };

  const handleSavePress = async () => {
    setIsSubmitting(true);

    try {
      await onUpdate(inputValues);
      setHasChanges(false); // Reset hasChanges after successful save
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Error Saving Profile',
        error.message || 'An error occurred.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const SaveIcon = () => (
    <View style={{position: 'absolute', bottom: 20, right: 30}}>
      {hasChanges ? (
        <Pressable
          onPress={handleSavePress}
          style={({pressed}) => [
            styles.saveButton,
            {
              backgroundColor: pressed ? '#772414' : '#B93A21',
              opacity: pressed ? 0.5 : 1,
            },
          ]}
          disabled={!hasChanges}>
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Image
              style={styles.icon}
              source={require('../assets/icons/floppy-disk.png')}
            />
          )}
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <>
        <ScrollView>
          <EditImages userInfo={userInfo} onChange={handleUserInfoChange} />
          <EditInputs
            userInfo={inputValues}
            onInputChange={handleInputChange}
          />
        </ScrollView>
        <EditHeader navigation={navigation} userInfo={userInfo} />
        <SaveIcon />
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#082032',
    flex: 1,
  },

  saveButton: {
    backgroundColor: '#B93A21',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    elevation: 10,
    height: 57,
    width: 57,
  },

  icon: {
    tintColor: '#DADADA',
    margin: 10,
    width: 30,
    height: 30,
  },
});

export default EditProfileScreen;
