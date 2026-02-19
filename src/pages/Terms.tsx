import { Card, CardContent } from '@/components/ui/card'

export default function Terms() {
  return (
    <div className="pt-16 bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-4xl font-bold mb-2">Terms of Service</h2>
              <p className="text-gray-600 mb-8">Last updated: January 2026</p>

              <div className="space-y-6">
                <section>
                  <h3 className="text-2xl font-bold mb-3">Acceptance of Terms</h3>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing and using OpenHands, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">Use License</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Permission is granted to temporarily use OpenHands for personal, non-commercial transitory viewing only.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">User Responsibilities</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account and password, and for restricting access to your computer.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">Donation Terms</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All donations are made voluntarily and OpenHands does not guarantee the delivery or use of donations by NGOs.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">Contact Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Questions about the Terms of Service should be sent to us at{' '}
                    <a href="mailto:terms@openhands.org" className="text-primary hover:underline">
                      terms@openhands.org
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
