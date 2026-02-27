import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clean up existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.providerProfile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany({ where: { role: 'PROVIDER' } }); 

  // 2. Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Burger' } }),
    prisma.category.create({ data: { name: 'Pizza' } }),
    prisma.category.create({ data: { name: 'Asian' } }),
    prisma.category.create({ data: { name: 'Dessert' } }),
    prisma.category.create({ data: { name: 'Healthy' } }),
    prisma.category.create({ data: { name: 'Snack' } }),
    prisma.category.create({ data: { name: 'Biriyani' } }),
    prisma.category.create({ data: { name: 'Chicken' } }),
    prisma.category.create({data:  { name: 'Fuchka'}}),
  ]);

  console.log('✅ Categories created');

  // 3. Create 8 Providers (Restaurants)
  const password = await bcrypt.hash('password123', 10);
  
  const providerData = [
    { name: "Best Burger", cuisine: ["American", "Snacks"], img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80", rating: 4.8 },
    { name: "Yum Pizza", cuisine: ["Italian", "Snacks"], img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80", rating: 4.5 },
    { name: "Sakura Cuisine", cuisine: ["Japanese", "Healthy","Snacks"], img: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&q=80", rating: 4.9 },
    { name: "Green Bowl", cuisine: ["Healthy"], img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80", rating: 4.7 },
    { name: "Mama Bari", cuisine: ["Indian", "Bangladeshi"], img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80", rating: 4.6 },
    { name: "Sweet Bakery", cuisine: ["Desserts","Healthy"], img: "https://images.unsplash.com/photo-1551024506-0cb4a1cb48f6?w=500&q=80", rating: 4.8 },
    { name: "Fresh Melt", cuisine: ["Desserts","Healthy"], img: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&q=80", rating: 4.4 },
    { name: "Biriyani House", cuisine: ["Indian", "Bangladeshi"], img: "https://images.unsplash.com/photo-1604908176997-431c8b90b5d1?w=500&q=80", rating: 4.9 },
    { name: "Korean kitchen", cuisine: ["Korean"], img: "https://images.unsplash.com/photo-1604908177522-040a4f8c8e0f?w=500&q=80", rating: 4.6 },
    { name: "Crunchy Corner", cuisine: ["Bangladeshi", "Snacks", "Indian"], img: "https://images.unsplash.com/photo-1598514982841-0a9f7e1f3c2a?w=500&q=80", rating: 4.5 },
    { name: "Pasta Pal", cuisine: ["Italian"], img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80", rating: 4.7 }
  ];

  const providers = [];

  for (const pd of providerData) {
    const email = `${pd.name.replace(/\s/g, '').toLowerCase()}@foodhub.com`;
    
    // Create User
    const user = await prisma.user.create({
      data: {
        name: pd.name,
        email,
        password,
        role: 'PROVIDER',
      }
    });

    // Create Profile
    const profile = await prisma.providerProfile.create({
      data: {
        userId: user.id,
        restaurantName: pd.name,
        cuisines: pd.cuisine,
        imageUrl: pd.img,
        rating: pd.rating,
        address: "Dhaka",
      }
    });
    
    providers.push(profile);
  }

  console.log('Providers created successfully');

  // 4. Create Meals
  const mealData = [
  { name: "Classic Cheeseburger", price: 420, cat: 0, prov: 0, diet: "Non-Veg", desc: "Juicy beef patty with cheddar cheese." },
  { name: "Double Bacon BBQ", price: 550, cat: 0, prov: 0, diet: "Non-Veg", desc: "Double patty with crispy bacon." },
  { name: "Spicy Chicken Burger", price: 380, cat: 0, prov: 6, diet: "Halal", desc: "Crispy chicken with spicy mayo." },
  { name: "Pepperoni Feast", price: 650, cat: 1, prov: 1, diet: "Non-Veg", desc: "Loaded with double pepperoni." },
  { name: "Margherita Supreme", price: 580, cat: 1, prov: 1, diet: "Vegetarian", desc: "Fresh basil, mozzarella, and tomato sauce." },
  { name: "BBQ Chicken Pizza", price: 680, cat: 1, prov: 10, diet: "Halal", desc: "Tangy BBQ sauce with grilled chicken." },
  { name: "Salmon Sushi Roll", price: 620, cat: 2, prov: 2, diet: "Pescatarian", desc: "Fresh salmon avocado roll." },
  { name: "Spicy Ramen", price: 400, cat: 2, prov: 2, diet: "Non-Veg", desc: "Hot broth with noodles and egg." },
  { name: "Pad Thai", price: 450, cat: 2, prov: 8, diet: "Vegetarian Options", desc: "Classic Thai stir-fried noodles." },
  { name: "Chicken Tikka Masala", price: 500, cat: 2, prov: 4, diet: "Halal", desc: "Creamy curry with tender chicken." },
  { name: "Quinoa Salad Bowl", price: 350, cat: 4, prov: 3, diet: "Vegan", desc: "Healthy quinoa with fresh veggies." },
  { name: "Avocado Toast", price: 300, cat: 4, prov: 3, diet: "Vegan", desc: "Sourdough bread with smashed avocado." },
  { name: "Grilled Chicken Salad", price: 380, cat: 4, prov: 3, diet: "High Protein", desc: "Low carb option with vinaigrette." },
  { name: "Chocolate Lava Cake", price: 280, cat: 3, prov: 5, diet: "Vegetarian", desc: "Warm cake with molten chocolate center." },
  { name: "Strawberry Cheesecake", price: 240, cat: 3, prov: 5, diet: "Vegetarian", desc: "Classic New York style cheesecake." },
  { name: "Tiramisu", price: 300, cat: 3, prov: 10, diet: "Vegetarian", desc: "Italian coffee-flavoured dessert." },
  { name: "Fish Tacos", price: 430, cat: 5, prov: 9, diet: "Pescatarian", desc: "Fresh fish tacos with salsa." },
  { name: "Veggie Wrap", price: 320, cat: 4, prov: 3, diet: "Vegan", desc: "Spinach wrap with hummus." },
  { name: "Beef Lasagna", price: 600, cat: 1, prov: 10, diet: "Non-Veg", desc: "Layered pasta with meat sauce." },
  { name: "Miso Soup", price: 180, cat: 2, prov: 2, diet: "Vegan Options", desc: "Traditional Japanese soup." },
 ];

  for (const m of mealData) {
    await prisma.meal.create({
      data: {
        name: m.name,
        description: m.desc,
        price: m.price,
        imageUrl: "https://placehold.co/600x400?text=" + m.name.replace(/ /g, '+'), // Placeholder Text Image
        dietaryPref: m.diet,
        categoryId: categories[m.cat].id,
        providerId: providers[m.prov].id,
      }
    });
  }

  console.log('Meals created successfully');
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});