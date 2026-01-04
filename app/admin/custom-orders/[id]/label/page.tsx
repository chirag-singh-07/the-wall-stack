"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCustomPosterById } from "@/actions/user/custom-poster-actions";
import {
  Loader2,
  Printer,
  Scissors,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomPosterLabelPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await getCustomPosterById(id as string);
      if (res.success) {
        setOrder(res.data);
      } else {
        router.push("/admin/custom-orders");
      }
      setIsLoading(false);
    };
    if (id) fetchOrder();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) return null;

  const linkedOrder = order.linkedOrder;

  if (!linkedOrder) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4 p-4 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500" />
        <h1 className="text-xl font-bold">No Shipping Information Available</h1>
        <p className="text-muted-foreground max-w-md">
          This custom poster request has not been linked to a confirmed order
          yet, so we cannot generate a shipping label.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 font-sans text-black">
      {/* Print Controls - Hidden during print */}
      <div className="mb-8 flex items-center justify-between border-b pb-4 print:hidden">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">Packing Label Preview</p>
          <Button
            onClick={() => window.print()}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Label
          </Button>
        </div>
      </div>

      {/* Actual Label Area */}
      <div className="mx-auto max-w-[800px] border-2 border-black p-8 shadow-sm">
        {/* Header */}
        <div className="flex justify-between border-b-4 border-black pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black italic tracking-tighter">
              THE WALL STACK
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Custom Art Division
            </p>
          </div>
          <div className="text-right">
            <div
              className={`px-4 py-2 text-white font-bold text-sm ${
                linkedOrder.paymentStatus === "paid" ||
                linkedOrder.paymentMethod !== "COD"
                  ? "bg-green-600"
                  : "bg-black"
              }`}
            >
              {linkedOrder.paymentStatus === "paid" ||
              linkedOrder.paymentMethod !== "COD"
                ? "PREPAID"
                : "CASH ON DELIVERY"}
            </div>
            <p className="mt-2 text-xs font-mono font-bold">
              ORD-{linkedOrder.id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 py-8 border-b-2 border-dashed border-gray-300 relative">
          {/* TO Section */}
          <div className="space-y-4 pr-8 border-r-2 border-gray-100">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Ship To:
              </span>
              <h2 className="text-2xl font-bold uppercase leading-none">
                {linkedOrder.name}
              </h2>
            </div>
            <div className="space-y-1 text-sm font-medium leading-relaxed">
              <p className="text-lg">{linkedOrder.address}</p>
              <p className="text-lg">
                {linkedOrder.city} - {linkedOrder.postalCode}
              </p>
              <p className="text-lg">{linkedOrder.country}</p>
            </div>
            <div className="pt-4 flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-gray-400">
                Contact:
              </span>
              <span className="text-lg font-bold">+{linkedOrder.phone}</span>
            </div>
          </div>

          {/* FROM Section */}
          <div className="space-y-4 pl-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Return Address:
              </span>
              <h3 className="text-lg font-bold">THE WALL STACK</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Plot No. 42, Design District</p>
              <p>Industrial Area, Phase II</p>
              <p>New Delhi, 110020</p>
              <p className="font-bold text-black mt-2">
                Support: +91 99999 88888
              </p>
            </div>

            {/* Barcode Mockup */}
            <div className="pt-8 pt-4">
              <div className="h-16 w-full flex gap-[2px] items-end">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-black"
                    style={{
                      width: `${Math.random() > 0.5 ? 2 : 4}px`,
                      height: `${40 + Math.random() * 20}px`,
                    }}
                  />
                ))}
              </div>
              <p className="text-[10px] font-mono mt-1 text-center font-bold tracking-[0.5em]">
                *{order.id.toUpperCase()}*
              </p>
            </div>
          </div>
        </div>

        {/* Packing List */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Scissors className="h-4 w-4 text-gray-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Packing List (Keep inside box)
            </span>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="border-b-2 border-black">
              <tr>
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">Size</th>
                <th className="py-2 text-right">Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 font-bold uppercase">
                  Custom Poster "{order.design.text || "Untitled"}"
                </td>
                <td className="py-3 text-center font-mono">
                  {order.design.size}
                </td>
                <td className="py-3 text-right font-bold">x1</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-between rounded-lg bg-gray-50 p-6 border border-gray-200">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Important
            </p>
            <p className="text-xs font-medium max-w-[300px]">
              Handle with care. Do not bend. Custom Art Piece inside.
            </p>
          </div>
          <div className="text-right">
            {linkedOrder.paymentStatus === "paid" ||
            linkedOrder.paymentMethod !== "COD" ? (
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Payment Status
                </p>
                <p className="text-2xl font-black text-green-600">PAID FULL</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Do not collect any cash
                </p>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Total Collectible Amount
                </p>
                <p className="text-3xl font-black">
                  ₹{linkedOrder.total.toLocaleString()}
                </p>
                <p className="text-[10px] font-bold text-red-500 uppercase mt-1">
                  Please verify COD amount before delivery
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mt-10 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">
          Scan to Verify Authenticity • thewallstack.com
        </div>
      </div>

      {/* Print Specific CSS */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            padding: 0 !important;
          }
          .container {
            width: 100% !important;
            max-width: none !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}
