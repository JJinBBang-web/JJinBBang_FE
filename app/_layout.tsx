import { useEffect } from 'react';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [isLoaded] = useFonts({
      PretendardVariable: require('../src/assets/fonts/PretendardVariable.ttf'),
    });

    useEffect(() => {
        if (isLoaded) {
            SplashScreen.hideAsync();
        }
    }, [isLoaded]);

    if (!isLoaded) return null;

    return <Stack screenOptions={{ headerShown: false }} />;
}
