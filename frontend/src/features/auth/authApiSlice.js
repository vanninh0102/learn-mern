import {apiSlice} from '../../app/api/apiSlice';
import {logOut, setCredential} from './authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth',
                method: 'POST',
                body: {...credentials},
            }),
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    console.log(data);

                    dispatch(logOut());
                    dispatch(apiSlice.util.resetApiState());
                } catch (error) {
                    console.log(error);
                }
            },
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'POST',
            }),
            async onQueryStarted(arg, api) {
                try {
                    const {data} = await api.queryFulfilled;
                    console.log(data);
                    const {accessToken} = data;
                    api.dispatch(setCredential({accessToken}));
                } catch (error) {
                    console.log(error);
                }
            },
        }),
    }),
});

export const {useLoginMutation, useRefreshMutation, useSendLogoutMutation} = authApiSlice;
