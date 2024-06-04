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
import {auth, db, storage} from '../firebase';
import {deleteDoc, doc, updateDoc} from '@firebase/firestore';
import {updateProfile} from '@firebase/auth';
import {getDownloadURL, ref, uploadBytes} from '@firebase/storage';
import {Formik} from 'formik';

const EditProfileScreen = ({route, navigation}) => {
  const userInfo = route.params?.info;
  // const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValues, setInputValues] = useState(userInfo);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (name, value) => {
    setInputValues(prevValues => ({...prevValues, [name]: value}));
  };

  const handleImageChange = newImageUri => {
    setSelectedImageUri(newImageUri); // Store the selected image URI
  };

  // Update hasChanges whenever userInfo changes
  useEffect(() => {
    setHasChanges(
      JSON.stringify(inputValues) !== JSON.stringify(userInfo) ||
        selectedImageUri, // Check if image has changed
    );
  }, [userInfo, inputValues, selectedImageUri]);

  const uploadImage = async uid => {
    const uri = selectedImageUri;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);

    console.log('uri: ' + uri);
    console.log('filename: ' + filename);
    console.log(uid);

    const pfpImageRef = ref(storage, uid + '/' + 'pfp');

    const img = await fetch(uri);
    const bytes = await img.blob();

    console.log();

    try {
      await uploadBytes(pfpImageRef, bytes);
      const downloadUrl = await getDownloadURL(pfpImageRef);
      console.log('Download Url :: ' + downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdate = async values => {
    try {
      const userInput = {
        name: values.name.trim(),
        username: values.username.trim(),
        email: values.email.trim(),
        bio: values.bio.trim(),
        number: values.number.trim(),
      };

      // Update both user information and profile picture concurrently
      const [downloadURL] = await Promise.all([
        selectedImageUri ? uploadImage(auth.currentUser.uid) : null,
        updateDoc(doc(db, 'users', auth.currentUser.uid), userInput),
      ]);

      if (downloadURL) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          profile_picture: downloadURL,
        });
      }

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
      // 1. Update profile information
      await onUpdate(inputValues);
      setHasChanges(false);
      navigation.goBack();
    } catch (error) {
      // ... error handling ...
    } finally {
      setIsSubmitting(false);
    }
  };

  const SaveButton = () => (
    <Formik>
      <View style={{position: 'absolute', bottom: 20, right: 30}}>
        {hasChanges && (
          <Pressable
            onPress={
              // () => console.log(isFormValid)
              handleSavePress
            }
            style={({pressed}) => [
              styles.saveButton,
              {
                backgroundColor:
                  !isFormValid || isSubmitting // Check form validity AND submission state
                    ? '#838383' // Greyed out if invalid or submitting
                    : pressed
                      ? '#772414'
                      : '#B93A21',
                opacity: pressed ? 0.5 : 1,
              },
            ]}
            disabled={!isFormValid || isSubmitting} // Disable if invalid or submitting
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Image
                style={styles.icon}
                source={require('../assets/icons/floppy-disk.png')}
              />
            )}
          </Pressable>
        )}
      </View>
    </Formik>
  );

  return (
    <SafeAreaView style={styles.container}>
      <>
        <ScrollView>
          <EditImages userInfo={userInfo} onImageChange={handleImageChange} />
          <EditInputs
            userInfo={inputValues}
            onInputChange={handleInputChange}
            hasChanges={hasChanges}
            handleSavePress={handleSavePress}
            isSubmitting={isSubmitting}
            onValidationChange={setIsFormValid}
          />
        </ScrollView>
        <EditHeader navigation={navigation} userInfo={userInfo} />
        <SaveButton />
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
