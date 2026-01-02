import { baseApi } from "@/redux/api/baseApi";

const driverOrderCompetitionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDriverOrderCompetition: build.query<any, void>({
      query: () => ({
        url: `/driver-order-competition`,
        method: "GET",
      }),
      providesTags: ["DriverOrderCompetition"],
    }),

    // Fix: Accept optional date parameter
    getDriverOrderCompetitionLog: build.query<any, { date?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params?.date) {
          queryParams.append('date', params.date);
        }
        
        const url = `/driver-order-competition/logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["DriverOrderCompetition"],
    }),

    getDriverOrderCompetitionById: build.query<any, number>({
      query: (id) => ({
        url: `/driver-order-competition/${id}`,
        method: "GET",
      }),
      providesTags: ["DriverOrderCompetition"],
    }),

    updateDriverOrderCompetition: build.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/driver-order-competition/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["DriverOrderCompetition"],
    }),
  }),
});

export const {
  useGetDriverOrderCompetitionQuery,
  useGetDriverOrderCompetitionByIdQuery,
  useGetDriverOrderCompetitionLogQuery,
  useUpdateDriverOrderCompetitionMutation,
} = driverOrderCompetitionApi;