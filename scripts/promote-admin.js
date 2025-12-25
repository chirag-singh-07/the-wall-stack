
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const email = 'admin@thewallstack.com' // Change this to your desired admin email
  const name = 'Manish Saroj'
  const image = 'https://example.com/image.jpg'
  
  // You might want to ask user for input or just hardcode for their local env
  // Since I can't interact, I'll provide a hardcoded one and tell them to edit or I'll specificy instructions.
  // The user asked "how i create". I'll give them a script and instructions.
  
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    })
    console.log(`User ${email} updated to ADMIN role.`);
    console.log(updatedUser);
  } else {
    // Note: Creating a user here won't have a password if using OAuth or passwordless in better-auth without specific setup.
    // However, if using credential auth, we'd need to hash password.
    // Given the stack, it's safer to ask them to SIGN UP first, then run this script to promote themselves.
    // But I will provide a script that promotes a user by email.
    
    console.log(`User ${email} not found. Please sign up first via the app, then run this script to promote the user to ADMIN.`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {  
    await prisma.$disconnect()
  })
