import { Carousel } from "antd";

const HomePage = (props) => {

  const carouselItems = Array.from({ length: 8 }, (_, index) => ({
    key: index + 1,
    title: `Card ${index + 1}`,
    baseName: index + 1,
  }));

  return (
    <div style={{ margin: 20 }}>
      <Carousel effect="fade" autoplaySpeed={4500}>
        <div className="rounded-[10px]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full rounded-lg"
          >
            <source
              src="/images/saveTheDateMob.mp4"
              type="video/mp4"
              media="(max-width: 767px)"
            />
            <source
              src="/images/saveTheDate2.mp4"
              type="video/mp4"
              media="(min-width: 768px)"
            />
          </video>
        </div>
      </Carousel>
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 mt-6 p-4 rounded-2xl bg-[#faebd7]">
        {carouselItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() =>
              props.history.push(`/products?category=${item.key}`)
            }
            className="aspect-[2/3] flex items-center justify-center rounded-lg bg-[#faebd7]"
          >
            <picture>
              <source
                srcSet={`/images/${item.baseName}Mob.svg`}
                media="(max-width: 767px)"
              />
              <img
                src={`/images/${item.baseName}.svg`}
                alt={item.title}
                className="w-full h-full object-contain rounded-2xl"
              />
            </picture>
          </button>
        ))}
      </div>
      <picture>
        <source
          srcSet="/images/saveTheDateMob.svg"
          media="(max-width: 767px)"
        />
        <source
          srcSet="/images/saveTheDate.svg"
          media="(min-width: 768px)"
        />
        <img
          src="/images/saveTheDate.svg"
          alt="Save The Date"
          className="w-full h-auto rounded-lg mt-6 mb-5"
        />
      </picture>
    </div>
  );
};

export default HomePage;
