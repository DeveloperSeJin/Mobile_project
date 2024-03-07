import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Screens/Login'
import Find from './Screens/Find'
import SignUp from './Screens/SignUp'
import Home from './Screens/Home'
import StudentList from './Screens/StudentList'
import ClassInformation from './Screens/ClassInformation'
import StudentInformation from './Screens/StudentInfomation'
import SelectStrategy from './Screens/SelectStrategy';
import Question from './Screens/Question';

const Stack = createStackNavigator();

 export default function App() {
   return (
     <NavigationContainer>
       <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
         <Stack.Screen name = "Login" component = {Login}/>
         <Stack.Screen name = "Find" component = {Find}/>
         <Stack.Screen name = "SignUp" component = {SignUp}/>
         <Stack.Screen name = "Home" component = {Home}/>
         <Stack.Screen name = "StudentList" component = {StudentList}/>
         <Stack.Screen name = "ClassInformation" component = {ClassInformation}/>
         <Stack.Screen name = "StudentInformation" component = {StudentInformation}/>
         <Stack.Screen name = "SelectStrategy" component = {SelectStrategy}/>
         <Stack.Screen name = "Question" component = {Question}/>
       </Stack.Navigator>
     </NavigationContainer>
   );
 }
