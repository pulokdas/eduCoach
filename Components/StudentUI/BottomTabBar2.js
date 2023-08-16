import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library
// import TeacherProfile from './TeacherUI/Teacher_profile';
const BottomTabBar = ({ activeTab, onTabPress }) => {
    const navigation = useNavigation();
    return (
        <View style={tailwind`absolute bottom-0 left-0 right-0 flex-row justify-around items-center bg-[#F5B302] py-2`}>
            <TouchableOpacity onPress={() => navigation.navigate('Student_home')} style={tailwind`flex items-center`}>
                <View style={tailwind`flex-1 `}>
                    <Text><Icon name="home" size={40} color={activeTab === 'home' ? 'white' : '#3B3F46'} /></Text>

                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Chatbox')} style={tailwind`flex items-center`}>
                <View>
                    <Text><Icon name="comments" size={40} color={activeTab === 'chat' ? 'white' : '#3B3F46'} /></Text>

                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Students_profile')} style={tailwind`flex items-center`}>
                <View>
                    <Text><Icon name="user" size={40} color={activeTab === 'profile' ? 'white' : '#3B3F46'} /></Text>

                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CreatePostScreen')} style={tailwind`flex items-center`}>
                <View>
                    <Text><Icon name="plus" size={40} color={activeTab === 'profile' ? 'white' : '#3B3F46'} /></Text>

                </View>
            </TouchableOpacity>
        </View>
    );
};

export default BottomTabBar;
