import { Tabs } from 'expo-router';
import { Home, Send, QrCode, History } from 'lucide-react-native';
import { View, Platform } from 'react-native';
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
          <View style={{ flex: 1, backgroundColor: '#222222', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
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
          height: 88,
          paddingBottom: 24,
          paddingTop: 16,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.5,
          shadowRadius: 12,
          elevation: 16,
        },
        tabBarIcon: ({ color, size, focused }) => ({ icon: Icon }) => (
          <View
            style={{
              padding: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: focused ? '#404040' : 'transparent',
              backgroundColor: focused ? '#030303' : 'transparent',
            }}
          >
            <Icon size={size} color={color} />
          </View>
        ),
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
                borderColor: focused ? '#404040' : 'transparent',
                backgroundColor: focused ? '#030303' : 'transparent',
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
                borderColor: focused ? '#404040' : 'transparent',
                backgroundColor: focused ? '#030303' : 'transparent',
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
                borderColor: focused ? '#404040' : 'transparent',
                backgroundColor: focused ? '#030303' : 'transparent',
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
                borderColor: focused ? '#404040' : 'transparent',
                backgroundColor: focused ? '#030303' : 'transparent',
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
