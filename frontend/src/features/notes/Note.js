import {faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import {memo} from 'react';
import {useNavigate} from 'react-router-dom';

import {useGetNotesQuery} from './noteApiSlice';

const Note = ({noteId}) => {
    const {note} = useGetNotesQuery('notesList', {
        selectFromResult: ({data}) => ({
            note: data?.entities[noteId],
        }),
    });

    const navigate = useNavigate();

    if (note) {
        const created = new Date(note.createdAt).toLocaleString('vi-VN', {
            day: 'numeric',
            month: '2-digit',
        });
        const updated = new Date(note.updatedAt).toLocaleString('vi-VN', {
            day: 'numeric',
            month: '2-digit',
        });
        const handleEdit = () => navigate(`/dash/notes/${noteId}`);

        return (
            <tr>
                <td className="table__cell note__status">
                    {note.completed ? (
                        <span className="note__status--completed">Completed</span>
                    ) : (
                        <span className="note__status--open">Open</span>
                    )}
                </td>
                <td className="table__cell note__created">{created}</td>
                <td className="table__cell note__updated">{updated}</td>
                <td className="table__cell note__title">{note.title}</td>
                <td className="table__cell note__username">{note.username}</td>
                <td className="table__cell">
                    <button className="icon-button table__button" onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        );
    } else {
        return null;
    }
};
Note.propTypes = {
    noteId: PropTypes.string.isRequired,
};

const memmorizedNote = memo(Note);
export default memmorizedNote;
