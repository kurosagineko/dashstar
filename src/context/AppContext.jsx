import { createContext } from 'react';

export const ThemeContext = createContext('plum');
// which list the card is in so we can change elements about the card per list
export const CardListContext = createContext('task');
export const UserRoleContext = createContext('user');
