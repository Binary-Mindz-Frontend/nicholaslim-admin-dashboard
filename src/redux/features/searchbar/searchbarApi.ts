import { baseApi } from "@/redux/api/baseApi";

const searchbarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSearchbar: builder.query({
      query: (searchTerm) => `/roles/search?search=${encodeURIComponent(searchTerm)}`,
    }),
  }),
});

export const { useGetSearchbarQuery } = searchbarApi;
