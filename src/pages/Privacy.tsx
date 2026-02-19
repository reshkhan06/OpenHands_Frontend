import { Card, CardContent } from '@/components/ui/card'

export default function Privacy() {
  return (
    <div className="pt-16 bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-4xl font-bold mb-2">Privacy Policy</h2>
              <p className="text-gray-600 mb-8">Last updated: January 2026</p>

              <div className="space-y-6">
                <section>
                  <h3 className="text-2xl font-bold mb-3">Information We Collect</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We collect information you provide directly to us, such as when you create an account, make a donation, or contact us for support.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">How We Use Your Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our services, process donations, and communicate with you.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">Information Sharing</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">Data Security</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">Contact Us</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at{' '}
                    <a href="mailto:privacy@openhands.org" className="text-primary hover:underline">
                      privacy@openhands.org
                    </a>
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
