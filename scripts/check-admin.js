#!/usr/bin/env node

const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function checkAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@thewallstack.com";
    console.log(`\n🔍 Checking for admin user with email: ${adminEmail}\n`);

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email: adminEmail },
      include: { accounts: true },
    });

    if (!user) {
      console.log(`❌ Admin user NOT found with email: ${adminEmail}\n`);
      console.log("📋 Available users in database:\n");
      
      const allUsers = await db.user.findMany({
        select: { id: true, email: true, name: true, role: true },
        take: 10,
      });

      if (allUsers.length === 0) {
        console.log("   No users found in database\n");
      } else {
        allUsers.forEach((u) => {
          console.log(`   • Email: ${u.email} | Name: ${u.name} | Role: ${u.role}`);
        });
        console.log();
      }

      return;
    }

    console.log(`✅ Admin user FOUND!\n`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Banned: ${user.banned}\n`);

    // Check accounts
    console.log(`📋 Accounts for this user:\n`);
    if (user.accounts.length === 0) {
      console.log("   ❌ NO ACCOUNTS FOUND for this user!\n");
      console.log("   Solution: You need to create an account with providerId: 'email'\n");
    } else {
      user.accounts.forEach((acc) => {
        console.log(`   • Provider: ${acc.providerId}`);
        console.log(`     Account ID: ${acc.id}`);
        console.log(`     Password: ${acc.password ? "✅ Set" : "❌ Not set"}`);
        console.log();
      });
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await db.$disconnect();
  }
}

checkAdmin();
