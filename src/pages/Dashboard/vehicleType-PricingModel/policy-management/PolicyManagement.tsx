
import type React from "react"
import { useState } from "react"
import { PolicyData } from "./_components/_common/PolicyCard"
import PolicyHeader from "./_components/PolicyHeader"
import PolicyGrid from "./_components/PolicyGrid"

const PolicyManagementPage: React.FC = () => {
  const [policies, setPolicies] = useState<PolicyData[]>([
    {
      id: "1",
      title: "Terms and Conditions",
      description: "Legal terms and conditions for service usage",
      status: "Published",
      modifiedDate: "10/10/2025",
    },
    {
      id: "2",
      title: "Privacy Policy",
      description: "Data privacy and protection policy",
      status: "Published",
      modifiedDate: "10/10/2025",
    },
    {
      id: "3",
      title: "Refund Policy",
      description: "Service refund and cancellation policy",
      status: "Published",
      modifiedDate: "10/10/2025",
    },
    {
      id: "4",
      title: "Driver Guidelines",
      description: "Guidelines and requirements for drivers",
      status: "Published",
      modifiedDate: "10/10/2025",
    },
    {
      id: "5",
      title: "Safety Protocol",
      description: "Safety measures and emergency procedures",
      status: "Published",
      modifiedDate: "10/10/2025",
    },
    {
      id: "6",
      title: "Service Level Agreement",
      description: "SLA terms and service quality standards",
      status: "Published",
      modifiedDate: "10/10/2025",
    },
  ])

  const handleEditPolicy = (policy: PolicyData) => {
    console.log("Edit policy:", policy)
    // Add your edit logic here (e.g., open modal, redirect)
  }

  const handleDeletePolicy = (id: string) => {
    setPolicies((prevPolicies) => prevPolicies.filter((policy) => policy.id !== id))
  }

  const handleCreatePolicy = () => {
    console.log("Create new policy")
    // Add your create logic here (e.g., open modal, redirect)
  }

  const handleExportAll = () => {
    console.log("Export all policies")
    // Add your export logic here
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <PolicyHeader onCreatePolicy={handleCreatePolicy} onExportAll={handleExportAll} />
        <PolicyGrid policies={policies} onEdit={handleEditPolicy} onDelete={handleDeletePolicy} />
      </div>
    </div>
  )
}

export default PolicyManagementPage
