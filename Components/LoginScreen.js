import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import tailwind from 'twrnc';

import useBackButton from './useBackButton';
import { db, AUTH } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    useBackButton();

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const auth = AUTH;

    const handleEmailChange = (text) => {
        setEmail(text);
        setEmailError('');
    };

    const handleSignUpPress = () => {
        navigation.navigate('SignUp');
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        setPasswordError('');
    };



    const handleSubmit = async () => {
        let isValid = true;

        // Validate email format
        if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            setEmailError('Please input a valid email');
            isValid = false;
        }

        // Validate password
        if (!password || password.length < 6) {
            setPasswordError('Please input a valid password (at least 6 characters)');
            isValid = false;
        }

        if (isValid) {
            try {
                const userDocRef = doc(db, "Students", email);
                const docSnapshot = await getDoc(userDocRef);
                const userDocRef1 = doc(db, "Teachers", email);
                const docSnapshot1 = await getDoc(userDocRef1);

                console.log(userDocRef.selectedRole + "  ===  " + userDocRef1.selectedRole + " " + email)



                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    if (userData.selectedRole === 'student') {
                        // Authenticate the user first
                        await signInWithEmailAndPassword(auth, email, password);
                        // Then navigate based on the role
                        navigation.navigate('Student_home', { email: userData.email });
                    } else {
                        console.error('Role not recognized: student');
                    }
                } else if (docSnapshot1.exists()) {
                    const userData1 = docSnapshot1.data();
                    console.log(userData1, userData1.selectedRole);
                    if (userData1.selectedRole === 'teacher') {
                        // Authenticate the user first
                        await signInWithEmailAndPassword(auth, email, password);
                        // Then navigate based on the role
                        navigation.navigate('Teacher_Home', { email: userData1.email });
                    } else {
                        console.error('Role not recognized: teacher');
                    }
                }
                else {
                    console.log("User data not found");
                }
            } catch (error) {
                console.error('Login Error:', error);
            }
        }
    };



    return (
        <View style={tailwind`flex-1 items-center justify-center bg-[#3B3F46]`}>
            <View style={tailwind`p-8 w-full max-w-sm`}>
                <Text style={tailwind`text-5xl text-center font-bold mb-6 text-[#F5B302]`}>Login</Text>

                <TextInput
                    style={tailwind`w-full bg-[#292b2e] rounded-md text-white h-12 px-4 mb-4`}
                    placeholderTextColor="#696a6b"
                    placeholder="Enter email address"
                    onChangeText={handleEmailChange}
                />
                {emailError ? <Text style={tailwind`text-red-500 mb-2`}>{emailError}</Text> : null}

                <TextInput
                    style={tailwind`w-full bg-[#292b2e] text-white rounded-md h-12 px-4`}
                    placeholderTextColor="#696a6b"
                    placeholder="Enter password"
                    onChangeText={handlePasswordChange}
                    secureTextEntry
                />
                {passwordError ? <Text style={tailwind`text-red-500 mb-2`}>{passwordError}</Text> : null}

                <View style={tailwind`flex flex-row justify-between items-center my-8`}>
                    <View style={tailwind`flex-row items-center`}>
                        <TouchableOpacity style={tailwind`bg-white h-6 w-6 rounded-sm mr-2`} />
                        <Text style={tailwind`text-white`}>Remember me</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={tailwind`text-white font-bold`}>Reset password</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={tailwind`h-12 border-2 border-[#F5B302] bg-[#F5B302] rounded-md flex flex-row justify-center items-center px-6`}
                    onPress={handleSubmit}
                >
                    <View style={tailwind`flex-1 flex items-center`}>
                        <Text style={tailwind`text-white font-medium text-2xl`}>Login</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignUpPress}>
                    <Text style={tailwind`text-white my-4`}> Don't have an account? <Text style={tailwind`font-extrabold text-[#F5B302]`}>Sign Up</Text> </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
