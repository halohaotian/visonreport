'use client';
import { createContext, useContext } from 'react';

type Dict = Record<string, Record<string, any>>;
const TranslationContext = createContext<Dict>({});

export function useTranslations(namespace: string) {
  const dict = useContext(TranslationContext);
  return dict[namespace] ?? {};
}

export function TranslationProvider({ dict, children }: { dict: Dict; children: React.ReactNode }) {
  return (
    <TranslationContext.Provider value={dict}>
      {children}
    </TranslationContext.Provider>
  );
}
