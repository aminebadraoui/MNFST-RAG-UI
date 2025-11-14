import * as React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { CogIcon } from '@heroicons/react/24/outline';
import { chatAPI } from '../../services';
import { Chat, CreateChatRequest, UpdateChatRequest } from '../../types';

interface ChatConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (chat: Chat) => void;
  chat?: Chat | null;
}

interface FormData {
  name: string;
  systemPrompt: string;
}

interface FormErrors {
  name?: string;
  systemPrompt?: string;
  general?: string;
}

const ChatConfigurationModal: React.FC<ChatConfigurationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  chat
}) => {
  const [formData, setFormData] = React.useState<FormData>({
    name: chat?.name || '',
    systemPrompt: chat?.systemPrompt || ''
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [createdChat, setCreatedChat] = React.useState<Chat | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Chat name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      let response;
      if (chat && chat.id) {
        // Update existing chat
        const updateData: UpdateChatRequest = {};
        if (formData.name !== chat.name) {
          updateData.name = formData.name;
        }
        // Normalize both values to handle null/undefined vs empty string
        const currentSystemPrompt = chat.systemPrompt || '';
        const formSystemPrompt = formData.systemPrompt || '';
        
        if (formSystemPrompt !== currentSystemPrompt) {
          updateData.systemPrompt = formData.systemPrompt;
        }
        response = await chatAPI.updateChat(chat.id, updateData);
      } else {
        // Create new chat
        const createData: CreateChatRequest = {
          name: formData.name,
          systemPrompt: formData.systemPrompt
        };
        response = await chatAPI.createChat(createData);
      }
      
      setCreatedChat(response);
      setIsSuccess(true);
      // Call onSuccess for both updates and new creations
      onSuccess(response);
    } catch (error: any) {
      console.error('Error saving chat:', error);
      let errorMessage = 'Failed to save chat. Please try again.';
      
      if (error.message) {
        if (error.message.includes('already exists')) {
          errorMessage = 'A chat with this name already exists.';
        }
      }
      
      setErrors({
        general: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form state
      setFormData({
        name: '',
        systemPrompt: ''
      });
      setErrors({});
      setIsSuccess(false);
      setCreatedChat(null);
      onClose();
    }
  };

  const handleCreateAnother = () => {
    setFormData({
      name: '',
      systemPrompt: ''
    });
    setErrors({});
    setIsSuccess(false);
    setCreatedChat(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" title="Chat Configuration">
      {isSuccess && createdChat ? (
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <CogIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            {chat ? 'Chat Updated Successfully!' : 'Chat Created Successfully!'}
          </h3>
          <div className="mt-4 p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-md text-left">
            <h4 className="font-medium text-light-text-primary dark:text-dark-text-primary mb-2">Chat Details:</h4>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <strong>Name:</strong> {createdChat.name}
            </p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <strong>System Prompt:</strong> {createdChat.systemPrompt || 'None'}
            </p>
          </div>
          <div className="mt-6 flex gap-3 justify-center">
            <Button onClick={handleCreateAnother}>
              Create Another
            </Button>
            <Button onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
              {errors.general}
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-4">
              {chat ? 'Edit Chat Configuration' : 'Create New Chat'}
            </h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
              Configure your chat assistant with a custom name and system prompt. The system prompt provides context and instructions to guide the AI's responses.
            </p>
          </div>

          <div>
            <Input
              label="Chat Name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
              error={errors.name}
              placeholder="e.g., Customer Support Bot"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              This is the display name for your chat assistant
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
              System Prompt
            </label>
            <textarea
              value={formData.systemPrompt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('systemPrompt', e.target.value)}
              className={`w-full px-3 py-2 border border-light-border-primary dark:border-dark-border-primary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary resize-none ${
                errors.systemPrompt ? 'border-red-300 dark:border-red-800 focus:ring-red-500 focus:border-red-500' : ''
              }`}
              rows={6}
              placeholder="You are a helpful customer service assistant. You provide accurate, concise answers to customer questions..."
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-light-text-quaternary dark:text-dark-text-quaternary">
                {formData.systemPrompt.length} characters
              </p>
              <p className="text-xs text-light-text-quaternary dark:text-dark-text-quaternary">
                Provide context and instructions for the AI assistant
              </p>
            </div>
            {errors.systemPrompt && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.systemPrompt}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? (chat ? 'Updating...' : 'Creating...') : (chat ? 'Update Chat' : 'Create Chat')}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export { ChatConfigurationModal };