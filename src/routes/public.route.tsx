import { Layout } from 'antd'

type PublicRouteProps = {
    children: JSX.Element
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    return <Layout style={{ backgroundColor: 'transparent' }} className='fixed top-0 left-0 right-0 bottom-0'>{children}</Layout>
}

export default PublicRoute