import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Create default point of sale
  const mainStore = await prisma.pointOfSale.create({
    data: {
      name: "Main Store",
      address: "123 Main St, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      status: "active",
    },
  })

  // Create admin user
  const adminPassword = await hash("password", 10)
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
      status: "active",
      pointOfSaleId: mainStore.id,
    },
  })

  // Update point of sale with manager
  await prisma.pointOfSale.update({
    where: {
      id: mainStore.id,
    },
    data: {
      managerId: admin.id,
    },
  })

  // Create system settings
  await prisma.systemSettings.create({
    data: {
      companyName: "My Company",
      taxId: "123456789",
      address: "123 Business St, Suite 100",
      phone: "+1 (555) 123-4567",
      currency: "USD",
      taxRate: 0.05,
    },
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

