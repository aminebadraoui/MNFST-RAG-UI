import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  CheckIcon, 
  XMarkIcon,
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';
import { chatAPI } from '../../services';
import { Chat, CreateChatRequest, UpdateChatRequest } from '../../types';

interface AgentWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (chat: Chat) => void;
  chat?: Chat | null;
  source?: 'build' | 'test'; // Track where the wizard was opened from
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

type WizardStep = 'name' | 'systemPrompt' | 'review';

const AgentWizard: React.FC<AgentWizardProps> = ({
  isOpen,
  onClose,
  onSuccess,
  chat,
  source = 'build'
}) => {
  const [currentStep, setCurrentStep] = React.useState<WizardStep>('name');
  const [formData, setFormData] = React.useState<FormData>({
    name: chat?.name || '',
    systemPrompt: chat?.systemPrompt || ''
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [createdChat, setCreatedChat] = React.useState<Chat | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (isOpen) {
      // Reset form when wizard opens
      setFormData({
        name: chat?.name || '',
        systemPrompt: chat?.systemPrompt || ''
      });
      setCurrentStep('name');
      setErrors({});
      setIsSuccess(false);
      setCreatedChat(null);
    }
  }, [isOpen, chat]);

  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {};

    if (currentStep === 'name' && !formData.name.trim()) {
      newErrors.name = 'Agent name is required';
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

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep === 'name') {
        setCurrentStep('systemPrompt');
      } else if (currentStep === 'systemPrompt') {
        setCurrentStep('review');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'systemPrompt') {
      setCurrentStep('name');
    } else if (currentStep === 'review') {
      setCurrentStep('systemPrompt');
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
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
      // Call onSuccess if provided
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error: any) {
      console.error('Error saving chat:', error);
      let errorMessage = 'Failed to save agent. Please try again.';
      
      if (error.message) {
        if (error.message.includes('already exists')) {
          errorMessage = 'An agent with this name already exists.';
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
      onClose();
      // Navigate back to the source page
      if (source === 'test') {
        navigate('/test');
      } else {
        navigate('/chat');
      }
    }
  };

  const handleFinish = () => {
    // Navigate based on source
    if (source === 'test') {
      navigate('/test');
    } else {
      navigate('/chat');
    }
    onClose();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'name':
        return 'Step 1: Agent Name';
      case 'systemPrompt':
        return 'Step 2: System Prompt';
      case 'review':
        return 'Step 3: Review & Create';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'name':
        return 'Choose a name for your agent that reflects its purpose';
      case 'systemPrompt':
        return 'Define personality and behavior of your agent';
      case 'review':
        return 'Review your agent configuration before creating';
      default:
        return '';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'name':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Agent Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 text-lg border border-light-border-primary dark:border-dark-border-primary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary ${
                  errors.name ? 'border-red-300 dark:border-red-800 focus:ring-red-500 focus:border-red-500' : ''
                }`}
                placeholder="e.g., Customer Support Agent"
                disabled={isSubmitting}
                autoFocus
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
              <p className="mt-2 text-sm text-light-text-quaternary dark:text-dark-text-quaternary">
                This is the display name for your agent
              </p>
            </div>
          </div>
        );

      case 'systemPrompt':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                System Prompt
              </label>
              <textarea
                value={formData.systemPrompt}
                onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                className={`w-full px-4 py-3 text-lg border border-light-border-primary dark:border-dark-border-primary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary resize-none ${
                  errors.systemPrompt ? 'border-red-300 dark:border-red-800 focus:ring-red-500 focus:border-red-500' : ''
                }`}
                rows={8}
                placeholder="You are a helpful customer service assistant. You provide accurate, concise answers to customer questions..."
                disabled={isSubmitting}
                autoFocus
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-light-text-quaternary dark:text-dark-text-quaternary">
                  {formData.systemPrompt.length} characters
                </p>
                <p className="text-sm text-light-text-quaternary dark:text-dark-text-quaternary">
                  Provide context and instructions for the AI assistant
                </p>
              </div>
              {errors.systemPrompt && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.systemPrompt}</p>
              )}
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-6">
              <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-4">
                Agent Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Name</h4>
                  <p className="text-base text-light-text-primary dark:text-dark-text-primary">{formData.name || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">System Prompt</h4>
                  <p className="text-base text-light-text-primary dark:text-dark-text-primary whitespace-pre-wrap">
                    {formData.systemPrompt || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="h-full flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-light-border-primary dark:border-dark-border-primary">
            <div className="flex items-center">
              <button
                onClick={handleClose}
                className="p-2 rounded-md hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-light-text-quaternary dark:text-dark-text-quaternary" />
              </button>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                  {chat ? 'Edit Agent' : 'Create New Agent'}
                </h2>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {getStepDescription()}
                </p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'name' || currentStep === 'systemPrompt' || currentStep === 'review'
                  ? 'bg-primary-600 text-white'
                  : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-quaternary dark:text-dark-text-quaternary'
              }`}>
                {currentStep === 'review' ? <CheckIcon className="h-4 w-4" /> : '1'}
              </div>
              <div className={`w-12 h-1 ${
                currentStep === 'systemPrompt' || currentStep === 'review'
                  ? 'bg-primary-600'
                  : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'systemPrompt' || currentStep === 'review'
                  ? 'bg-primary-600 text-white'
                  : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-quaternary dark:text-dark-text-quaternary'
              }`}>
                {currentStep === 'review' ? <CheckIcon className="h-4 w-4" /> : '2'}
              </div>
              <div className={`w-12 h-1 ${
                currentStep === 'review'
                  ? 'bg-primary-600'
                  : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'review'
                  ? 'bg-primary-600 text-white'
                  : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-quaternary dark:text-dark-text-quaternary'
              }`}>
                3
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-8">
              <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                {getStepTitle()}
              </h3>
              
              {isSuccess && createdChat ? (
                <div className="text-center py-12">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                    {chat ? 'Agent Updated Successfully!' : 'Agent Created Successfully!'}
                  </h3>
                  <div className="mt-6 p-6 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg text-left max-w-md mx-auto">
                    <h4 className="font-medium text-light-text-primary dark:text-dark-text-primary mb-3">Agent Details:</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        <strong>Name:</strong> {createdChat.name}
                      </p>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        <strong>System Prompt:</strong> {createdChat.systemPrompt || 'None'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button
                      onClick={handleFinish}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                      {source === 'test' ? 'Go to Test' : 'Go to Build'}
                    </button>
                  </div>
                </div>
              ) : (
                renderStepContent()
              )}
            </div>
          </div>

          {/* Footer */}
          {!isSuccess && (
            <div className="px-6 py-4 border-t border-light-border-primary dark:border-dark-border-primary">
              <div className="flex justify-between">
                <div>
                  {currentStep !== 'name' && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={isSubmitting}
                      className="inline-flex items-center px-4 py-2 border border-light-border-primary dark:border-dark-border-primary text-sm font-medium rounded-lg text-light-text-primary dark:text-dark-text-primary bg-light-bg-secondary dark:bg-dark-bg-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeftIcon className="h-4 w-4 mr-2" />
                      Previous
                    </button>
                  )}
                </div>
                <div>
                  {currentStep === 'review' ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (chat ? 'Updating...' : 'Creating...') : (chat ? 'Update Agent' : 'Create Agent')}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { AgentWizard };