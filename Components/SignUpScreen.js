import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import tailwind from 'twrnc';

import useBackButton from './useBackButton';
import { AUTH, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from "firebase/firestore";




export default function SignUpScreen() {
    useBackButton();

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [selectedRole, setSelectedRole] = useState('student');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const auth = AUTH;

    const handleEmailChange = (text) => {
        setEmail(text);
        setEmailError('');
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        setPasswordError('');
    };

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        setConfirmPasswordError('');
    };

    const handleSubmit = async () => {
        let isValid = true;
        console.log(auth);

        // // Validate email format
        // if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        //     setEmailError('Please input a valid email');
        //     isValid = false;
        // }

        // // Validate password
        // if (!password || password.length < 6) {
        //     setPasswordError('Please input a valid password (at least 6 characters)');
        //     isValid = false;
        // }

        // // Validate confirm password
        // if (!confirmPassword || confirmPassword !== password) {
        //     setConfirmPasswordError('Passwords do not match');
        //     isValid = false;
        // }

        if (isValid) {

            try {
                // // Create user with email and password
                // await createUserWithEmailAndPassword(auth, email, password);
                // navigation.navigate('Login'); // Navigate to the login screen

                await createUserWithEmailAndPassword(AUTH, email, password)
                    .then((userCredential) => {
                        console.log("success user ");
                        if (selectedRole === "student") {
                            setDoc(doc(db, "Students", email), {
                                email: email,
                                password: password,
                                confirmPassword: confirmPassword,
                                selectedRole: selectedRole,
                            }).then(() => {
                                console.log(`SUBMITED DATA`);
                                navigation.navigate('Student_home');
                            }).catch((error) => {
                                console.log(error);
                                Alert.alert("Already Have an account!");
                            })
                        } else {
                            setDoc(doc(db, "Teachers", email), {
                                email: email,
                                password: password,
                                confirmPassword: confirmPassword,
                                selectedRole: selectedRole,
                            }).then(() => {
                                console.log(`SUBMITED DATA`);
                                navigation.navigate('Teachers_form', { teacherEmail: email });
                            }).catch((error) => {
                                console.log(error);
                                Alert.alert("Already Have an account!");
                            })
                        }

                    })
                    .catch((error) => {
                        console.log("ERROR : " + error);
                    });


            } catch (error) {
                console.error('Signup Error: ', error);
            }
        }
        else {
            Alert.alert("HELLOW NOT ONE HERE!");
        }
    };

    return (
        <View style={tailwind`flex-1 items-center justify-center bg-[#3B3F46]`}>
            <View style={tailwind`p-8 w-full max-w-sm`}>
                <Text style={tailwind`text-5xl text-center font-bold mb-6 text-[#F5B302]`}>Sign Up</Text>

                <TextInput
                    style={tailwind`w-full bg-[#292b2e] text-white rounded-md h-12 px-4 mb-4`}
                    placeholderTextColor="#696a6b"
                    placeholder="Enter your email"
                    onChangeText={handleEmailChange}
                />
                {emailError ? <Text style={tailwind`text-red-500 mb-2`}>{emailError}</Text> : null}

                <TextInput
                    style={tailwind`w-full bg-[#292b2e] text-white rounded-md h-12 px-4 mb-4`}
                    placeholderTextColor="#696a6b"
                    placeholder="Create a password"
                    onChangeText={handlePasswordChange}
                    secureTextEntry
                />
                {passwordError ? <Text style={tailwind`text-red-500 mb-2`}>{passwordError}</Text> : null}

                <TextInput
                    style={tailwind`w-full bg-[#292b2e] text-white rounded-md h-12 px-4 mb-4`}
                    placeholderTextColor="#696a6b"
                    placeholder="Confirm password"
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry
                />
                {confirmPasswordError ? <Text style={tailwind`text-red-500 mb-2`}>{confirmPasswordError}</Text> : null}
                <View style={tailwind`w-full bg-[#292b2e] rounded-md h-12 px-4 mb-4`}>

                    <Picker
                        selectedValue={selectedRole}
                        onValueChange={(itemValue) => setSelectedRole(itemValue)}
                        style={tailwind`text-white`}
                        placeholder='student'
                        placeholderTextColor="#696a6b"
                    >
                        <Picker.Item label="Student" value="student" />
                        <Picker.Item label="Teacher" value="teacher" />
                    </Picker>
                </View>

                <TouchableOpacity
                    style={tailwind`h-12 border-2 border-[#F5B302] bg-[#F5B302] text-white rounded-md flex flex-row justify-center items-center px-6`}
                    onPress={handleSubmit}
                >
                    <View style={tailwind`flex-1 flex items-center`}>
                        <Text style={tailwind`text-white font-medium text-2xl`}>Sign Up</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={tailwind`text-white my-4`}>Already have an account? <Text style={tailwind`font-extrabold text-[#F5B302]`}>Log In</Text></Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}
