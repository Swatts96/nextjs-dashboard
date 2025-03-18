import Image from 'next/image';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Customer</th>
            <th className="border border-gray-300 p-2 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2 flex items-center gap-3">
                <Image
                  src={customer.image_url}
                  className="rounded-full"
                  width={40}
                  height={40}
                  alt={`${customer.name}'s profile picture`}
                />
                <p>{customer.name}</p>
              </td>
              <td className="border border-gray-300 p-2">{customer.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
