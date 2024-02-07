import { Routes, BrowserRouter, Route } from 'react-router-dom'
import RouteList from './routes'
import { useAuthStore } from '../stores/auth.store'
import PrivateRoute from './private.route'
import PublicRoute from './public.route'
import LoginPage from '../pages/auth/login'


const RoutesList = RouteList.getRoutes()

const Router: React.FunctionComponent<{}> = () => {
    const { accessToken } = useAuthStore()

    return (
        <BrowserRouter>
            <Routes>
                {RoutesList.map((route, index) => {
                    if (route.isPublic) {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={<PublicRoute>{route.component}</PublicRoute>}
                            />
                        )
                    } else if (accessToken) {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={<PrivateRoute>{route.component}</PrivateRoute>}
                            />
                        )
                    } else {
                        return (
                            <Route key={index} path={route.path} element={<div style={{ backgroundColor: 'transparent' }} className='fixed top-0 left-0 right-0 bottom-0'><LoginPage /></div>} />
                        )
                    }
                })}
                <Route path="*" element={<>not found page</>} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router