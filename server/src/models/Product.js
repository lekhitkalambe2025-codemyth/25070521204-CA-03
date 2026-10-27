import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Protein', 'Performance', 'Nutrition', 'Accessories'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
    compareAtPrice: {
      type: Number,
      default: null,
    },
    image: {
      type: String,
      required: [true, 'Primary product image is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    flavor: {
      type: String,
      default: '',
      trim: true,
    },
    packSize: {
      type: String,
      default: '',
      trim: true,
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 50,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    sampleNutrition: {
      servingSize: { type: String, default: 'Sample: 30g' },
      protein: { type: String, default: 'Sample: 25g' },
      carbs: { type: String, default: 'Sample: 2g' },
      fats: { type: String, default: 'Sample: 1g' },
      calories: { type: String, default: 'Sample: 120 kcal' },
      disclaimer: {
        type: String,
        default: 'Demonstration data for academic evaluation only. Not verified nutritional facts.',
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model('Product', productSchema);
export default Product;
