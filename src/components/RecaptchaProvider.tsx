import React, { createContext, useContext, ReactNode } from 'react';

interface RecaptchaContextType {
  siteKey: string;
}

const RecaptchaContext = createContext<RecaptchaContextType | null>(null);

export const useRecaptcha = () => {
  const context = useContext(RecaptchaContext);
  if (!context) {
    throw new Error('useRecaptcha must be used within a RecaptchaProvider');
  }
  return context;
};

interface RecaptchaProviderProps {
  children: ReactNode;
}

export const RecaptchaProvider: React.FC<RecaptchaProviderProps> = ({ children }) => {
  // You'll need to add your Google reCAPTCHA site key to your environment variables
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Test key for development

  return (
    <RecaptchaContext.Provider value={{ siteKey }}>
      {children}
    </RecaptchaContext.Provider>
  );
};