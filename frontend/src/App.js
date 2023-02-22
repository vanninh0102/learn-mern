import {Route, Routes} from 'react-router-dom';

import DashLayout from './components/DashLayout';
import Layout from './components/Layout';
import Public from './components/Public';
import {ROLES} from './config/roles';
import Login from './features/auth/Login';
import PersistLogin from './features/auth/PersistLogin';
import Prefetch from './features/auth/Prefetch';
import RequireAuth from './features/auth/RequireAuth';
import Welcome from './features/auth/Welcome';
import EditNote from './features/notes/EditNote';
import NewNote from './features/notes/NewNote';
import NotesList from './features/notes/NotesList';
import EditUser from './features/users/EditUser';
import NewUserForm from './features/users/NewUserForm';
import UsersList from './features/users/UsersList';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route index element={<Public />}></Route>
                <Route path="login" element={<Login />} />
                {/* Protected Routes */}
                <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
                        <Route element={<Prefetch />}>
                            <Route path="dash" element={<DashLayout />}>
                                <Route index element={<Welcome />} />

                                <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]} />}>
                                    <Route path="users">
                                        <Route index element={<UsersList />} />
                                        <Route path=":id" element={<EditUser />}></Route>
                                        <Route path="new" element={<NewUserForm />}></Route>
                                    </Route>
                                </Route>
                                <Route path="notes">
                                    <Route index element={<NotesList />} />
                                    <Route path=":id" element={<EditNote />}></Route>
                                    <Route path="new" element={<NewNote />}></Route>
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                </Route>
                {/* End dash*/}
            </Route>
        </Routes>
    );
}

export default App;
