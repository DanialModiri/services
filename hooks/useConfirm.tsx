import React, { createContext, useContext, useState, ReactNode, FC, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import ConfirmDialog, { ConfirmDialogProps } from '../components/common/ConfirmDialog';

type ConfirmOptions = Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel'>;

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

type DialogState = ConfirmOptions & {
    isOpen: boolean;
};

export const ConfirmProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [dialogState, setDialogState] = useState<DialogState | null>(null);
  // FIX: Imported `useRef` from React to resolve 'Cannot find name' error.
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({ ...options, isOpen: true });
      resolveRef.current = resolve;
    });
  }, []);

  const handleClose = (result: boolean) => {
    if (resolveRef.current) {
      resolveRef.current(result);
    }
    setDialogState(null);
  };
  
  const handleConfirm = () => handleClose(true);
  const handleCancel = () => handleClose(false);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialogState && createPortal(
        <ConfirmDialog
          {...dialogState}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />,
        document.body
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};
