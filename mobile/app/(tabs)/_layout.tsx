import { Tabs } from 'expo-router';
import { Home, Send, QrCode, History } from 'lucide-react-native';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#808080',
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: '#222222', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginBottom: -10 }}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.25, 0.5, 0.75, 1]}
              style={{ height: 1.5, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
            />
          </View>
        ),
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: 105,
          paddingBottom: 40,
          paddingTop: 20,
          position: 'absolute',
          bottom: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.5,
          shadowRadius: 12,
          elevation: 16,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: focused ? '#606060' : '#404040',
                backgroundColor: '#030303',
              }}
            >
              <Home size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="send"
        options={{
          title: 'Send',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: focused ? '#606060' : '#404040',
                backgroundColor: '#030303',
              }}
            >
              <Send size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="receive"
        options={{
          title: 'Receive',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: focused ? '#606060' : '#404040',
                backgroundColor: '#030303',
              }}
            >
              <QrCode size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: focused ? '#606060' : '#404040',
                backgroundColor: '#030303',
              }}
            >
              <History size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
