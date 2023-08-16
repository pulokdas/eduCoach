import { EmailAuthProvider } from 'firebase/auth';
import { db } from './firebase'; // Replace with your Firebase import
import { doc, addDoc, collection, Timestamp } from 'firebase/firestore';
// Function to add a new post
export const addPost = async (content, author) => {

    const postsCollectionRef = collection(db, 'Posts'); // Reference to the "Posts" collection

    try {
        const newPostRef = await addDoc(postsCollectionRef, {
            content,
            author,
            timestamp: Timestamp.fromDate(new Date()), // Use server timestamp for consistent time
        });

        console.log('Post added with ID:', newPostRef.id);
        return newPostRef.id;
    } catch (error) {
        console.error('Error adding post:', error);
        throw error; // Rethrow the error to handle it further up the call stack
    }
};

// Function to add a new comment to a post
export const addCommentToPost = async (postId, text, author) => {
    const commentRef = db.collection('Posts').doc(postId).collection('Comments').doc();
    await commentRef.set({
        text,
        author,
        timestamp: new Date(),
    });
};

// Function to add a new like to a post
export const addLikeToPost = async (postId, author) => {
    const likeRef = db.collection('Posts').doc(postId).collection('Likes').doc();
    await likeRef.set({
        author,
        timestamp: new Date(),
    });
};
