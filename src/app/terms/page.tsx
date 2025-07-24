"use client";

import DashboardLayout from '@/components/layout/dashboard-layout';

export default function TermsOfServicePage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground">The terms and conditions governing your use of Netch.ai.</p>
        </div>
        <div className="space-y-8">
          {/* Introduction */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <div className="space-y-4 text-muted-foreground">
              <p>These Terms of Service ("Terms") govern your access to and use of the Netch AI platform, located at <a href="https://www.netch.ai" className="underline text-purple-600" target="_blank" rel="noopener noreferrer">https://www.netch.ai</a> (the "Site"), and related services (collectively, the "Services") provided by Netch AI ("Netch," "we," "us," or "our").</p>
              <p>By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, do not use the platform.</p>
            </div>
          </div>

          {/* 1. Overview of Netch */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Overview of Netch</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Netch is a networking management platform that enables users to automate and streamline their professional relationship building. This includes, but is not limited to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact aggregation and organization</li>
                <li>Automated messaging and follow-ups</li>
                <li>Integration with third-party accounts (e.g., Gmail, LinkedIn)</li>
              </ul>
            </div>
          </div>

          {/* 2. Eligibility */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Eligibility</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>To use Netch, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 13 years of age (16 in some jurisdictions)</li>
                <li>Have the legal capacity to enter into a binding agreement</li>
                <li>Use the Services in accordance with these Terms and applicable laws</li>
              </ul>
              <p>If you use Netch on behalf of a company or organization, you confirm you are authorized to bind them to these Terms.</p>
            </div>
          </div>

          {/* 3. User Accounts and Security */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Accounts and Security</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>To use certain features, you must create an account. You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the confidentiality of your password</li>
                <li>Notify us immediately of any unauthorized use or breach</li>
              </ul>
              <p>You are responsible for all activity under your account.</p>
            </div>
          </div>

          {/* 4. Third-Party Account Integrations */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Third-Party Account Integrations</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>By connecting third-party services (e.g., email, LinkedIn), you authorize Netch to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your data through those services via APIs or other means</li>
                <li>Perform automated actions such as messaging, contact syncing, or data retrieval</li>
                <li>Store tokens or identifiers required for integration (we do not store credentials)</li>
              </ul>
              <p>You can revoke access at any time via the respective third-party platform or your Netch dashboard.</p>
              <p>Netch is not responsible for the availability, performance, or content of third-party services.</p>
            </div>
          </div>

          {/* 5. Acceptable Use */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Acceptable Use</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>You agree not to misuse the Services. This includes but is not limited to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sending spam, unsolicited messages, or mass outreach without user consent</li>
                <li>Automating outreach in a way that violates third-party terms (e.g., LinkedIn policies)</li>
                <li>Reverse engineering, scraping, or interfering with Netch systems</li>
                <li>Uploading viruses, malware, or harmful code</li>
                <li>Misrepresenting your identity or affiliations</li>
              </ul>
              <p>We reserve the right to suspend or terminate accounts engaging in prohibited activity.</p>
            </div>
          </div>

          {/* 6. Service Modifications */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Service Modifications</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>We may modify, suspend, or discontinue any part of the Services at any time, with or without notice. This includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Introducing new features</li>
                <li>Changing pricing models</li>
                <li>Removing integrations or functionality</li>
              </ul>
              <p>We are not liable to you or any third party for such changes.</p>
            </div>
          </div>

          {/* 7. Subscription and Billing */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Subscription and Billing</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Certain features of Netch may require a paid subscription. By subscribing, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pay all applicable fees and taxes</li>
                <li>Allow recurring charges, if applicable</li>
                <li>Comply with our cancellation and refund policies</li>
              </ul>
              <p>We use third-party processors (e.g., Stripe) to manage billing. All payment information is handled securely and externally.</p>
            </div>
          </div>

          {/* 8. Intellectual Property */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Intellectual Property</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>All content, features, and functionality of Netch — including software, branding, and user interface — are the exclusive property of Netch or its licensors. You may not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Copy, distribute, or modify any part of the platform</li>
                <li>Use our name, logo, or marks without prior written permission</li>
                <li>Build derivative works based on our Services</li>
              </ul>
              <p>You retain rights to the content and data you upload or create through the platform.</p>
            </div>
          </div>

          {/* 9. Termination */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Termination</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>You may stop using Netch at any time. We reserve the right to suspend or terminate your account for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violating these Terms</li>
                <li>Abusing the service or harming other users</li>
                <li>Legal or regulatory reasons</li>
              </ul>
              <p>Upon termination, we may delete your account and data, except where retention is required by law.</p>
            </div>
          </div>

          {/* 10. Disclaimer of Warranties */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Disclaimer of Warranties</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Netch is provided "as is" and "as available". We make no warranties or guarantees, express or implied, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>That the Services will be error-free or uninterrupted</li>
                <li>That automation will produce any particular networking outcome</li>
                <li>That third-party integrations will remain operational or supported</li>
              </ul>
              <p>Use the platform at your own risk.</p>
            </div>
          </div>

          {/* 11. Limitation of Liability */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Limitation of Liability</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>To the maximum extent permitted by law, Netch is not liable for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of data, profits, or business opportunities</li>
                <li>Damages arising from third-party account activity or service downtime</li>
              </ul>
              <p>Our total liability for any claim is limited to the amount you paid us in the last 12 months.</p>
            </div>
          </div>

          {/* 12. Indemnification */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Indemnification</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>You agree to defend and indemnify Netch and its affiliates against any claims, damages, or expenses arising from:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use or misuse of the Services</li>
                <li>Your violation of these Terms or applicable law</li>
                <li>Your infringement of third-party rights (e.g., sending unauthorized messages)</li>
              </ul>
            </div>
          </div>

          {/* 13. Governing Law */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Governing Law</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>These Terms are governed by the laws of the State of California, without regard to conflict of laws principles. Any disputes shall be resolved in the state or federal courts located in San Francisco County, California.</p>
            </div>
          </div>

          {/* 14. Changes to Terms */}
          <div className="bg-card/50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-semibold text-foreground mb-4">14. Changes to Terms</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>We may update these Terms periodically. When we do, we will:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Post the updated version with a new date</li>
                <li>Notify users of material changes (e.g., via email or in-app)</li>
              </ul>
              <p>Your continued use of Netch after changes indicates acceptance of the updated Terms.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
