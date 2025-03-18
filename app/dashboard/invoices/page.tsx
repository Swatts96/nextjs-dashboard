import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import InvoicesTable from '@/app/ui/invoices/table'; // ✅ Updated import
import { CreateInvoice } from '@/app/ui/invoices/buttons'; 
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { fetchInvoicesPages, fetchFilteredInvoices } from '@/app/lib/data';
import { Metadata } from 'next';
import { Suspense } from 'react';



export const metadata: Metadata = {
  title: 'Invoices',
};

// ✅ Server Component
export default async function Page({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const { query = '', page = '1' } = searchParams ?? {};
  const currentPage = Number(page);

  // ✅ Fetch invoices in server component
  const totalPages = await fetchInvoicesPages(query);
  const invoices = await fetchFilteredInvoices(query, currentPage); // ✅ Fetch invoices here

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>

      {/* ✅ Pass invoices as a prop to InvoicesTable */}
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <InvoicesTable invoices={invoices} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
