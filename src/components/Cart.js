import { DoubleRightOutlined, DeleteOutlined, HeartOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Image, message, Tag, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, addToWishlist, addToCart } from "../redux/productSlice";

const Cart = () => {
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();

  // Helper function to format price in Indian locale
  const formatIndianPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(price));
  };

  // Helper function to get effective price from variant or base price
  const getEffectivePrice = (item) => {
    if (item.selectedVariant) {
      // For variants, use the product's base price and apply variant discount
      const basePrice = item.mrp || item.price || item.base_price || 0;
      const discountPercent = item.selectedVariant.discount_percentage || 0;
      const effectivePrice = basePrice * (1 - discountPercent / 100);
      return effectivePrice;
    }
    
    // Fallback to item pricing (for items added without variants)
    return item.price || item.mrp || item.base_price || 0;
  };

  // Helper function to get original price for discount calculation
  const getOriginalPrice = (item) => {
    // Always use the base product price as original
    return item.mrp || item.price || item.base_price || 0;
  };

  const { cartItems } = useSelector((state) => state.products);
  const cartProducts = cartItems || [];
  const total = cartProducts.reduce((acc, item) => acc + (getEffectivePrice(item) * (item.quantity || 1)), 0);
  const totalMrp = cartProducts.reduce((acc, item) => acc + (getOriginalPrice(item) * (item.quantity || 1)), 0);
  const savedProducts = products.filter((i) => i.savedForLater === true);
  const totalDiscount = totalMrp - total;
  const deliveryCharges = total > 499 ? 0 : 50;
  const finalTotal = total + deliveryCharges;

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart({ 
      id: item.originalId || item.id, 
      cartItemId: item.cartItemId 
    }));
    message.success('Item removed from cart');
  };

  const handleMoveToWishlist = (item) => {
    dispatch(removeFromCart({ 
      id: item.originalId || item.id, 
      cartItemId: item.cartItemId 
    }));
    dispatch(addToWishlist({ id: item.originalId || item.id }));
    message.success('Item moved to wishlist');
  };

  const handleQuantityChange = (item, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ 
        id: item.originalId || item.id, 
        cartItemId: item.cartItemId,
        quantity 
      }));
    }
  };

  const handleVariantChange = (item, newVariant) => {
    const product = products.find(p => p.id === (item.originalId || item.id));
    if (!product) return;

    // Remove current item from cart
    dispatch(removeFromCart({ 
      id: item.originalId || item.id, 
      cartItemId: item.cartItemId 
    }));

    // Add new variant to cart with same quantity
    dispatch(addToCart({ 
      id: product.id, 
      variant: newVariant,
      quantity: item.quantity || 1
    }));

    message.success(`Size changed to ${newVariant.size}`);
  };



  const CartItem = ({ item }) => (
    <div className="bg-white border-b border-gray-100 p-3 sm:p-6 hover:bg-gray-50 transition-colors duration-200">
      {/* Mobile Layout */}
      <div className="sm:hidden">
        <div className="flex gap-3 mb-3">
          {/* Product Image - Mobile */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <Image
                preview={false}
                src={item.image_url || item.image || `/images/${item.originalId || item.id}.svg`}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Product Info - Mobile */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
              {item.name}
            </h3>
            
            {/* Variant Info - Mobile */}
            {item.selectedVariant && (
              <div className="mb-1">
                {(() => {
                  const product = products.find(p => p.id === (item.originalId || item.id));
                  const availableVariants = product?.variants || [];
                  
                  return availableVariants.length > 1 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Size:</span>
                      <Select
                        size="small"
                        value={item.selectedVariant.size}
                        onChange={(size) => {
                          const newVariant = availableVariants.find(v => v.size === size);
                          if (newVariant) {
                            handleVariantChange(item, newVariant);
                          }
                        }}
                        className="min-w-[60px] cart-size-selector"
                        dropdownMatchSelectWidth={false}
                        style={{
                          backgroundColor: '#f3f4f6',
                          border: '1px solid #d1d5db'
                        }}
                      >
                        {availableVariants
                          .filter(variant => variant.stock > 0)
                          .map((variant) => (
                          <Select.Option key={variant.size} value={variant.size}>
                            {variant.size}
                            {variant.stock <= 5 && (
                              <span className="text-orange-500 text-xs ml-1">
                                ({variant.stock} left)
                              </span>
                            )}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  ) : (
                    <Tag size="small" className="text-xs">
                      Size: {item.selectedVariant.size}
                    </Tag>
                  );
                })()}
              </div>
            )}
            
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold text-gray-900">
                ₹{formatIndianPrice(getEffectivePrice(item))}
              </span>
              {getOriginalPrice(item) > getEffectivePrice(item) && (
                <>
                  <span className="text-xs text-gray-500 line-through">
                    ₹{formatIndianPrice(getOriginalPrice(item))}
                  </span>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                    {Math.round(((getOriginalPrice(item) - getEffectivePrice(item)) / getOriginalPrice(item)) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Actions Row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {/* Quantity Controls - Mobile */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-medium">Qty:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <Button
                size="small"
                icon={<MinusOutlined />}
                onClick={() => handleQuantityChange(item, (item.quantity || 1) - 1)}
                className="border-0 hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
                disabled={(item.quantity || 1) <= 1}
              />
              <span className="px-2 py-1 min-w-[32px] text-center text-sm border-x border-gray-300">
                {item.quantity || 1}
              </span>
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => handleQuantityChange(item, (item.quantity || 1) + 1)}
                className="border-0 hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
                disabled={(item.quantity || 1) >= 10}
              />
            </div>
          </div>

          {/* Action Buttons - Mobile */}
          <div className="flex gap-1">
            <Button
              size="small"
              icon={<HeartOutlined />}
              onClick={() => handleMoveToWishlist(item)}
              className="text-gray-600 hover:text-red-500 border-gray-300 w-8 h-8 flex items-center justify-center p-0"
            />
            <Button
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveItem(item)}
              className="text-gray-600 hover:text-red-500 border-gray-300 w-8 h-8 flex items-center justify-center p-0"
            />
          </div>
        </div>
      </div>

      {/* Desktop Layout - Unchanged */}
      <div className="hidden sm:flex gap-4">
        {/* Product Image - Desktop */}
        <div className="flex-shrink-0">
          <div className="w-28 h-28 md:w-32 md:h-32 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
            <Image
              preview={false}
              src={item.image_url || item.image || `/images/${item.originalId || item.id}.svg`}
              alt={item.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Product Details - Desktop */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-sm md:text-base font-medium text-gray-900 line-clamp-2 mb-2">
                {item.name}
              </h3>
              
              {/* Variant Info - Desktop */}
              {item.selectedVariant && (
                <div className="mb-2">
                  {(() => {
                    const product = products.find(p => p.id === (item.originalId || item.id));
                    const availableVariants = product?.variants || [];
                    
                    return availableVariants.length > 1 ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Size:</span>
                          <Select
                            size="small"
                            value={item.selectedVariant.size}
                            onChange={(size) => {
                              const newVariant = availableVariants.find(v => v.size === size);
                              if (newVariant) {
                                handleVariantChange(item, newVariant);
                              }
                            }}
                            className="min-w-[70px] cart-size-selector"
                            dropdownMatchSelectWidth={false}
                            style={{
                              backgroundColor: '#f3f4f6',
                              border: '1px solid #d1d5db'
                            }}
                          >
                            {availableVariants
                              .filter(variant => variant.stock > 0)
                              .map((variant) => (
                              <Select.Option key={variant.size} value={variant.size}>
                                {variant.size}
                                {variant.stock <= 5 && (
                                  <span className="text-orange-500 text-xs ml-1">
                                    ({variant.stock} left)
                                  </span>
                                )}
                              </Select.Option>
                            ))}
                          </Select>
                        </div>
                        {item.selectedVariant.stock <= 5 && item.selectedVariant.stock > 0 && (
                          <Tag color="orange" className="text-xs">
                            Only {item.selectedVariant.stock} left
                          </Tag>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Tag className="text-sm">
                          Size: {item.selectedVariant.size}
                        </Tag>
                        {item.selectedVariant.stock <= 5 && item.selectedVariant.stock > 0 && (
                          <Tag color="orange" className="text-xs">
                            Only {item.selectedVariant.stock} left
                          </Tag>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
              
              {/* Price Section - Desktop */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg md:text-xl font-bold text-gray-900">
                  ₹{formatIndianPrice(getEffectivePrice(item))}
                </span>
                {getOriginalPrice(item) > getEffectivePrice(item) && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{formatIndianPrice(getOriginalPrice(item))}
                    </span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                      {Math.round(((getOriginalPrice(item) - getEffectivePrice(item)) / getOriginalPrice(item)) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Quantity and Actions - Desktop */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      size="small"
                      icon={<MinusOutlined />}
                      onClick={() => handleQuantityChange(item, (item.quantity || 1) - 1)}
                      className="border-0 hover:bg-gray-100"
                      disabled={(item.quantity || 1) <= 1}
                    />
                    <span className="px-3 py-1 min-w-[40px] text-center border-x border-gray-300">
                      {item.quantity || 1}
                    </span>
                    <Button
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => handleQuantityChange(item, (item.quantity || 1) + 1)}
                      className="border-0 hover:bg-gray-100"
                      disabled={(item.quantity || 1) >= 10}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    (Max 10)
                  </span>
                </div>

                {/* Action Buttons - Desktop */}
                <div className="flex gap-2">
                  <Button
                    size="small"
                    icon={<HeartOutlined />}
                    onClick={() => handleMoveToWishlist(item)}
                    className="text-gray-600 hover:text-red-500 border-gray-300"
                  >
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                  <Button
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(item)}
                    className="text-gray-600 hover:text-red-500 border-gray-300"
                  >
                    <span className="hidden sm:inline">Remove</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyCart = () => (
    <div className="text-center py-16">
      <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6m0 0h9m0 0L16 19"/>
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
      <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
      <Button type="primary" size="large" className="bg-blue-600 hover:bg-blue-700 border-0">
        Continue Shopping
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-antique-200 py-2 sm:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-0 rounded-lg overflow-hidden">
              <div className="border-b border-gray-200 p-3 sm:p-6">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                  Shopping Cart
                  {cartProducts.length > 0 && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'})
                    </span>
                  )}
                </h1>
              </div>

              {cartProducts.length === 0 ? (
                <EmptyCart />
              ) : (
                <>
                  <div className="divide-y divide-gray-100">
                    {cartProducts.map((item) => (
                      <CartItem key={item.cartItemId || item.id} item={item} />
                    ))}
                  </div>
                  
                  {/* Cart Summary */}
                  <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900">
                        Subtotal ({cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'}):
                      </span>
                      <span className="text-xl font-bold text-gray-900">₹{formatIndianPrice(total)}</span>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Right Column - Price Details & Actions */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Price Details Card */}
              <Card className="shadow-sm border-0 rounded-lg sticky top-4">
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Price Details</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Price ({cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'})</span>
                      <span>₹{formatIndianPrice(totalMrp)}</span>
                    </div>
                    
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{formatIndianPrice(totalDiscount)}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-700">
                      <span className="flex items-center gap-1">
                        Delivery Charges
                        {total > 499 && (
                          <span className="text-xs text-green-600 line-through">₹50</span>
                        )}
                      </span>
                      <span className={deliveryCharges === 0 ? "text-green-600" : ""}>
                        {deliveryCharges === 0 ? "FREE" : `₹${formatIndianPrice(deliveryCharges)}`}
                      </span>
                    </div>
                    
                    {total <= 499 && total > 0 && (
                      <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded-lg">
                        Add items worth ₹{formatIndianPrice(499 - total)} more for FREE delivery
                      </div>
                    )}
                  </div>
                  
                  <Divider className="my-4 border-gray-300" />
                  
                  <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{formatIndianPrice(finalTotal)}</span>
                  </div>
                  
                  <div className="text-xs text-green-600 mt-1">
                    You will save ₹{formatIndianPrice(totalDiscount)} on this order
                  </div>
                  
                  <Button
                    type="primary"
                    size="large"
                    icon={<DoubleRightOutlined />}
                    disabled={cartProducts.length === 0}
                    className="w-full mt-6 h-12 text-base font-semibold bg-orange-500 hover:bg-orange-600 border-0 rounded-lg"
                  >
                    PLACE ORDER
                  </Button>
                </div>
              </Card>

              {/* Saved for Later */}
              {savedProducts.length > 0 && (
                <Card className="shadow-sm border-0 rounded-lg">
                  <div className="p-3 sm:p-6">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                      Saved for Later ({savedProducts.length})
                    </h2>
                    
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {savedProducts.map((item) => (
                        <div key={item.id} className="flex gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              preview={false}
                              src={item.image_url || item.image || `/images/${item.id}.svg`}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-1 sm:gap-2 mb-2">
                              <span className="text-xs sm:text-sm font-semibold">₹{item.price}</span>
                              <span className="text-xs text-gray-500 line-through">₹{item.mrp}</span>
                            </div>
                            <Button
                              size="small"
                              type="primary"
                              className="text-xs h-6 sm:h-7 bg-blue-600 hover:bg-blue-700 border-0 px-2"
                            >
                              Move to Cart
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
