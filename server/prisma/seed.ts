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
    { name: "Yum Pizza", cuisine: ["Italian", "Snacks"], img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80", rating: 4.5 },
    { name: "Sakura Cuisine", cuisine: ["Japanese", "Healthy","Snacks"], img: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&q=80", rating: 4.9 },
    { name: "Green Bowl", cuisine: ["Healthy"], img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80", rating: 4.7 },
    { name: "Mama Bari", cuisine: ["Indian", "Bangladeshi"], img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80", rating: 4.6 },
    { name: "Sweet Bakery", cuisine: ["Desserts","Healthy"], img: "https://images.unsplash.com/photo-1595353611262-ff0489f4969a?w=500&q=80", rating: 4.8 },
    { name: "Fresh Melt", cuisine: ["Desserts","Healthy"], img: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&q=80", rating: 4.4 },
    { name: "Biriyani House", cuisine: ["Indian", "Bangladeshi"], img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80", rating: 4.9 },
    { name: "Korean kitchen", cuisine: ["Korean"], img: "https://plus.unsplash.com/premium_photo-1705406168732-15720b6b097d?w=500&q=80", rating: 4.6 },
    { name: "Crunchy Corner", cuisine: ["Bangladeshi", "Snacks", "Indian"], img: "https://images.unsplash.com/photo-1674669520816-c3c5615dfe51?w=500&q=80", rating: 4.5 },
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
  { name: "Classic Cheeseburger", img: "https://images.unsplash.com/photo-1718912053452-462af446bb8d?w=500&q=80" , price: 420, cat: 0, prov: 0, diet: "Non-Veg", desc: "Juicy beef patty with cheddar cheese." },
  { name: "Double Bacon BBQ", img: "https://plus.unsplash.com/premium_photo-1683619761492-639240d29bb5?w=500&q=80", price: 550, cat: 0, prov: 0, diet: "Non-Veg", desc: "Double patty with crispy bacon." },
  { name: "Spicy Chicken Burger", img: "https://images.unsplash.com/photo-1613160774216-fc2d814368f2?w=500&q=80", price: 380, cat: 0, prov: 6, diet: "Halal", desc: "Crispy chicken with spicy mayo." },
  { name: "Pepperoni Feast", img: "https://images.unsplash.com/photo-1692737580547-b45bb4a02356?w=500&q=80", price: 650, cat: 1, prov: 1, diet: "Non-Veg", desc: "Loaded with double pepperoni." },
  { name: "Margherita Supreme",img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80", price: 580, cat: 1, prov: 1, diet: "Vegetarian", desc: "Fresh basil, mozzarella, and tomato sauce." },
  { name: "BBQ Chicken Pizza",img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80", price: 680, cat: 1, prov: 10, diet: "Halal", desc: "Tangy BBQ sauce with grilled chicken." },
  { name: "Salmon Sushi Roll",img: "https://plus.unsplash.com/premium_photo-1667545168921-34f756495d7b?w=500&q=80", price: 620, cat: 2, prov: 2, diet: "Pescatarian", desc: "Fresh salmon avocado roll." },
  { name: "Spicy Ramen",img: "https://images.unsplash.com/photo-1637024698421-533d83c7b883?w=500&q=80", price: 400, cat: 2, prov: 2, diet: "Non-Veg", desc: "Hot broth with noodles and egg." },
  { name: "Pad Thai", img: "https://images.unsplash.com/photo-1645500498403-970672caf43e?w=500&q=80", price: 450, cat: 2, prov: 8, diet: "Vegetarian Options", desc: "Classic Thai stir-fried noodles." },
  { name: "Chicken Tikka Masala", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80", price: 500, cat: 2, prov: 4, diet: "Halal", desc: "Creamy curry with tender chicken." },
  { name: "Quinoa Salad Bowl", img: "https://images.unsplash.com/photo-1623428186429-e76984bf48ad?w=500&q=80", price: 350, cat: 4, prov: 3, diet: "Vegan", desc: "Healthy quinoa with fresh veggies." },
  { name: "Avocado Toast",img: "https://images.unsplash.com/photo-1687276287139-88f7333c8ca4?w=500&q=80", price: 300, cat: 4, prov: 3, diet: "Vegan", desc: "Sourdough bread with smashed avocado." },
  { name: "Grilled Chicken Salad",img: "https://images.unsplash.com/photo-1580013759032-c96505e24c1f?w=500&q=80", price: 380, cat: 4, prov: 3, diet: "High Protein", desc: "Low carb option with vinaigrette." },
  { name: "Chocolate Lava Cake",img: "https://images.unsplash.com/photo-1673551490812-eaee2e9bf0ef?w=500&q=80", price: 280, cat: 3, prov: 5, diet: "Vegetarian", desc: "Warm cake with molten chocolate center." },
  { name: "Strawberry Cheesecake",img: "https://images.unsplash.com/photo-1553882299-9601a48ebe6a?w=500&q=80", price: 240, cat: 3, prov: 5, diet: "Vegetarian", desc: "Classic New York style cheesecake." },
  { name: "Tiramisu",img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80", price: 300, cat: 3, prov: 10, diet: "Vegetarian", desc: "Italian coffee-flavoured dessert." },
  { name: "Fish Tacos",img: "https://plus.unsplash.com/premium_photo-1681406994499-737a170e9c43?w=500&q=80", price: 430, cat: 5, prov: 9, diet: "Pescatarian", desc: "Fresh fish tacos with salsa." },
  { name: "Veggie Wrap", img: "https://images.unsplash.com/photo-1626776065242-2eced649aa07?w=500&q=80", price: 320, cat: 4, prov: 3, diet: "Vegan", desc: "Spinach wrap with hummus." },
  { name: "Beef Lasagna", img: "https://images.unsplash.com/photo-1709429790175-b02bb1b19207?w=500&q=80", price: 600, cat: 1, prov: 10, diet: "Non-Veg", desc: "Layered pasta with meat sauce." },
  { name: "Miso Soup",img: "https://images.unsplash.com/photo-1680137248903-7af5d51a3350?w=500&q=80", price: 180, cat: 2, prov: 2, diet: "Vegan Options", desc: "Traditional Japanese soup." },
 ];

  for (const m of mealData) {
    await prisma.meal.create({
      data: {
        name: m.name,
        description: m.desc,
        price: m.price,
        imageUrl: m.img, 
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