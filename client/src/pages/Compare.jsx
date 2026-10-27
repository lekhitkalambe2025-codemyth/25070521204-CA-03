import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import PriceDisplay from '../components/PriceDisplay';
import RatingDisplay from '../components/RatingDisplay';
import { LoadingSpinner, EmptyState } from '../components/UIFeedback';

export const Compare = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [comparedProducts, setComparedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load available products for the dropdown selector
  useEffect(() => {
    api.products.getAll({ limit: 50 }).then((res) => {
      if (res.success && res.products) {
        setAllProducts(res.products);
      }
    });
  }, []);

  const loadComparedProducts = useCallback(async () => {
    const idsParam = searchParams.get('ids');
    if (!idsParam) {
      setComparedProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const idList = idsParam.split(',').filter(Boolean);
      const res = await api.products.compare(idList);
      if (res.success && res.products) {
        setComparedProducts(res.products);
      }
    } catch (err) {
      console.warn('Error loading compared products:', err.message);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadComparedProducts();
  }, [loadComparedProducts]);

  const removeProduct = (id) => {
    const nextList = comparedProducts.filter((p) => p._id !== id);
    const nextIds = nextList.map((p) => p._id).join(',');
    const nextParams = new URLSearchParams(searchParams);
    if (nextIds) nextParams.set('ids', nextIds);
    else nextParams.delete('ids');
    setSearchParams(nextParams);
  };

  const addProductToCompare = (productId) => {
    if (!productId) return;
    if (comparedProducts.some((p) => p._id === productId)) return;

    if (comparedProducts.length >= 3) {
      alert('You can compare a maximum of 3 products at a time. Remove one first.');
      return;
    }

    const nextIds = [...comparedProducts.map((p) => p._id), productId].join(',');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('ids', nextIds);
    setSearchParams(nextParams);
  };

  return (
    <div className="compare-page container">
      <div className="page-header flex-between">
        <div>
          <span className="section-subheading">SPECIFICATION COMPARISON</span>
          <h1 className="page-title">Product Comparison</h1>
          <p className="page-subtitle">
            Compare up to 3 TATVA supplements side-by-side to match your athletic goals
          </p>
        </div>

        {/* Add Product Dropdown */}
        {comparedProducts.length < 3 && (
          <div className="compare-add-box">
            <select
              onChange={(e) => {
                addProductToCompare(e.target.value);
                e.target.value = '';
              }}
              className="select-custom"
              defaultValue=""
            >
              <option value="" disabled>
                + Add Product to Compare ({comparedProducts.length}/3)
              </option>
              {allProducts
                .filter((p) => !comparedProducts.some((c) => c._id === p._id))
                .map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.category} — ₹{p.price})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Assembling comparison matrix..." />
      ) : comparedProducts.length === 0 ? (
        <EmptyState
          title="No products selected for comparison"
          description="Select up to three products from the dropdown above or click '+ Compare' on any catalogue card."
          actionText="Browse Catalogue →"
          onAction={() => (window.location.href = '/shop')}
        />
      ) : (
        <div className="compare-matrix-wrap">
          <table className="compare-matrix-table">
            <thead>
              <tr>
                <th className="feature-col">Attribute</th>
                {comparedProducts.map((p) => (
                  <th key={p._id} className="product-col">
                    <div className="compare-th-content">
                      <button
                        type="button"
                        onClick={() => removeProduct(p._id)}
                        className="btn-remove-compare"
                        title="Remove from comparison"
                      >
                        ✕ Remove
                      </button>
                      <img
                        src={p.image || '/images/tatva-whey-isolate.svg'}
                        alt={p.name}
                        className="compare-th-img"
                        onError={(e) => {
                          e.target.src = '/images/tatva-whey-isolate.svg';
                        }}
                      />
                      <h4 className="compare-product-name">
                        <Link to={`/products/${p.slug}`}>{p.name}</Link>
                      </h4>
                      <PriceDisplay price={p.price} compareAtPrice={p.compareAtPrice} size="medium" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Category */}
              <tr>
                <td className="feature-label">Category</td>
                {comparedProducts.map((p) => (
                  <td key={p._id}>
                    <span className="badge-category">{p.category}</span>
                  </td>
                ))}
              </tr>

              {/* Flavor / Variant */}
              <tr>
                <td className="feature-label">Flavor / Variant</td>
                {comparedProducts.map((p) => (
                  <td key={p._id}>
                    <strong>{p.flavor || '—'}</strong>
                  </td>
                ))}
              </tr>

              {/* Pack Size / Capacity */}
              <tr>
                <td className="feature-label">Pack Size / Capacity</td>
                {comparedProducts.map((p) => (
                  <td key={p._id}>
                    <strong>{p.packSize || '—'}</strong>
                  </td>
                ))}
              </tr>

              {/* Stock Availability */}
              <tr>
                <td className="feature-label">Availability</td>
                {comparedProducts.map((p) => (
                  <td key={p._id}>
                    {p.stockQuantity > 0 ? (
                      <span className="badge-stock badge-in">In Stock ({p.stockQuantity})</span>
                    ) : (
                      <span className="badge-stock badge-out">Out of Stock</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Community Rating */}
              <tr>
                <td className="feature-label">Rating</td>
                {comparedProducts.map((p) => (
                  <td key={p._id}>
                    <RatingDisplay rating={p.rating} numReviews={p.numReviews} />
                  </td>
                ))}
              </tr>

              {/* Sample Protein Content */}
              <tr>
                <td className="feature-label">Sample Protein / Serving</td>
                {comparedProducts.map((p) => (
                  <td key={p._id}>
                    {p.sampleNutrition?.protein || p.attributes?.proteinPerServing || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Sample Carbohydrates */}
              <tr>
                <td className="feature-label">Sample Carbohydrates</td>
                {comparedProducts.map((p) => (
                  <td key={p._id}>
                    {p.sampleNutrition?.carbs || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Sample Calories */}
              <tr>
                <td className="feature-label">Sample Calories</td>
                {comparedProducts.map((p) => (
                  <td key={p._id}>
                    {p.sampleNutrition?.calories || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Action Buttons */}
              <tr className="compare-action-row">
                <td className="feature-label">Action</td>
                {comparedProducts.map((p) => (
                  <td key={p._id}>
                    <button
                      type="button"
                      onClick={() => addToCart(p._id, 1)}
                      disabled={p.stockQuantity < 1}
                      className="btn-primary btn-block btn-sm"
                    >
                      {p.stockQuantity < 1 ? 'Sold Out' : 'Add to Cart'}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Compare;
