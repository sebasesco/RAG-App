"use client";

import { FileText, Code } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 py-4 flex justify-center">
      <div className="flex space-x-6 text-gray-500">

        <Link href="https://pdfroom.com/books/option-volatility-and-pricing-advanced-trading-strategies-and-techniques/jndOK0X1dRq" className="flex items-center hover:text-gray-700" target="_blank">
          <FileText className="mr-1" size={18} />
          Source PDF
        </Link>

        <Link href="https://github.com/sebasesco/RAG-App" className="flex items-center hover:text-gray-700" target="_blank">
          <Code className="mr-1" size={18} />
          Project Source Code
        </Link>

      </div>
    </footer>
  );
}