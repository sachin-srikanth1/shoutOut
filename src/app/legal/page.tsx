'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import TypingAnimation from '@/components/typing-animation';
import Link from 'next/link';

export default function LegalPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium text-foreground">Legal</h1>
          <p className="text-muted-foreground">
            <TypingAnimation text="Our legal policies and terms of service..." speed={30} />
          </p>
        </div>

        <div className="space-y-6">
          {/* Privacy Policy */}
          <div className="bg-card/50 rounded-xl p-4 border border-purple-100">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              <Link href="/privacy" className="hover:underline text-foreground">
                Privacy Policy
              </Link>
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                At Netch.ai, we are committed to protecting your privacy. This Privacy Policy explains how we collect, 
                use, and safeguard your personal information when you use our networking platform.
              </p>
              <p>
                We collect information you provide directly to us, such as when you create an account, complete your profile, 
                or communicate with other users. This may include your name, email address, professional information, and networking preferences.
              </p>
              <p>
                We use this information to provide our services, improve your experience, and connect you with relevant professionals. 
                We do not sell your personal information to third parties.
              </p>
            </div>
          </div>

          {/* Terms of Service */}
          <div className="bg-card/50 rounded-xl p-4 border border-purple-100">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              <Link href="/terms" className="hover:underline text-foreground">
                Terms of Service
              </Link>
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                By using Netch.ai, you agree to these Terms of Service. Our platform is designed to facilitate professional 
                networking and connections in a respectful and productive environment.
              </p>
              <p>
                You are responsible for the accuracy of information you provide and for maintaining the confidentiality of your account. 
                You agree not to use our service for any unlawful purpose or to harass, abuse, or harm other users.
              </p>
              <p>
                We reserve the right to modify these terms at any time. Continued use of our service constitutes acceptance of any changes.
              </p>
            </div>
          </div>


        </div>
      </div>
    </DashboardLayout>
  );
} 