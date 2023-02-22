import {
    faFileCirclePlus,
    faFilePen,
    faRightFromBracket,
    faUserGear,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useEffect} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';

import {useSendLogoutMutation} from '../features/auth/authApiSlice';
import useAuth from '../hooks/useAuth';

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTE_REGEX = /^\/dash\/notes(\/)?$/;
const USER_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
    const {isAdmin, isMananger} = useAuth();
    const navigate = useNavigate();
    const {pathname} = useLocation();

    const [sendLogut, {isLoading, isError, isSuccess, error}] = useSendLogoutMutation();

    useEffect(() => {
        if (isSuccess) navigate('/');
    }, [isSuccess, navigate]);

    const onNewNoteClicked = () => navigate('/dash/notes/new');
    const onNewUserClicked = () => navigate('/dash/users/new');
    const onNotesClicked = () => navigate('/dash/notes');
    const onUsersClicked = () => navigate('/dash/users');

    const dashClass = null;
    if (!DASH_REGEX.test(pathname) && !NOTE_REGEX.test(pathname) && !USER_REGEX.test(pathname)) {
        // dashClass = 'dash-header__container--small';
    }

    let newNoteButton = null;
    if (NOTE_REGEX.test(pathname)) {
        newNoteButton = (
            <button className="icon-button" title="New Note" onClick={onNewNoteClicked}>
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        );
    }

    let newUserButton = null;
    if (USER_REGEX.test(pathname)) {
        if (isMananger || isAdmin) {
            newUserButton = (
                <button className="icon-button" title="New User" onClick={onNewUserClicked}>
                    <FontAwesomeIcon icon={faUserPlus} />
                </button>
            );
        }
    }

    let usersButton = null;
    if (isAdmin || isMananger) {
        if (!USER_REGEX.test(pathname) && pathname.includes('/dash')) {
            usersButton = (
                <button className="icon-button" title="Users List" onClick={onUsersClicked}>
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            );
        }
    }
    let notesButton = null;
    if (!NOTE_REGEX.test(pathname) && pathname.includes('/dash')) {
        notesButton = (
            <button className="icon-button" title="Notes List" onClick={onNotesClicked}>
                <FontAwesomeIcon icon={faFilePen} />
            </button>
        );
    }

    const logoutBtn = (
        <button className="icon-button" title="Logout" onClick={sendLogut}>
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    );

    const errClass = isError ? 'errmsg' : 'offscreen';

    let btnContent = null;
    if (isLoading) btnContent = <p>Logging Out...</p>;
    else {
        btnContent = (
            <>
                {newNoteButton}
                {newUserButton}
                {notesButton}
                {usersButton}
            </>
        );
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <header className="dash-header">
                <div className={`dash-header__container ${dashClass}`}>
                    <Link to="/dash">
                        <h1 className="dash-header__title">techNotes</h1>
                    </Link>
                    <nav className="dash-header__nav">
                        {btnContent}
                        {logoutBtn}
                    </nav>
                </div>
            </header>
        </>
    );
    return content;
};

export default DashHeader;
