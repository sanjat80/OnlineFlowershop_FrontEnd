import { Navigate, Route, createBrowserRouter } from "react-router-dom";
import App from "../app/layout/App";
import HomePage from "../features/home/HomePage";
import Catalog from "../features/catalog/catalog";
import ProductDetails from "../features/catalog/ProductDetails";
import AboutPage from "../features/about/AboutPage";
//import { ContactPage } from "@mui/icons-material";
import ServerError from "../app/errors/ServerError";
import NotFound from "../app/errors/NotFound";
import BasketPage from "../features/basket/BasketPage";
import Login from "../features/account/Login";
import Register from "../features/account/Register";
import ContactPage from "../features/contact/ContactPage";
import CheckoutPage from "../features/checkout/CheckoutPage";
import Order from "../features/orders/Orders";
import Orders from "../features/orders/Orders";
import Inventory from "../features/admin/Inventory";
import CheckoutWrapper from "../features/checkout/CheckputWrapper";
import { useSelector } from "react-redux";
import Profile from "../features/profile/Profile";
import Admin from "../features/admin/Admin";
import Korisnici from "../features/admin/Korisnici";
import Pakovanja from "../features/admin/Pakovanja";
import Kategorije from "../features/admin/Kategorije";
import Vrste from "../features/admin/Vrste";
import { ReactNode } from "react";
import Porudzbine from "../features/admin/Porudzbine";

function InventoryRoute() {
    const user = localStorage.getItem('user');
    const parsedUser = user && JSON.parse(user);
    const role = parsedUser?.data?.uloga;
  
    if (role === 'admin') {
      return <Inventory />;
    } else {
      return <Navigate to="/login" />;
    }
  }

  function ProtectedRoute({
    role,
    authorizedElement,
    unauthorizedElement,
    redirectPath
  }: {
    role: string;
    authorizedElement: ReactNode;
    unauthorizedElement: ReactNode;
    redirectPath: string;
  }): JSX.Element {
    const user = localStorage.getItem('user');
    const parsedUser = user && JSON.parse(user);
    const userRole = parsedUser?.data?.uloga;
  
    if (userRole === role) {
      return authorizedElement as JSX.Element;
    } else {
      return <Navigate to={redirectPath} />;
    }
  }
  

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children:[
            {path:'',element:<HomePage/>},
            {path:'catalog',element:<Catalog/>},
            {path:'catalog/:id',element:<ProductDetails/>},
            {path:'about',element:<AboutPage/>},
            {path:'contact',element:<ContactPage/>},
            {path:'server-error',element:<ServerError/>},
            {path:'not-found',element:<NotFound/>},
            {path:'login',element:<Login/>},
            {path:'register',element: <Register/>},
            {path:'basket', element:<BasketPage/>},
            {path:'checkout',element:<CheckoutWrapper/>},
            {
                path:'inventory',
                element: <InventoryRoute/>
            },
            {path:'user',element:<Profile/>},
            {path:'admin',element: (
              <ProtectedRoute
                role="admin"
                authorizedElement={<Admin/>}
                unauthorizedElement={<Navigate to="/login" replace />}
                redirectPath="/login"
              />
            )},
            {path:'adminUsers',element:(
              <ProtectedRoute
                role="admin"
                authorizedElement={<Korisnici />}
                unauthorizedElement={<Navigate to="/login" replace />}
                redirectPath="/login"
              />
            )},
            {path:'adminPackages',element:(
              <ProtectedRoute
                role="admin"
                authorizedElement={<Pakovanja/>}
                unauthorizedElement={<Navigate to="/login" replace />}
                redirectPath="/login"
              />
            )},
            {path:'adminCategories',element:(
              <ProtectedRoute
                role="admin"
                authorizedElement={<Kategorije />}
                unauthorizedElement={<Navigate to="/login" replace />}
                redirectPath="/login"
              />
            )},
            {path:'adminTypes',element:(
              <ProtectedRoute
                role="admin"
                authorizedElement={<Vrste />}
                unauthorizedElement={<Navigate to="/login" replace />}
                redirectPath="/login"
              />
            )},
            {path:'orders',element:(
              <ProtectedRoute
                role="admin"
                authorizedElement={<Porudzbine />}
                unauthorizedElement={<Navigate to="/login" replace />}
                redirectPath="/login"
              />
            )},
            {path:'*',element:<Navigate replace to='/not-found'/>} 
        ]
    }
])