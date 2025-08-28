'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Send, Sparkles, User, MessageSquare, Mail } from 'lucide-react';

export default function SendShoutOutPage() {
  const searchParams = useSearchParams();
  const defaultRecipient = searchParams.get('to') || '';
  
  const [formData, setFormData] = useState({
    recipientEmail: defaultRecipient,
    recipientName: '',
    message: '',
    category: 'Teamwork',
    useAIPolish: false,
    includeManager: true
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Create the shoutout object
    const shoutout = {
      id: Date.now().toString(),
      type: 'sent' as const,
      recipient: formData.recipientName || formData.recipientEmail,
      message: formData.useAIPolish ? getAIPolishPreview().replace('AI Polished: "', '').replace('"', '') : formData.message,
      category: formData.category,
      date: new Date().toISOString(),
      isPublic: true
    };

    // Save to localStorage
    const existingShoutouts = localStorage.getItem('shoutouts');
    const shoutouts = existingShoutouts ? JSON.parse(existingShoutouts) : [];
    shoutouts.push(shoutout);
    localStorage.setItem('shoutouts', JSON.stringify(shoutouts));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSuccess(true);
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getAIPolishPreview = () => {
    if (!formData.message || !formData.useAIPolish) return '';
    
    // Simple AI polish simulation
    const polished = formData.message
      .replace(/\b(amazing|great|awesome|fantastic)\b/gi, 'exceptional')
      .replace(/\b(good|nice)\b/gi, 'outstanding')
      .replace(/\b(help|helped)\b/gi, 'supported')
      .replace(/\b(work|working)\b/gi, 'contributing');
    
    return `AI Polished: "${polished}"`;
  };

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Send className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">ShoutOut Sent! 🎉</h1>
          <p className="text-muted-foreground text-lg">
            Your recognition has been sent to {formData.recipientName || formData.recipientEmail}. 
            Their manager has been CC'd for visibility.
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => setSuccess(false)}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Send Another ShoutOut
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="block mx-auto text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Send a ShoutOut</h1>
          <p className="text-muted-foreground">
            Recognize a colleague for their great work and make it visible to their manager
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <User className="h-5 w-5" />
              Who are you recognizing?
            </h2>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="recipientEmail" className="block text-sm font-medium text-foreground mb-2">
                  Colleague's Email *
                </label>
                <input
                  type="email"
                  id="recipientEmail"
                  value={formData.recipientEmail}
                  onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                  placeholder="colleague@company.com"
                  required
                  className="w-full px-4 py-3 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
              
              <div>
                <label htmlFor="recipientName" className="block text-sm font-medium text-foreground mb-2">
                  Colleague's Name (optional)
                </label>
                <input
                  type="text"
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => handleInputChange('recipientName', e.target.value)}
                  placeholder="First and Last Name"
                  className="w-full px-4 py-3 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Recognition Message */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              What are you recognizing them for?
            </h2>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Recognition Message *
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Describe the great work, behavior, or contribution you want to recognize..."
                required
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.message.length}/500 characters
              </p>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Recognition Category
            </h2>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                What category best describes this recognition? *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
                className="w-full px-4 py-3 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              >
                <option value="Teamwork">Teamwork</option>
                <option value="Innovation">Innovation</option>
                <option value="Leadership">Leadership</option>
                <option value="Customer Focus">Customer Focus</option>
                <option value="Excellence">Excellence</option>
              </select>
            </div>
          </div>

          {/* AI Polish Option */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="useAIPolish"
                checked={formData.useAIPolish}
                onChange={(e) => handleInputChange('useAIPolish', e.target.checked)}
                className="w-4 h-4 text-primary border-border/50 rounded focus:ring-primary/20"
              />
              <label htmlFor="useAIPolish" className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                Use AI to polish the tone and clarity (optional)
              </label>
            </div>
            
            {formData.useAIPolish && formData.message && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {getAIPolishPreview()}
                </p>
              </div>
            )}
          </div>

          {/* Manager CC Option */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="includeManager"
                checked={formData.includeManager}
                onChange={(e) => handleInputChange('includeManager', e.target.checked)}
                className="w-4 h-4 text-primary border-border/50 rounded focus:ring-primary/20"
                disabled
              />
              <label htmlFor="includeManager" className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Mail className="h-4 w-4 text-blue-500" />
                CC their manager for visibility (required)
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Manager visibility is mandatory to drive recognition culture and performance visibility.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.recipientEmail || !formData.message}
            className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending ShoutOut...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send ShoutOut
              </>
            )}
          </button>
        </form>

        {/* Preview */}
        {formData.message && (
          <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-foreground mb-3">Email Preview</h3>
            <div className="space-y-2 text-sm">
              <p><strong>To:</strong> {formData.recipientEmail}</p>
              <p><strong>CC:</strong> [Manager] (automatically added)</p>
              <p><strong>Subject:</strong> ShoutOut from [Your Name] 🎉</p>
              <div className="mt-4 p-3 bg-muted/50 rounded border-l-4 border-l-primary">
                <p className="text-foreground">{formData.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
