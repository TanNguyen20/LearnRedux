import { useRoutes } from 'react-router-dom';
// layouts
import Product from './pages/Product';
import Counter from './pages/Counter';
//
// ----------------------------------------------------------------------

const routes = [
    {
        path: '/',
        element: <Product />,
    },
    {
        path: '/counter',
        element: <Counter />,
    },
];

export default function Router() {
    return useRoutes(routes);
}
