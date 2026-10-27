import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

// Load .env from server directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tatva_nutrition';

export const initialProducts = [
  {
    name: 'TATVA Whey Isolate Protein Powder',
    slug: 'whey-isolate-chocolate',
    description:
      'A premium chocolate-flavoured whey isolate concept for customers shopping for sports nutrition. Pure micro-filtered isolate delivering clean post-workout muscle recovery with minimal carbs and fats.',
    category: 'Protein',
    price: 2499,
    compareAtPrice: 2999,
    image: '/images/tatva-whey-isolate.png',
    images: [
      '/images/tatva-whey-isolate.png',
      '/images/Tatva Chocolate Whey Isolate Showcase.png',
      '/images/tatva-whey-isolate.svg',
    ],
    flavor: 'Chocolate',
    packSize: '1 kg',
    stockQuantity: 45,
    sku: 'TATVA-WHEY-CHOC-1KG',
    featured: true,
    active: true,
    attributes: {
      form: 'Powder',
      proteinPerServing: '27g (Sample)',
      servings: '33',
      dietType: 'Vegetarian',
    },
    sampleNutrition: {
      servingSize: 'Sample: 30g',
      protein: 'Sample: 27g',
      carbs: 'Sample: 1.2g',
      fats: 'Sample: 0.5g',
      calories: 'Sample: 118 kcal',
      disclaimer:
        'Demonstration data for academic evaluation only. Not verified nutritional facts.',
    },
    rating: 4.8,
    numReviews: 24,
  },
  {
    name: 'TATVA Micronized Creatine',
    slug: 'micronized-creatine',
    description:
      'A creatine monohydrate product concept for strength-training customers. Ultra-micronized 200-mesh powder engineered for instant water solubility and explosive power support during heavy lifting.',
    category: 'Performance',
    price: 699,
    compareAtPrice: 899,
    image: '/images/tatva-micronized-creatine.png',
    images: [
      '/images/tatva-micronized-creatine.png',
      '/images/Premium Creatine in a Natural Gym Setting.png',
      '/images/tatva-micronized-creatine.svg',
    ],
    flavor: 'Unflavored',
    packSize: '250 g',
    stockQuantity: 60,
    sku: 'TATVA-CREAT-UNFL-250G',
    featured: true,
    active: true,
    attributes: {
      form: 'Micronized Powder',
      servings: '83',
      dietType: 'Vegan',
    },
    sampleNutrition: {
      servingSize: 'Sample: 3g',
      protein: 'Sample: 0g',
      carbs: 'Sample: 0g',
      fats: 'Sample: 0g',
      calories: 'Sample: 0 kcal',
      disclaimer:
        'Demonstration data for academic evaluation only. Not verified nutritional facts.',
    },
    rating: 4.9,
    numReviews: 38,
  },
  {
    name: 'TATVA Peanut Butter',
    slug: 'peanut-butter-creamy',
    description:
      'A creamy peanut butter product concept for everyday nutrition and snack preparation. Slow-roasted premium quality peanuts with zero palm oil, zero hydrogenated fats, and no refined sugars.',
    category: 'Nutrition',
    price: 399,
    compareAtPrice: 499,
    image: '/images/tatva-peanut-butter.png',
    images: [
      '/images/tatva-peanut-butter.png',
      '/images/Premium Creamy Peanut Butter Product Shot.png',
      '/images/tatva-peanut-butter.svg',
    ],
    flavor: 'Creamy Original',
    packSize: '1 kg',
    stockQuantity: 40,
    sku: 'TATVA-PB-CRM-1KG',
    featured: false,
    active: true,
    attributes: {
      form: 'Spread',
      dietType: 'Vegan',
      proteinPerServing: '10g (Sample)',
    },
    sampleNutrition: {
      servingSize: 'Sample: 32g',
      protein: 'Sample: 10g',
      carbs: 'Sample: 6g',
      fats: 'Sample: 16g',
      calories: 'Sample: 190 kcal',
      disclaimer:
        'Demonstration data for academic evaluation only. Not verified nutritional facts.',
    },
    rating: 4.6,
    numReviews: 19,
  },
  {
    name: 'TATVA Protein Shaker Bottle',
    slug: 'protein-shaker',
    description:
      'A reusable shaker bottle concept for mixing drinks and carrying to the gym. Built from food-grade BPA-free plastic featuring a leak-proof flip lock and rounded base for lump-free shakes.',
    category: 'Accessories',
    price: 299,
    compareAtPrice: 399,
    image: '/images/tatva-protein-shaker.png',
    images: [
      '/images/tatva-protein-shaker.png',
      '/images/Premium TATVA Nutrition Shaker Showcase.png',
      '/images/tatva-protein-shaker.svg',
    ],
    flavor: 'Charcoal & Olive Finish',
    packSize: '700 ml',
    stockQuantity: 80,
    sku: 'TATVA-SHAKER-700ML',
    featured: false,
    active: true,
    attributes: {
      material: 'BPA-Free Tritan',
      capacity: '700 ml',
      leakProof: 'Yes',
    },
    sampleNutrition: {
      servingSize: 'N/A',
      protein: 'N/A',
      carbs: 'N/A',
      fats: 'N/A',
      calories: 'N/A',
      disclaimer: 'Gym accessory concept. No nutritional value.',
    },
    rating: 4.7,
    numReviews: 15,
  },
  {
    name: 'TATVA Pre-Workout',
    slug: 'pre-workout-fruit-punch',
    description:
      'A pre-workout supplement concept for customers browsing workout nutrition products. Calibrated blend of beta-alanine, citrulline malate, and organic caffeine to sharpen focus and enhance training intensity.',
    category: 'Performance',
    price: 899,
    compareAtPrice: 1199,
    image: '/images/tatva-pre-workout.png',
    images: [
      '/images/tatva-pre-workout.png',
      '/images/Tatva Lemon Lime Pre-Workout Ad.png',
      '/images/tatva-pre-workout.svg',
    ],
    flavor: 'Lemon Lime / Fruit Punch',
    packSize: '300 g',
    stockQuantity: 35,
    sku: 'TATVA-PRE-FP-300G',
    featured: true,
    active: true,
    attributes: {
      form: 'Powder',
      caffeinePerServing: '200mg (Sample)',
      servings: '30',
      dietType: 'Vegetarian',
    },
    sampleNutrition: {
      servingSize: 'Sample: 10g',
      protein: 'Sample: 0g',
      carbs: 'Sample: 1g',
      fats: 'Sample: 0g',
      calories: 'Sample: 15 kcal',
      disclaimer:
        'Demonstration data for academic evaluation only. Not verified nutritional facts.',
    },
    rating: 4.5,
    numReviews: 22,
  },
  {
    name: 'TATVA Protein Oats',
    slug: 'protein-oats-chocolate-banana',
    description:
      'A chocolate-banana protein oats product concept for breakfast and snack preparation. Whole grain rolled oats enriched with clean whey protein isolate and natural freeze-dried banana crunch.',
    category: 'Nutrition',
    price: 349,
    compareAtPrice: 449,
    image: '/images/tatva-protein-oats.png',
    images: [
      '/images/tatva-protein-oats.png',
      '/images/Tatva Chocolate Banana Protein Oats.png',
      '/images/tatva-protein-oats.svg',
    ],
    flavor: 'Chocolate Banana',
    packSize: '1 kg',
    stockQuantity: 50,
    sku: 'TATVA-OATS-CHOCBAN-1KG',
    featured: false,
    active: true,
    attributes: {
      form: 'Rolled Oats',
      proteinPerServing: '12g (Sample)',
      dietType: 'Vegetarian',
    },
    sampleNutrition: {
      servingSize: 'Sample: 45g',
      protein: 'Sample: 12g',
      carbs: 'Sample: 24g',
      fats: 'Sample: 3g',
      calories: 'Sample: 175 kcal',
      disclaimer:
        'Demonstration data for academic evaluation only. Not verified nutritional facts.',
    },
    rating: 4.7,
    numReviews: 12,
  },
];

export const seedDatabase = async () => {
  try {
    console.log(`[Seed] Connecting to MongoDB: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected successfully to database');

    console.log(`[Seed] Upserting ${initialProducts.length} initial products with assets...`);

    let insertedCount = 0;
    let updatedCount = 0;

    for (const product of initialProducts) {
      const existing = await Product.findOne({ slug: product.slug });
      if (existing) {
        await Product.updateOne({ slug: product.slug }, { $set: product });
        updatedCount++;
        console.log(`  ↻ Updated existing product: ${product.name} (${product.slug})`);
      } else {
        await Product.create(product);
        insertedCount++;
        console.log(`  + Inserted new product: ${product.name} (${product.slug})`);
      }
    }

    console.log(`[Seed] Success! Inserted: ${insertedCount}, Updated: ${updatedCount}`);
    await mongoose.disconnect();
    console.log('[Seed] Disconnected cleanly.');
    return true;
  } catch (error) {
    console.error('[Seed Error] Failed to seed products:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    return false;
  }
};

// If run directly via CLI
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then((success) => {
    process.exit(success ? 0 : 1);
  });
}
