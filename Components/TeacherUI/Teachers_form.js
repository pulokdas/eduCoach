import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import tailwind from 'twrnc';
import useBackButton from '../useBackButton';
import { useNavigation } from '@react-navigation/native';
import  {ImagePicker, launchImageLibrary} from 'react-native-image-picker';

import { PermissionsAndroid } from 'react-native';
import { db } from '../../firebase'; // Import the 'db' instance from your Firebase config file
import { useRoute } from '@react-navigation/native';
import { doc, updateDoc } from "firebase/firestore";


export default function SignUpScreen() {
    useBackButton();
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [institute, setInstitute] = useState('');
    const [topic, setTopic] = useState('');
    const route = useRoute();
    const { teacherEmail } = route.params;
    useEffect(() => {
        requestMediaPermission();
    }, []);

    async function requestMediaPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Media Access Permission',
                    message: 'App needs access to your media to select images.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Media permission granted');
            } else {
                console.log('Media permission denied');
            }
        } catch (error) {
            console.warn(error);
        }
    }

    const handleImagePick = () => {
        ImagePicker.launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 1,
            },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else {
                    setSelectedImage(response.uri);
                }
            }
        );
    };

    const handleSubmit = () => {


        const teacherDocumentId = teacherEmail;

        updateDoc(doc(db, "Teachers", teacherDocumentId), {
            name: name,
            phone: phone,
            institute: institute,
            topic: topic,
            profileImage: selectedImage,
        })
        navigation.navigate('Teacher_Home');
    };

    return (
        <View style={tailwind`flex-1 items-center justify-center bg-[#3B3F46]`}>
            <View style={tailwind`p-6 w-full max-w-sm`}>
                <Text style={tailwind`text-3xl text-center font-bold mb-6 text-white`}>
                    If You Are a{' '}
                    <Text style={tailwind`text-3xl text-center font-bold mb-6 text-[#F5B302]`}>
                        Tutor
                    </Text>{' '}
                    Fill Up This Form
                </Text>
                <TouchableOpacity onPress={handleImagePick}>
                    {selectedImage ? (
                        <Image
                            source={{ uri: selectedImage }}
                            style={tailwind`w-20 h-20 rounded-full mb-4`}
                        />
                    ) : (
                        <View style={tailwind`w-20 h-20 bg-gray-400 rounded-full`} />
                    )}
                    <Text style={tailwind`text-gray-400 mb-4`} > Choose a image </Text>
                </TouchableOpacity>
                <TextInput
                    style={tailwind`w-full bg-[#292b2e] text-white rounded-md h-12 px-4 mb-4`}
                    placeholderTextColor="#696a6b"
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={tailwind`w-full bg-[#292b2e] text-white rounded-md h-12 px-4 mb-4`}
                    placeholderTextColor="#696a6b"
                    placeholder="Phone"
                    value={phone}
                    onChangeText={setPhone}
                    secureTextEntry
                />
                <TextInput
                    style={tailwind`w-full bg-[#292b2e] text-white rounded-md h-12 px-4 mb-4`}
                    placeholderTextColor="#696a6b"
                    placeholder="Institute"
                    value={institute}
                    onChangeText={setInstitute}
                    secureTextEntry
                />
                <TextInput
                    style={tailwind`w-full bg-[#292b2e] text-white rounded-md h-12 px-4 mb-4`}
                    placeholderTextColor="#696a6b"
                    placeholder="Topic or Subject that you are specialized on"
                    value={topic}
                    onChangeText={setTopic}
                    secureTextEntry
                />
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={tailwind`h-12 border-2 border-[#F5B302] bg-[#F5B302] text-white rounded-md flex flex-row justify-center items-center px-6`}
                >
                    <View style={tailwind`flex-1 flex items-center`}>
                        <Text style={tailwind`text-white font-medium text-2xl`}>SUBMIT</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={tailwind`text-white my-4`}>
                        Not a Tutor?{' '}
                        <Text style={tailwind`font-extrabold text-[#F5B302]`}>
                            Register As a Student
                        </Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
