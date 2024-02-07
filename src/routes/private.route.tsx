import Layout from '../components/layout/index'
type privateRouteProps = {
    children: JSX.Element
}

const PrivateRoute = ({ children }: privateRouteProps) => {
    return (
        <>
            <Layout>{children}</Layout>
        </>
    )
}

export default PrivateRoute