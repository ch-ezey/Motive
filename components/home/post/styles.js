//components/Post/styles.js
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  pfp: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 6,
  },

  container: {
    backgroundColor: '#213647',
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    overflow: 'hidden',
    elevation: 5,
    paddingBottom: 10,
    backfaceVisibility: 'hidden',
  },

  icon: {
    tintColor: '#B93A21',
    width: 23,
    height: 23,
    margin: 5,
    resizeMode: 'contain',
  },

  footerIcon: {
    tintColor: '#B93A21',
    width: 27,
    height: 27,
    marginHorizontal: 35,
    marginTop: 5,
    resizeMode: 'contain',
  },

  footerIconActive: {
    tintColor: 'white',
    width: 27,
    height: 27,
    marginHorizontal: 35,
    marginTop: 5,
    resizeMode: 'contain',
  },

  allFooterIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  placeholder: {
    height: 35,
    width: 35,
    borderRadius: 50,
    backgroundColor: 'grey',
  },

  placeholderText: {
    height: 16,
    width: 100,
    backgroundColor: 'grey',
    borderRadius: 8,
  },

  image: {
    width: '100%',
    height: '100%',
  },
});

export default styles;
