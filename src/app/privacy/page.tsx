"use client";

import DashboardLayout from '@/components/layout/dashboard-layout';

export default function PrivacyPolicyPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground">How Netch.ai collects, uses, and protects your information.</p>
        </div>
        <div className="space-y-8">
          {/* Introduction */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <div className="space-y-4 text-muted-foreground">
              <p><strong>Netch AI</strong> (“Netch”, “we”, “our”, or “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://www.netch.ai" className="underline text-purple-600" target="_blank" rel="noopener noreferrer">https://www.netch.ai</a> and use our services, including automated networking tools that may connect to your email, LinkedIn, or other third-party accounts.</p>
              <p>By accessing or using our website or services, you agree to the practices described in this Privacy Policy. If you do not agree with the terms, please do not access the site or use our services.</p>
            </div>
          </div>

          {/* 1. Information We Collect */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="text-lg font-medium text-foreground">a. Information You Provide to Us</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Full name, email address, password, and any profile information you submit.</li>
                <li><strong>Third-Party Account Data:</strong> If you connect accounts (e.g., Gmail, Outlook, LinkedIn), we may collect access tokens and associated profile data, such as contact lists, message metadata, and profile connections, to enable networking automation.</li>
                <li><strong>Communication Data:</strong> If you use our automated messaging features, we may store message templates, sent messages, and engagement metrics.</li>
                <li><strong>Billing Information:</strong> If you purchase a subscription, we collect payment details via a third-party processor (e.g., Stripe). Netch does not store credit card numbers directly.</li>
              </ul>
              <h3 className="text-lg font-medium text-foreground mt-6">b. Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Device & Usage Data:</strong> IP address, browser type, operating system, referring URLs, and pages visited.</li>
                <li><strong>Cookies & Tracking:</strong> We use cookies and similar technologies to recognize your browser or device, maintain your session, and collect usage analytics (see Section 6 for more on Cookies).</li>
              </ul>
            </div>
          </div>

          {/* 2. How We Use Your Information */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide, operate, and maintain Netch and its features</li>
              <li>Enable automated networking, including email/LinkedIn messaging and contact management</li>
              <li>Personalize your experience and recommend actions or contacts</li>
              <li>Monitor and analyze usage and engagement trends</li>
              <li>Provide customer support</li>
              <li>Ensure security and prevent fraud</li>
              <li>Send service-related updates and notifications</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          {/* 3. Sharing of Information */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Sharing of Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>We do not sell your personal information.</strong> We may share your information with:</li>
              <li><strong>Service Providers:</strong> Vendors that help us operate the platform (e.g., hosting, analytics, messaging).</li>
              <li><strong>Third-Party Integrations:</strong> If you connect services like Gmail or LinkedIn, we access and use those services only as authorized by you.</li>
              <li><strong>Legal Obligations:</strong> We may disclose information when required by law or to respond to legal process.</li>
              <li><strong>Business Transfers:</strong> If Netch is involved in a merger, acquisition, or asset sale, your information may be transferred.</li>
            </ul>
          </div>

          {/* 4. Data Retention */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Retention</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>We retain your data for as long as necessary to provide services and comply with our legal obligations. Upon termination of your account, we may retain certain information for backup, audit, and compliance purposes.</p>
              <p>You may request deletion of your account and associated data by contacting us at <a href="mailto:privacy@netch.ai" className="underline text-purple-600">privacy@netch.ai</a>.</p>
            </div>
          </div>

          {/* 5. Your Choices and Rights */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Choices and Rights</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Delete your data ("Right to be Forgotten")</li>
              <li>Object to or restrict certain processing</li>
              <li>Withdraw Consent for integrations (e.g., disconnecting LinkedIn or Gmail)</li>
            </ul>
            <div className="text-muted-foreground mt-4">
              <p>You can manage account settings, revoke integration access, or delete your account directly via the platform, or contact us for assistance.</p>
            </div>
          </div>

          {/* 6. Cookies and Tracking Technologies */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies and Tracking Technologies</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Keep you logged in</li>
              <li>Analyze site traffic and usage</li>
              <li>Customize your experience</li>
            </ul>
            <div className="text-muted-foreground mt-4">
              <p>You may control cookie preferences via your browser settings. Disabling cookies may affect functionality.</p>
            </div>
          </div>

          {/* 7. Security */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Security</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>We take security seriously. We implement technical, administrative, and physical safeguards to protect your data from unauthorized access, alteration, or disclosure. These measures include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>HTTPS encryption</li>
                <li>OAuth-secured third-party integrations</li>
                <li>Limited access to personal data</li>
                <li>Regular system monitoring</li>
              </ul>
              <p>However, no method of transmission over the Internet is 100% secure. You use our services at your own risk.</p>
            </div>
          </div>

          {/* 8. International Users */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. International Users</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Netch is based in the United States. If you access the platform from outside the U.S., your data may be transferred to, stored, or processed in the U.S. where data protection laws may differ from those of your jurisdiction.</p>
            </div>
          </div>

          {/* 9. Children’s Privacy */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Children’s Privacy</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Netch is not intended for children under 13 (or 16 in certain jurisdictions). We do not knowingly collect personal information from minors. If we learn that we have, we will delete it promptly.</p>
            </div>
          </div>

          {/* 10. Changes to This Privacy Policy */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Privacy Policy</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated date. If material changes are made, we will notify users via email or platform notice.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
