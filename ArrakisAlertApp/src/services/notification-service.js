import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';

const backendApiUrl = Constants.expoConfig.extra.backendApiUrl;

// Pede permissão para enviar notificações
export async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            Alert.alert('Permissão Necessária', 'Não foi possível obter a permissão para notificações push. O alerta não funcionará.');
            return;
        }
        // O projectId é necessário para obter o token no Expo Go.
        token = (await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId,
        })).data;
    } else {
        Alert.alert('Dispositivo Inválido', 'Notificações push só funcionam em dispositivos físicos.');
        return;
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

// Envia o token e o ID do Discord para o backend
export async function sendTokenToBackend(pushToken, discordUserId, guildId) {
    if (!pushToken || !discordUserId || !guildId) {
        Alert.alert('Erro', 'Faltam informações para registar o dispositivo.');
        return false;
    }

    try {
        const response = await fetch(`${backendApiUrl}/register-device`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                discordUserId,
                pushToken,
                guildId,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro desconhecido no servidor.');
        }

        Alert.alert('Sucesso', 'Dispositivo registado com sucesso para os alertas Arrakis!');
        return true;

    } catch (error) {
        console.error('Erro ao enviar token para o backend:', error);
        Alert.alert('Erro de Registo', `Não foi possível registar o dispositivo: ${error.message}`);
        return false;
    }
}
