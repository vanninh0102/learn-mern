import {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {Link, Outlet} from 'react-router-dom';

import usePersist from '../../hooks/usePersist';
import {useRefreshMutation} from './authApiSlice';
import {selectCurrentToken} from './authSlice';

const PersistLogin = () => {
    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);

    const [trueSuccess, setTrueSuccess] = useState(false);
    const [refresh, {isUninitialized, isLoading, isSuccess, isError, error}] = useRefreshMutation();

    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
            const verifyingRefreshToken = async () => {
                console.log('verifying refresh token');
                try {
                    // const res =
                    await refresh();
                    // const {accessToken} = res.data
                    setTrueSuccess(true);
                } catch (err) {
                    console.log(err);
                }
            };
            if (!token && persist) verifyingRefreshToken();
        }
        return () => (effectRan.current = true);
    }, []);

    let content = null;
    // persist: no
    if (!persist) {
        console.log('no persist');
        content = <Outlet />;
    }
    // persist: yes
    if (persist) {
        // token:no
        if (isLoading) {
            console.log('Loading...');
            content = <p>Loading...</p>;
        }
        // token:no
        if (isError) {
            console.log('error');
            content = (
                <p className="">
                    {`${error.data?.message}`} - <Link to={'/login'}>Please Login again</Link>
                </p>
            );
        }
        // token: yes
        if (isSuccess && trueSuccess) {
            console.log('success');
            content = <Outlet />;
        }
        // token: yes
        if (token && isUninitialized) {
            console.log('token and uninit');
            content = <Outlet />;
        }
    }

    return content;
};

export default PersistLogin;
