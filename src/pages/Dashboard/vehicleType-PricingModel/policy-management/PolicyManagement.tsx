/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { useState, useEffect } from "react"
import { PolicyData } from "./_components/_common/PolicyCard"
import PolicyHeader from "./_components/PolicyHeader"
import PolicyGrid from "./_components/PolicyGrid"
import AddPolicyModal from "./_components/AddPolicyModal"
import EditPolicyModal from "./_components/EditPolicyModal"
import { 
  useAddPolicyMutation, 
  useDeletePolicyMutation, 
  useGetPoliciesQuery, 
  useUpdatePolicyMutation, 
  useUpdatePolicyStatusMutation 
} from "@/redux/features/policyManagement/policyManagementApi"
import DeleteConfirmationModal from "./_components/DeleteConfirmationModal"

const PolicyManagementPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyData | null>(null)
  const [policyToDelete, setPolicyToDelete] = useState<string | null>(null)
  const [policies, setPolicies] = useState<PolicyData[]>([])
  const [loadingAnimation, setLoadingAnimation] = useState(true)
  
  const { data: apiResponse, isLoading, refetch } = useGetPoliciesQuery("")
  const [addPolicy, { isLoading: isAdding }] = useAddPolicyMutation()
  const [updatePolicy] = useUpdatePolicyMutation()
  const [updatePolicyStatus] = useUpdatePolicyStatusMutation()
  const [deletePolicy, { isLoading: isDeleting }] = useDeletePolicyMutation()

  useEffect(() => {
    const rawData = apiResponse?.data?.data || (Array.isArray(apiResponse?.data) ? apiResponse.data : null);

    if (apiResponse?.success && rawData) {
      const formattedPolicies = rawData.map((item: any) => ({
        id: item.id.toString(),
        title: item.title || "",
        description: item.desc || "",
        isPublist: item.isPublist || false,
        modifiedDate: item.updated_at || item.created_at,
        created_at: item.created_at,
        updated_at: item.updated_at
      }))
      setPolicies(formattedPolicies)
      
      setTimeout(() => {
        setLoadingAnimation(false)
      }, 300)
    } else if (!isLoading) {
      setPolicies([])
      setLoadingAnimation(false)
    }
  }, [apiResponse, isLoading])

  useEffect(() => {
    if (isLoading) {
      setLoadingAnimation(true)
    }
  }, [isLoading])

  const handleCreatePolicy = async (title: string, description: string) => {
    try {
      const response = await addPolicy({ title, desc: description }).unwrap()
      refetch()
      setIsAddModalOpen(false)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error }
    }
  }

  const handleUpdatePolicy = async (id: string, title: string, description: string) => {
    try {
      const response = await updatePolicy({ id, title, desc: description }).unwrap()
      refetch()
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error }
    }
  }

  const handleUpdatePolicyStatus = async (id: string, isPublist: boolean) => {
    console.log(isPublist)
    try {
      const response = await updatePolicyStatus(id).unwrap()
      refetch()
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error }
    }
  }

  const handleDeletePolicy = async (id: string) => {
    try {
      const response = await deletePolicy(id).unwrap()
      refetch()
      setIsDeleteModalOpen(false)
      setPolicyToDelete(null)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error }
    }
  }

  const handleEditPolicyClick = (policy: PolicyData) => {
    setSelectedPolicy(policy)
    setIsEditModalOpen(true)
  }

  const handleDeletePolicyClick = (id: string) => {
    const policy = policies.find(p => p.id === id)
    setPolicyToDelete(id)
    setSelectedPolicy(policy || null)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (policyToDelete) {
      await handleDeletePolicy(policyToDelete)
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setPolicyToDelete(null)
    setSelectedPolicy(null)
  }

  const handleAddPolicyClick = () => {
    setIsAddModalOpen(true)
  }

  const handleExportAll = () => {
    if (!policies || policies.length === 0) return
    
    const headers = ["Title", "Description", "Status", "Modified Date"]
    const csvRows = [
      headers.join(","),
      ...policies.map(policy => 
        `"${policy.title || ''}","${policy.description || ''}","${policy.isPublist ? 'Published' : 'Draft'}","${policy.modifiedDate || ''}"`
      )
    ]
    
    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `policies-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <PolicyHeader 
          onCreatePolicy={handleAddPolicyClick} 
          onExportAll={handleExportAll} 
        />
        
        {isLoading || loadingAnimation ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="animate-pulse">
                  <div className="flex justify-between items-start mb-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
                  <div className="flex gap-3">
                    <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                    <div className="w-10 h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <PolicyGrid 
            policies={policies} 
            onEdit={handleEditPolicyClick} 
            onDelete={handleDeletePolicyClick} 
          />
        )}
        
        <AddPolicyModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreatePolicy}
          isLoading={isAdding}
        />
        
        <EditPolicyModal 
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedPolicy(null)
          }}
          policy={selectedPolicy}
          onUpdateContent={handleUpdatePolicy}
          onUpdateStatus={handleUpdatePolicyStatus}
        />
        
        <DeleteConfirmationModal 
          isOpen={isDeleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          policy={selectedPolicy}
          isLoading={isDeleting}
        />
      </div>
    </div>
  )
}

export default PolicyManagementPage