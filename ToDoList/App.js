import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Today from './Screens/Today'
import Month from './Screens/Month'
import 'react-native-gesture-handler';

export default function App() {

  const Drawer = createDrawerNavigator()
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName='Today'
        //screenOptions={{headerShown:false}}
      >
        <Drawer.Screen
          name = "Today" component={Today}/>
        <Drawer.Screen
          name = "Month" component={Month}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
