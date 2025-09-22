import {
  HomeFilled,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Image, Input, Layout } from "antd";
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
      <HomeFilled className="text-[#faebd7] text-3xl" />
    ),
    selectedIcon: (
      <HomeFilled className="text-[#001529] text-3xl" />
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
  const history = useHistory();
  const location = useLocation();

  return (
    <Layout className="bg-[antiquewhite] min-h-screen" >
      <Header className="!h-[130px] sm:!h-[60px]  !pl-2 !pr-2 flex flex-col lg:flex-row">
        <div className="flex flex-col lg:flex-row items-center w-full justify-between sm:gap-24 ">

          <div className="flex w-[95%] sm:w-[100px] h-[70px] items-center justify-between">
            <img
              src={"/images/Logo.svg"}
              alt="logo"
              className="cursor-pointer w-[90px] h-[110px] ml-[-20px]"
              onClick={() => history.push("/")}
            />
            <div className="flex gap-2 lg:hidden">
              <Avatar
                size="large"
                icon={<UserOutlined onClick={() => history.push({ pathname: `/account` })} />}
              />
              <Badge count={products.filter((i) => i.addedToCart).length} size="small" > <ShoppingCartOutlined className="text-[#faebd7] text-3xl mt-1" onClick={() => history.push({ pathname: `/cart` })} /> </Badge>

            </div>
          </div>

          <Input
            className="rounded-2l w-[95%] h-[40px] sm:w-[700px] "
            placeholder="Search for the products..."
            allowClear
            onChange={(e) => console.log(e.target.value)}
            suffix={<SearchOutlined />}
          />

          <div className="hidden lg:flex gap-12">
            {items.map((item) => (
              <Button
                key={item.key}
                onClick={() => history.push({ pathname: `/${item.key}` })}
                icon={
                  location.pathname === `/${item.key}`
                    ? item.selectedIcon
                    : item.icon
                }
                className={`rounded-[40px] w-[130px] h-[40px] font-bold ${location.pathname === `/${item.key}`
                    ? "bg-[antiquewhite] text-[#001529]"
                    : "bg-[#001529] text-[#faebd7]"
                  }`}
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
                        : "bg-[#faebd7] text-[#001529] border-[#001529]"
                      }
              `}
                  >
                    {products.filter((i) => i.addedToCart).length}
                  </span>
                )}
              </Button>
            ))}
          </div>
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
      <Footer className="text-center">
          Hira ©{new Date().getFullYear()} Created by Rahul Boddeti
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
  );
};

export default App;
