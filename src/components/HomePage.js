import { Carousel } from "antd";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";

const HomePage = (props) => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const itemRefs = useRef([]);
  const dispatch = useDispatch();
  const { products } = useSelector(state => state.products);

  // Fetch products if not already loaded
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const carouselItems = Array.from({ length: 8 }, (_, index) => ({
    key: index + 1,
    title: `Category ${index + 1}`,
    baseName: index + 1,
    description: `Shop amazing products in category ${index + 1}`,
  }));

  useEffect(() => {
    const observers = [];
    
    itemRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setVisibleItems(prev => new Set([...prev, index]));
              }, index * 40);
            }
          },
          {
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px'
          }
        );
        
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const setItemRef = (index) => (el) => {
    itemRefs.current[index] = el;
  };

  return (
    <main className="bg-antique-200">
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
          <div className="mb-8 sm:mb-12">
            <Carousel 
              effect="fade" 
              autoplaySpeed={4500}
              autoplay
              dots={true}
              className="rounded-xl md:rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden">
                {/* Hero Image */}
                <picture>
                  <source
                    srcSet="/images/saveTheDateMob.svg"
                    media="(max-width: 767px)"
                  />
                  <img
                    src="/images/saveTheDate.svg"
                    alt="Welcome to Hira - Premium Fashion Collection"
                    className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[600px] object-cover"
                  />
                </picture>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                      Welcome to Hira
                    </h1>
                    <p className="text-sm sm:text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
                      Discover premium quality garments and fashion accessories
                    </p>
                  </div>
                </div>
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Categories
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Explore our curated collection of premium garments and accessories
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6 md:gap-8">
            {carouselItems.map((item, index) => (
              <article
                key={item.key}
                ref={setItemRef(index)}
                className={`group cursor-pointer transition-all duration-500 ease-out ${
                  visibleItems.has(index) 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{
                  transitionDelay: visibleItems.has(index) ? `${index * 40}ms` : '0ms'
                }}
                onClick={() => props.history.push(`/products?category=${item.key}`)}
              >
                <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 overflow-hidden">
                    <picture className="w-full h-full block">
                      <source
                        srcSet={`/images/${item.baseName}Mob.svg`}
                        media="(max-width: 767px)"
                      />
                      <img
                        src={`/images/${item.baseName}.svg`}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </picture>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
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
                alt="Special Offers and Promotions - Save the Date"
                loading="lazy"
                className="w-full h-auto hover:scale-105 transition-transform duration-700"
              />
            </picture>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Premium Fashion Collection
          </h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-4">
              Discover our curated collection of premium garments, featuring the latest trends 
              in fashion and timeless classics. From casual wear to formal attire, we offer 
              high-quality clothing that combines style, comfort, and durability.
            </p>
            <p>
              Shop with confidence knowing that every piece in our collection is carefully 
              selected for its exceptional quality and craftsmanship. Experience fashion 
              that makes a statement while ensuring maximum comfort for everyday wear.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
