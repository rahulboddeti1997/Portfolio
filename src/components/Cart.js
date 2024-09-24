import { DoubleRightOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Image } from "antd";
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useWindowSize } from "./WindowSize";

const Cart = () => {
  const [width] = useWindowSize();
  const { products, setProducts } = useContext(CartContext);

  const cartProducts = products.filter((i) => i.addedToCart === true);
  const total = cartProducts.reduce((acc, item) => acc + item.price, 0);
  const totalMrp = cartProducts.reduce((acc, item) => acc + item.mrp, 0);
  const savedProducts = products.filter((i) => i.savedForLater === true);
  const avgDiscount = cartProducts.reduce(
    (acc, item) => acc + (item.mrp - item.price),
    0
  );
  const itemStyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    padding: "5px 10px", // Adds padding to the container
  };

  const nameStyle = {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
    whiteSpace: "nowrap", // Prevents wrapping of text
  };

  const priceContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  };

  const discountPriceStyle = {
    display: "flex",
    alignItems: "center", // Centers discount and price on the same line
    marginBottom: 5, // Adds space below discount and price
  };

  const discountStyle = {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
    marginRight: 5,
    backgroundColor: "red",
    padding: "2px 5px",
    borderRadius: 5,
  };

  const priceStyle = {
    fontSize: 18,
    fontWeight: 600,
  };

  const mrpStyle = {
    fontSize: 10,
    marginLeft: 4,
  };

  const strikeThroughStyle = {
    fontSize: 12,
    textDecoration: "line-through",
  };

  const Item = ({ item, fontSize, showButton }) => (
    <div style={itemStyle}>
      <div style={{ ...nameStyle, fontSize: fontSize }}>{item.name}</div>
      <div style={priceContainerStyle}>
        <div style={discountPriceStyle}>
          <span style={discountStyle}>{item.discount}%</span>
          <span style={priceStyle}>₹{item.price}.00</span>
        </div>
        <span style={mrpStyle}>
          M.R.P: <span style={{ fontSize: fontSize }}>₹</span>
          <span style={strikeThroughStyle}>{item.mrp}.00</span>
        </span>
        {showButton && (
          <Button
            onClick={() =>
              setProducts(
                products.map((i) =>
                  item.id === i.id
                    ? { ...i, addedToCart: true, savedForLater: false }
                    : i
                )
              )
            }
            type="primary"
            style={{
              borderRadius: 30,
              color: "#001529",
              backgroundColor: "white",
              border: "1px solid #001529",
              marginLeft: 10,
              marginTop: 10,
              fontWeight: "bold",
              width: "90%",
              fontSize: 11,
              height: 22,
            }}
          >
            Move To Card
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: 100,
        marginTop: 30,
      }}
    >
      <Card
        title={
          <h3 style={{ margin: 5 }}>
            {cartProducts.length > 0 ? "Shopping Cart" : "Your Cart is Empty"}
          </h3>
        }
        style={{
          width: 800,
          margin: 15,
          height: total > 0 ? "100%" : 200,
        }}
        bodyStyle={{ padding: 10 }}
      >
        {cartProducts.map((item) => (
          <div style={{ backgroundColor: "white" }} bodyStyle={{ padding: 6 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: 10,
                backgroundColor: "white",
              }}
            >
              <Image
                preview={false}
                width={width > 1024 ? 130 : width > 480 ? 44 : 40}
                height={width > 1024 ? 115 : width > 480 ? 65 : 60}
                alt={item.name}
                src={item.image}
                style={{
                  backgroundColor: "antiquewhite",
                  borderRadius: width > 1024 ? 20 : width > 480 ? 6 : 4,
                  cursor: "pointer",
                }}
              />
              {Item({ item: item, fontSize: 14 })}
            </div>
            <Divider style={{ margin: 0 }} />
          </div>
        ))}
        {cartProducts.length > 0 && (
          <span style={{ fontSize: 22, float: "right", marginRight: 20 }}>
            Subtotal: <span style={{ fontWeight: "bold" }}>₹{total}</span>
          </span>
        )}
      </Card>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Card
          title={<h4 style={{ margin: 0 }}>Price Details</h4>}
          style={{
            margin: 15,
            marginBottom: 10,
            marginLeft: 10,
            height: 280,
            width: 450,
          }}
        >
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 16,
              fontWeight: 550,
            }}
          >
            <span style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Price ({cartProducts.length} Items):</span>
              <span> ₹{totalMrp}</span>
            </span>
            <span style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Discounted Amount:</span>
              <span> ₹{avgDiscount}</span>
            </span>
            <span style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Delivery Charges:</span>
              <span> ₹{50} </span>
            </span>
            <Divider
              style={{ margin: 5, borderColor: "#001529" }}
              variant="dashed"
            />
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              <span>Total Amount:</span>
              <span> ₹{total + 50} </span>
            </span>
            <Divider
              style={{ margin: 5, borderColor: "#001529" }}
              variant="dashed"
            />
            <Button
              type="primary"
              style={{
                borderRadius: 30,
                fontWeight: "bold",
                fontSize: 18,
                backgroundColor: "#001529",
                width: "50%",
                alignSelf: "center",
                marginTop: 10,
                color: "antiquewhite",
                padding: 10,
              }}
              icon={<DoubleRightOutlined />}
            >
              PLACE ORDER
            </Button>
          </span>
        </Card>
        <Card
          title={<h4 style={{ margin: 0 }}>Saved for Later</h4>}
          style={{
            margin: 15,
            marginBottom: 0,
            marginLeft: 10,
            height: 550,
            width: 450,
            overflowY: "scroll",
            padding: 10,
            paddingTop: 0,
          }}
        >
          {savedProducts.map((item) => (
            <div
              style={{ backgroundColor: "white" }}
              bodyStyle={{ padding: 6 }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 10,
                  backgroundColor: "white",
                }}
              >
                <Image
                  preview={false}
                  width={width > 1024 ? 130 : width > 480 ? 44 : 40}
                  height={width > 1024 ? 105 : width > 480 ? 65 : 60}
                  alt={item.name}
                  src={item.image}
                  style={{
                    backgroundColor: "antiquewhite",
                    borderRadius: width > 1024 ? 20 : width > 480 ? 6 : 4,
                    cursor: "pointer",
                  }}
                />
                {Item({ item: item, fontSize: 10, showButton: true })}
              </div>
              <Divider style={{ margin: 0 }} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default Cart;
