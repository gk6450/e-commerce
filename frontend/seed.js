// seed.js
//
// Description:
// This script will seed 25 products into your local API at http://localhost:4000/api/products.
// It uses axios to perform HTTP POST requests. Each product includes title, description,
// price (in cents), image_url, variant_options (customized per product), and inventory.
//
// Usage:
//   1. Make sure your API server is running at http://localhost:4000.
//   2. Install axios if you haven’t already: 
//        npm install axios
//   3. Run this script with Node.js:
//        node seed.js

import axios from 'axios';

const products = [
  {
    title: "Apple MacBook Pro 14 Inch",
    description: "Apple MacBook Pro 14 Inch with M1 Pro chip delivers exceptional performance and battery life.",
    price: 199999,
    image_url: "https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/thumbnail.png",
    variant_options: {
      color: ["Space Grey", "Silver"],
      storage: ["512GB", "1TB", "2TB"],
      memory: ["16GB", "32GB"]
    },
    inventory: 50
  },
  {
    title: "Green Oval Earring",
    description: "Elegant Green Oval Earring crafted with high-quality materials, perfect for any occasion.",
    price: 2499,
    image_url: "https://cdn.dummyjson.com/products/images/womens-jewellery/Green%20Oval%20Earring/thumbnail.png",
    variant_options: {
      material: ["Gold", "Silver"],
      size: ["Small", "Medium"]
    },
    inventory: 200
  },
  {
    title: "iPhone X",
    description: "Apple iPhone X with Super Retina display, dual 12MP cameras, and Face ID.",
    price: 89999,
    image_url: "https://cdn.dummyjson.com/products/images/smartphones/iPhone%20X/thumbnail.png",
    variant_options: {
      color: ["Silver", "Space Grey"],
      storage: ["64GB", "256GB"]
    },
    inventory: 80
  },
  {
    title: "iPhone 6",
    description: "Apple iPhone 6 featuring a 4.7-inch Retina HD display and 8MP iSight camera.",
    price: 29999,
    image_url: "https://cdn.dummyjson.com/products/images/smartphones/iPhone%206/thumbnail.png",
    variant_options: {
      color: ["Gold", "Silver", "Space Grey"],
      storage: ["16GB", "64GB", "128GB"]
    },
    inventory: 120
  },
  {
    title: "Rolex Submariner Watch",
    description: "Rolex Submariner with Oystersteel case, unidirectional rotatable bezel, and waterproof design.",
    price: 1399999,
    image_url: "https://cdn.dummyjson.com/products/images/mens-watches/Rolex%20Submariner%20Watch/thumbnail.png",
    variant_options: {
      bezel: ["Black", "Blue"],
      strap: ["Stainless Steel", "Yellow Gold"]
    },
    inventory: 15
  },
  {
    title: "Oppo A57",
    description: "Oppo A57 smartphone with 16MP dual front cameras for stunning selfies and a 16.4cm (6.5) HD+ display.",
    price: 24999,
    image_url: "https://cdn.dummyjson.com/products/images/smartphones/Oppo%20A57/thumbnail.png",
    variant_options: {
      color: ["Gold", "Black", "Rose Gold"],
      storage: ["32GB", "64GB"]
    },
    inventory: 100
  },
  {
    title: "Samsung Galaxy S8",
    description: "Samsung Galaxy S8 with Infinity Display, 12MP rear camera, and IP68 water resistance.",
    price: 49999,
    image_url: "https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S8/thumbnail.png",
    variant_options: {
      color: ["Midnight Black", "Orchid Grey", "Coral Blue"],
      storage: ["64GB"]
    },
    inventory: 90
  },
  {
    title: "Golden Shoes Woman",
    description: "Fashionable Golden Shoes for women featuring a comfortable design and faux leather finish.",
    price: 4999,
    image_url: "https://cdn.dummyjson.com/products/images/womens-shoes/Golden%20Shoes%20Woman/thumbnail.png",
    variant_options: {
      size: ["6", "7", "8", "9", "10"],
      material: ["Faux Leather", "Genuine Leather"]
    },
    inventory: 150
  },
  {
    title: "Green and Black Glasses",
    description: "Stylish Green and Black Glasses with polarized lenses and lightweight frame.",
    price: 3499,
    image_url: "https://cdn.dummyjson.com/products/images/sunglasses/Green%20and%20Black%20Glasses/thumbnail.png",
    variant_options: {
      frame_color: ["Green", "Black"],
      lens: ["Polarized", "Non-polarized"]
    },
    inventory: 180
  },
  {
    title: "TV Studio Camera Pedestal",
    description: "Heavy-duty TV Studio Camera Pedestal with adjustable height and smooth-rolling wheels.",
    price: 49999,
    image_url: "https://cdn.dummyjson.com/products/images/mobile-accessories/TV%20Studio%20Camera%20Pedestal/thumbnail.png",
    variant_options: {
      max_height: ["100cm", "120cm"],
      mount_type: ["Standard 3/8\"", "Quick Release"]
    },
    inventory: 20
  },
  {
    title: "Rolex Datejust",
    description: "Classic Rolex Datejust Watch featuring a fluted bezel, Jubilee bracelet, and date display.",
    price: 1099999,
    image_url: "https://cdn.dummyjson.com/products/images/mens-watches/Rolex%20Datejust/thumbnail.png",
    variant_options: {
      dial_color: ["White", "Black", "Blue"],
      strap: ["Oyster", "Jubilee"]
    },
    inventory: 25
  },
  {
    title: "Realme C35",
    description: "Realme C35 smartphone with 6.6-inch FHD+ display, 50MP AI camera, and 5000mAh battery.",
    price: 14999,
    image_url: "https://cdn.dummyjson.com/products/images/smartphones/Realme%20C35/thumbnail.png",
    variant_options: {
      color: ["Black", "Blue"],
      storage: ["64GB", "128GB"]
    },
    inventory: 200
  },
  {
    title: "Sportbike Motorcycle",
    description: "High-performance Sportbike Motorcycle with aerodynamic design and 600cc engine.",
    price: 749999,
    image_url: "https://cdn.dummyjson.com/products/images/motorcycle/Sportbike%20Motorcycle/thumbnail.png",
    variant_options: {
      color: ["Red", "Black", "Blue"],
      engine_capacity: ["600cc", "1000cc"]
    },
    inventory: 5
  },
  {
    title: "Apple MagSafe Battery Pack",
    description: "MagSafe Battery Pack by Apple, magnetically attaches to iPhone for wireless charging on the go.",
    price: 9999,
    image_url: "https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20MagSafe%20Battery%20Pack/thumbnail.png",
    variant_options: {
      color: ["White", "Black"]
    },
    inventory: 75
  },
  {
    title: "Calvin Klein CK One",
    description: "Calvin Klein CK One unisex fragrance with refreshing citrus notes and amber wood base.",
    price: 4999,
    image_url: "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png",
    variant_options: {
      size: ["50ml", "100ml", "200ml"]
    },
    inventory: 120
  },
  {
    title: "Black Sun Glasses",
    description: "Trendy Black Sun Glasses with UV400 protection and durable acetate frame.",
    price: 2999,
    image_url: "https://cdn.dummyjson.com/products/images/sunglasses/Black%20Sun%20Glasses/thumbnail.png",
    variant_options: {
      frame_color: ["Black", "Brown"],
      lens_type: ["UV400", "Polarized"]
    },
    inventory: 160
  },
  {
    title: "Corset Leather With Skirt",
    description: "Stylish Corset Leather With Skirt combo for women, made from premium leather materials.",
    price: 8999,
    image_url: "https://cdn.dummyjson.com/products/images/womens-dresses/Corset%20Leather%20With%20Skirt/thumbnail.png",
    variant_options: {
      size: ["S", "M", "L", "XL"],
      color: ["Black", "Red"]
    },
    inventory: 70
  },
  {
    title: "Rolex Cellini Moonphase",
    description: "Rolex Cellini Moonphase Watch featuring luxury design, moonphase complication, and alligator strap.",
    price: 1599999,
    image_url: "https://cdn.dummyjson.com/products/images/womens-watches/Rolex%20Cellini%20Moonphase/thumbnail.png",
    variant_options: {
      strap: ["Black Leather", "Brown Leather"],
      dial_color: ["White", "Black"]
    },
    inventory: 10
  },
  {
    title: "New DELL XPS 13 9300 Laptop",
    description: "Dell XPS 13 9300 with UltraSharp display, 10th Gen Intel Core processors, and slim design.",
    price: 1499999,
    image_url: "https://cdn.dummyjson.com/products/images/laptops/New%20DELL%20XPS%2013%209300%20Laptop/thumbnail.png",
    variant_options: {
      color: ["Silver", "White"],
      storage: ["256GB", "512GB", "1TB"],
      memory: ["8GB", "16GB"]
    },
    inventory: 40
  },
  {
    title: "Blue Women's Handbag",
    description: "Chic Blue Women's Handbag with spacious interior and adjustable shoulder strap.",
    price: 4999,
    image_url: "https://cdn.dummyjson.com/products/images/womens-bags/Blue%20Women's%20Handbag/thumbnail.png",
    variant_options: {
      color: ["Blue", "Black", "Red"],
      material: ["Leather", "Faux Leather"]
    },
    inventory: 130
  },
  {
    title: "Prada Women Bag",
    description: "Luxury Prada Women Bag crafted from premium leather with iconic logo detailing.",
    price: 59999,
    image_url: "https://cdn.dummyjson.com/products/images/womens-bags/Prada%20Women%20Bag/thumbnail.png",
    variant_options: {
      color: ["Black", "Pink"],
      size: ["Small", "Medium"]
    },
    inventory: 25
  },
  {
    title: "Nike Air Jordan 1 Red And Black",
    description: "Nike Air Jordan 1 in Red and Black colorway featuring high-top design and Air cushioning.",
    price: 14999,
    image_url: "https://cdn.dummyjson.com/products/images/mens-shoes/Nike%20Air%20Jordan%201%20Red%20And%20Black/thumbnail.png",
    variant_options: {
      size: ["8", "9", "10", "11", "12"],
      colorway: ["Red/Black", "White/Black"]
    },
    inventory: 95
  },
  {
    title: "Puma Future Rider Trainers",
    description: "Puma Future Rider Trainers with cushioned midsole and retro design for everyday comfort.",
    price: 8999,
    image_url: "https://cdn.dummyjson.com/products/images/mens-shoes/Puma%20Future%20Rider%20Trainers/thumbnail.png",
    variant_options: {
      size: ["7", "8", "9", "10", "11"],
      color: ["Blue", "White", "Black"]
    },
    inventory: 110
  },
  {
    title: "Longines Master Collection",
    description: "Longines Master Collection Watch featuring elegant design, automatic movement, and chronograph.",
    price: 149999,
    image_url: "https://cdn.dummyjson.com/products/images/mens-watches/Longines%20Master%20Collection/thumbnail.png",
    variant_options: {
      dial_color: ["Silver", "Blue"],
      strap: ["Leather", "Stainless Steel"]
    },
    inventory: 30
  },
  {
    title: "IWC Ingenieur Automatic Steel",
    description: "IWC Ingenieur Automatic Steel Watch with robust case, anti-magnetic protection, and sleek design.",
    price: 499999,
    image_url: "https://cdn.dummyjson.com/products/images/womens-watches/IWC%20Ingenieur%20Automatic%20Steel/thumbnail.png",
    variant_options: {
      dial_color: ["Silver", "Black"],
      strap: ["Stainless Steel", "Rubber"]
    },
    inventory: 20
  },
  {
    title: "New DELL XPS 13 9300 Laptop",
    description: "Dell XPS 13 9300 with UltraSharp display, 10th Gen Intel Core processors, and slim design.",
    price: 1499999,
    image_url: "https://cdn.dummyjson.com/products/images/laptops/New%20DELL%20XPS%2013%209300%20Laptop/thumbnail.png",
    variant_options: {
      color: ["Silver", "White"],
      storage: ["256GB", "512GB", "1TB"],
      memory: ["8GB", "16GB"]
    },
    inventory: 40
  }
];

async function seed() {
  try {
    for (const product of products) {
      const response = await axios.post('http://localhost:4000/api/products', product);
      console.log(`Created product: ${response.data.title} (ID: ${response.data.id || 'N/A'})`);
    }
    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error seeding products:', error.response ? error.response.data : error.message);
  }
}

seed();
