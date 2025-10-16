import { HeartFilled } from "@ant-design/icons";
import { Button, Card, Image, Tooltip, Alert } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, addToWishlist, removeFromWishlist, fetchProducts } from "../redux/productSlice";
import { fetchSearchResults, setCurrentQuery, clearSearchResults } from "../redux/searchSlice";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import BrandedLoader, { ProductCardSkeleton, ImageWithLoader } from "./BrandedLoader";

const ProductsList = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Redux state
  const { products, loading: productsLoading, error: productsError } = useSelector(state => state.products);
  const { searchResults, searchLoading, searchError, currentQuery } = useSelector(state => state.search);
  
  // Component state - optimized for performance
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [loadingImages, setLoadingImages] = useState(new Set());
  const itemRefs = useRef([]);
  const observerRef = useRef(null);

  // Get search query from URL
  const urlParams = new URLSearchParams(location.search);
  const searchQuery = urlParams.get('search');

  // Fetch products on component mount
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // Handle search when URL changes
  useEffect(() => {
    if (searchQuery && searchQuery !== currentQuery) {
      dispatch(setCurrentQuery(searchQuery));
      dispatch(fetchSearchResults(searchQuery));
    } else if (!searchQuery && currentQuery) {
      dispatch(clearSearchResults());
    }
  }, [searchQuery, currentQuery, dispatch]);

  // Handle image loading
  const handleImageLoad = useCallback((productId) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
    setLoadedImages(prev => new Set([...prev, productId]));
  }, []);

  const handleImageLoadStart = useCallback((productId) => {
    setLoadingImages(prev => new Set([...prev, productId]));
  }, []);

  const handleImageError = useCallback((productId) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  }, []);
  const displayProducts = searchResults && searchResults.results 
    ? searchResults.results.map(result => ({
        ...result,
        // Map API result to existing product structure
        id: result.product_id,
        image: result.image_url, // Use the actual image URL from database
        addedToCart: false, // Could check against cartItems
        wishListed: false, // Could check against wishlistItems
        price: result.variants[0]?.effective_price || result.base_price,
        mrp: result.base_price,
        name: result.name,
        category: result.category
      }))
    : products.map(product => ({
        ...product,
        // Ensure regular products also use the correct image field
        image: product.image_url || product.image || `/images/${product.id}.svg`, // Fallback to SVG if no image_url
        price: product.variants?.[0]?.effective_price || product.base_price,
        mrp: product.base_price
      }));

  // Show first batch of items immediately for better perceived performance
  useEffect(() => {
    const initialVisible = new Set();
    for (let i = 0; i < Math.min(12, displayProducts.length); i++) {
      initialVisible.add(i);
    }
    setVisibleItems(initialVisible);
  }, [displayProducts.length]);

  // Optimized intersection observer with throttling
  const handleIntersection = useCallback((entries) => {
    const newVisibleItems = new Set(visibleItems);
    let hasChanges = false;
    
    entries.forEach((entry) => {
      const index = parseInt(entry.target.dataset.index);
      if (entry.isIntersecting && !newVisibleItems.has(index)) {
        newVisibleItems.add(index);
        hasChanges = true;
      }
    });
    
    // Only update state if there are actual changes
    if (hasChanges) {
      setVisibleItems(newVisibleItems);
    }
  }, [visibleItems]);

  useEffect(() => {
    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create a single intersection observer with throttling
    observerRef.current = new IntersectionObserver(
      handleIntersection,
      {
        threshold: 0.3, // Higher threshold for better performance
        rootMargin: '150px 0px', // Larger margin for smoother experience
      }
    );

    // Observe all current items
    itemRefs.current.forEach((ref) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [displayProducts.length, handleIntersection]);

  const setItemRef = (index) => (el) => {
    itemRefs.current[index] = el;
    // Add data attribute for intersection observer
    if (el) {
      el.dataset.index = index;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="flex w-full">
        <div className="hidden xl:block xl:w-80"></div>
        
        <div className="flex-1 mt-6 md:mt-10">
          {/* Search Results Header */}
          {searchQuery && (
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                Search results for "{searchQuery}"
              </h2>
              {searchResults && (
                <p className="text-gray-600">
                  {searchResults.results.length} products found
                </p>
              )}
            </div>
          )}

          {/* Loading State */}
          {(searchLoading || productsLoading) && (
            <BrandedLoader 
              size="large" 
              type={searchQuery ? "search" : "products"}
              message={searchQuery ? "Finding perfect matches..." : "Curating premium fashion..."}
            />
          )}

          {/* Error State */}
          {(searchError || productsError) && (
            <Alert
              message={searchQuery ? "Search Error" : "Products Error"}
              description={searchError || productsError}
              type="error"
              showIcon
              className="mb-6"
            />
          )}

          {/* Products Grid */}
          {!searchLoading && !productsLoading && !searchError && !productsError && (
            <div className="relative">
              {/* Show skeleton while initial load or many images are loading */}
              {(displayProducts.length > 0 && loadedImages.size < displayProducts.length * 0.5) && (
                <div className="mb-8">
                  <ProductCardSkeleton count={Math.min(8, displayProducts.length)} />
                </div>
              )}
              
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-4 md:gap-6 place-items-center">
                {displayProducts.map((product, index) => {
                  const isImageLoaded = loadedImages.has(product.id);
                  const shouldShow = visibleItems.has(index) && (isImageLoaded || loadedImages.size > displayProducts.length * 0.5);
                  
                  return (
                    <Card
                      key={product.id}
                      ref={setItemRef(index)}
                      hoverable
                      className={`product-card w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-[240px] rounded-none md:rounded-lg border-0 md:border shadow-none md:shadow-sm hover:shadow-md transition-all duration-500 ease-out ${
                        shouldShow
                          ? 'opacity-100 transform-none animate-fadeInUp' 
                          : 'opacity-0 transform translate-y-4'
                      }`}
                      bodyStyle={{ padding: '12px 6px 0px 6px' }}
                cover={
                  <div className="relative aspect-square">
                    <ImageWithLoader
                      src={product.image_url || product.image || `/images/${product.id}.svg`}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-none md:rounded-t-lg"
                      fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="
                      onLoad={() => {
                        handleImageLoadStart(product.id);
                        setTimeout(() => handleImageLoad(product.id), 200);
                      }}
                      onError={() => handleImageError(product.id)}
                    />
                    {product.wishListed ? (
                      <Button
                        onClick={() => dispatch(removeFromWishlist({id: product.id}))}
                        icon={<HeartFilled />}
                        type="primary"
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-0 bg-white text-red-500 hover:bg-red-50 shadow-md z-10 flex items-center justify-center p-0"
                      />
                    ) : (
                      <Button
                        onClick={() => dispatch(addToWishlist(product))}
                        icon={<HeartFilled />}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-0 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-md z-10 flex items-center justify-center p-0"
                      />
                    )}
                  </div>
                }
              >
                <div className="pt-3 pb-2 px-1 -mt-4">
                  <Tooltip title={product.name} trigger="hover">
                    <h4 className="text-xs sm:text-xs md:text-sm font-medium text-gray-800 mb-1 overflow-hidden text-ellipsis leading-tight" 
                        style={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          lineHeight: '1.2'
                        }}>
                      {product.name}
                    </h4>
                  </Tooltip>
                  
                  <div className="mb-1">
                    <div className="flex items-center justify-start gap-1 mb-1">
                      <span className="text-xs sm:text-xs md:text-sm font-bold text-green-600">
                        {product.discount}%
                      </span>
                      <span className="text-xs sm:text-xs md:text-sm font-semibold text-gray-900">
                        ₹{product.price}.00
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      M.R.P:{" "}
                      <span className="line-through">
                        ₹{product.mrp}.00
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    {!product.addedToCart ? (
                      <Button
                        onClick={() => dispatch(addToCart({id: product.id}))}
                        type="primary"
                        className="w-full rounded-full bg-slate-800 hover:bg-slate-700 border-0 text-white font-semibold text-xs py-1 h-7 sm:h-8"
                      >
                        ADD TO CART
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          props.history.push("/cart");
                        }}
                        type="primary"
                        className="w-full rounded-full bg-slate-800 hover:bg-slate-700 border-0 text-white font-semibold text-xs py-1 h-7 sm:h-8"
                      >
                        GO TO CART
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Right spacer for larger screens */}
        <div className="hidden xl:block xl:w-72"></div>
      </div>
    </div>
  );
};

export default ProductsList;
