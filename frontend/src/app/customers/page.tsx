'use client';

import { useEffect, useState } from 'react';
import { getReports, Report } from '@/lib/api';
import { useFile } from '@/context/FileContext';
import CustomerFilters from '@/components/customers/CustomerFilters';
import CustomerList from '@/components/customers/CustomerList';
import CustomerStats from '@/components/customers/CustomerStats';
import { CustomerSummary } from '@/components/customers/types';
import { processCustomers } from '@/components/customers/utils';

export default function CustomersPage() {
    const { selectedFile } = useFile();
    const [customers, setCustomers] = useState<CustomerSummary[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<CustomerSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedRank, setSelectedRank] = useState('');
    const [isPriorityOnly, setIsPriorityOnly] = useState(false);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!selectedFile) return;

        setLoading(true);
        getReports(selectedFile).then(data => {
            const processed = processCustomers(data);
            setCustomers(processed);
            setFilteredCustomers(processed);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [selectedFile]);

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    useEffect(() => {
        let result = customers;

        // Filter Logic
        if (searchTerm.trim() || selectedArea || selectedRank || isPriorityOnly) {
            const term = searchTerm.toLowerCase().trim();
            const autoExpandIds = new Set<string>();

            const checkMatch = (c: CustomerSummary) => {
                const nameMatch = c.name.toLowerCase().includes(term);
                const codeMatch = c.code.toLowerCase().includes(term);
                const ddNameMatch = c.directDeliveryName?.toLowerCase().includes(term);
                const ddCodeMatch = c.directDeliveryCode?.toLowerCase().includes(term);

                return nameMatch || codeMatch || ddNameMatch || ddCodeMatch;
            };

            const checkFilters = (c: CustomerSummary) => {
                if (selectedArea && c.area !== selectedArea) return false;
                if (selectedRank && c.rank !== selectedRank) return false;
                if (isPriorityOnly && !c.isPriority) return false;
                return true;
            };

            result = result.map(parent => {
                // Check if parent matches strict filters (Area, Rank, Priority)
                if (!checkFilters(parent)) return null;

                // Check text search
                const parentMatches = term ? checkMatch(parent) : true;

                // Filter subItems
                let filteredSubs = parent.subItems || [];
                if (term) {
                    filteredSubs = filteredSubs.filter(sub => checkMatch(sub));
                }

                // Decision: Show Parent if Parent matches OR any Sub matches
                if (parentMatches || filteredSubs.length > 0) {
                    // If we have search term, and sub matches, expand parent
                    if (term && filteredSubs.length > 0) {
                        autoExpandIds.add(parent.id);
                        if (!parentMatches) {
                            return { ...parent, subItems: filteredSubs };
                        }
                    }
                    if (parentMatches) {
                        return { ...parent };
                    }

                    return { ...parent, subItems: filteredSubs };
                }
                return null;
            }).filter((c): c is CustomerSummary => c !== null);

            if (term) {
                setExpandedRows(autoExpandIds);
            }
        }

        setFilteredCustomers(result);
    }, [searchTerm, selectedArea, selectedRank, isPriorityOnly, customers]);

    // Unique Areas and Ranks for dropdowns
    const areas = Array.from(new Set(customers.map(c => c.area).filter(Boolean))).sort();
    const ranks = Array.from(new Set(customers.map(c => c.rank).filter(Boolean))).sort();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-sf-text">得意先一覧</h1>
            </div>

            {/* 検索・フィルターバー */}
            <CustomerFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedArea={selectedArea}
                setSelectedArea={setSelectedArea}
                selectedRank={selectedRank}
                setSelectedRank={setSelectedRank}
                isPriorityOnly={isPriorityOnly}
                setIsPriorityOnly={setIsPriorityOnly}
                areas={areas}
                ranks={ranks}
            />

            {/* 統計サマリー */}
            <CustomerStats
                customers={customers}
                filteredCustomers={filteredCustomers}
            />

            {/* 得意先一覧テーブル */}
            <div className="bg-white rounded border border-sf-border shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-sf-border bg-gray-50">
                    <h2 className="font-semibold text-sm text-sf-text">得意先一覧</h2>
                </div>

                <CustomerList
                    customers={filteredCustomers}
                    loading={loading}
                    expandedRows={expandedRows}
                    toggleRow={toggleRow}
                />
            </div>
        </div>
    );
}
