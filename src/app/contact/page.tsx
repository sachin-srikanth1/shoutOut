'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { Mail, MessageCircle, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
          <p className="text-muted-foreground">Get in touch with our team for support and inquiries.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground">support@netch.ai</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Live Chat</p>
                    <p className="text-muted-foreground">Available 24/7</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Phone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Office</p>
                    <p className="text-muted-foreground">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Support Hours</h2>
              <div className="space-y-2 text-muted-foreground">
                <p><span className="font-medium text-foreground">Monday - Friday:</span> 9:00 AM - 6:00 PM PST</p>
                <p><span className="font-medium text-foreground">Saturday:</span> 10:00 AM - 4:00 PM PST</p>
                <p><span className="font-medium text-foreground">Sunday:</span> Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border-b border-border/50 pb-4">
              <h3 className="font-medium text-foreground mb-2">How do I get started with Netch.ai?</h3>
              <p className="text-muted-foreground text-sm">
                Simply create an account, complete your profile, and our AI will start recommending relevant connections for you.
              </p>
            </div>
            <div className="border-b border-border/50 pb-4">
              <h3 className="font-medium text-foreground mb-2">Is my data secure?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, we use industry-standard encryption and security measures to protect your personal and professional information.
              </p>
            </div>
            <div className="border-b border-border/50 pb-4">
              <h3 className="font-medium text-foreground mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-muted-foreground text-sm">
                Absolutely. You can cancel your subscription at any time from your account settings with no questions asked.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">How does the AI matching work?</h3>
              <p className="text-muted-foreground text-sm">
                Our AI analyzes your professional background, interests, and goals to find the most relevant connections that can help advance your career.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 