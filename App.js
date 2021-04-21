import 'react-native-gesture-handler';
import React from 'react';
import {
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Components imports
import DevicesPage from './src/pages/devices/devices-page';
import ControlPage from './src/pages/control/control-page';
import PromptPage from './src/pages/prompt/prompt-page';

// Styles imports

// Main declarations
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>

        <Tab.Screen
          name="devices"
          component={DevicesPage}
        />

        <Tab.Screen
          name="control"
          component={ControlPage}
        />

        <Tab.Screen
          name="prompt"
          component={PromptPage}
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
