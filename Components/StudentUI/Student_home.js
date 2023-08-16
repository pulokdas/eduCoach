import React, { useState, useEffect } from 'react';

import BottomTabBar2 from '../StudentUI/BottomTabBar2';
import tailwind from 'twrnc';
import { View, Text, FlatList } from 'react-native';
import { db } from '../../firebase'; // Import the database
import { collection, getDoc, getDocs, onSnapshot } from 'firebase/firestore'

export default function StudentHomeScreen() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const fetchPosts = async () => {
            const postsRef = collection(db, 'posts');

            try {
                const querySnapshot = await getDocs(postsRef);
                const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log('Fetched posts:', postsData.length);
                setPosts(postsData);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);
    return (
        <View style={tailwind`h-full bg-[#3B3F46]`}>
            <FlatList
                data={posts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={tailwind`bg-white p-4 mb-2`}>
                        <Text>{item.content}</Text>
                    </View>
                )}
            />
            <BottomTabBar2 />
        </View>
    );
}
// import React, { useState, useEffect } from 'react';
