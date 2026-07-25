import React from 'react';
import Modal from './Modal';
import Button from '../common/Button';

/**
 * Pre-styled Confirm Dialog component built on top of Modal.
 * Used for deletion confirmation, destructive actions, or critical prompts.
 */
const ConfirmDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
  ...props
}) => {
  const iconVariants = {
    danger: (
      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
        <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
    ),
    warning: (
      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
        <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.007v.008H12v-.008zM12 3v.008" />
        </svg>
      </div>
    ),
    info: (
      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
        <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      </div>
    ),
  };

  const confirmButtonVariant = {
    danger: 'danger',
    warning: 'primary',
    info: 'primary',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnOverlayClick={!loading}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmButtonVariant[variant] || 'danger'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
      {...props}
    >
      <div className="flex items-start gap-4">
        {iconVariants[variant] || iconVariants.danger}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
