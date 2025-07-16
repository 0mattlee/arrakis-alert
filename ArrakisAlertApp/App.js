import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert, AppState, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import RegistrationScreen from './src/screens/RegistrationScreen';

// Configura o comportamento da notificação quando a app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, // Usaremos o nosso próprio som, mas isto pode ser útil
    shouldSetBadge: false,
  }),
});

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();
  const [sound, setSound] = useState();

  async function playAlarmSound() {
    console.log('A carregar o som do alarme...');
    try {
      // Tenta parar e descarregar o som anterior para evitar sobreposições
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
         require('./assets/alarm.mp3'), // Certifique-se que o ficheiro alarm.mp3 está em assets
         { shouldPlay: true, isLooping: true }
      );
      setSound(newSound);
      console.log('A tocar o som do alarme.');
      Vibration.vibrate([1000, 1000, 1000], true); // Vibra por 1s, pausa por 1s, repete
    } catch (error) {
      console.error("Erro ao carregar ou tocar o som:", error);
      Alert.alert("Erro de Áudio", "Não foi possível tocar o som do alarme. Verifique se o ficheiro 'alarm.mp3' existe na pasta 'assets'.");
    }
  }

  async function stopAlarm() {
    if (sound) {
      console.log('A parar o alarme...');
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(undefined);
      Vibration.cancel();
    }
  }

  useEffect(() => {
    // Listener para quando uma notificação é recebida com a app aberta
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      const notificationData = notification.request.content.data;
      if (notificationData && notificationData.type === 'emergency_alert') {
        playAlarmSound();
        Alert.alert(
          '🚨 ALERTA ARRAKIS 🚨',
          notificationData.message,
          [{ text: 'OK', onPress: stopAlarm }]
        );
      }
    });

    // Listener para quando o utilizador interage com a notificação (toca nela)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const notificationData = response.notification.request.content.data;
      if (notificationData && notificationData.type === 'emergency_alert') {
        // Para o alarme se o utilizador tocar na notificação
        stopAlarm();
      }
    });

    // Cleanup dos listeners
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]); // Adiciona sound como dependência para ter a referência correta no cleanup

  return (
    <View style={styles.container}>
      <RegistrationScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
