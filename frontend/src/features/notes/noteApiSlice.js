import {createEntityAdapter, createSelector} from '@reduxjs/toolkit';

import {apiSlice} from '../../app/api/apiSlice';

const notesAdapter = createEntityAdapter({
    sortComparer: (a, b) => {
        return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
    },
});
const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotes: builder.query({
            query: () => ({
                url: '/notes',
                validateStatus: (response, body) => {
                    return response.status === 200 && !body.isError;
                },
            }),
            keepUnusedDataFor: 5,
            transformResponse: (responseData) => {
                const loadedNotes = responseData.map((note) => {
                    note.id = note._id;
                    return note;
                });
                return notesAdapter.setAll(initialState, loadedNotes);
            },
            providesTags: (result, err, arg) => {
                if (result?.ids) {
                    return [{type: 'Note', id: 'LIST'}, ...result.ids.map((id) => ({type: 'Note', id: id}))];
                } else {
                    return [{type: 'Note', id: 'LIST'}];
                }
            },
        }),
        addNewNote: builder.mutation({
            query: (initialNoteData) => ({
                url: '/notes',
                method: 'POST',
                body: {...initialNoteData},
            }),
            invalidatesTags: (result, error, arg) => [{type: 'Note', id: 'LIST'}],
        }),
        updateNote: builder.mutation({
            query: (initialNoteData) => ({
                url: '/notes',
                method: 'PATCH',
                body: {...initialNoteData},
            }),
            invalidatesTags: (result, error, arg) => [{type: 'Note', id: arg.id}],
        }),
        deleteNote: builder.mutation({
            query: ({id}) => ({
                url: 'notes',
                method: 'DELETE',
                body: {id},
            }),
            invalidatesTags: (result, error, arg) => [{type: 'Note', id: arg.id}],
        }),
    }),
    overrideExisting: true,
});

export const {useGetNotesQuery, useAddNewNoteMutation, useDeleteNoteMutation, useUpdateNoteMutation} = notesApiSlice;

// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// create memoized selector
const selectNoteData = createSelector(
    selectNotesResult,
    (notesResult) => notesResult.data, // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllNotes,
    selectById: selectNoteById,
    selectIds: selectNoteIds,
} = notesAdapter.getSelectors((state) => selectNoteData(state) ?? initialState);
