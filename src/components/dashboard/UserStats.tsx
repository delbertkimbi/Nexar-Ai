export default function UserStats() {
  return (
    <div className="p-6 rounded-lg bg-white shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Level</p>
          <p className="text-2xl font-bold">1</p>
        </div>
        <div>
          <p className="text-gray-600">XP</p>
          <p className="text-2xl font-bold">0/100</p>
        </div>
      </div>
    </div>
  )
} 