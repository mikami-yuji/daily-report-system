'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface OfflineReport {
    id: string;
    timestamp: number;
    data: any;
    status: 'pending' | 'syncing' | 'error';
    filename: string;
}

interface OfflineContextType {
    isOnline: boolean;
    offlineReports: OfflineReport[];
    saveOfflineReport: (data: any, filename: string) => void;
    syncReports: () => Promise<void>;
    removeOfflineReport: (id: string) => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: ReactNode }) {
    const [isOnline, setIsOnline] = useState(true);
    const [offlineReports, setOfflineReports] = useState<OfflineReport[]>([]);

    // Initialize state from local storage and event listeners
    useEffect(() => {
        // Load saved reports
        const saved = localStorage.getItem('offlineReports');
        if (saved) {
            try {
                setOfflineReports(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse offline reports', e);
            }
        }

        // Set initial online status
        setIsOnline(navigator.onLine);

        const handleOnline = () => {
            setIsOnline(true);
            toast.success('オンラインに復帰しました。データを同期します。');
            syncReports();
        };

        const handleOffline = () => {
            setIsOnline(false);
            toast('オフラインモードに切り替わりました', { icon: '📡' });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Save to local storage whenever reports change
    useEffect(() => {
        localStorage.setItem('offlineReports', JSON.stringify(offlineReports));
    }, [offlineReports]);

    const saveOfflineReport = (data: any, filename: string) => {
        const newReport: OfflineReport = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            data,
            status: 'pending',
            filename
        };

        setOfflineReports(prev => [...prev, newReport]);
        toast.success('オフラインで保存しました。オンライン時に自動送信されます。');
    };

    const removeOfflineReport = (id: string) => {
        setOfflineReports(prev => prev.filter(r => r.id !== id));
    };

    const syncReports = async () => {
        const pending = offlineReports.filter(r => r.status === 'pending' || r.status === 'error');
        if (pending.length === 0) return;

        const toastId = toast.loading(`${pending.length}件のデータを同期中...`);

        let successCount = 0;
        let failCount = 0;

        // Process sequentially to avoid overwhelming the server
        for (const report of pending) {
            try {
                // Update status to syncing
                setOfflineReports(prev => prev.map(r =>
                    r.id === report.id ? { ...r, status: 'syncing' } : r
                ));

                const response = await fetch(`/api/reports?filename=${encodeURIComponent(report.filename)}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(report.data),
                });

                if (!response.ok) {
                    throw new Error('Server error');
                }

                // Remove from queue on success
                removeOfflineReport(report.id);
                successCount++;

            } catch (error) {
                console.error('Sync failed for report', report.id, error);
                // Update status to error
                setOfflineReports(prev => prev.map(r =>
                    r.id === report.id ? { ...r, status: 'error' } : r
                ));
                failCount++;
            }
        }

        if (successCount > 0) {
            toast.success(`${successCount}件の同期が完了しました`, { id: toastId });
        }
        if (failCount > 0) {
            toast.error(`${failCount}件の同期に失敗しました`, { id: toastId });
        }
        if (successCount === 0 && failCount === 0) {
            toast.dismiss(toastId);
        }
    };

    return (
        <OfflineContext.Provider value={{ isOnline, offlineReports, saveOfflineReport, syncReports, removeOfflineReport }}>
            {children}
        </OfflineContext.Provider>
    );
}

export function useOffline() {
    const context = useContext(OfflineContext);
    if (context === undefined) {
        throw new Error('useOffline must be used within an OfflineProvider');
    }
    return context;
}
