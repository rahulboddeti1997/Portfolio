import { HeartFilled } from "@ant-design/icons";
import { Button, Card, Flex, Image, Tooltip } from "antd";
import { useWindowSize } from "./WindowSize";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addToCart, addToWishlist, removeFromWishlist } from "../redux/productSlice";

const { Meta } = Card;

const ProductsList = (props) => {
  const products = useSelector((state) => state.products.products)
  const [width] = useWindowSize();
  const dispatch = useDispatch();
  const mobileWidth =
    width > 768 ? 200 : width > 480 ? (width * 30) / 100 : (width * 50) / 100;
  return (
    <div
      style={{
        margin: 15,
        marginRight: width > 728 ? 15 : 0,
        marginLeft: width > 728 ? 15 : 0,
        height: "100%",
        overflow: "scroll",
      }}
    >
      <div
        style={{
          display: "flex",
          marginLeft: width > 728 ? 10 : 0,
          width: "100%",
        }}
      >
        {width > 768 && <div style={{ width: 350 }}></div>}
        <Flex
          gap={width > 728 ? "small" : 0}
          wrap
          style={{ marginTop: 40, alignItems: "center" }}
        >
          {products.map((product) => (
            <Card
              hoverable
              className="product-card"
              style={{
                width: mobileWidth,
                borderRadius: width > 728 ? 10 : 0,
              }}
              cover={
                <>
                  <Image
                    preview={false}
                    width={mobileWidth}
                    height={mobileWidth}
                    style={{
                      borderRadius: width > 728 ? "10px 10px 0px 0px" : "0px",
                    }}
                    alt="example"
                    src={product.image}
                  />
                  {product.wishListed ? (
                    <Button
                      onClick={() => dispatch(removeFromWishlist({id: product.id}))}
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
                      onClick={() => dispatch(addToWishlist({id: product.id}))}
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
                    fontSize: width > 728 ? 15 : 12,
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
                        fontSize: width > 728 ? 16 : 12,
                        fontWeight: "bold",
                        color: "green",
                        marginRight: 5,
                      }}
                    >
                      {" "}
                      {product.discount}%{" "}
                    </span>
                    <span
                      style={{
                        fontSize: width > 728 ? 14 : 12,
                        fontWeight: 600,
                      }}
                    >
                      ₹{product.price}.00
                    </span>
                  </div>

                  <span style={{ fontSize: 8 }}>
                    M.R.P:{" "}
                    <span style={{ fontSize: width > 728 ? 12 : 10 }}>₹</span>
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
                    onClick={() => dispatch(addToCart({id: product.id}))}
                    type="primary"
                    style={{
                      borderRadius: 30,
                      backgroundColor: "#001529",
                      color: "white",
                      marginLeft: 10,
                      fontWeight: "bold",
                      width: "98%",
                      fontSize: width > 728 ? 14 : 10,
                    }}
                  >
                    ADD TO CART
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      props.history.push("/Portfolio/cart");
                    }}
                    type="primary"
                    style={{
                      borderRadius: 30,
                      backgroundColor: "#001529",
                      color: "white",
                      marginLeft: 10,
                      fontWeight: "bold",
                      width: "98%",
                      fontSize: width > 728 ? 14 : 10,
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
