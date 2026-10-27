import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import ProductGrid from '../components/ProductGrid';
import { LoadingSpinner, ErrorMessage } from '../components/UIFeedback';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Comparison tray state
  const [comparedProducts, setComparedProducts] = useState([]);

  // Filter state synced with searchParams
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const featuredParam = searchParams.get('featured') || '';

  const [searchInput, setSearchInput] = useState(searchParam);
  const [minPriceInput, setMinPriceInput] = useState(minPriceParam);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPriceParam);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        category: categoryParam !== 'All' ? categoryParam : undefined,
        search: searchParam || undefined,
        sort: sortParam,
        minPrice: minPriceParam || undefined,
        maxPrice: maxPriceParam || undefined,
        featured: featuredParam || undefined,
      };

      const res = await api.products.getAll(params);
      if (res.success && res.products) {
        setProducts(res.products);
        setTotalCount(res.total || res.products.length);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch catalogue from server');
    } finally {
      setLoading(false);
    }
  }, [categoryParam, searchParam, sortParam, minPriceParam, maxPriceParam, featuredParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput.trim());
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (minPriceInput) nextParams.set('minPrice', minPriceInput);
    else nextParams.delete('minPrice');

    if (maxPriceInput) nextParams.set('maxPrice', maxPriceInput);
    else nextParams.delete('maxPrice');

    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams(new URLSearchParams());
  };

  const handleCompareToggle = (product) => {
    const exists = comparedProducts.some((p) => p._id === product._id);
    if (exists) {
      setComparedProducts(comparedProducts.filter((p) => p._id !== product._id));
    } else {
      if (comparedProducts.length >= 3) {
        alert('You can compare a maximum of 3 products at a time.');
        return;
      }
      setComparedProducts([...comparedProducts, product]);
    }
  };

  const categories = ['All', 'Protein', 'Performance', 'Nutrition', 'Accessories'];

  return (
    <div className="shop-page container">
      {/* Shop Header */}
      <div className="shop-header">
        <div>
          <span className="section-subheading">TATVA CATALOGUE</span>
          <h1 className="page-title">Sports Nutrition Store</h1>
          <p className="page-subtitle">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'} formulated for athletic purity
          </p>
        </div>

        {/* Sort Select */}
        <div className="shop-sort-wrap">
          <label htmlFor="sortSelect" className="sort-label">Sort by:</label>
          <select
            id="sortSelect"
            value={sortParam}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="select-custom"
          >
            <option value="newest">Featured & Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Product Name (A-Z)</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Product Grid */}
      <div className="shop-layout">
        {/* Left Filter Sidebar */}
        <aside className="shop-sidebar">
          {/* Search box */}
          <div className="sidebar-widget">
            <h4 className="widget-title">Search</h4>
            <form onSubmit={handleSearchSubmit} className="sidebar-search-form">
              <input
                type="text"
                placeholder="Product name or keyword..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input-text"
              />
              <button type="submit" className="btn-secondary btn-sm" style={{ marginTop: '6px' }}>
                Search
              </button>
            </form>
          </div>

          {/* Categories */}
          <div className="sidebar-widget">
            <h4 className="widget-title">Categories</h4>
            <div className="category-pill-list">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => updateFilter('category', cat)}
                  className={`btn-category-filter ${categoryParam === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="sidebar-widget">
            <h4 className="widget-title">Price Range (₹)</h4>
            <form onSubmit={handlePriceApply} className="price-filter-form">
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="input-price"
                  min="0"
                />
                <span>–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="input-price"
                  min="0"
                />
              </div>
              <button type="submit" className="btn-secondary btn-sm" style={{ marginTop: '8px', width: '100%' }}>
                Apply Range
              </button>
            </form>
          </div>

          {/* Featured only checkbox */}
          <div className="sidebar-widget">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={featuredParam === 'true'}
                onChange={(e) => updateFilter('featured', e.target.checked ? 'true' : '')}
              />
              <span>Featured Items Only</span>
            </label>
          </div>

          {/* Reset Filters */}
          {(categoryParam !== 'All' || searchParam || minPriceParam || maxPriceParam || featuredParam) && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="btn-clear-filters"
            >
              ✕ Clear All Filters
            </button>
          )}
        </aside>

        {/* Right Product Grid Area */}
        <main className="shop-main">
          {loading ? (
            <LoadingSpinner message="Fetching TATVA supplements from backend..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchProducts} />
          ) : (
            <ProductGrid
              products={products}
              onCompareToggle={handleCompareToggle}
              comparedIds={comparedProducts.map((p) => p._id)}
              emptyTitle="No products match your criteria"
              emptyDescription="Try selecting a different category or clearing price filters."
            />
          )}
        </main>
      </div>

      {/* Floating Comparison Tray (if items selected) */}
      {comparedProducts.length > 0 && (
        <div className="comparison-tray">
          <div className="comparison-tray-inner">
            <div className="comparison-tray-info">
              <strong>Comparing {comparedProducts.length} of 3 items:</strong>
              <div className="comparison-tray-thumbs">
                {comparedProducts.map((p) => (
                  <span key={p._id} className="tray-pill">
                    {p.name.replace('TATVA ', '')}
                    <button
                      type="button"
                      onClick={() => handleCompareToggle(p)}
                      className="tray-remove-btn"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="comparison-tray-actions">
              <button
                type="button"
                onClick={() => setComparedProducts([])}
                className="btn-outline btn-sm"
              >
                Clear
              </button>
              <Link
                to={`/compare?ids=${comparedProducts.map((p) => p._id).join(',')}`}
                className="btn-primary btn-sm"
              >
                View Comparison Matrix →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
