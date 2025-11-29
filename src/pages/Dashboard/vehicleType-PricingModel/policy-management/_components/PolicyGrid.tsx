import type React from "react"
import PolicyCard, { type PolicyData } from "./_common/PolicyCard"

interface PolicyGridProps {
  policies: PolicyData[]
  onEdit: (policy: PolicyData) => void
  onDelete: (id: string) => void
}

const PolicyGrid: React.FC<PolicyGridProps> = ({ policies, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {policies.map((policy) => (
        <PolicyCard key={policy.id} policy={policy} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default PolicyGrid
