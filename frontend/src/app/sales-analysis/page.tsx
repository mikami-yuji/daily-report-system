'use client';

import { useEffect, useState, useMemo } from 'react';
import { getAllSales, SalesData } from '@/lib/api';
import SalesTable from '@/components/sales/SalesTable';
import { Search, RotateCcw } from 'lucide-react';

export default function SalesAnalysisPage() {
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Sort State
    const [sortField, setSortField] = useState<keyof SalesData>('sales_amount');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await getAllSales();
        setSalesData(data);
        setLoading(false);
    };

    const handleSort = (field: keyof SalesData) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc'); // Default to descending for new field (useful for numbers)
        }
    };

    const filteredAndSortedData = useMemo(() => {
        if (!Array.isArray(salesData)) return [];
        let result = [...salesData];

        // Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(item =>
                (item.customer_name && item.customer_name.toLowerCase().includes(term)) ||
                (item.customer_code && item.customer_code.toLowerCase().includes(term))
            );
        }

        // Sort
        result.sort((a, b) => {
            const valA = a[sortField];
            const valB = b[sortField];

            // Handle null/undefined (always put at bottom)
            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        // Add visual ranking after sort? No, keep original ranking intact.
        // Or if sorted by something else, the "rank" column stays fixed? Column stays fixed.

        return result;
    }, [salesData, searchTerm, sortField, sortDirection]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-sf-border mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-sf-text">売上分析</h1>
                    <p className="text-sm text-sf-text-weak mt-1">
                        全得意先の売上・粗利・前年比を分析します。
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadData}
                        className="p-2 text-sf-light-blue hover:bg-blue-50 rounded-full transition-colors"
                        title="データを更新"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-lg border border-sf-border shadow-sm flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="得意先名、またはコードで検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-sf-border rounded focus:outline-none focus:ring-2 focus:ring-sf-light-blue/20 transition-all"
                    />
                </div>
                <div className="text-sm text-gray-500">
                    {filteredAndSortedData.length} 件 表示中
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-20 text-gray-400">
                    データを読み込み中...
                </div>
            ) : (
                <SalesTable
                    data={filteredAndSortedData}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                />
            )}
        </div>
    );
}
