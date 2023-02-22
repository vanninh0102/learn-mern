import jwtDecode from 'jwt-decode';
import {useSelector} from 'react-redux';

import {selectCurrentToken} from '../features/auth/authSlice';

const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    let isMananger = false;
    let isAdmin = false;
    let status = 'Employee';

    if (token) {
        const decoded = jwtDecode(token);
        const {username, roles} = decoded.UserInfo;

        if (roles.includes('Manager')) {
            isMananger = true;
            status = 'Manager';
        }
        if (roles.includes('Admin')) {
            isAdmin = true;
            status = 'Admin';
        }

        return {username, roles, isAdmin, isMananger, status};
    }

    return {username: '', roles: [], isMananger, isAdmin, status};
};

export default useAuth;
