import {useParams} from 'react-router-dom';
import {PulseLoader} from 'react-spinners';

import useAuth from '../../hooks/useAuth';
import {useGetUsersQuery} from '../users/usersApiSlice';
import EditNoteForm from './EditNoteForm';
import {useGetNotesQuery} from './noteApiSlice';

const EditNote = () => {
    const {id} = useParams();

    const {username, isMananger, isAdmin} = useAuth();
    console.log(username, isMananger, isAdmin);

    const {note} = useGetNotesQuery('notesList', {
        selectFromResult: ({data}) => ({
            note: data?.entities[id],
        }),
    });

    const {users} = useGetUsersQuery('usersList', {
        selectFromResult: ({data}) => ({
            users: data?.ids.map((id) => data?.entities[id]),
        }),
    });

    if (!note || !users?.length) return <PulseLoader color="#FFF" />;

    if (!isAdmin && !isMananger) {
        if (note.username != username) {
            return <p className="errmsg">No access</p>;
        }
    }

    const content = <EditNoteForm note={note} users={users} />;

    return content;
};

export default EditNote;
