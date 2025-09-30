import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#222222] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#B8B8B8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Content Container */}
        <div className="backdrop-blur-xl bg-[#2A2A2A]/80 border border-[#4A4A4A] rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-[#CCCCCC] mb-8">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <div className="space-y-6 text-[#B8B8B8]">
              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">1. Information We Collect</h2>
                <p>
                  Between Friends collects minimal information necessary to provide our services:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong>Email Address:</strong> Used for account creation and transaction notifications</li>
                  <li><strong>Display Name:</strong> How your name appears to other users</li>
                  <li><strong>Wallet Address:</strong> Your blockchain wallet address for transactions</li>
                  <li><strong>Transaction History:</strong> Records of your USDC transfers for your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">2. How We Use Your Information</h2>
                <p>
                  We use your information solely to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Facilitate USDC transfers between users</li>
                  <li>Send transaction notifications and confirmations</li>
                  <li>Maintain your transaction history</li>
                  <li>Provide customer support when needed</li>
                  <li>Comply with legal and regulatory requirements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">3. Information Sharing</h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties except:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>In connection with a business transfer or acquisition</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">4. Wallet Security</h2>
                <p>
                  Your cryptocurrency wallet is secured by Coinbase Developer Platform using industry-standard security measures:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Private keys are secured in a Trusted Execution Environment (TEE)</li>
                  <li>You maintain full custody of your digital assets</li>
                  <li>Between Friends never has access to your private keys</li>
                  <li>All transactions are secured by blockchain technology</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">5. Data Storage and Retention</h2>
                <p>
                  We store your data securely and retain it only as long as necessary to provide our services or as required by law. Transaction records may be retained for compliance and auditing purposes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">6. Cookies and Tracking</h2>
                <p>
                  We use essential cookies to maintain your session and provide core functionality. We do not use tracking cookies for advertising or analytics purposes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">7. Your Rights</h2>
                <p>
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your account and data</li>
                  <li>Export your transaction history</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">8. Children&apos;s Privacy</h2>
                <p>
                  Our service is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">9. International Users</h2>
                <p>
                  If you are accessing our service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">10. Changes to Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">11. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us through our support channels.
                </p>
              </section>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#4A4A4A]">
            <p className="text-sm text-[#999999] text-center">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}