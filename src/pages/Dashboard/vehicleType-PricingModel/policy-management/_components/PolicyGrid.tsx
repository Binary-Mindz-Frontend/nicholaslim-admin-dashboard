import type React from "react"
import PolicyCard, { type PolicyData } from "./_common/PolicyCard"

interface PolicyGridProps {
  policies: PolicyData[]
  onEdit: (policy: PolicyData) => void
  onDelete: (id: string) => void
}

const PolicyGrid: React.FC<PolicyGridProps> = ({ policies, onEdit, onDelete }) => {
  if (!Array.isArray(policies)) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm animate-fadeIn">
        <p className="text-gray-500 text-lg">Invalid data format</p>
      </div>
    )
  }

  if (policies.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm animate-fadeIn">
        <p className="text-gray-500 text-lg">No policies found</p>
        <p className="text-gray-400 mt-2">Create your first policy to get started</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {policies.map((policy, index) => (
        <div 
          key={policy.id} 
          className="animate-slideUp"
          style={{ 
            animationDelay: `${index * 0.1}s`,
            animationFillMode: 'both'
          }}
        >
          <PolicyCard policy={policy} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  )
}

export default PolicyGrid