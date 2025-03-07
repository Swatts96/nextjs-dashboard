import bcryptjs from 'bcryptjs';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';
import { Sql } from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Ensure the UUID extension exists before running transactions
await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

async function seedUsers(tx: Sql) {
  await tx`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  return Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcryptjs.hash(user.password, 10);
      return tx`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );
}

async function seedInvoices(tx: Sql) {
  await tx`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  return Promise.all(
    invoices.map((invoice) =>
      tx`
        INSERT INTO invoices (id, customer_id, amount, status, date)
        VALUES (${invoice.id}, ${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );
}

async function seedCustomers(tx: Sql) {
  await tx`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  return Promise.all(
    customers.map((customer) =>
      tx`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );
}

async function seedRevenue(tx: Sql) {
  await tx`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  return Promise.all(
    revenue.map((rev) =>
      tx`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `
    )
  );
}

export async function GET() {
  try {
    await sql.begin(async (tx) => {
      await seedUsers(tx);
      await seedCustomers(tx);
      await seedInvoices(tx);
      await seedRevenue(tx);
    });

    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Seeding Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
