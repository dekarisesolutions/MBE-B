const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
// Have to manually define products to seed or read from a JSON.
const products = [
    {
        id: "MF-001",
        name: "Heavy Cut Polish 1000",
        category: "Detailing Chemicals",
        description: "Professional grade heavy cut polishing compound for rapid defect removal and scratch correction.",
        image: "/images/heavy_cut_polish_1789980729203.jpg"
    },
    {
        id: "MF-002",
        name: "Dual Action Polisher 15mm",
        category: "Polishers",
        description: "Ergonomic 15mm throw dual action polisher for smooth, hologram-free finishing.",
        image: ""
    },
    {
        id: "MF-003",
        name: "Pro Wash Foam Gun",
        category: "Foam Guns",
        description: "High-pressure foam cannon for thick, clinging foam pre-wash. Adjustable fan and mixture.",
        image: ""
    },
    {
        id: "MF-004",
        name: "Ceramic Prep Spray",
        category: "Detailing Chemicals",
        description: "Panel wipe solution to remove polishing oils prior to applying ceramic coatings or PPF.",
        image: "/images/ceramic_prep_spray_1789980751466.jpg"
    },
    {
        id: "MF-005",
        name: "LED Inspection Light",
        category: "Specialist LED Lighting",
        description: "High CRI inspection lamp for spotting swirl marks, holograms, and paint defects.",
        image: "/images/led_inspection_light_1789980764439.jpg"
    }
];

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/motofence';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await Product.deleteMany({});
    console.log('Cleared existing products');
    await Product.insertMany(products);
    console.log('Seeded database with default products');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
