export async function getRecentOrders() {
  return [
    {
      id: 1,
      customer: "John Doe",
      product: "Nike Shoe",
      price: 25000,
      status: "pending",
      date: "Mar 18, 2026",
    },
    {
      id: 2,
      customer: "Aisha Bello",
      product: "Headphones",
      price: 15000,
      status: "completed",
      date: "Mar 17, 2026",
    },
    {
      id: 3,
      customer: 'Abdulganiy Ibrahim',
      product: 'Keyboard',
      price: 14000,
      status: 'failed',
      date: 'Mar 20, 2026'
    },
    {
      id: 4,
      customer: 'Abdulqudus Forex',
      product: 'Iphone 12',
      price: 270000,
      status: 'completed',
      date: 'January 20, 2026'
    }
  ]
}