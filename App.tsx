global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
global.FormData = global.originalFormData || global.FormData;

if (window.FETCH_SUPPORT) {
    window.FETCH_SUPPORT.blob = false;
} else {
    global.Blob = global.originalBlob || global.Blob;
    global.FileReader = global.originalFileReader || global.FileReader;
}
import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeRouter, Route, Routes } from 'react-router-native';
import { routerPaths } from './core/constant';
import { NativeBaseProvider } from 'native-base';
import { routerComponents } from './core/routers';
import { theme } from './core/styles';
import { useFonts } from 'expo-font';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { config } from './core/config';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = (await AsyncStorage.getItem('token')) || '';

    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            token,
        },
    };
});
export const apolloClient = new ApolloClient({
    uri: `${config.SERVER_URL}/api/graphql`,
    credentials: 'include',
    link: authLink.concat(new HttpLink({ uri: `${config.SERVER_URL}/api/graphql` })),
    cache: new InMemoryCache(),
});

export default function App() {
    const [fontsLoaded] = useFonts({
        SFTextRegular: require('./assets/fonts/SF-Pro-Text-Regular.otf'),
        SFTextSemibold: require('./assets/fonts/SF-Pro-Text-Semibold.otf'),
        SFTextBold: require('./assets/fonts/SF-Pro-Text-Bold.otf'),
        SFTextMedium: require('./assets/fonts/SF-Pro-Text-Medium.otf'),
    });
    if (!fontsLoaded) {
        return <Text>Loading</Text>;
    }

    return (
        <ApolloProvider client={apolloClient}>
            <NativeBaseProvider theme={theme}>
                <NativeRouter>
                    <View style={styles.container}>
                        <Routes>
                            <Route path={routerPaths.authLogin} element={<routerComponents.authLogin />} />

                            <Route path={routerPaths.authRegister} element={<routerComponents.authRegister />} />
                            <Route path={routerPaths.home} element={<routerComponents.home />} />
                        </Routes>
                    </View>
                </NativeRouter>
            </NativeBaseProvider>
        </ApolloProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
