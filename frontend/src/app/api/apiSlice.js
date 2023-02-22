import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import {setCredential} from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    credentials: 'include',
    prepareHeaders: (headers, {getState}) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) //request url , body , method
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) //custom like {shout: true}
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403) {
        console.log('sending refresh token');

        const refreshResult = await baseQuery({url: '/auth/refresh', method: 'POST'}, api, extraOptions);

        if (refreshResult?.data) {
            api.dispatch(setCredential({...refreshResult.data}));
            result = await baseQuery(args, api, extraOptions);
        } else {
            if (refreshResult?.error?.status == 403) {
                refreshResult.error.data.message = 'Your login has expired';
            }
            return refreshResult;
        }
    }
    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Note', 'User'],
    endpoints: (builder) => ({}),
});
