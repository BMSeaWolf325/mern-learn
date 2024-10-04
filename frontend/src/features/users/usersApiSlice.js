import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

// provides a set of methods and properties that facilitate the management of normalized state for collections of entities
// The empty object {} can be used to pass configuration options, {} = default
const usersAdapter = createEntityAdapter({})

// default state structure for the entities managed by the adapter
const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({ // new query endpoint
            query: () => ({
                url: '/users',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => { // transform res data before stored in Redux
                // add user.id field for each user
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                });
                // populate initialState (redux Store) with new entities (loadedUsers)
                // userAdapater requires id property
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) { // if results has id property
                    return [ // array of tags
                        // This tag indicates that there is a list of users available in the cache
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                        // creates array of tags for each user id
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
        addNewUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'POST',
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'PATCH',
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: `/users`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetUsersQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApiSlice

// creates a selector function for the result of the getUsers query from the usersApiSlice
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data //  normalized state object with ids & entities
)

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers, // all user entities
    selectById: selectUserById,
    selectIds: selectUserIds // all user IDs
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)
// takes the Redux state as an argument and calls selectUsersData to get user data slice,
// If selectUsersData(state) return any falsy value, initialState is default val