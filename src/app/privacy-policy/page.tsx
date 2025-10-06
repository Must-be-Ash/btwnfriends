import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#222222] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800/60 via-gray-700/40 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-300">Between Friends - Email-Based Stablecoin Payments</p>
            <p className="text-sm text-gray-400 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                Between Friends ("we," "our," or "us") is a peer-to-peer payment application that enables users to send and receive USDC (USD Coin) payments using email addresses. This Privacy Policy explains how we collect, use, and protect your information when you use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-gray-200 mb-3">2.1 Personal Information</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li><strong>Email Address:</strong> Required for account creation and payment processing</li>
                <li><strong>Display Name:</strong> Optional name you choose to display to other users</li>
                <li><strong>Wallet Address:</strong> Automatically generated blockchain wallet address</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-200 mb-3 mt-6">2.2 Transaction Information</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Payment amounts and recipients</li>
                <li>Transaction timestamps and status</li>
                <li>Blockchain transaction hashes</li>
                <li>Payment notes or descriptions</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-200 mb-3 mt-6">2.3 Technical Information</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Device information and browser type</li>
                <li>IP address and location data</li>
                <li>App usage patterns and preferences</li>
                <li>Error logs and performance data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              
              <h3 className="text-xl font-medium text-gray-200 mb-3">3.1 Core Services</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Process and facilitate USDC payments</li>
                <li>Create and manage your embedded wallet</li>
                <li>Send payment notifications via email</li>
                <li>Verify recipient email addresses</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-200 mb-3 mt-6">3.2 Security and Compliance</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Authenticate users and prevent fraud</li>
                <li>Comply with applicable financial regulations</li>
                <li>Monitor for suspicious activity</li>
                <li>Maintain transaction records for audit purposes</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-200 mb-3 mt-6">3.3 Service Improvement</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Analyze usage patterns to improve our service</li>
                <li>Develop new features and functionality</li>
                <li>Provide customer support</li>
                <li>Send important service updates</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Information Sharing</h2>
              
              <h3 className="text-xl font-medium text-gray-200 mb-3">4.1 Third-Party Services</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We integrate with the following services to provide our payment functionality:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li><strong>Coinbase Developer Platform (CDP):</strong> For wallet creation and authentication</li>
                <li><strong>Base Network:</strong> For blockchain transaction processing</li>
                <li><strong>Email Services:</strong> For payment notifications and account verification</li>
                <li><strong>Database Providers:</strong> For secure data storage</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-200 mb-3 mt-6">4.2 Legal Requirements</h3>
              <p className="text-gray-300 leading-relaxed">
                We may share your information when required by law, court order, or to protect our rights and the safety of our users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure authentication through Coinbase's infrastructure</li>
                <li>Regular security audits and monitoring</li>
                <li>Access controls and employee training</li>
                <li>Secure cloud storage with encryption at rest</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your transaction history</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
              <p className="text-gray-300 leading-relaxed">
                We retain your information for as long as necessary to provide our services and comply with legal obligations. Transaction records are kept for a minimum of 7 years as required by financial regulations. You may request deletion of your account at any time, subject to legal requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. International Transfers</h2>
              <p className="text-gray-300 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable privacy laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our service is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our service after any changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-800/40 rounded-lg p-6 border border-white/10">
                <p className="text-gray-300">
                  <strong>Email:</strong> info@btwnfriends.com<br/>
                  <strong>Website:</strong> btwnfriends.com<br/>
                  <strong>Support:</strong> Available through our app's help section
                </p>
              </div>
            </section>

            <div className="border-t pt-8 mt-12">
              <p className="text-sm text-gray-400 text-center">
                This Privacy Policy is effective as of {new Date().toLocaleDateString()} and applies to all users of the Between Friends application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
