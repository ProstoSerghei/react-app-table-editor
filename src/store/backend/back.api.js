import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import Cookies from 'universal-cookie';


export const backendApi = createApi({
    reducerPath: 'backend',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://drf-table-editor.onrender.com',
        prepareHeaders: (headers) => {
            const cookie = new Cookies()
            const token = cookie.get('token')
            if (token) {
                headers.set('authorization', `Token ${token}`)
            }
            return headers
        },
    }),
    endpoints: (build) => ({
        getToken: build.mutation({
            query: (data) => ({
                url: 'api-token-auth/',
                method: 'POST',
                body: data
            }),
            transformResponse: (res) => {
                let cookie = new Cookies()
                cookie.set('token', res.token)
                window.location.reload()
            }
        }),
        putTodoData: build.mutation({
            query: ({id, ...data}) => ({
                url: `todo/${id}/`,
                method: 'PUT',
                body: data
            }),
            transformResponse: (res) => {
                window.location.reload()
            }
        }),
        postTodoData: build.mutation({
            query: (data) => ({
                url: `todo/`,
                method: 'POST',
                body: data
            }),
            transformResponse: (res) => {
                window.location.reload()
            }
        }),
        allUsers: build.query({
            query: () => ({
                url: 'users/'
            })
        }),
        getUserById: build.query({
            query: (id) => `users/${id}`
        }),
        allOrders: build.query({
            query: () => ({
                url: 'todo/'
            })
        }),
        getOrderById: build.query({
            query: (id) => `todo/${id}`
        }),
    })
})


export const {useAllUsersQuery} = backendApi
export const {useGetUserByIdQuery} = backendApi
export const {useAllOrdersQuery} = backendApi
export const {useLazyAllOrdersQuery} = backendApi
export const {useGetOrderByIdQuery} = backendApi
export const {useGetTokenMutation} = backendApi
export const {usePutTodoDataMutation} = backendApi
export const {usePostTodoDataMutation} = backendApi