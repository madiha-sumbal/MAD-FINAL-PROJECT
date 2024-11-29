import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { auth } from '../backend/firebaseAuth';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            setError("Email and password cannot be empty.");
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Logged in successfully!");
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }], // Navigate to MainTabs after login
                });
            })
            .catch((err) => setError(err.message));
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/profile.png')} style={styles.image} />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Text onPress={() => navigation.navigate('SignupScreen')} style={styles.link}>
                Don’t have an account? <Text style={styles.signupText}>Sign up</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    image: {
        width: '70%',
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    input: {
        width: '90%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
    },
    error: {
        color: 'red',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#34A853',
        width: '90%',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    link: {
        color: '#555',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
    signupText: {
        color: '#34A853',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
