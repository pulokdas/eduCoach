import React from 'react';
import { View, Text } from 'react-native'
import BottomTabBar from '../BottomTabBar';
import tailwind from 'twrnc';


export default function TeacherHomeScreen() {
    return (
        <View style={tailwind`h-full bg-[#3B3F46]`}>
            <Text>This is Teacher</Text>
            <BottomTabBar />
        </View>
    );
}