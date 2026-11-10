'use client';

import React from 'react';
import { PwaProvider } from './PwaProvider';
import { InstallModal } from './InstallModal';

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PwaProvider>
      {children}
      <InstallModal />
    </PwaProvider>
  );
};
