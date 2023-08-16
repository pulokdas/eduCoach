import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BottomTabBar from '../BottomTabBar';
import tailwind from 'twrnc';
import { db, AUTH } from '../../firebase'; // Import your firebase configuration and database reference
import { doc, getDoc } from "firebase/firestore";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function TeacherHomeScreen(activeTab) {
    const [userInfo, setUserInfo] = useState(null);


    useEffect(() => {
        // Fetch user information from Firestore
        const fetchUserInfo = async () => {
            try {
                const userDocRef = doc(db, "Teachers", AUTH.currentUser.email);
                const docSnapshot = await getDoc(userDocRef);
                if (docSnapshot.exists()) {
                    setUserInfo(docSnapshot.data());
                }
                console.log(userInfo)
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <View style={tailwind`h-full bg-[#3B3F46]`}>
            {/* Display user information */}
            {userInfo && (
                <View>
                    <View style={tailwind`mt-8 mx-4 flex-row  items-center justify-between`}>
                        <Text style={tailwind`text-white  text-3xl font-extrabold `}>My Profile</Text>
                        <TouchableOpacity
                            style={tailwind`h-12 w-3/12 border-2 border-[#F5B302] bg-[#F5B302] rounded-md flex flex-row justify-center items-center px-2`}

                        >
                            <View style={tailwind`flex-1 flex items-center`}>
                                <Text style={tailwind`text-white font-medium text-lg`}>LogOut</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={tailwind`flex-row items-center justify-between mx-4`}>
                        <Text style={tailwind`text-white text-2xl`}><Icon name="user" size={25} color='white' /></Text>
                        <Text style={tailwind`text-white text-2xl`}> {userInfo.name}</Text>
                    </View>
                    <View style={tailwind`flex-row items-center justify-between mx-4`}>
                        <Text style={tailwind`text-white text-2xl`}><Icon name="envelope" size={25} color='white' /></Text>
                        <Text style={tailwind`text-white text-2xl`}> {userInfo.email}</Text>
                    </View>
                    <View style={tailwind`flex-row items-center justify-between mx-4`}>
                        <Text style={tailwind`text-white text-2xl`}><Icon name="phone" size={25} color='white' /></Text>
                        <Text style={tailwind`text-white text-2xl`}> {userInfo.phone}</Text>
                    </View>
                    <View style={tailwind`flex-row items-center justify-between mx-4`}>
                        <Text style={tailwind`text-white text-2xl`}><Icon name="graduation-cap" size={25} color='white' /></Text>
                        <Text style={tailwind`text-white text-2xl`}> {userInfo.institute}</Text>
                    </View>



                </View>
            )}

            <BottomTabBar />
        </View>
    );
}
