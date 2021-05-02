import 'react-native-gesture-handler';
import React from 'react';
import {
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

// My Components
import DevicesPage from './src/pages/devices/devices-page';
import AppsPage from './src/pages/apps/apps-page';
import PromptPage from './src/pages/prompt/prompt-page';

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';

// Contexts
import BtConnectionProvider from './src/core/contexts/bt-connection';

import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './src/styles/theme';

// Main declarations
const Tab = createBottomTabNavigator();

export default function App() {
  changeNavigationBarColor(defaultTheme.black);

  return (
    <ThemeProvider theme={defaultTheme}>

      <BtConnectionProvider>

        <NavigationContainer>
          <Tab.Navigator
            tabBarOptions={{
              style: {
                backgroundColor: defaultTheme.secondary,
                paddingBottom: 5,
                borderTopWidth: 0,
              },
              activeTintColor: defaultTheme.text[0],
            }}
          >

            <Tab.Screen
              name="devices"
              component={DevicesPage}
              options={{
                title: 'Dispositivos',
                tabBarLabel: 'Dispositivos',
                tabBarIcon: ({ color, size }) => {
                  return <Ionicons name="bluetooth" color={color} size={size} />;
                },
              }}
            />

            <Tab.Screen
              name="apps"
              component={AppsPage}
              options={{
                tabBarLabel: 'Aplicativos',
                tabBarIcon: ({ color, size }) => {
                  return <Ionicons name="apps" color={color} size={size} />;
                },
              }}
            />

            <Tab.Screen
              name="prompt"
              component={PromptPage}
              options={{
                tabBarLabel: 'Prompt',
                tabBarIcon: ({ color, size }) => {
                  return <Ionicons name="code" color={color} size={size} />;
                },
              }}
            />

          </Tab.Navigator>
        </NavigationContainer>

      </BtConnectionProvider>
    </ThemeProvider>
  );
}
