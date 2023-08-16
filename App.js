import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './Components/LoginScreen';
import SignUpScreen from './Components/SignUpScreen';
import LandingPage from './Components/LandingPage';
import Home from './Components/Home';
import Teachers_form from './Components/TeacherUI/Teachers_form'
import TeacherProfile from './Components/TeacherUI/Teacher_profile';
import TeacherHomeScreen from './Components/TeacherUI/Teacher_Home'
import ChatBox from './Components/Chatbox';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentHomeScreen from './Components/StudentUI/Student_home';
import StudentProfile from './Components/StudentUI/Students_profile';
import CreatePostScreen from './Components/post_components/CreatePostScreen';
// import { useState } from 'react';
const Stack = createNativeStackNavigator();


function LandingStack() {
  return (
    <Stack.Navigator initialRouteName="LandingPage">
      <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
function TacherStack() {
  return (
    <Stack.Navigator initialRouteName="Homet">
      <Stack.Screen name="Homet" component={TeacherHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Teacher_profile" component={TeacherProfile} options={{ headerShown: false }} />
      <Stack.Screen name="Chatbox" component={ChatBox} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
function StudentStack() {
  return (
    <Stack.Navigator initialRouteName="Homes">
      <Stack.Screen name="Homes" component={StudentHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Students_profile" component={StudentProfile} options={{ headerShown: false }} />
      <Stack.Screen name="Chatbox" component={ChatBox} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingStack" >
        <Stack.Screen name="LandingStack" component={LandingStack} options={{ headerShown: false }} />
        <Stack.Screen name="Home" options={{ headerShown: false }} component={Home} />
        <Stack.Screen name='Teachers_form' component={Teachers_form} />
        <Stack.Screen name='Teacher_Home' component={TacherStack} options={{ headerShown: false }} />
        <Stack.Screen name='Student_home' component={StudentStack} options={{ headerShown: false }} />
        <Stack.Screen name='CreatePostScreen' component={CreatePostScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
