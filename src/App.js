import {
  HomeFilled,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Image, Layout } from "antd";
import React, { lazy, Suspense, useContext } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom"; // Corrected import for useHistory
import Loading from "./components/Loading";
import { useWindowSize } from "./components/WindowSize";
import { CartContext } from "./context/CartContext";

const { Header, Content, Footer } = Layout;

const ProductsList = lazy(() => import("./components/ProductsList"));
const HomePage = lazy(() => import("./components/HomePage"));
const CartComponent = lazy(() => import("./components/Cart"));

const items = [
  {
    key: "",
    label: "Home",
    icon: (
      <HomeFilled
        style={{
          color: "antiquewhite",
          fontSize: 25,
        }}
      />
    ),
    selectedIcon: (
      <HomeFilled
        style={{
          color: "#001529",
          fontSize: 25,
        }}
      />
    ),
  },
  {
    key: "products",
    label: "Garments",
    icon: (
      <Image
        src={"/Portfolio/images/clothesLogo.svg"}
        alt="logo"
        preview={false}
        width={28}
      />
    ),
    selectedIcon: (
      <Image
        src={"/Portfolio/images/clothesLogoRev.svg"}
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
      <ShoppingCartOutlined style={{ color: "antiquewhite", fontSize: 25 }} />
    ),
    selectedIcon: (
      <ShoppingCartOutlined style={{ color: "#001529", fontSize: 25 }} />
    ),
  },
  {
    key: "account",
    label: "Account",
    icon: <UserOutlined style={{ color: "antiquewhite", fontSize: 25 }} />,
    selectedIcon: <UserOutlined style={{ color: "#001529", fontSize: 25 }} />,
  },
];

const App = () => {
  const history = useHistory(); // Correct hook usage
  const location = useLocation();
  const [width] = useWindowSize();
  const { products } = useContext(CartContext);

  const onChange = (e) => {
    history.push({ pathname: `/${e.key}` });
    localStorage.setItem("selectedKey", [e.key]);
  };

  const getActiveKey = () => {
    return localStorage.getItem("selectedKey");
  };

  return (
    <Layout
      style={{
        backgroundColor: "antiquewhite",
        minHeight: "100vh",
        height: width > 1028 ? "100%" : "100vh",
      }}
    >
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: width > 728 ? "space-between" : "center",
        }}
      >
        <Image
          src={"/Portfolio/images/Logo.svg"}
          alt="logo"
          style={{
            width: width > 728 ? 90 : 130,
            height: width > 728 ? 110 : 140,
          }}
          visible={false}
          preview={false}
          onClick={() => history.push("/")}
        />
        {width > 1028 && (
          <div style={{ display: "flex" }}>
            {items.map((item) => (
              <Button
                onClick={() => history.push({ pathname: `/${item.key}` })}
                icon={
                  location.pathname === `/${item.key}`
                    ? item.selectedIcon
                    : item.icon
                }
                style={{
                  backgroundColor:
                    location.pathname === `/${item.key}`
                      ? "antiquewhite"
                      : "#001529",
                  borderRadius: "40px",
                  width: 130,
                  height: 40,
                  marginRight: 60,
                  color:
                    location.pathname === `/${item.key}`
                      ? "#001529"
                      : "antiquewhite",
                  fontWeight: "bold",
                  alignItems: "center",
                }}
              >
                {item.label}{" "}
                {item.key === "cart" && (
                  <span
                    style={{
                      border: "solid 1px ",
                      width: 50,
                      height: 24,
                      alignItems: "center",
                      backgroundColor:
                        location.pathname === `/${item.key}`
                          ? "#001529"
                          : "antiquewhite",
                      color:
                        location.pathname === `/${item.key}`
                          ? "white"
                          : "#001529",
                      borderRadius: 20,
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {products.filter((i) => i.addedToCart).length}
                  </span>
                )}
              </Button>
            ))}
          </div>
        )}
      </Header>
      <Content>
        <Suspense fallback={<Loading minHeight="100vh" />}>
          <Switch>
            {" "}
            {/* Use Switch for version 5 */}
            <Route exact path="/" component={HomePage} />{" "}
            {/* Use component prop */}
            <Route exact path="/cart" component={CartComponent} />
            <Route exact path="/products" component={ProductsList} />
          </Switch>
        </Suspense>
      </Content>
      {width > 728 ? (
        <Footer style={{ textAlign: "center" }}>
          Hira ©{new Date().getFullYear()} Created by Hira
        </Footer>
      ) : (
        <Footer
          style={{
            backgroundColor: "#001529",
            borderRadius: "15px 15px 0px 0px",
            display: "flex",
            justifyContent: "space-between",
            zIndex: 1,
            height: 60,
            paddingBottom: 65,
          }}
        >
          {items.map((item) => (
            <Button
              onClick={() => history.push({ pathname: `/${item.key}` })}
              type="link"
              icon={
                location.pathname === `/${item.key}`
                  ? item.selectedIcon
                  : item.icon
              }
              style={{
                backgroundColor:
                  location.pathname === `/${item.key}` ? "antiquewhite" : "",
                borderRadius: "40px",
                width: 45,
                height: 45,
                alignItems: "center",
              }}
            />
          ))}
        </Footer>
      )}
    </Layout>
  );
};

export default App;
