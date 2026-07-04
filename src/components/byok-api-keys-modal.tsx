/**
 * BYOK "Add Key" modal — add-only by design: existing keys are listed and
 * managed (toggle/delete) inline in Settings → API Keys & Secrets, so this
 * dialog stays a single-purpose flow: pick a provider, paste a key, done.
 */

import { useState, useEffect, useCallback } from 'react';
import { Key, Check, AlertCircle, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import type { SecretTemplate } from '@/api-types';

// Import provider logos
import OpenAILogo from '@/assets/provider-logos/openai.svg?react';
import AnthropicLogo from '@/assets/provider-logos/anthropic.svg?react';
import GoogleLogo from '@/assets/provider-logos/google.svg?react';
import CerebrasLogo from '@/assets/provider-logos/cerebras.svg?react';
import CloudflareLogo from '@/assets/provider-logos/cloudflare.svg?react';

interface ByokApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyAdded?: () => void;
}

// Logo mapping for dynamic provider support
const PROVIDER_LOGOS: Record<string, React.ComponentType<{ className?: string }>> = {
  openai: OpenAILogo,
  anthropic: AnthropicLogo,
  'google-ai-studio': GoogleLogo,
  cerebras: CerebrasLogo,
};

interface BYOKProvider {
  id: string;
  name: string;
  provider: string;
  logo: React.ComponentType<{ className?: string }>;
  placeholder: string;
  validation: RegExp;
}

/**
 * Convert BYOK template to provider configuration
 */
function templateToBYOKProvider(template: SecretTemplate): BYOKProvider {
  const logo = PROVIDER_LOGOS[template.provider] || (() => <div className="w-4 h-4 bg-bg-4 rounded" />);

  return {
    id: template.id,
    name: template.displayName.replace(' (BYOK)', ''),
    provider: template.provider,
    logo,
    placeholder: template.placeholder,
    validation: new RegExp(template.validation),
  };
}

export function ByokApiKeysModal({ isOpen, onClose, onKeyAdded }: ByokApiKeysModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [byokProviders, setBYOKProviders] = useState<BYOKProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get selected provider details
  const provider = byokProviders.find(p => p.id === selectedProvider);

  const loadBYOKProviders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getBYOKTemplates();

      if (response.success && response.data) {
        const providers = response.data.templates.map(templateToBYOKProvider);
        setBYOKProviders(providers);
      } else {
        toast.error('Failed to load BYOK providers');
      }
    } catch (error) {
      console.error('Error loading BYOK templates:', error);
      toast.error('Failed to load BYOK providers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load BYOK templates when the modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedProvider(null);
      setApiKey('');
      setIsSaving(false);
      loadBYOKProviders();
    }
  }, [isOpen, loadBYOKProviders]);

  // Handle provider selection
  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    setApiKey('');
  };

  // Validate key format
  const isKeyFormatValid = provider && apiKey && provider.validation.test(apiKey);

  // Save API key, then close — the Settings list shows the new key inline.
  const handleSaveKey = async () => {
    if (!provider || !apiKey || !isKeyFormatValid) return;

    setIsSaving(true);

    try {
      await apiClient.storeSecret({
        templateId: provider.id,
        value: apiKey.trim(),
        environment: 'production'
      });

      toast.success(`${provider.name} API key added successfully!`);
      onKeyAdded?.();
      setSelectedProvider(null);
      setApiKey('');
      onClose();
    } catch (error) {
      console.error('Failed to save API key:', error);
      toast.error('Failed to save API key. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Add Your Own Key
            <span className="flex items-center gap-1 text-xs text-text-tertiary font-normal">
              via <CloudflareLogo className="h-3 w-3" /> AI Gateway
            </span>
          </DialogTitle>
          <DialogDescription>
            Bring a provider API key to run builds on your own provider billing. Added keys
            appear under API Keys &amp; Secrets in Settings, where you can pause or remove them.
          </DialogDescription>
        </DialogHeader>

        {/* Provider Selection - Clean List */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select Provider</Label>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full flex items-center gap-3 p-3 rounded-lg border border-border-primary">
                  <div className="w-8 h-8 bg-bg-4 rounded-md animate-pulse" />
                  <div className="h-4 bg-bg-4 rounded animate-pulse flex-1" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {byokProviders.map((providerOption) => {
                const LogoComponent = providerOption.logo;
                const isSelected = selectedProvider === providerOption.id;
                return (
                  <button
                    key={providerOption.id}
                    onClick={() => handleProviderSelect(providerOption.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-accent bg-accent/10'
                        : 'border-border-primary bg-bg-3 hover:border-accent/50 hover:bg-bg-4'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-bg-4 rounded-md border border-border-primary">
                      <LogoComponent className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{providerOption.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* API Key Input - Smooth Expansion */}
        {selectedProvider && provider && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
            <Label htmlFor="apiKey" className="text-sm font-medium">
              Enter your {provider.name} API key
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider.placeholder}
                className={`pr-10 ${
                  apiKey
                    ? isKeyFormatValid
                      ? 'border-green-500 focus:border-green-500'
                      : 'border-red-500 focus:border-red-500'
                    : ''
                }`}
              />
              {apiKey && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isKeyFormatValid ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {apiKey && !isKeyFormatValid && (
              <p className="text-xs text-red-500">
                Invalid format. Expected: {provider.placeholder}
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {selectedProvider && (
            <Button
              onClick={handleSaveKey}
              disabled={!apiKey || !isKeyFormatValid || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Key
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
