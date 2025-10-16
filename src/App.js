import {
  HomeFilled,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Image, Input, Layout } from "antd";
import React, { lazy, Suspense } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import Loading from "./components/Loading";
import { useSelector } from "react-redux";
import { AuthProvider } from "./contexts/AuthContext";
import UserMenu from "./components/UserMenu";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchBox from "./components/SearchBox";

const { Header, Content, Footer } = Layout;

const ProductsList = lazy(() => import("./components/ProductsList"));
const HomePage = lazy(() => import("./components/HomePage"));
const CartComponent = lazy(() => import("./components/Cart"));
const ProfileComponent = lazy(() => import("./components/Profile"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));

const items = [
  {
    key: "",
    label: "Home",
    icon: (
      <HomeFilled className="text-antique-200 text-xl" />
    ),
    selectedIcon: (
      <HomeFilled className="text-slate-800 text-xl" />
    ),
  },
  {
    key: "products",
    label: "Garments",
    icon: (
      <Image
        src={"/images/clothesLogo.svg"}
        alt="logo"
        preview={false}
        width={32}
        className="filter brightness-0 invert opacity-90"
      />
    ),
    selectedIcon: (
      <Image
        src={"/images/clothesLogoRev.svg"}
        alt="logo"
        preview={false}
        width={32}
      />
    ),
  },
  {
    key: "cart",
    label: "Cart",
    icon: (
      <ShoppingCartOutlined className="text-antique-200 text-xl"  />
    ),
    selectedIcon: (
      <ShoppingCartOutlined className="text-slate-800 text-xl" />
    ),
  },
  {
    key: "account",
    label: "Account",
    icon: <UserOutlined className="text-antique-200 text-xl"  />,
    selectedIcon: <UserOutlined className="text-slate-800 text-xl" />,
  },
];

const App = () => {
  const products = useSelector((state) => state.products.products)
  const history = useHistory();
  const location = useLocation();

  return (
    <AuthProvider>
      <Layout className="bg-antique-200 min-h-screen" >
      <Header className="!h-[130px] sm:!h-[60px] !pl-2 !pr-2 flex flex-col lg:flex-row bg-[#001529] fixed top-0 left-0 right-0 z-50">
        <div className="flex flex-col lg:flex-row items-center w-full justify-between sm:gap-24">

          <div className="flex w-[95%] sm:w-[100px] h-[70px] items-center justify-between">
            <img
              src={"/images/Logo.svg"}
              alt="logo"
              className="cursor-pointer w-[90px] h-[110px] ml-[-20px] hover:scale-105 transition-transform duration-300"
              onClick={() => history.push("/")}
            />
            <div className="flex gap-3 lg:hidden">
              <UserMenu />
            </div>
          </div>

          {/* Search Input - Visible on all screen sizes */}
          <div className="flex w-full max-w-md px-2 lg:px-0">
            <SearchBox />
          </div>

          <div className="hidden lg:flex gap-4 items-center">
            {items.slice(0, -1).map((item) => (
              <Button
                key={item.key}
                onClick={() => history.push({ pathname: `/${item.key}` })}
                icon={
                  location.pathname === `/${item.key}`
                    ? item.selectedIcon
                    : item.icon
                }
                className={`rounded-full w-[130px] h-[40px] font-bold transition-all duration-300 hover:scale-105 ${
                  location.pathname === `/${item.key}`
                    ? "bg-antique-200 text-slate-800 border-antique-300 shadow-md"
                    : "bg-slate-800 text-antique-200 border-slate-700 hover:bg-slate-700"
                }`}
              >
                {item.label}
                {item.key === "cart" && (
                  <span
                    className={`
                w-[22px] h-[21px] 
                flex items-center justify-center 
                rounded-full 
                border border-solid
                text-[12px] font-bold
                transition-all duration-300
                ${location.pathname === `/cart`
                        ? "bg-slate-800 text-white border-slate-800"
                        : "bg-antique-200 text-slate-800 border-slate-800"
                      }
              `}
                  >
                    {products.filter((i) => i.addedToCart).length}
                  </span>
                )}
              </Button>
            ))}
            <UserMenu />
          </div>
        </div>
      </Header>

      <Content className="bg-antique-200 pt-[130px] sm:pt-[60px]">
        <Suspense fallback={<Loading minHeight="100vh" />}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/cart" component={CartComponent} />
            <Route exact path="/products" component={ProductsList} />
            <Route exact path="/product/:id" component={ProductDetail} />
            <Route exact path="/account">
              <ProtectedRoute>
                <ProfileComponent />
              </ProtectedRoute>
            </Route>
          </Switch>
        </Suspense>
      </Content>
      <Footer className="text-center bg-slate-800 text-antique-200 py-6 border-t border-slate-700">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm">
              Hira ©{new Date().getFullYear()} Created by <span className="font-semibold text-antique-100">Rahul Boddeti</span>
            </p>
          </div>
        </Footer>
      {/* <Footer className="flex lg:hidden bg-[#001529] justify-between z-[1] h-[20px] pb-[65px] mt-[30px]">
        {items.map((item) => (
          <Button
            onClick={() =>
              history.push({ pathname: `/${item.key}` })
            }
            type="link"
            icon={
              location.pathname === `/${item.key}`
                ? item.selectedIcon
                : item.icon
            }
            className={`
          !w-[35px] !h-[35px] 
          flex items-center justify-center 
          rounded-[8px] 
        `}
            style={{
              backgroundColor:
                location.pathname === `/${item.key}`
                  ? "antiquewhite"
                  : "",
            }}
          />
        ))}
      </Footer> */}
    </Layout>
    </AuthProvider>
  );
};

export default App;
