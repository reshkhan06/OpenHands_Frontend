import { useParams } from 'react-router-dom'
import NgoLayout from '@/components/NgoLayout'
import PickupDetail from '@/pages/PickupDetail'

export default function NgoPickupDetailPage() {
  const { pickupId } = useParams<{ pickupId: string }>()
  const title = pickupId ? `Pickup #${pickupId}` : 'Pickup Detail'
  return (
    <NgoLayout title={title} activeManagePickups>
      <PickupDetail />
    </NgoLayout>
  )
}
