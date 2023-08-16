import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';
import { useNavigation } from '@react-navigation/native';
export default function LandingPage() {
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={require('../assets/images/bg.jpg')}
      style={tailwind`bg-center bg-no-repeat bg-gray-900 bg-blend-multiply flex-1`}
    >
      <View style={tailwind`px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56`}>
        <Text style={tailwind`text-[#F5B302] text-6xl mt-24 font-extrabold tracking-tight leading-none  text-center `}>Edu Coach</Text>
        <Text style={tailwind`mb-8 text-4xl font-extrabold tracking-tight leading-none text-white text-center  md:text-5xl lg:text-6xl`}>

          <Text>-Your Gateway to Limitless Learning</Text>
        </Text>
        <Text style={tailwind`mb-8 text-lg font-normal text-gray-100 lg:text-xl sm:px-16 lg:px-48`}>
          Ignite Boundless Learning. Connect with expert teachers, thrive in personalized education."
        </Text>
        <View style={tailwind`flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4`}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignUp');
            }}
            style={tailwind`inline-flex justify-center items-center mb-6 py-4 px-5 text-base font-medium text-center text-white rounded-lg bg-[#F5B302]`}
          >
            <Text style={tailwind`text-white text-xl font-extrabold`}>Sign Up</Text>

          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Login');
            }}
            style={tailwind`inline-flex justify-center items-center  py-4 px-5 text-base font-medium text-center text-white rounded-lg border-2 border-[#F5B302]`}
          >
            <Text style={tailwind`text-[#F5B302] text-xl font-extrabold`}>Log In</Text>

          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // Navigate to the "Aboutus" screen
            }}

          >
            <Text style={tailwind`text-gray-200 text-lg font-bold text-center underline`}>Learn more</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
