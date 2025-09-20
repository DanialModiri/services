import React, { createContext, useContext, ReactNode, FC } from 'react';

// A simple key-value store for messages
type Messages = Record<string, string>;

// Type for the translation function
type TFunction = (key: string, values?: Record<string, string | number>) => string;

// The context shape
interface I18nContextType {
    t: TFunction;
}

// Create the context with a default dummy function
const I18nContext = createContext<I18nContextType>({
    t: (key) => key,
});

// The provider component
interface I18nProviderProps {
    messages: Messages;
    children: ReactNode;
}

// FIX: Correctly implemented the I18nProvider to define the translation function and return a valid React Context Provider, fixing multiple syntax and type errors.
export const I18nProvider: FC<I18nProviderProps> = ({ messages, children }) => {
    const t: TFunction = (key, values) => {
        let message = messages[key] || key;
        if (values) {
            Object.entries(values).forEach(([valueKey, value]) => {
                // Use a regex to replace all occurrences of {key}
                const regex = new RegExp(`\\{${valueKey}\\}`, 'g');
                message = message.replace(regex, String(value));
            });
        }
        return message;
    };

    return (
        <I18nContext.Provider value={{ t }}>
            {children}
        </I18nContext.Provider>
    );
};

// The custom hook to use the translation function
export const useI18n = () => useContext(I18nContext);
