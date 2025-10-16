import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Button, 
  Card, 
  Row, 
  Col, 
  Divider, 
  Rate, 
  Breadcrumb, 
  message,
  Image as AntImage,
  Progress,
  Input,
  Form,
  Avatar,
  Tag
} from 'antd';
import { 
  ArrowLeftOutlined, 
  ShoppingCartOutlined, 
  HeartOutlined, 
  HeartFilled,
  StarFilled,
  UserOutlined,
  CheckCircleOutlined,
  LikeOutlined,
  DislikeOutlined
} from '@ant-design/icons';
import { addToCart, addToWishlist, removeFromWishlist, fetchProducts } from '../redux/productSlice';
import { fetchSearchResults } from '../redux/searchSlice';
import BrandedLoader, { ImageWithLoader } from './BrandedLoader';

const { TextArea } = Input;

const ProductDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  
  const { products, loading, cartItems } = useSelector(state => state.products);
  const { searchResults } = useSelector(state => state.search);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({});
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '', name: '' });

  // Find current product - check both regular products and search results
  let product = null;
  
  // First try to find in regular products
  product = products.find(p => {
    return p.id === parseInt(id) || p.id === id || p.product_id === parseInt(id) || p.product_id === id;
  });
  
  // If not found and we have search results, try search results
  if (!product && searchResults?.results) {
    product = searchResults.results.find(p => {
      return p.id === parseInt(id) || p.id === id || p.product_id === parseInt(id) || p.product_id === id;
    });
    
    // If found in search results, normalize the structure
    if (product) {
      product = {
        ...product,
        id: product.product_id || product.id,
        image: product.image_url,
      };
    }
  }

  // Debug logging
  console.log('Product ID from URL:', id, typeof id);
  console.log('Products array length:', products.length);
  console.log('Search results:', searchResults?.results?.length || 0);
  console.log('Found product:', product);

  // Helper function to format price in Indian locale
  const formatIndianPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(price));
  };

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (product) {
      // Set default selected variant
      if (product.variants && product.variants.length > 0) {
        const defaultVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
        setSelectedVariant(defaultVariant);
      }

      // Fetch similar products based on category
      const similar = products
        .filter(p => p.id !== product.id && p.category === product.category)
        .slice(0, 8);
      setSimilarProducts(similar);

      // Generate mock reviews for the product
      const mockReviews = generateMockReviews(product.id);
      setReviews(mockReviews);
      
      // Calculate review statistics
      const stats = calculateReviewStats(mockReviews);
      setReviewStats(stats);
    }
  }, [product, products]);

  if (loading || products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <BrandedLoader size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Product Not Found</h2>
          <Button 
            type="primary" 
            onClick={() => history.push('/products')}
            className="bg-slate-800"
          >
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const currentPrice = selectedVariant?.effective_price || product.base_price;
  const currentDiscount = selectedVariant?.discount_percentage || 0;
  const originalPrice = selectedVariant?.original_price || product.base_price;

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  // Helper function to check if specific variant is in cart
  const isVariantInCart = (productId, variant) => {
    if (!variant || !cartItems) return false;
    const variantId = variant.id || variant.variant_id || variant.size;
    const cartItemId = variantId ? `${productId}-${variantId}` : productId;
    return cartItems.some(item => item.cartItemId === cartItemId);
  };

  // Helper function to check if any variant of product is in cart
  const hasAnyVariantInCart = (productId) => {
    return cartItems?.some(item => 
      (item.originalId === productId || item.id === productId)
    ) || false;
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ 
      id: product.id, 
      variant: selectedVariant,
      quantity 
    }));
    message.success('Added to cart!');
  };

  const handleWishlistToggle = () => {
    if (product.wishListed) {
      dispatch(removeFromWishlist({ id: product.id }));
      message.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product));
      message.success('Added to wishlist');
    }
  };

  const handleSimilarProductClick = (productId) => {
    history.push(`/product/${productId}`);
  };

  // Generate mock reviews based on product ID
  const generateMockReviews = (productId) => {
    const reviewTemplates = [
      {
        name: "Priya Sharma",
        rating: 5,
        title: "Excellent quality!",
        comment: "Amazing fabric quality and perfect fit. Highly recommended!",
        verified: true,
        helpful: 12,
        date: "2024-10-10"
      },
      {
        name: "Rajesh Kumar",
        rating: 4,
        title: "Good value for money",
        comment: "Nice product, good material. Delivery was fast. Worth buying.",
        verified: true,
        helpful: 8,
        date: "2024-10-08"
      },
      {
        name: "Anita Desai",
        rating: 5,
        title: "Perfect size and comfort",
        comment: "Fits perfectly and very comfortable to wear. Great purchase!",
        verified: false,
        helpful: 15,
        date: "2024-10-05"
      },
      {
        name: "Vikram Singh",
        rating: 3,
        title: "Average product",
        comment: "It's okay, not exceptional but decent for the price.",
        verified: true,
        helpful: 3,
        date: "2024-10-02"
      },
      {
        name: "Meera Patel",
        rating: 5,
        title: "Love it!",
        comment: "Beautiful design and excellent quality. Will order again!",
        verified: true,
        helpful: 20,
        date: "2024-09-28"
      }
    ];

    // Use product ID to generate consistent reviews
    const numReviews = 3 + (productId % 3); // 3-5 reviews per product
    return reviewTemplates.slice(0, numReviews).map((review, index) => ({
      ...review,
      id: `${productId}-${index}`,
      avatar: `https://i.pravatar.cc/40?img=${(productId + index) % 50}`
    }));
  };

  // Calculate review statistics
  const calculateReviewStats = (reviewsArray) => {
    if (!reviewsArray.length) return { average: 0, total: 0, distribution: {} };

    const total = reviewsArray.length;
    const sum = reviewsArray.reduce((acc, review) => acc + review.rating, 0);
    const average = (sum / total).toFixed(1);

    // Calculate rating distribution
    const distribution = {};
    for (let i = 1; i <= 5; i++) {
      const count = reviewsArray.filter(r => r.rating === i).length;
      distribution[i] = {
        count,
        percentage: Math.round((count / total) * 100)
      };
    }

    return { average: parseFloat(average), total, distribution };
  };

  // Handle review submission
  const handleSubmitReview = () => {
    if (!newReview.title || !newReview.comment || !newReview.name) {
      message.error('Please fill in all fields');
      return;
    }

    const review = {
      ...newReview,
      id: `${product.id}-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      verified: false,
      helpful: 0,
      avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 50)}`
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    setReviewStats(calculateReviewStats(updatedReviews));
    setShowReviewForm(false);
    setNewReview({ rating: 5, title: '', comment: '', name: '' });
    message.success('Review submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item onClick={() => history.push('/')}>Home</Breadcrumb.Item>
          <Breadcrumb.Item onClick={() => history.push('/products')}>Products</Breadcrumb.Item>
          <Breadcrumb.Item>{product.category}</Breadcrumb.Item>
          <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Back Button */}
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => history.goBack()}
          className="mb-6"
        >
          Back
        </Button>

        <Row gutter={[32, 32]}>
          {/* Product Images */}
          <Col xs={24} md={12}>
            <Card className="border-0 shadow-lg">
              <div className="product-images">
                <ImageWithLoader
                  src={product.image_url || product.image || `/images/${product.id}.svg`}
                  alt={product.name}
                  className="w-full h-96 md:h-[500px] object-cover rounded-lg mb-4"
                />
              </div>
            </Card>
          </Col>

          {/* Product Info */}
          <Col xs={24} md={12}>
            <div className="product-info">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <Rate disabled value={reviewStats.average || 4} className="text-sm" />
                <span className="ml-2 text-gray-600">
                  {reviewStats.average || 4} out of 5 ({reviewStats.total || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{formatIndianPrice(currentPrice)}
                  </span>
                  {currentDiscount > 0 && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{formatIndianPrice(originalPrice)}
                      </span>
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                        {currentDiscount}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-green-600">Inclusive of all taxes</p>
              </div>

              {/* Size Selection */}
              {product.variants && product.variants.length > 1 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Select Size:</h3>
                    {selectedVariant && (
                      <div className="text-sm text-gray-600">
                        Selected: <span className="font-semibold text-slate-800">{selectedVariant.size}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant, idx) => {
                      const isSelected = selectedVariant?.size === variant.size;
                      const isOutOfStock = variant.stock === 0;
                      
                      return (
                        <Button
                          key={variant.size || idx}
                          onClick={() => !isOutOfStock && handleVariantSelect(variant)}
                          disabled={isOutOfStock}
                          style={{
                            height: '48px',
                            padding: '0 16px',
                            border: isSelected 
                              ? '2px solid #1e293b' 
                              : isOutOfStock 
                                ? '2px solid #e5e7eb'
                                : '2px solid #d1d5db',
                            backgroundColor: isSelected 
                              ? '#1e293b' 
                              : isOutOfStock 
                                ? '#f3f4f6'
                                : '#ffffff',
                            color: isSelected 
                              ? '#ffffff' 
                              : isOutOfStock 
                                ? '#9ca3af'
                                : '#374151',
                            transition: 'all 0.2s ease'
                          }}
                          className={`transition-all duration-200 ${isOutOfStock ? 'cursor-not-allowed' : 'hover:border-slate-600'}`}
                        >
                          {variant.size}
                          {isOutOfStock && <span className="block text-xs">Out of Stock</span>}
                        </Button>
                      );
                    })}
                  </div>
                  {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                    <p className="text-orange-600 text-sm mt-2">
                      Only {selectedVariant.stock} left in stock!
                    </p>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Quantity:</h3>
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 border rounded text-lg">{quantity}</span>
                  <Button 
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={selectedVariant && quantity >= selectedVariant.stock}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-6">
                {selectedVariant && isVariantInCart(product.id, selectedVariant) ? (
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => history.push('/cart')}
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                  >
                    GO TO CART
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    disabled={selectedVariant && selectedVariant.stock === 0}
                    className="flex-1 h-12 bg-slate-800 hover:bg-slate-700"
                  >
                    ADD TO CART
                  </Button>
                )}
                <Button
                  size="large"
                  icon={product.wishListed ? <HeartFilled /> : <HeartOutlined />}
                  onClick={handleWishlistToggle}
                  className={`h-12 ${product.wishListed ? 'text-red-500 border-red-500' : ''}`}
                >
                  {product.wishListed ? 'WISHLISTED' : 'WISHLIST'}
                </Button>
              </div>

              {/* Product Details */}
              <Divider />
              <div className="product-details">
                <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-medium">Category:</span> {product.category}</p>
                  <p><span className="font-medium">Material:</span> Premium Cotton Blend</p>
                  <p><span className="font-medium">Care:</span> Machine Wash Cold</p>
                  <p><span className="font-medium">Fit:</span> Regular Fit</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <Divider />
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
            <Row gutter={[16, 16]}>
              {similarProducts.map((similarProduct) => (
                <Col key={similarProduct.id} xs={12} sm={8} md={6} lg={4}>
                  <Card
                    hoverable
                    onClick={() => handleSimilarProductClick(similarProduct.id)}
                    className="cursor-pointer"
                    cover={
                      <ImageWithLoader
                        src={similarProduct.image_url || similarProduct.image || `/images/${similarProduct.id}.svg`}
                        alt={similarProduct.name}
                        className="h-48 object-cover"
                      />
                    }
                  >
                    <Card.Meta
                      title={
                        <div className="text-sm font-medium line-clamp-2">
                          {similarProduct.name}
                        </div>
                      }
                      description={
                        <div className="text-sm">
                          <span className="font-bold text-gray-900">
                            ₹{formatIndianPrice(similarProduct.base_price)}
                          </span>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Customer Reviews Section */}
        <div className="mt-12">
          <Divider />
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={8}>
              {/* Review Summary */}
              <Card className="h-fit">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
                  <div className="flex items-center justify-center mb-2">
                    <Rate disabled value={reviewStats.average} className="text-lg" />
                    <span className="ml-2 text-xl font-semibold">{reviewStats.average}</span>
                  </div>
                  <p className="text-gray-600">{reviewStats.total} global ratings</p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-3">
                      <span className="text-sm w-8">{rating} ★</span>
                      <Progress
                        percent={reviewStats.distribution?.[rating]?.percentage || 0}
                        showInfo={false}
                        strokeColor="#faad14"
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 w-8">
                        {reviewStats.distribution?.[rating]?.percentage || 0}%
                      </span>
                    </div>
                  ))}
                </div>

                <Divider />
                
                {/* Write Review Button */}
                <Button
                  type="primary"
                  block
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-slate-800 hover:bg-slate-700"
                >
                  Write a Customer Review
                </Button>
              </Card>
            </Col>

            <Col xs={24} lg={16}>
              {/* Review Form */}
              {showReviewForm && (
                <Card className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                  <Form layout="vertical">
                    <Form.Item label="Your Name">
                      <Input
                        value={newReview.name}
                        onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                        placeholder="Enter your name"
                      />
                    </Form.Item>
                    
                    <Form.Item label="Overall Rating">
                      <Rate
                        value={newReview.rating}
                        onChange={(rating) => setNewReview({...newReview, rating})}
                      />
                    </Form.Item>
                    
                    <Form.Item label="Review Title">
                      <Input
                        value={newReview.title}
                        onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                        placeholder="Add a headline"
                      />
                    </Form.Item>
                    
                    <Form.Item label="Written Review">
                      <TextArea
                        rows={4}
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        placeholder="What did you like or dislike? What did you use this product for?"
                      />
                    </Form.Item>
                    
                    <div className="flex space-x-3">
                      <Button type="primary" onClick={handleSubmitReview} className="bg-slate-800">
                        Submit Review
                      </Button>
                      <Button onClick={() => setShowReviewForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Card>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="shadow-sm">
                    <div className="flex items-start space-x-3">
                      <Avatar src={review.avatar} icon={<UserOutlined />} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{review.name}</h4>
                          {review.verified && (
                            <Tag color="green" icon={<CheckCircleOutlined />} className="text-xs">
                              Verified Purchase
                            </Tag>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <Rate disabled value={review.rating} className="text-sm" />
                          <span className="font-medium">{review.title}</span>
                        </div>
                        
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Reviewed on {new Date(review.date).toLocaleDateString()}</span>
                          <div className="flex items-center space-x-4">
                            <span>Was this helpful?</span>
                            <Button size="small" icon={<LikeOutlined />}>
                              Yes ({review.helpful})
                            </Button>
                            <Button size="small" icon={<DislikeOutlined />}>
                              No
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;