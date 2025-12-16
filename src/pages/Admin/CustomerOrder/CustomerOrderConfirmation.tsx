import { useGetCustomerOrderConfirmationQuery, useGetCustomerOrderConfirmationStatusQuery, useUpdateCustomerOrderConfirmationMutation } from "@/redux/features/customerOrderConfirmation/customerOrderConfirmationApi";
import { ConfirmationRatioChart } from "./components/ConfirmationRatioChart";
import { ConfirmationRules } from "./components/ConfirmationRules";
import { OverviewCards } from "./components/OverviewCards";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface LocalSettings {
  new_customer_percentage: number;
  completed_order_required: number;
  follower_weight: number;
}

export default function CustomerOrderConfirmation() {
  const [localSettings, setLocalSettings] = useState<LocalSettings>({
    new_customer_percentage: 10,
    completed_order_required: 5,
    follower_weight: 80,
  });
  
  const { 
    data: configData, 
    isLoading: configLoading,
    refetch: refetchConfig 
  } = useGetCustomerOrderConfirmationQuery("");
  
  const { 
    data: statusData, 
    isLoading: statusLoading 
  } = useGetCustomerOrderConfirmationStatusQuery("");
  
  const [updateConfig, { isLoading: updateLoading }] = useUpdateCustomerOrderConfirmationMutation();

  // Initialize local state when data loads
  useEffect(() => {
    if (configData?.data) {
      const config = configData.data;
      setLocalSettings({
        new_customer_percentage: config.new_customer_percentage || 10,
        completed_order_required: config.completed_order_required || 5,
        follower_weight: config.follower_weight || 80,
      });
    }
  }, [configData]);

  const handleSaveSettings = async () => {
    if (!configData?.data?.id) {
      toast.error("Configuration not found");
      return;
    }
    
    try {
      await updateConfig({
        id: configData.data.id,
        data: localSettings
      }).unwrap();
      
      await refetchConfig();
      toast.success("Settings updated successfully!");
    } catch (error: any) {
      console.error("Failed to update settings:", error);
      toast.error(error?.data?.message || "Failed to update settings");
    }
  };

  const handleSettingChange = (key: keyof LocalSettings, value: number) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Convert keys for the ConfirmationRules component
  const getComponentSettings = () => ({
    newCustomer: localSettings.new_customer_percentage,
    completedOrders: localSettings.completed_order_required,
    followerWeight: localSettings.follower_weight,
  });

  // Handle setting changes from ConfirmationRules component
  const handleComponentSettingChange = (
    key: 'newCustomer' | 'completedOrders' | 'followerWeight', 
    value: number
  ) => {
    const keyMap = {
      newCustomer: 'new_customer_percentage',
      completedOrders: 'completed_order_required',
      followerWeight: 'follower_weight',
    } as const;
    
    handleSettingChange(keyMap[key], value);
  };

  if (configLoading || statusLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Customer Order Confirmation
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Overview of how orders are automatically confirmed based on customer
            trust level.
          </p>
        </div>

        <OverviewCards 
          metrics={{
            is_new_customer_weight: localSettings.new_customer_percentage,
            completedOrders: localSettings.completed_order_required,
            followerWeight: localSettings.follower_weight,
            autoConfirmed: statusData?.data?.auto_confirmed_orders || 0,
          }}
        />
        
        <ConfirmationRules 
          settings={getComponentSettings()}
          onSettingChange={handleComponentSettingChange}
          onSave={handleSaveSettings}
          isLoading={updateLoading}
        />
        
        {/* <ConfirmationRatioChart data={statusData?.data} /> */}
        <ConfirmationRatioChart />
      </div>
    </div>
  );
}