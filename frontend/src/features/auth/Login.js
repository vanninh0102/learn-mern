import {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';

import usePersist from '../../hooks/usePersist';
import {useLoginMutation} from './authApiSlice';
import {setCredential} from './authSlice';

const Login = () => {
    const userRef = useRef();
    const errRef = useRef();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [errMsg, setErrMsg] = useState();
    const [persist, setPersist] = usePersist();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, {isLoading}] = useLoginMutation();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [username, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {accessToken} = await login({username, password}).unwrap();
            dispatch(setCredential({accessToken}));
            setUsername('');
            setPassword('');
            navigate('/dash');
        } catch (error) {
            console.log(error);
            if (!error.status) {
                setErrMsg('No server response');
            } else if (error.status === 400) {
                setErrMsg('Missing Username Or Password');
            } else if (error.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(error.data?.message);
            }
            errRef.current.focus();
        }
    };

    const handleUserInnut = (e) => setUsername(e.target.value);
    const hanldlePwdInput = (e) => setPassword(e.target.value);
    const hanldleToggle = () => setPersist((prev) => !prev);

    const errClass = errMsg ? 'errMsg' : 'offscreen';

    if (isLoading) return <p>Loading...</p>;

    const content = (
        <section className="public">
            <header>
                <h1>Empolyee Login</h1>
            </header>
            <main className="login">
                <p ref={errRef} className={errClass} aria-live="assertive">
                    {errMsg}
                </p>
                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username </label>
                    <input
                        className="form__input"
                        type={'text'}
                        id={'username'}
                        ref={userRef}
                        value={username}
                        onChange={handleUserInnut}
                        autoComplete="off"
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        className="form__input"
                        name="password"
                        id="password"
                        onChange={hanldlePwdInput}
                        value={password}
                        required
                    />
                    <button className="form__submit-button">Sign In</button>

                    <label htmlFor="persist" className="form__persist">
                        <input
                            type="checkbox"
                            className="form__checkbox"
                            id="persist"
                            onChange={hanldleToggle}
                            checked={persist}
                        />
                        Trust this device
                    </label>
                </form>
            </main>
            <footer>
                <Link to="/">Back to home</Link>
            </footer>
        </section>
    );

    return content;
};

export default Login;
