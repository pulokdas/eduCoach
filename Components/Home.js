import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import tailwind from 'twrnc';
import useBackButton from './useBackButton';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../firebase';

// ... (imports and other code)

export default function Home({ route }) {
  useBackButton();
  const { email } = route.params;

  const [userRole, setUserRole] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        // console.log(email);
        const docRef = doc(db, 'Students', email); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserRole(data.selectedRole);
          setUserData(data);
          console.log(userData);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchUserData();
  }, [email]);

  return (
    <View style={tailwind`h-full flex items-center justify-center`}>
      <View style={tailwind`p-8 w-full max-w-sm`}>
        <Text style={tailwind`text-5xl text-center font-bold mb-6 text-[#F5B302]`}>Welcome!</Text>

        {userData ? (
          <>
            <Text style={tailwind`text-black text-xl mb-4`}>Email: {userData.email}</Text>
            <Text style={tailwind`text-black text-xl mb-4`}>Role: {userRole}</Text>
          </>
        ) : (
          <Text style={tailwind`text-black text-xl mb-4`}>Loading user data...</Text>
        )}
      </View>
    </View>
  );
}
