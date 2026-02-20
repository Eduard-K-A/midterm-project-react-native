import React, { createContext, useEffect, useMemo, useReducer, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContextType } from '../types';
import { darkColors, lightColors } from './colors';

const STORAGE_KEY = 'themePreference';

type State = {
  isDark: boolean;
};

type Action = { type: 'SET_DARK' } | { type: 'SET_LIGHT' } | { type: 'TOGGLE' };

const initialState: State = { isDark: true };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_DARK':
      return { isDark: true };
    case 'SET_LIGHT':
      return { isDark: false };
    case 'TOGGLE':
      return { isDark: !state.isDark };
    default:
      return state;
  }
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // rehydrate theme preference on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        if (raw === 'light') {
          dispatch({ type: 'SET_LIGHT' });
        } else if (raw === 'dark') {
          dispatch({ type: 'SET_DARK' });
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleTheme = () => {
    // update UI immediately
    dispatch({ type: 'TOGGLE' });

    // persist preference asynchronously, do not block UI
    (async () => {
      try {
        const next = !state.isDark ? 'dark' : 'light';
        await AsyncStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
    })();
  };

  const value = useMemo<ThemeContextType>(() => ({
    isDark: state.isDark,
    toggleTheme,
    colors: state.isDark ? darkColors : lightColors,
  }), [state.isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

