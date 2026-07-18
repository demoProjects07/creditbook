"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { search } from "@/services/search.service";

export default function Header() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<any>({
    customers: [],
    bills: [],
    payments: [],
  });
  const searchRef = useRef<HTMLDivElement>(null);

  function handleSearch(value: string) {
    setQuery(value);
  }

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(query);
  }, 300);

  return () => clearTimeout(timer);
}, [query]);

useEffect(() => {
  async function loadSearch() {
    if (!debouncedQuery.trim()) {
      setResults({
        customers: [],
        bills: [],
        payments: [],
      });

      return;
    }

    try {
      const data = await search(debouncedQuery);
      setResults(data);
    } catch (error) {
      console.error(error);
    }
  }

  loadSearch();
}, [debouncedQuery]);

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setResults({
        customers: [],
        bills: [],
        payments: [],
      });
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Left Side */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          CreditBook
        </h1>
      </div>

      {/* Search */}
      <div
        ref={searchRef}
        className="relative w-96"
      >

        <input
          type="text"
          placeholder="Search customers, bills, payments..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {(results.customers.length > 0 ||
          results.bills.length > 0 ||
          results.payments.length > 0) && (

          <div className="absolute left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border bg-white shadow-xl">

            {/* Customers */}

            {results.customers.length > 0 && (
              <>
                <div className="bg-gray-100 px-4 py-2 text-xs font-bold uppercase text-gray-500">
                  Customers
                </div>

                {results.customers.map((customer: any) => (
                  <Link
                    key={customer.id}
                    href={`/customers/${customer.id}`}
                    onClick={() => {
                      setQuery("");
                      setResults({
                        customers: [],
                        bills: [],
                        payments: [],
                      });
                    }}
                  >
                    <div className="cursor-pointer border-b px-4 py-3 hover:bg-gray-50">
                      <p className="font-semibold">
                        👤 {customer.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {customer.mobile}
                      </p>
                    </div>
                  </Link>
                ))}
              </>
            )}

            {/* Bills */}

            {results.bills.length > 0 && (
              <>
                <div className="bg-gray-100 px-4 py-2 text-xs font-bold uppercase text-gray-500">
                  Bills
                </div>

                {results.bills.map((bill: any) => (
                  <div
                    key={bill.id}
                    className="border-b px-4 py-3"
                  >
                    <p className="font-semibold">
                      ₹{bill.amount.toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-500">
                      {bill.customer.name}
                    </p>

                    <p className="text-sm">
                      {bill.note}
                    </p>
                  </div>
                ))}
              </>
            )}

            {/* Payments */}

            {results.payments.length > 0 && (
              <>
                <div className="bg-gray-100 px-4 py-2 text-xs font-bold uppercase text-gray-500">
                  Payments
                </div>

                {results.payments.map((payment: any) => (
                  <div
                    key={payment.id}
                    className="border-b px-4 py-3"
                  >
                    <p className="font-semibold text-green-600">
                      ₹{payment.amount.toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-500">
                      {payment.customer.name}
                    </p>

                    <p className="text-sm">
                      {payment.note}
                    </p>
                  </div>
                ))}
              </>
            )}

          </div>

        )}

      </div>

      {/* Right Side */}
      <div className="font-medium text-gray-700">
        Admin
      </div>
    </header>
  );
}