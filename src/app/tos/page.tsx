import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfServicePage() {
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
          <h1 className="text-3xl font-bold text-[#CCCCCC] mb-8">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none">
            <div className="space-y-6 text-[#B8B8B8]">
              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using Between Friends (&ldquo;the Service&rdquo;), you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">2. Description of Service</h2>
                <p>
                  Between Friends is a peer-to-peer USDC transfer application that allows users to send and receive cryptocurrency via email addresses. The service utilizes blockchain technology and smart contracts for secure transactions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">3. User Responsibilities</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must provide accurate and complete information when using the Service</li>
                  <li>You are solely responsible for all activities that occur under your account</li>
                  <li>You must comply with all applicable laws and regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">4. Wallet and Cryptocurrency</h2>
                <p>
                  Your wallet is secured by Coinbase Developer Platform. You maintain full custody of your digital assets. Between Friends does not have access to your private keys or funds.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">5. Transaction Risks</h2>
                <p>
                  Cryptocurrency transactions are irreversible. You acknowledge and accept the risks associated with blockchain transactions, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Network congestion and transaction delays</li>
                  <li>Gas fees and transaction costs</li>
                  <li>Potential smart contract vulnerabilities</li>
                  <li>Market volatility of digital assets</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">6. Limitation of Liability</h2>
                <p>
                  Between Friends shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">7. Termination</h2>
                <p>
                  We may terminate or suspend your access to the Service at any time, without prior notice or liability, for any reason whatsoever.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">8. Changes to Terms</h2>
                <p>
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#CCCCCC] mb-4">9. Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us through our support channels.
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