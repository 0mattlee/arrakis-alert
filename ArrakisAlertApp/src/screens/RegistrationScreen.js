import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync, sendTokenToBackend } from '../services/notification-service';

const DISCORD_ID_KEY = '@ArrakisAlert:discordId';
const GUILD_ID_KEY = '@ArrakisAlert:guildId';

export default function RegistrationScreen() {
    const [discordId, setDiscordId] = useState('');
    const [guildId, setGuildId] = useState('');
    const [pushToken, setPushToken] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Carregar dados guardados ao iniciar
    useEffect(() => {
        const loadStoredData = async () => {
            const storedDiscordId = await AsyncStorage.getItem(DISCORD_ID_KEY);
            const storedGuildId = await AsyncStorage.getItem(GUILD_ID_KEY);
            if (storedDiscordId) {
                setDiscordId(storedDiscordId);
                setIsRegistered(true); // Assume que está registado se tiver dados
            }
            if (storedGuildId) {
                setGuildId(storedGuildId);
            }
            setIsLoading(false);
        };
        loadStoredData();
    }, []);

    const handleRegister = async () => {
        Keyboard.dismiss();
        setIsLoading(true);
        const token = await registerForPushNotificationsAsync();
        if (token) {
            setPushToken(token);
            const success = await sendTokenToBackend(token, discordId, guildId);
            if (success) {
                await AsyncStorage.setItem(DISCORD_ID_KEY, discordId);
                await AsyncStorage.setItem(GUILD_ID_KEY, guildId);
                setIsRegistered(true);
            }
        }
        setIsLoading(false);
    };

    const handleClear = async () => {
        setIsLoading(true);
        await AsyncStorage.removeItem(DISCORD_ID_KEY);
        await AsyncStorage.removeItem(GUILD_ID_KEY);
        setDiscordId('');
        setGuildId('');
        setIsRegistered(false);
        setIsLoading(false);
    };

    if (isLoading) {
        return <View style={styles.container}><ActivityIndicator size="large" /></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configuração Arrakis Alert</Text>
            {isRegistered ? (
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>Dispositivo Registado!</Text>
                    <Text>ID Discord: {discordId}</Text>
                    <Text>ID Guilda: {guildId}</Text>
                    <Button title="Limpar Registo e Registar Novamente" onPress={handleClear} color="#c0392b" />
                </View>
            ) : (
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Seu ID de Utilizador do Discord"
                        value={discordId}
                        onChangeText={setDiscordId}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="ID do Servidor (Guilda) do Discord"
                        value={guildId}
                        onChangeText={setGuildId}
                        keyboardType="numeric"
                    />
                    <Button
                        title="Registar Dispositivo"
                        onPress={handleRegister}
                        disabled={!discordId || !guildId}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0e6d2',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#4a4a4a',
    },
    formContainer: {
        width: '100%',
    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    statusContainer: {
        alignItems: 'center',
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 20,
    },
});
