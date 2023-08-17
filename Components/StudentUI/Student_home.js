import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { db, AUTH } from '../../firebase';
import { addCommentToPost } from '../../firebaseUtils'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import tailwind from 'twrnc';
import BottomTabBar2 from '../StudentUI/BottomTabBar2';

export default function StudentHomeScreen() {
    const [posts, setPosts] = useState([]);
    const [commentTextMap, setCommentTextMap] = useState({}); // Use an object to store comment text for each post
    const [showCommentInputMap, setShowCommentInputMap] = useState({});
    const [expandedPostId, setExpandedPostId] = useState(null);
    const [isInputFocused, setInputFocused] = useState(false);
    useEffect(() => {
        const fetchPosts = async () => {
            const postsRef = collection(db, 'Posts');
            try {
                const querySnapshot = await getDocs(postsRef);
                const postsData = [];

                for (const docSnapshot of querySnapshot.docs) {
                    const postData = docSnapshot.data();
                    const userDocRef = doc(db, `Students/${postData.author}`);
                    const userDocSnapshot = await getDoc(userDocRef);

                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        const postDocRef = doc(db, 'Posts', docSnapshot.id);
                        const commentsRef = collection(postDocRef, 'Comments');
                        const commentsQuerySnapshot = await getDocs(commentsRef);

                        const commentsData = [];

                        for (const commentDocSnapshot of commentsQuerySnapshot.docs) {
                            const commentData = commentDocSnapshot.data();
                            const commentAuthorDocRef = doc(db, `Students/${commentData.author}`);
                            const commentAuthorDocSnapshot = await getDoc(commentAuthorDocRef);

                            if (commentAuthorDocSnapshot.exists()) {
                                const commentAuthorData = commentAuthorDocSnapshot.data();
                                commentsData.push({
                                    ...commentData,
                                    user: {
                                        name: commentAuthorData.name,
                                        profileImage: commentAuthorData.profileImage,
                                    },
                                });
                            } else {
                                
                            }
                        }

                        for (const commentDocSnapshot of commentsQuerySnapshot.docs) {
                            const commentData = commentDocSnapshot.data();
                            const commentAuthorDocRef = doc(db, `Teachers/${commentData.author}`);
                            const commentAuthorDocSnapshot = await getDoc(commentAuthorDocRef);

                            if (commentAuthorDocSnapshot.exists()) {
                                const commentAuthorData = commentAuthorDocSnapshot.data();
                                commentsData.push({
                                    ...commentData,
                                    user: {
                                        name: commentAuthorData.name,
                                        profileImage: commentAuthorData.profileImage,
                                    },
                                });
                            } else {
                               
                            }
                        }

                        postsData.push({
                            id: docSnapshot.id,
                            content: postData.content,
                            user: {
                                name: userData.name,
                                profileImage: userData.profileImage,
                            },
                            comments: commentsData,
                        });
                    }
                }

                console.log('Fetched posts:', postsData.length);
                setPosts(postsData);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);




    const handleAddComment = async (postId) => {
        try {
            const commentText = commentTextMap[postId] || '';
            if (commentText.trim() !== '') {
                await addCommentToPost(postId, commentText, AUTH.currentUser.email);
                setCommentTextMap({ ...commentTextMap, [postId]: '' });
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };
    const toggleCommentInput = (postId) => {
        setShowCommentInputMap({ ...showCommentInputMap, [postId]: !showCommentInputMap[postId] });
    };
    const handleToggleComments = (postId) => {
        setExpandedPostId(expandedPostId === postId ? null : postId);
    };
    const handleInputFocus = () => {
        setInputFocused(true);
    };

    const handleInputBlur = () => {
        setInputFocused(false);
    };

    return (
        <KeyboardAvoidingView
            style={tailwind`h-full bg-[#F0F2F5]`}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        >
            <FlatList
                style={tailwind`p-4 mt-`}
                data={posts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <KeyboardAvoidingView
                        style={tailwind`bg-white p-4 mb-4 rounded-lg shadow-md`}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
                    >
                        <View style={tailwind`flex-row items-center mb-2`}>
                            <Image
                                source={{ uri: item.user.profileImage }}
                                style={tailwind`w-10 h-10 rounded-full mr-2`}
                            />
                            <Text style={tailwind`font-semibold text-lg`}>{item.user.name}</Text>
                        </View>
                        <Text style={tailwind`mb-2`}>{item.content}</Text>
                        {expandedPostId === item.id && (
                            <View>
                                {item.comments.map(comment => (
                                    <View key={comment.timestamp} style={tailwind`mb-4`}>
                                        <View style={tailwind`flex-row items-center mb-1`}>
                                            <Image
                                                source={{ uri: comment.user.profileImage }}
                                                style={tailwind`w-8 h-8 rounded-full mr-2`}
                                            />
                                            <Text style={tailwind`font-semibold`}>{comment.user.name}</Text>
                                        </View>
                                        <Text style={tailwind`text-gray-500 text-sm`}>{comment.text}</Text>
                                        <Text style={tailwind`text-gray-600 text-xs`}>{comment.timestamp.toDate().toLocaleString()}</Text>
                                    </View>
                                ))}
                                <View style={tailwind`flex-row items-center mt-2`}>
                                    <TextInput
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}
                                        style={tailwind`flex-grow bg-gray-100 rounded-md h-8 px-2 mr-2`}
                                        placeholder="Add a comment..."
                                        value={commentTextMap[item.id] || ''}
                                        onChangeText={text => setCommentTextMap({ ...commentTextMap, [item.id]: text })}
                                    />
                                    <TouchableOpacity onPress={() => handleAddComment(item.id)}>
                                        <Text style={tailwind`text-blue-600`}>Post</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        <TouchableOpacity onPress={() => handleToggleComments(item.id)}>
                            <Text style={tailwind`text-gray-500 mt-1`}>
                                {expandedPostId === item.id ? 'Hide comments' : 'View comments'}
                            </Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                )}
            />
            {!isInputFocused && <BottomTabBar2 />}
        </KeyboardAvoidingView>
    );

}
