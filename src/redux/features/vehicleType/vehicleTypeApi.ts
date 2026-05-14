import { baseApi } from "@/redux/api/baseApi";

const vehicleTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVehicleTypes: builder.query({
      query: (query) => ({
        url: "/admin/vehicle-types",
        method: "GET",
        params: query,
      }),
      providesTags: ["VehicleType", "AdditionalServicesLogs"],
    }),
    getVehicleTypeById: builder.query({
      query: (id) => ({
        url: `/admin/vehicle-types/${id}`,
        method: "GET",
      }),
      providesTags: ["VehicleType", "AdditionalServicesLogs"],
    }),
    addVehicleType: builder.mutation({
      query: (data) => ({
        url: "/admin/vehicle-types/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["VehicleType", "AdditionalServicesLogs"],
    }),
    updateVehicleType: builder.mutation({
      query: (data) => {
        const { id, ...restData } = data;
        
        return {
          url: `/admin/vehicle-types/update/${id}`,
          method: "PATCH",
          body: restData,
        };
      },
      invalidatesTags: ["VehicleType", "AdditionalServicesLogs"],
    }),
    deleteVehicleType: builder.mutation({
      query: (id) => ({
        url: `/admin/vehicle-types/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VehicleType", "AdditionalServicesLogs"],
    }),
  }),
});

export const {
  useGetVehicleTypesQuery,
  useGetVehicleTypeByIdQuery,
  useAddVehicleTypeMutation,
  useUpdateVehicleTypeMutation,
  useDeleteVehicleTypeMutation,
} = vehicleTypeApi;
