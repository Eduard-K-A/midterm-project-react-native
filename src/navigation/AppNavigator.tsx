import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import JobFinderScreen from '../screens/JobFinderScreen';
import SavedJobsScreen from '../screens/SavedJobsScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import { useAppSelector } from '../store';
import { selectSavedJobs } from '../store/savedJobsSlice';
import { styles } from './AppNavigator.styles';

type RootTabParamList = {
  JobFinder: undefined;
  SavedJobs: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator();

const TabNavigator: React.FC = () => {
  const { colors, isDark } = useTheme();
  const savedJobs = useAppSelector(selectSavedJobs);
  const savedCount = savedJobs.length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        ],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size, focused }) => {
          const iconName =
            route.name === 'JobFinder'
              ? focused
                ? 'briefcase'
                : 'briefcase-outline'
              : focused
              ? 'bookmark'
              : 'bookmark-outline';

          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName as never} size={size} color={color} />
              {route.name === 'SavedJobs' && savedCount > 0 && (
                <View style={[styles.badgeContainer, { backgroundColor: colors.primary }]}> 
                  <Text style={[styles.badgeText, { color: colors.onPrimary }]}> 
                    {savedCount}
                  </Text>
                </View>
              )}
            </View>
          );
        },
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen
        name="JobFinder"
        component={JobFinderScreen}
        options={{ title: 'Job Finder' }}
      />
      <Tab.Screen
        name="SavedJobs"
        component={SavedJobsScreen}
        options={{ title: 'Saved Jobs' }}
      />
    </Tab.Navigator>
  );
};

/**
 * AppNavigator bridges the React Navigation theme with the app's ThemeContext
 */
const AppNavigator: React.FC = () => {
  const { isDark, colors } = useTheme();

  const navigationTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          primary: colors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          primary: colors.primary,
        },
      };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Root" component={TabNavigator} />
        <Stack.Screen name="JobDetail" component={JobDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

