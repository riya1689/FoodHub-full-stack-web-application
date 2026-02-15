import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clean up existing data (Optional: carefully remove if you want to keep data)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.providerProfile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany({ where: { role: 'PROVIDER' } }); // Keep your Admin/Customer accounts

  // 2. Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Burger' } }),
    prisma.category.create({ data: { name: 'Pizza' } }),
    prisma.category.create({ data: { name: 'Asian' } }),
    prisma.category.create({ data: { name: 'Dessert' } }),
    prisma.category.create({ data: { name: 'Healthy' } }),
  ]);

  console.log('✅ Categories created');

  // 3. Create 8 Providers (Restaurants)
  const password = await bcrypt.hash('password123', 10);
  
  const restaurantNames = [
    "Burger King Dom", "Pizza Hut Local", "Sushi Master", "Green Bowl", 
    "Spicy Curry House", "Sweet Tooth Bakery", "Taco Fiesta", "Pasta Palace"
  ];

  const providers = [];

  for (const name of restaurantNames) {
    const email = `${name.replace(/\s/g, '').toLowerCase()}@foodhub.com`;
    
    // Create User
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: 'PROVIDER',
      }
    });

    // Create Profile
    const profile = await prisma.providerProfile.create({
      data: {
        userId: user.id,
        restaurantName: name,
        cuisine: "Mixed", // Simple default
        address: "123 Food Street, Tech City",
      }
    });
    
    providers.push(profile);
  }

  console.log('✅ 8 Providers created');

  // 4. Create 20 Meals
  const mealData = [
    // Burgers
    { name: "Classic Cheeseburger", price: 12.99, cat: 0, prov: 0, desc: "Juicy beef patty with cheddar cheese." },
    { name: "Double Bacon BBQ", price: 15.99, cat: 0, prov: 0, desc: "Double patty with crispy bacon." },
    { name: "Spicy Chicken Burger", price: 11.50, cat: 0, prov: 6, desc: "Crispy chicken with spicy mayo." },
    
    // Pizza
    { name: "Pepperoni Feast", price: 18.00, cat: 1, prov: 1, desc: "Loaded with double pepperoni." },
    { name: "Margherita Supreme", price: 14.50, cat: 1, prov: 1, desc: "Fresh basil, mozzarella, and tomato sauce." },
    { name: "BBQ Chicken Pizza", price: 19.99, cat: 1, prov: 7, desc: "Tangy BBQ sauce with grilled chicken." },
    
    // Asian
    { name: "Salmon Sushi Roll", price: 16.00, cat: 2, prov: 2, desc: "Fresh salmon avocado roll." },
    { name: "Spicy Ramen", price: 13.50, cat: 2, prov: 2, desc: "Hot broth with noodles and egg." },
    { name: "Pad Thai", price: 14.00, cat: 2, prov: 4, desc: "Classic Thai stir-fried noodles." },
    { name: "Chicken Tikka Masala", price: 15.50, cat: 2, prov: 4, desc: "Creamy curry with tender chicken." },

    // Healthy
    { name: "Quinoa Salad Bowl", price: 10.99, cat: 4, prov: 3, desc: "Healthy quinoa with fresh veggies." },
    { name: "Avocado Toast", price: 8.50, cat: 4, prov: 3, desc: "Sourdough bread with smashed avocado." },
    { name: "Grilled Chicken Salad", price: 12.00, cat: 4, prov: 3, desc: "Low carb option with vinaigrette." },

    // Dessert
    { name: "Chocolate Lava Cake", price: 7.99, cat: 3, prov: 5, desc: "Warm cake with molten chocolate center." },
    { name: "Strawberry Cheesecake", price: 6.50, cat: 3, prov: 5, desc: "Classic New York style cheesecake." },
    { name: "Tiramisu", price: 8.00, cat: 3, prov: 7, desc: "Italian coffee-flavoured dessert." },
    
    // Mix
    { name: "Fish Tacos", price: 11.00, cat: 1, prov: 6, desc: "Fresh fish tacos with salsa." },
    { name: "Veggie Wrap", price: 9.50, cat: 4, prov: 3, desc: "Spinach wrap with hummus." },
    { name: "Beef Lasagna", price: 16.50, cat: 1, prov: 7, desc: "Layered pasta with meat sauce." },
    { name: "Miso Soup", price: 5.00, cat: 2, prov: 2, desc: "Traditional Japanese soup." },
  ];

  for (const m of mealData) {
    await prisma.meal.create({
      data: {
        name: m.name,
        description: m.desc,
        price: m.price,
        imageUrl: "https://placehold.co/600x400?text=" + m.name.replace(/ /g, '+'), // Placeholder Text Image
        categoryId: categories[m.cat].id,
        providerId: providers[m.prov].id,
      }
    });
  }

  console.log('✅ 20 Meals created');
  console.log('🚀 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});