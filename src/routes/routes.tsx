import LoginPage from "../pages/auth/login"
import ConverstationHistory from "../pages/converstation"
import EyePage from "../pages/eye"
import HomePage from "../pages/home"
import OldConverstation from "../pages/oldconvs"
import ReportPage from "../pages/report"
import UnknowWords from "../pages/unknowWords"
import WordsDetail from "../pages/wordsDetail"


interface IRoute {
    path: string
    component: JSX.Element
    isPublic?: boolean
}

class RouteList {
    public static routes: IRoute[] = [
        {
            path: '/login',
            component: <LoginPage />,
            isPublic: true,
        },
        {
            // TODO: need dashboard screen
            path: '/',
            component: <HomePage />,
            isPublic: false,
        },
        {
            // TODO: need dashboard screen
            path: '/oldconverstations',
            component: <OldConverstation />,
            isPublic: false,
        },
        {
            // TODO: need dashboard screen
            path: '/unknownwords',
            component: <UnknowWords />,
            isPublic: false,
        },
        {
            // TODO: need dashboard screen
            path: '/word/:id',
            component: <WordsDetail />,
            isPublic: false,
        },
        {
            // TODO: need dashboard screen
            path: '/converstation/:id',
            component: <ConverstationHistory />,
            isPublic: false,
        },
        {
            path: '/reports',
            component: <ReportPage />,
            isPublic: false,
        },
        {
            path: '/eyes',
            component: <EyePage />,
            isPublic: false,
        }
    ]

    public static getRoutes = (): IRoute[] => {
        return this.routes
    }

    public static getPublicRoutes = () => {
        return this.routes.filter((route) => route.isPublic)
    }

    public static getPrivateRoutes = () => {
        return this.routes.filter((route) => !route.isPublic)
    }

    public static getRouteName = (route: string) => {
        let pageName = ''
        if (route === '/') pageName = 'Home'
        else if (route.split('/').length > 2) {
            let splitedPath = route.split('/')
            if (splitedPath.slice(-1)[0].includes(':')) {
                pageName =
                    splitedPath.slice(-2)[0].charAt(0).toUpperCase() +
                    splitedPath.slice(-2)[0].slice(1)
            } else {
                pageName =
                    splitedPath.slice(-1)[0].charAt(0).toUpperCase() +
                    splitedPath.slice(-1)[0].slice(1)
            }
        } else pageName = route.charAt(1).toUpperCase() + route.slice(2)
        return pageName
    }

    public static getRoutesPath = () => {
        return this.routes.map((route) => route.path)
    }
}

export default RouteList