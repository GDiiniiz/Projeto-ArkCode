import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Animated } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import GestureHandlerRootViewWrapper from './GestureHandlerRootView';
import { StatusBar } from 'expo-status-bar';
import homeStyle from './styles/homeStyle';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scale = new Animated.Value(1);

  const getNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        console.log('Permissões de notificação negadas');
      }
    }
  };

  useEffect(() => {
    getNotificationPermission();
  }, []);

  const DisLikeEsquerda = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
      startAnimation();
    }
  };

  const LikeDireita = () => {
    if (currentIndex < users.length - 1) {
      const likedUserName = users[currentIndex].name;
      setCurrentIndex(currentIndex + 1);
      LikeNotificacao(likedUserName);
      startAnimation();
      Alert.alert('Parabéns, você deu Match!!', ` ${users[currentIndex].name}`);
    }
  };

  const startAnimation = () => {
    Animated.timing(scale, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      scale.setValue(1);
    });
  };

  const LikeNotificacao = async (userName: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Novo Match!',
          body: `Você deu like em ${userName}.`,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  };

  const users = [
    {
      name: 'João',
      profileImage:
        'https://img.freepik.com/fotos-gratis/close-no-homem-sorrindo-na-natureza_23-2150771075.jpg?w=740&t=st=1698949778~exp=1698950378~hmac=b0f50f52e08f669c368121f6f0216ff180bbe546eb0f1c76a397ffd1e0254235',
    },
    {
      name: 'Maria',
      profileImage:
        'https://img.freepik.com/fotos-gratis/feliz-bonito-mulher-jovem-posar-camera-em-parque-cidade_1262-19158.jpg?w=1800&t=st=1698949886~exp=1698950486~hmac=59144dec4b8b7c486a0cbd302db38724745de34b005e4df298ab19befa2e8630',
    },
    {
      name: 'Rodrigo',
      profileImage:
        'https://img.freepik.com/fotos-gratis/jovem-bonito-com-bracos-cruzados-em-fundo-branco_23-2148222620.jpg?w=1380&t=st=1698950181~exp=1698950781~hmac=4b4adcb66de48014e2e212e28a4c9aca2c156583f702f769b7ace38227354a48',
    },
    {
      name: 'Cesar',
      profileImage:
        'https://img.freepik.com/fotos-gratis/empresario-prospero-mantem-as-maos-cruzadas-tem-expressao-satisfeita_273609-16711.jpg?w=1800&t=st=1698950233~exp=1698950833~hmac=d1858ec0fd6ec6a545818bfcf81d0e60a36a9cdc1b585a9b94e4ee0034b2d55e',
    },
    {
      name: 'Rosangela',
      profileImage:
        'https://img.freepik.com/fotos-gratis/jovem-linda-anda-pela-cidade-na-europa-foto-de-rua-mulher-posando-no-centro-da-cidade_1321-4317.jpg?w=740&t=st=1698950271~exp=1698950871~hmac=0e7085e807f3cc3aa2268729b2034f3163a88cf56464400b50f023502548e908',
    },
    {
      name: 'Eduarda',
      profileImage:
        'https://img.freepik.com/fotos-premium/retrato-de-uma-bela-jovem-sorridente-em-lingerie-sobre-fundo-colorido_963338-2868.jpg?w=740',
    },
    {
      name: 'Mario',
      profileImage:
        'https://img.freepik.com/fotos-gratis/homem-bonito-e-confiante-sorrindo-com-as-maos-cruzadas-no-peito_176420-18743.jpg?w=1800&t=st=1698950311~exp=1698950911~hmac=90afbc9c958cae894c3bbe5391aa17bd497c93ff958b8e4de26d09fef0ebabcf',
    },
  ];

  return (
    <GestureHandlerRootViewWrapper>
      <View style={homeStyle.container}>
        <StatusBar style="auto" />
        <View>
          <Text style={{ fontSize: 30, color: 'white', fontWeight: 'bold' }}>
            Tinder
          </Text>
        </View>

        {currentIndex < users.length && (
          <PanGestureHandler
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.END) {
                if (nativeEvent.translationX > 50) {
                  LikeDireita();
                } else if (nativeEvent.translationX < -50) {
                  DisLikeEsquerda();
                }
              }
            }}
          >
            <Animated.View
              style={[
                homeStyle.boxUser,
                {
                  transform: [{ scale }],
                },
              ]}
            >
              <Text style={homeStyle.userName}>{users[currentIndex].name}</Text>
              <Image
                source={{ uri: users[currentIndex].profileImage }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderBottomRightRadius: 30,
                  borderBottomLeftRadius: 30,
                }}
              />
            </Animated.View>
          </PanGestureHandler>
        )}

        {currentIndex < users.length && (
          <View style={{ flexDirection: 'row', gap: 200, paddingHorizontal: 40 }}>
            <TouchableOpacity onPress={DisLikeEsquerda}>
              <Ionicons name="ios-heart-dislike" size={48} color="red" />
            </TouchableOpacity>
            <TouchableOpacity onPress={LikeDireita}>
              <Ionicons name="ios-heart" size={48} color="green" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </GestureHandlerRootViewWrapper>
  );
}
