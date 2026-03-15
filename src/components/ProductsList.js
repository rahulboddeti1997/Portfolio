import { HeartFilled } from "@ant-design/icons";
import { Button, Card, Image, Tooltip, Alert } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, addToWishlist, removeFromWishlist, fetchProducts } from "../redux/productSlice";
import { fetchSearchResults, setCurrentQuery, clearSearchResults } from "../redux/searchSlice";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { ProductCardSkeleton, ImageWithLoader } from "./BrandedLoader";

const ProductsList = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const { products, loading: productsLoading, error: productsError } = useSelector(state => state.products);
  const { searchResults, searchLoading, searchError, currentQuery } = useSelector(state => state.search);

  const [visibleItems, setVisibleItems] = useState(new Set());
  const [loadedImages, setLoadedImages] = useState(new Set());
  
  const { cartItems } = useSelector(state => state.products);
  const [loadingImages, setLoadingImages] = useState(new Set());

  // Helper function to check if specific variant is in cart (copied from ProductDetail)
  const isVariantInCart = (productId, variant) => {
    if (!variant || !cartItems) return false;
    const variantId = variant.id || variant.variant_id || variant.size;
    const cartItemId = variantId ? `${productId}-${variantId}` : productId;
    return cartItems.some(item => item.cartItemId === cartItemId);
  };

  // Helper function to check if the selected variant is in cart
  const isSelectedVariantInCart = (product) => {
    const selectedVariant = getSelectedVariant(product);
    if (!selectedVariant) return false;
    
    return isVariantInCart(product.id, selectedVariant);
  };

  const [selectedVariants, setSelectedVariants] = useState({});
  const itemRefs = useRef([]);
  const observerRef = useRef(null);

  const urlParams = new URLSearchParams(location.search);
  const searchQuery = urlParams.get('search');

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (searchQuery && searchQuery !== currentQuery) {
      dispatch(setCurrentQuery(searchQuery));
      dispatch(fetchSearchResults(searchQuery));
    } else if (!searchQuery && currentQuery) {
      dispatch(clearSearchResults());
    }
  }, [searchQuery, currentQuery, dispatch]);

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

  const getSelectedVariant = (product) => {
    if (!product.variants || product.variants.length === 0) return null;
    const productId = product.id || product.product_id;
    const selectedVariantId = selectedVariants[productId];
    const selectedVariant = product.variants.find(v => (v.variant_id || v.id) === selectedVariantId);
    return selectedVariant || product.variants.find(v => v.stock > 0) || product.variants[0];
  };

  const handleVariantSelect = (productId, variant) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variant.variant_id || variant.id
    }));
  };

  // Helper function to format price in Indian locale
  const formatIndianPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(price));
  };

  // Navigation to product detail page
  const handleProductClick = (productId, e) => {
    // Check if the click was on a button or interactive element
    if (e.target.closest('button') || e.target.closest('.ant-btn')) {
      return; // Don't navigate if clicking on buttons
    }
    history.push(`/product/${productId}`);
  };
  const displayProducts = searchResults && searchResults.results
    ? searchResults.results.map(result => {
      const selectedVariant = getSelectedVariant(result);
      const effectivePrice = selectedVariant?.effective_price || result.base_price;
      const mrpPrice = result.base_price;
      const discountPercent = selectedVariant?.discount_percentage ||
        (effectivePrice < mrpPrice ? Math.round(((mrpPrice - effectivePrice) / mrpPrice) * 100) : 0);

      return {
        ...result,
        id: result.product_id,
        image: result.image_url,
        addedToCart: false,
        wishListed: false,
        price: effectivePrice,
        mrp: mrpPrice,
        discount: discountPercent,
        name: result.name,
        category: result.category,
        selectedVariant
      };
    })
    : products.map(product => {
      const selectedVariant = getSelectedVariant(product);
      const effectivePrice = selectedVariant?.effective_price || product.base_price;
      const mrpPrice = product.base_price;
      const discountPercent = selectedVariant?.discount_percentage ||
        (effectivePrice < mrpPrice ? Math.round(((mrpPrice - effectivePrice) / mrpPrice) * 100) : 0);

      return {
        ...product,
        image: product.image_url || product.image || `/images/${product.id}.svg`,
        price: effectivePrice,
        mrp: mrpPrice,
        discount: discountPercent,
        selectedVariant
      };
    });

  useEffect(() => {
    const initialVisible = new Set();
    for (let i = 0; i < Math.min(12, displayProducts.length); i++) {
      initialVisible.add(i);
    }
    setVisibleItems(initialVisible);
  }, [displayProducts.length]);

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

    if (hasChanges) {
      setVisibleItems(newVisibleItems);
    }
  }, [visibleItems]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      handleIntersection,
      {
        threshold: 0.3, 
        rootMargin: '150px 0px', 
      }
    );

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
    if (el) {
      el.dataset.index = index;
    }
  };
  console.log(displayProducts)
  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="flex w-full">
        <div className="hidden xl:block xl:w-80"></div>

        <div className="flex-1 mt-6 md:mt-10">
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

          {(searchLoading || productsLoading) && (
            <ProductCardSkeleton count={8} />
          )}

          {(searchError || productsError) && (
            <Alert
              message={searchQuery ? "Search Error" : "Products Error"}
              description={searchError || productsError}
              type="error"
              showIcon
              className="mb-6"
            />
          )}

          {!searchLoading && !productsLoading && !searchError && !productsError && (
            <div className="relative">
              {(displayProducts.length > 0 && loadedImages.size < displayProducts.length * 0.3) && (
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
                      onClick={(e) => handleProductClick(product.id, e)}
                      className={`product-card w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-[240px] rounded-none md:rounded-lg border-0 md:border shadow-none md:shadow-sm hover:shadow-md transition-all duration-500 ease-out h-full flex flex-col cursor-pointer ${shouldShow
                          ? 'opacity-100 transform-none animate-fadeInUp'
                          : 'opacity-0 transform translate-y-4'
                        }`}
                      bodyStyle={{ padding: '12px 6px 0px 6px', height: '100%', display: 'flex', flexDirection: 'column' }}
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
                              onClick={() => dispatch(removeFromWishlist({ id: product.id }))}
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
                      <div className="pt-3 pb-2 px-1 -mt-4 flex-1 flex flex-col">
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

                        {product.variants && product.variants.length > 0 && (
                          <div className="mb-2">
                            {product.variants.length === 1 ? (
                              <div className="text-xs text-gray-600">
                                Size: {product.variants[0].size}
                              </div>
                            ) : (
                              <>
                                <div className="text-xs text-gray-600 mb-1">Size:</div>
                                <div className="flex flex-wrap gap-1">
                                  {product.variants.map((variant, idx) => {
                                    const isSelected = (product.selectedVariant?.variant_id || product.selectedVariant?.id) === (variant.variant_id || variant.id);
                                    const isOutOfStock = variant.stock === 0;

                                    return (
                                      <button
                                        key={variant.variant_id || variant.id || idx}
                                        onClick={() => !isOutOfStock && handleVariantSelect(product.id, variant)}
                                        disabled={isOutOfStock}
                                        className={`
                                px-1.5 py-0.5 text-xs border rounded transition-all duration-200
                                ${isSelected
                                        ? 'border-gray-800 bg-gray-800 text-white'
                                        : isOutOfStock
                                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
                                      }
                                min-w-[18px] text-center
                              `}
                                      >
                                        {variant.size}
                                      </button>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        <div className="mb-2 flex-1">
                          {product.discount && product.discount > 0 ? (
                            <>
                              <div className="flex items-center justify-start gap-1 mb-1">
                                <span className="text-xs sm:text-xs md:text-sm font-bold text-green-600">
                                  {product.discount}% OFF
                                </span>
                                <span className="text-xs sm:text-xs md:text-sm font-semibold text-gray-900">
                                  ₹{formatIndianPrice(product.price)}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                M.R.P:{" "}
                                <span className="line-through">
                                  ₹{formatIndianPrice(product.mrp)}
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-xs text-gray-500 mb-1">
                                M.R.P:{" "}
                                <span className="font-semibold text-gray-900">
                                  ₹{formatIndianPrice(product.mrp)}
                                </span>
                              </div>
                              <div className="text-xs text-transparent">
                                M.R.P: ₹{formatIndianPrice(0)}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="w-full mt-auto">
                          {!isSelectedVariantInCart(product) ? (
                            <Button
                              onClick={() => {
                                // Add with selected variant
                                const selectedVariant = getSelectedVariant(product);
                                dispatch(addToCart({ 
                                  id: product.id,
                                  variant: selectedVariant
                                }));
                              }}
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
                              className="w-full rounded-full bg-green-600 hover:bg-green-700 border-0 text-white font-semibold text-xs py-1 h-7 sm:h-8"
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

        <div className="hidden xl:block xl:w-72"></div>
      </div>
    </div>
  );
};

export default ProductsList;
