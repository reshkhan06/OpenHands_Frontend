import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Users, Droplet, HeartPulse, Brush, Wrench, ShoppingBasket, Building } from 'lucide-react'

const ngos = [
  { id: 1, name: 'Helping Hands Foundation', description: 'Providing food, shelter, and education to underprivileged communities.', icon: Building, color: 'text-primary' },
  { id: 2, name: 'Green Earth Initiative', description: 'Environmental conservation and sustainable development projects.', icon: Heart, color: 'text-green-500' },
  { id: 3, name: 'Education for All', description: 'Empowering children through quality education and learning resources.', icon: Building, color: 'text-blue-500' },
  { id: 4, name: 'Women Empowerment Trust', description: 'Vocational training and micro-loan programs to support women entrepreneurs.', icon: Users, color: 'text-yellow-500' },
  { id: 5, name: 'Clean Water Project', description: 'Building wells and water systems to provide safe drinking water in rural areas.', icon: Droplet, color: 'text-primary' },
  { id: 6, name: 'HealthFirst Initiative', description: 'Community health camps, vaccinations and maternal care outreach programs.', icon: HeartPulse, color: 'text-red-500' },
  { id: 7, name: 'Art for Change', description: 'Creative programs that use art to educate and empower youth.', icon: Brush, color: 'text-blue-500' },
  { id: 8, name: 'Rural Skills Network', description: 'Skill development workshops focused on sustainable livelihoods in villages.', icon: Wrench, color: 'text-green-500' },
  { id: 9, name: 'Food Relief Coalition', description: 'Rapid-response food distribution and community kitchens in crisis zones.', icon: ShoppingBasket, color: 'text-yellow-500' },
]

export default function NGOs() {
  return (
    <div className="pt-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {ngos.map((ngo) => {
              const Icon = ngo.icon
              return (
                <Card key={ngo.id} className="p-6 text-center border-0 shadow-sm hover:shadow-lg transition-shadow">
                  <Icon className={`w-16 h-16 ${ngo.color} mx-auto mb-4`} />
                  <h5 className="font-bold text-lg mb-3">{ngo.name}</h5>
                  <p className="text-gray-600 mb-4">{ngo.description}</p>
                  <Link to={`/ngo/${ngo.id}`}>
                    <Button className="w-full">View Profile</Button>
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
