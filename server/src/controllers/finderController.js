import Product from '../models/Product.js';

/**
 * Smart Product Finder (Rule-Based Recommendation Engine)
 * GET /api/product-finder
 */
export const findSmartProducts = async (req, res, next) => {
  try {
    const { category, maxBudget, dietType, flavor } = req.query;

    const query = { active: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (maxBudget && !isNaN(Number(maxBudget))) {
      query.price = { $lte: Number(maxBudget) };
    }

    const allCandidates = await Product.find(query);

    // Score and generate match reasons based on deterministic rules
    const results = allCandidates.map((product) => {
      const matchReasons = [];
      let score = 10;

      // Category matching
      if (category && category !== 'All' && product.category === category) {
        matchReasons.push(`Matches your targeted category: ${category}`);
        score += 20;
      }

      // Budget matching
      if (maxBudget && product.price <= Number(maxBudget)) {
        const remainingBudget = Number(maxBudget) - product.price;
        matchReasons.push(
          `Comfortably fits your budget (₹${product.price.toLocaleString(
            'en-IN'
          )} vs ₹${Number(maxBudget).toLocaleString('en-IN')}) with ₹${remainingBudget} remaining`
        );
        score += 15;
      }

      // Diet type matching
      const productDiet = product.attributes?.get('dietType') || product.attributes?.dietType;
      if (dietType && dietType !== 'Any') {
        if (
          productDiet &&
          (productDiet.toLowerCase() === dietType.toLowerCase() ||
            (dietType === 'Vegetarian' && productDiet.toLowerCase() === 'vegan'))
        ) {
          matchReasons.push(`Complies with ${dietType} dietary preference`);
          score += 15;
        }
      }

      // Flavor preference matching
      if (flavor && flavor !== 'Any' && product.flavor) {
        if (product.flavor.toLowerCase().includes(flavor.toLowerCase())) {
          matchReasons.push(`Features your selected flavor profile: ${product.flavor}`);
          score += 15;
        }
      }

      // Default baseline reason if no specific filters
      if (matchReasons.length === 0) {
        matchReasons.push(
          `High community rating (${product.rating}/5.0) and top-selling product in ${product.category}`
        );
      }

      return {
        product,
        matchReasons,
        score,
      };
    });

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      totalMatched: results.length,
      disclaimer:
        'Rule-based academic recommendations based on catalogue criteria. Does not constitute medical or clinical dietary advice.',
      recommendations: results,
    });
  } catch (error) {
    next(error);
  }
};
