import { Carousel, Image } from "antd";
import React, { useEffect, useRef } from "react";
import { useWindowSize } from "./WindowSize";

const HomePage = (props) => {
  const [width] = useWindowSize();

  const carouselItems = Array.from({ length: 10 }, (_, index) => ({
    key: index + 1,
    title: `Card ${index + 1}`,
    description: `www.instagram.com/${index + 1}`,
    imageUrl:
      width > 780
        ? `/Portfolio/images/${index + 1}.svg`
        : `/Portfolio/images/${index + 1}Mob.svg`,
  }));

  const itemsCount = width > 1024 ? 8 : width > 480 ? 4 : 2;
  const groupedItems = [];
  const categoryItems = carouselItems.slice(0, 8);
  for (let i = 0; i < carouselItems.length; i += itemsCount) {
    groupedItems.push(carouselItems.slice(i, i + itemsCount));
  }

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <div style={{ margin: 20 }}>
      <Carousel effect="fade" autoplaySpeed={4500}>
        <div style={{ borderRadius: 10 }}>
          <video
            ref={videoRef}
            style={{ borderRadius: 10 }}
            width="100%"
            autoPlay
            loop
            height="100%"
            muted
          >
            <source
              src={width > 780 ? "/saveTheDate2.mp4" : "/saveTheDateMob.mp4"}
              type="video/mp4"
            />
          </video>
        </div>
      </Carousel>
      {width > 780 ? (
        <div
          className="imgCard"
          style={{
            margin: 0,
            padding: 15,
            borderRadius: 15,
            marginTop: 15,
            display: "flex",
            paddingLeft: 0,
            paddingRight: 0,

            backgroundColor: "antiquewhite",
            justifyContent: "space-between",
          }}
        >
          {categoryItems.map((item) => (
            <Image
              preview={false}
              width={width > 1024 ? 183 : width > 480 ? 44 : 40}
              height={width > 1024 ? 275 : width > 480 ? 65 : 60}
              alt={item.title}
              src={item.imageUrl}
              onClick={() =>
                props.history.push(`/products?category=${item.key}`)
              }
              style={{
                backgroundColor: "antiquewhite",
                borderRadius: width > 1024 ? 15 : width > 480 ? 6 : 4,
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      ) : (
        <div>
          <div
            style={{
              margin: 0,
              padding: 15,
              borderRadius: 15,
              display: "flex",
              paddingLeft: 0,
              paddingRight: 0,
              paddingBottom: 5,
              marginTop: 5,
              backgroundColor: "antiquewhite",
              justifyContent: "space-between",
            }}
          >
            {categoryItems.splice(0, 4).map((item) => (
              <Image
                preview={false}
                width={90}
                height={135}
                alt={item.title}
                src={item.imageUrl}
                style={{
                  backgroundColor: "antiquewhite",
                  borderRadius: width > 480 ? 12 : 7,
                }}
              />
            ))}
          </div>
          <div
            style={{
              margin: 0,
              borderRadius: 15,
              display: "flex",
              backgroundColor: "antiquewhite",
              justifyContent: "space-between",
            }}
          >
            {categoryItems.map((item) => (
              <Image
                preview={false}
                width={90}
                height={135}
                alt={item.title}
                src={item.imageUrl}
                style={{
                  backgroundColor: "antiquewhite",
                  borderRadius: width > 480 ? 12 : 7,
                }}
              />
            ))}
          </div>
        </div>
      )}
      <Image
        preview={false}
        width={"100%"}
        height={"100%"}
        style={{
          borderRadius: "10px 10px 10px 10px",
          marginTop: 25,
          marginBottom: 20,
        }}
        src={
          width > 780
            ? "/Portfolio/images/saveTheDate.svg"
            : "/Portfolio/images/saveTheDateMob.svg"
        }
      />
    </div>
  );
};

export default HomePage;
