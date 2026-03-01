import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { View, ActivityIndicator } from 'react-native';
import {
  useFonts as useSoraFonts,
  Sora_600SemiBold,
  Sora_700Bold,
} from '@expo-google-fonts/sora';
import {
  useFonts as useDmSansFonts,
  DMSans_400Regular,
  DMSans_500Medium,
} from '@expo-google-fonts/dm-sans';
import { store } from './src/store';
import { ThemeProvider } from './src/theme/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { useTheme } from './src/hooks/useTheme';
import { styles } from './App.styles';
import { useEffect } from 'react';
import { useAppDispatch } from './src/store';
import { loadSavedJobs } from './src/store/savedJobsSlice';

const AppContent: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadSavedJobs());
  }, [dispatch]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </View>
  );
};

const App: React.FC = () => {
  const [soraLoaded] = useSoraFonts({
    Sora_600SemiBold,
    Sora_700Bold,
  });

  const [dmSansLoaded] = useDmSansFonts({
    DMSans_400Regular,
    DMSans_500Medium,
  });

  const fontsLoaded = soraLoaded && dmSansLoaded;

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
