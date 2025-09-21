import {
  HomeFilled,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Image, Input, Layout } from "antd";
import React, { lazy, Suspense, useContext } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom"; // Corrected import for useHistory
import Loading from "./components/Loading";
import { useSelector } from "react-redux";

const { Header, Content, Footer } = Layout;

const ProductsList = lazy(() => import("./components/ProductsList"));
const HomePage = lazy(() => import("./components/HomePage"));
const CartComponent = lazy(() => import("./components/Cart"));

const items = [
  {
    key: "",
    label: "Home",
    icon: (
      <HomeFilled className="text-[#faebd7] text-2xl" />
    ),
    selectedIcon: (
      <HomeFilled className="text-[#001529] text-2xl" />
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
        width={28}
      />
    ),
    selectedIcon: (
      <Image
        src={"/images/clothesLogoRev.svg"}
        alt="logo"
        preview={false}
        width={28}
      />
    ),
  },
  {
    key: "cart",
    label: "Cart",
    icon: (
      <ShoppingCartOutlined className="text-[#faebd7] text-2xl"  />
    ),
    selectedIcon: (
      <ShoppingCartOutlined className="text-[#001529] text-2xl" />
    ),
  },
  {
    key: "account",
    label: "Account",
    icon: <UserOutlined className="text-[#faebd7] text-2xl"  />,
    selectedIcon: <UserOutlined className="text-[#001529] text-2xl" />,
  },
];

const App = () => {
  const products = useSelector((state) => state.products.products)
  const history = useHistory(); // Correct hook usage
  const location = useLocation();

  return (
    <Layout className="bg-[antiquewhite] min-h-screen" >
      <Header className="flex items-center justify-center lg:justify-between" >
        <img
          src={"/images/Logo.svg"}
          alt="logo"
          className="cursor-pointer w-[120px] h-[120px] lg:w-[90px] lg:h-[110px]"
          onClick={() => history.push("/")}
        />
        <Input className="rounded-3xl w-[600px] h-[40px] hidden lg:block" placeholder="Search for the products..." />
        <div className="hidden lg:flex gap-12" >
          {items.map((item) => (
            <Button
              onClick={() =>
                history.push({ pathname: `/${item.key}` })
              }
              icon={
                location.pathname === `/${item.key}`
                  ? item.selectedIcon
                  : item.icon
              }
              className={`rounded-[40px] w-[130px] h-[40px] m-r-[60px] items-center font-bold ${location.pathname === `/${item.key}`
                      ? "bg-[antiquewhite] text-[#001529]"
                      : "bg-[#001529] text-[#faebd7]"}`}
            >
              {item.label}
              {item.key === "cart" && (
                <span
                  className={`
                w-[50px] h-[24px] 
                flex items-center justify-center 
                rounded-[20px] 
                border border-solid
                text-[14px] font-bold
                ${location.pathname === `/Portfolio/${item.key}`
                      ? "bg-[#001529] text-white border-[#001529]"
                      : "bg-[#faebd7] text-[#001529] border-[#001529]"}
              `}
                >
                  {products.filter((i) => i.addedToCart).length}
                </span>
              )}
            </Button>
          ))}
        </div>
      </Header>
      <Content>
        <Suspense fallback={<Loading minHeight="100vh" />}>
          <Switch>
            <Route exact path="/" component={HomePage} />{" "}
            <Route exact path="/cart" component={CartComponent} />
            <Route exact path="/products" component={ProductsList} />
          </Switch>
        </Suspense>
      </Content>
        {/* <Footer className="hidden md:block text-center">
          Hira ©{new Date().getFullYear()} Created by Hira
        </Footer> */}
        <Footer className="block lg:hidden bg-[#001529] rounded-t-[15px] flex justify-between z-[1] h-[50px] pb-[65px] mt-[30px]">
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
          !w-[45px] !h-[45px] 
          flex items-center justify-center 
          rounded-[40px] 
        `}
              style={{
                backgroundColor:
                  location.pathname === `/${item.key}`
                    ? "antiquewhite"
                    : "",
              }}
            />
          ))}
        </Footer>
    </Layout>
  );
};

export default App;
