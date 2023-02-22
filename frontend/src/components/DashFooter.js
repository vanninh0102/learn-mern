import {faHouse} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useLocation, useNavigate} from 'react-router-dom';

import useAuth from '../hooks/useAuth';

function DashFooter() {
    const {username, status} = useAuth();

    const navigate = useNavigate();
    const {pathname} = useLocation();

    const onGoHomeClick = () => navigate('/dash');

    let goHomeButton = null;
    if (pathname !== '/dash') {
        goHomeButton = (
            <button className="hash-footer__button icon-button" title="Home" onClick={onGoHomeClick}>
                <FontAwesomeIcon icon={faHouse} />
            </button>
        );
    }

    const content = (
        <footer className="dash-footer">
            {goHomeButton}
            <p>Current User: {username}</p>
            <p>Status: {status}</p>
        </footer>
    );
    return content;
}

export default DashFooter;
