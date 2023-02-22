import {faSave} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useAddNewNoteMutation} from './noteApiSlice';

const NewNoteForm = ({users}) => {
    console.log(users);
    const [addNewNote, {isLoading, isSuccess, isError, error}] = useAddNewNoteMutation();

    const navigate = useNavigate();

    const [user, setUser] = useState(users[0].id);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
        if (isSuccess) {
            setUser('');
            setTitle('');
            setText('');
            navigate('/dash/notes');
        }
    }, [isSuccess, navigate]);

    const onUserChanged = (e) => setUser(e.target.value);
    const onTitleChanged = (e) => setTitle(e.target.value);
    const onTextChanged = (e) => setText(e.target.value);

    const canSave = [user, title, text].every(Boolean) && !isLoading;

    const onClickSave = async (e) => {
        e.preventDefault();
        if (canSave) {
            await addNewNote({user, title, text});
        }
    };

    const optionsUser = users.map((userData) => {
        return (
            <option key={userData.id} value={userData.id}>
                {userData.username}
            </option>
        );
    });

    const errClass = isError ? 'errmsg' : 'offscreen';
    const validTitleClass = !title ? 'form__input--incomplete' : '';
    const validTextClass = !text ? 'form__input--incomplete' : '';

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onClickSave}>
                <div className="form__title-row">
                    <h2>New Note</h2>
                    <div className="form__action-buttons">
                        <button className="icon-button" title="Save" disabled={!canSave}>
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="title">
                    Title:
                </label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className="form__label" htmlFor="text">
                    Text:
                </label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="username">
                    ASSIGNED TO:
                </label>
                <select
                    id="username"
                    name="username"
                    className="form__select"
                    value={users[0].id}
                    onChange={onUserChanged}
                >
                    {optionsUser}
                </select>
            </form>
        </>
    );

    return content;
};
NewNoteForm.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            active: PropTypes.bool.isRequired,
            username: PropTypes.string.isRequired,
            password: PropTypes.string,
            roles: PropTypes.arrayOf(PropTypes.string),
        }),
    ),
};
export default NewNoteForm;
