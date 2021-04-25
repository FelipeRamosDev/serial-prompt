import 'react-native-gesture-handler';
import React from 'react';
import {
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// My Components
import DevicesPage from './src/pages/devices/devices-page';
import ControlPage from './src/pages/control/control-page';
import PromptPage from './src/pages/prompt/prompt-page';

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Contexts
import BtConnectionProvider from './src/core/contexts/bt-connection';

// Styles

// Main declarations
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <BtConnectionProvider>

      <NavigationContainer>
        <Tab.Navigator>

          <Tab.Screen
            name="devices"
            component={DevicesPage}
            options={{
              title: 'Dispositivos',
              headerStyle: {
                backgroundColor: '#f4511e',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              tabBarLabel: 'Dispositivos',
              tabBarIcon: ({ color, size }) => {
                return <MaterialCommunityIcons name="devices" color={color} size={size} />;
              },
            }}
          />

          <Tab.Screen
            name="control"
            component={ControlPage}
            options={{
              tabBarLabel: 'Comandos',
              tabBarIcon: ({ color, size }) => {
                return <Ionicons name="md-game-controller" color={color} size={size} />;
              },
            }}
          />

          <Tab.Screen
            name="prompt"
            component={PromptPage}
            options={{
              tabBarLabel: 'Prompt',
              tabBarIcon: ({ color, size }) => {
                return <Ionicons name="terminal" color={color} size={size} />;
              },
            }}
          />

        </Tab.Navigator>
      </NavigationContainer>

    </BtConnectionProvider>
  );
}
