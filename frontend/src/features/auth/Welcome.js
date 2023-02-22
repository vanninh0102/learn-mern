import {Link} from 'react-router-dom';

import useAuth from '../../hooks/useAuth';

const Welcome = () => {
    const {username, isAdmin, isMananger} = useAuth();

    const date = new Date();
    const today = new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'full',
        timeStyle: 'long',
    }).format(date);

    let userMenu = null;
    if (isAdmin || isMananger) {
        userMenu = (
            <>
                <p>
                    <Link to="/dash/users">View User Settings</Link>
                </p>
                <p>
                    <Link to="/dash/users/new">Add User</Link>
                </p>
            </>
        );
    }

    const content = (
        <section className="welcome">
            <p>{today}</p>
            <h1>Welcome {username}</h1>
            <p>
                <Link to="/dash/notes">View techNotes</Link>
            </p>
            <p>
                <Link to="/dash/notes/new">Add techNotes</Link>
            </p>
            {userMenu}
        </section>
    );
    return content;
};

export default Welcome;
