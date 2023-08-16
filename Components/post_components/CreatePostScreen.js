import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { addPost } from '../../firebaseUtils'; // Import the function
import tailwind from 'twrnc';
import { AUTH } from '../../firebase';

export default function CreatePostScreen() {
    const [postContent, setPostContent] = useState('');

    const handlePostSubmit = async () => {
        try {
            const postId = await addPost(postContent, AUTH.currentUser.email); // Replace with the actual user ID
            console.log('Post added with ID:', postId);
            // Clear the input field or navigate to a different screen
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    return (
        <View style={tailwind`h-full  bg-[#3B3F46] flex-1 justify-center items-center`}>
            <Text style={tailwind`text-3xl font-extrabold text-white`} >Add Your <Text style={tailwind`text-[#F5B302]`} >Teacher Request</Text> Post here</Text>
            <View style={tailwind`m-10 `}>
                <TextInput
                    value={postContent}
                    onChangeText={setPostContent}
                    placeholder="Please mention what subject or topic you want to learn and desired designation of your teacher"
                    placeholderTextColor="#fff"
                    multiline
                    numberOfLines={10}
                    textAlignVertical="top"
                    style={tailwind` h-30 w-80 border text-white p-4 border-white `}
                // Other TextInput props...
                />
                <TouchableOpacity onPress={handlePostSubmit} style={tailwind`h-12 w-1/3 border-2 border-[#F5B302] bg-[#F5B302] text-white rounded-md flex flex-row justify-center items-center px-6 ml-25 my-4`}>
                    <Text style={tailwind`text-white text-center text-2xl font-bold`}>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
