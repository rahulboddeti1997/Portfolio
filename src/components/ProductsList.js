import { HeartFilled } from "@ant-design/icons";
import { Button, Card, Flex, Image, Tooltip } from "antd";
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useWindowSize } from "./WindowSize";

const { Meta } = Card;

const ProductsList = (props) => {
  const [width] = useWindowSize();
  const { savedItems, setSavedItems, products, setProducts } =
    useContext(CartContext);
  const mobileWidth =
    width > 768 ? 200 : width > 480 ? (width * 30) / 100 : (width * 44) / 100;
  return (
    <div
      style={{
        margin: 15,
        height: "100%",
        overflow: "scroll",
      }}
    >
      <div style={{ display: "flex" }}>
        {width > 768 && <div style={{ width: 350 }}></div>}
        <Flex
          gap={"small"}
          wrap
          style={{ marginTop: 40, alignItems: "center" }}
        >
          {products.map((product) => (
            <Card
              hoverable
              className="product-card"
              style={{
                width: mobileWidth,
                borderRadius: 10,
              }}
              cover={
                <>
                  <Image
                    preview={false}
                    width={mobileWidth}
                    height={mobileWidth}
                    style={{ borderRadius: "10px 10px 0px 0px" }}
                    alt="example"
                    src={product.image}
                  />
                  {product.wishListed ? (
                    <Button
                      onClick={() =>
                        setProducts(
                          products.map((item) =>
                            item.id === product.id
                              ? { ...item, wishListed: false }
                              : item
                          )
                        )
                      }
                      icon={<HeartFilled />}
                      type="primary"
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 30,
                        color: "red",
                        position: "absolute",
                        backgroundColor: "white",
                        top: (mobileWidth * 75) / 100,
                        left: (mobileWidth * 75) / 100,
                        zIndex: 30,
                      }}
                    />
                  ) : (
                    <Button
                      onClick={() =>
                        setProducts(
                          products.map((item) =>
                            item.id === product.id
                              ? { ...item, wishListed: true }
                              : item
                          )
                        )
                      }
                      icon={<HeartFilled />}
                      type="primary"
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 30,
                        color: "white",
                        position: "absolute",
                        backgroundColor: "red",
                        top: (mobileWidth * 75) / 100,
                        left: (mobileWidth * 75) / 100,
                        zIndex: 30,
                      }}
                    />
                  )}
                </>
              }
            >
              <Tooltip title={product.name} trigger="hover">
                <h4
                  style={{
                    fontSize: width > 728 ? 15 : 19,
                    marginTop: -15,
                    marginBottom: 5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {product.name}
                </h4>
              </Tooltip>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "green",
                        marginRight: 5,
                      }}
                    >
                      {" "}
                      {product.discount}%{" "}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>
                      ₹{product.price}.00
                    </span>
                  </div>

                  <span style={{ fontSize: 8 }}>
                    M.R.P: <span style={{ fontSize: 12 }}>₹</span>
                    <span
                      style={{ fontSize: 12, textDecoration: "line-through" }}
                    >
                      {product.mrp}.00
                    </span>
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {!product.addedToCart ? (
                  <Button
                    onClick={() =>
                      setProducts(
                        products.map((item) =>
                          item.id === product.id
                            ? {
                                ...item,
                                addedToCart: true,
                                savedForLater: false,
                              }
                            : item
                        )
                      )
                    }
                    type="primary"
                    style={{
                      borderRadius: 30,
                      backgroundColor: "#001529",
                      color: "white",
                      marginLeft: 10,
                      fontWeight: "bold",
                      width: "98%",
                    }}
                  >
                    ADD TO CART
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      props.history.push("/cart");
                    }}
                    type="primary"
                    style={{
                      borderRadius: 30,
                      backgroundColor: "#001529",
                      color: "white",
                      marginLeft: 10,
                      fontWeight: "bold",
                      width: "98%",
                    }}
                  >
                    GO TO CART
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </Flex>
        {width > 768 && <div style={{ width: 300 }}></div>}
      </div>
    </div>
  );
};

export default ProductsList;
