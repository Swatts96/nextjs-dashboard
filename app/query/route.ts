import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    const data = await sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.created_at DESC
      LIMIT 5;
    `;

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Database query failed", details: error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
