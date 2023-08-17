import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button } from 'react-native';
import tailwind from 'twrnc';
import useBackButton from '../useBackButton';
import { useNavigation } from '@react-navigation/native';
import { PermissionsAndroid } from 'react-native';
import { db, AUTH } from '../../firebase'; // Import the 'db' instance from your Firebase config file
import { useRoute } from '@react-navigation/native';
import { doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';

export default function SignUpScreen() {
    useBackButton();
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [institute, setInstitute] = useState('');
    const [topic, setTopic] = useState('');
    const [experience, setExperience] = useState('');
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

 const handleImagePick = async () => {
    try {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            console.log(result.uri);
            setSelectedImage(result.uri);
        }
    } catch (error) {
        console.log(error);
    }
};

const handleSubmit = async () => {
    const teacherDocumentId = teacherEmail;

    try {
        if (!selectedImage) {
            console.log('No image selected');
            return;
        }

        const storage = getStorage();
        const metadata = {
            contentType: 'image/jpeg',
        };

        const response = await fetch(selectedImage);
        const blob = await response.blob();

        const storageRef = ref(storage, `teacher_profile_images/${teacherDocumentId}`);
        const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                // You can update a progress state here if needed
            },
            (error) => {
                console.error('Error uploading image:', error);
            },
            async () => {
                // Upload completed successfully, now we can get the download URL
                try {
                    const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

                    // Update Firestore document with the imageUrl
                    const teacherRef = doc(db, 'Teachers', teacherDocumentId);
                    await updateDoc(teacherRef, {
                        name: name,
                        phone: phone,
                        institute: institute,
                        topic: topic,
                        experience: experience,
                        profileImage: imageUrl,
                    });

                    console.log('Teacher data updated successfully');
                    
                    // Navigate to the desired screen
                    navigation.navigate('Teacher_Home');
                } catch (downloadUrlError) {
                    console.error('Error getting download URL:', downloadUrlError);
                }
            }
        );
    } catch (error) {
        console.error('Error updating teacher data:', error);
    }
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
                />
                <TextInput
                    style={tailwind`w-full bg-[#292b2e] text-white rounded-md h-12 px-4 mb-4`}
                    placeholderTextColor="#696a6b"
                    placeholder="Institute"
                    value={institute}
                    onChangeText={setInstitute}
                />
                <TextInput
                    style={tailwind`w-full bg-[#292b2e] text-white rounded-md h-12 px-4 mb-4`}
                    placeholderTextColor="#696a6b"
                    placeholder="Topic or Subject that you are specialized on"
                    value={topic}
                    onChangeText={setTopic}
                />
                <TextInput
                    style={tailwind`w-full bg-[#292b2e] text-white rounded-md h-12 px-4 mb-4`}
                    placeholderTextColor="#696a6b"
                    placeholder="Share your Teaching Experience in yrs"
                    value={experience}
                    onChangeText={setExperience}
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
