import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { db, AUTH } from '../../firebase';
import { addCommentToPost } from '../../firebaseUtils'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import tailwind from 'twrnc';
import BottomTabBar from '../BottomTabBar';

export default function StudentHomeScreen() {
    const [posts, setPosts] = useState([]);
    const [commentTextMap, setCommentTextMap] = useState({});
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
                    const teacherDocRef = doc(db, `Teachers/${postData.author}`);
                    
                    // Fetch data from both Students and Teachers collections
                    const userDocSnapshot = await getDoc(userDocRef);
                    const teacherDocSnapshot = await getDoc(teacherDocRef);

                    if (userDocSnapshot.exists() || teacherDocSnapshot.exists()) {
                        const userData = userDocSnapshot.exists() ? userDocSnapshot.data() : null;
                        const teacherData = teacherDocSnapshot.exists() ? teacherDocSnapshot.data() : null;
                        const userRole = userData ? userData.selectedRole : teacherData.selectedRole;

                        const postDocRef = doc(db, 'Posts', docSnapshot.id);
                        const commentsRef = collection(postDocRef, 'Comments');
                        const commentsQuerySnapshot = await getDocs(commentsRef);

                        const commentsData = [];

                        for (const commentDocSnapshot of commentsQuerySnapshot.docs) {
                            const commentData = commentDocSnapshot.data();
                            const commentAuthorDocRef = doc(db, `${userRole === 'student' ? 'Students' : 'Teachers'}/${commentData.author}`);
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
                                name: userData ? userData.name : teacherData.name,
                                profileImage: userData ? userData.profileImage : teacherData.profileImage,
                                role: userRole === 'student' ? 'Student' : 'Teacher',
                            },
                            comments: commentsData,
                        });
                    }
                }

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
            style={tailwind`flex-1 bg-[#3B3F46]`}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        >
            <FlatList
                style={tailwind`mt-20 p-4`}
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
                            <Text style={tailwind`font-semibold text-lg`}>
                                {item.user.name} ({item.user.role})
                            </Text>
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
                                            <Text style={tailwind`font-semibold`}>
                                                {comment.user.name} 
                                            </Text>
                                        </View>
                                        <Text style={tailwind`text-gray-500 text-sm`}>{comment.text}</Text>
                                        <Text style={tailwind`text-gray-600 text-xs`}>
                                            {comment.timestamp.toDate().toLocaleString()}
                                        </Text>
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
            {!isInputFocused && <BottomTabBar />}
        </KeyboardAvoidingView>
    );
}
