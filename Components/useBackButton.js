import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const useBackButton = () => {
    const navigation = useNavigation();

    const handleBackPress = () => {
        if (!navigation.canGoBack()) {
            // Handle back button behavior for the root screen
            // For example, show an alert or prevent the app from exiting
            return true; // Prevent default behavior
        } else {
            // Go back to the previous screen
            navigation.goBack();
            return true; // Prevent default behavior
        }
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, []);
};

export default useBackButton;
