import {TouchableOpacity, View, Text, Image, StyleSheet} from 'react-native';

const Header = ({navigation}) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image
        style={{tintColor: 'white', height: 30, width: 30}}
        source={require('../../assets/icons/back.png')}
      />
    </TouchableOpacity>
    <Text style={styles.headerText}>CREATE EVENT</Text>
    <Text></Text>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingVertical: 5,
  },

  headerText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 25,
    marginRight: 35,
  },
});
export default Header;
