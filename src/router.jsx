import {  createHashRouter } from "react-router-dom";

//前台
import Home from "./pages/front/Home";
import Cart from "./pages/front/Cart";
import Login from "./pages/front/Login";
import NotFound from "./pages/front/NotFound";
import ProductsList from "./pages/front/ProductsList";
import ProductDetail from "./pages/front/ProductDetail";

//後台
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";


import FrontLayout from "./layout/FrontLayout";
import AdminLayout from "./layout/AdminLayout";

export const route = createHashRouter([
    {
        path:"/",
        element:<FrontLayout></FrontLayout>,
        children:[
            {
                index:true,
                element:<Home></Home>
            },{
                path:"products",
                element:<ProductsList></ProductsList>
            },{
                path:"products/:id",
                element:<ProductDetail></ProductDetail>
            },{
                path:"carts",
                element:<Cart></Cart>
            },{
                path:"login",
                element:<Login></Login>
            }
        ]
    },{
        path:"/admin",
        element:<AdminLayout></AdminLayout>,
        children:[
            {
                index:true,
                element:<AdminProducts></AdminProducts>
            },
            {
                path:"orders",
                element:<AdminOrders></AdminOrders>
            }
        ]
    },{
        path:'*',
        element:<NotFound></NotFound>
    }
])