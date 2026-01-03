/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { WeightSliders } from "./components/WeightSliders";
import { OverviewCards } from "./components/OverviewCards";
import { TimeoutMaxDrivers } from "./components/TimeoutMaxDrivers";
import { ChangeLogTable } from "./components/ChangeLogTable";
import { useGetDriverOrderCompetitionLogQuery, useGetDriverOrderCompetitionQuery, useUpdateDriverOrderCompetitionMutation } from "@/redux/features/driverOrderCompetition/driverOrderCompetitionApi";
import { CompetitionConfig } from "@/types/driverOrderCompetition";

export default function DriverOrderCompetition() {
  const [localConfig, setLocalConfig] = useState<Partial<CompetitionConfig>>({});
  const [saveLoading, setSaveLoading] = useState<Record<string, boolean>>({});

  // Fetch data
  const { 
    data: configData, 
    isLoading: configLoading,
    refetch: refetchConfig 
  } = useGetDriverOrderCompetitionQuery();
  
  const { 
    data: logData, 
    isLoading: logLoading,
    refetch: refetchLogs 
  } = useGetDriverOrderCompetitionLogQuery({ date: new Date().toISOString().split('T')[0] });

  const [updateConfig] = useUpdateDriverOrderCompetitionMutation();

  // Initialize local state when data loads
  useEffect(() => {
    if (configData?.data?.[0]) {
      const config = configData.data[0];
      setLocalConfig({
        rank_weight: config.rank_weight,
        rating_weight: config.rating_weight,
        followers_weight: config.followers_weight,
        challenges_timeout: config.challenges_timeout,
        max_users_to_join: config.max_users_to_join,
      });
    }
  }, [configData]);

  // Fixed: Properly handle weight changes from WeightSliders
  const handleWeightChange = (key: 'ranking' | 'rating' | 'follower', value: number) => {
    
    // Map the WeightSliders keys to your config keys
    const configKeyMap = {
      'ranking': 'rank_weight',
      'rating': 'rating_weight',
      'follower': 'followers_weight'
    } as const;
    
    const configKey = configKeyMap[key];
    
    setLocalConfig(prev => {
      const updated = {
        ...prev,
        [configKey]: value,
      };
      
      return updated;
    });
  };

  const handleUpdateWeight = async () => {
    if (!configData?.data?.[0]?.id) {
      toast.error("Configuration not found");
      return;
    };
    
    setSaveLoading(prev => ({ ...prev, weights: true }));
    try {
      await updateConfig({
        id: configData.data[0].id,
        data: {
          rank_weight: localConfig.rank_weight || 0,
          rating_weight: localConfig.rating_weight || 0,
          followers_weight: localConfig.followers_weight || 0,
          challenges_timeout: localConfig.challenges_timeout || 0,
          max_users_to_join: localConfig.max_users_to_join || 0,
        }
      }).unwrap();
      
      await refetchConfig();
      await refetchLogs();
      toast.success("Weights updated successfully!");
    } catch (error: any) {
      console.error("Failed to update weights:", error);
      toast.error(error?.data?.message || "Failed to update weights");
    } finally {
      setSaveLoading(prev => ({ ...prev, weights: false }));
    }
  };

  const handleUpdateTimeout = async () => {
    if (!configData?.data?.[0]?.id) {
      toast.error("Configuration not found");
      return;
    };
    
    setSaveLoading(prev => ({ ...prev, timeout: true }));
    try {
      await updateConfig({
        id: configData.data[0].id,
        data: {
          rank_weight: localConfig.rank_weight || 0,
          rating_weight: localConfig.rating_weight || 0,
          followers_weight: localConfig.followers_weight || 0,
          challenges_timeout: localConfig.challenges_timeout || 0,
          max_users_to_join: localConfig.max_users_to_join || 0,
        }
      }).unwrap();
      
      await refetchConfig();
      await refetchLogs();
      toast.success("Timeout updated successfully!");
    } catch (error: any) {
      console.error("Failed to update timeout:", error);
      toast.error(error?.data?.message || "Failed to update timeout");
    } finally {
      setSaveLoading(prev => ({ ...prev, timeout: false }));
    }
  };

  const handleUpdateMaxDrivers = async () => {
    if (!configData?.data?.[0]?.id) {
      toast.error("Configuration not found");
      return;
    };
    
    setSaveLoading(prev => ({ ...prev, maxDrivers: true }));
    try {
      await updateConfig({
        id: configData.data[0].id,
        data: {
          rank_weight: localConfig.rank_weight || 0,
          rating_weight: localConfig.rating_weight || 0,
          followers_weight: localConfig.followers_weight || 0,
          challenges_timeout: localConfig.challenges_timeout || 0,
          max_users_to_join: localConfig.max_users_to_join || 0,
        }
      }).unwrap();
      
      await refetchConfig();
      await refetchLogs();
      toast.success("Max drivers updated successfully!");
    } catch (error: any) {
      console.error("Failed to update max drivers:", error);
      toast.error(error?.data?.message || "Failed to update max drivers");
    } finally {
      setSaveLoading(prev => ({ ...prev, maxDrivers: false }));
    }
  };

  if (configLoading) {
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
    <div className="bg-slate-50 p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Driver Order Competition
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Configure how the system selects the winning driver when multiple
            drivers challenge an order.
          </p>
        </div>

        <OverviewCards config={configData?.data?.[0]} />
        
        <WeightSliders
          weights={{
            ranking: localConfig.rank_weight || 0,
            rating: localConfig.rating_weight || 0,
            follower: localConfig.followers_weight || 0,
          }}
          onChange={handleWeightChange} // Use the fixed handler
          onSave={handleUpdateWeight}
          isLoading={saveLoading.weights}
        />
        
        <TimeoutMaxDrivers
          timeout={localConfig.challenges_timeout || 0}
          maxDrivers={localConfig.max_users_to_join || 0}
          onTimeoutChange={(v) => setLocalConfig(prev => ({ ...prev, challenges_timeout: v }))}
          onMaxDriversChange={(v) => setLocalConfig(prev => ({ ...prev, max_users_to_join: v }))}
          onSaveTimeout={handleUpdateTimeout}
          onSaveMaxDrivers={handleUpdateMaxDrivers}
          loadingTimeout={saveLoading.timeout}
          loadingMaxDrivers={saveLoading.maxDrivers}
        />
        
        <ChangeLogTable 
          logs={logData?.data || []} 
          isLoading={logLoading}
        />
      </div>
    </div>
  );
}