import * as React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  StyleSheet,
  ImageBackground,
  Button,
  Alert,
  TouchableOpacity,
  Icon,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Destination from '../Layout/Destination';
import Tickets from '../Layout/Tickets';

export default function CustomListItem({ item, setIsBottomNavShowing, setqueryData, queryData,type }) {
  return (
  <View style={styles.container} onTouchStart={() => {setIsBottomNavShowing(false);
    if (type === 'departure') {
      setqueryData({ ...queryData, departure: item.Name, start_point: item});
    } else {
      setqueryData({
        ...queryData,
        destination: item.Name, end_point: item
      });
    }
  }}>
      <FontAwesome
        style={styles.inputIcon}
        name="map-marker"
        size={20}
        color="red"
      />
      <Text style={{ marginLeft: 20 }}>{item.Name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: 40,
    padding: 10,
    margin: 10,
    borderBottomColor: '#cfd4d8',
    borderTopColor: '#f4f6f8',
    borderRightColor: '#f4f6f8',
    borderLeftColor: '#f4f6f8',
    borderWidth: 1,
  },
});
