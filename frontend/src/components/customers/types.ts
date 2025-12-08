
export interface CustomerSummary {
    id: string; // Unique ID for React Key (e.g. code or code-ddCode)
    code: string;
    name: string;
    area: string;
    totalActivities: number;
    visits: number;
    calls: number;
    designRequests: number;
    isPriority: boolean;
    lastActivity: string;
    rank: string;
    // Shared fields for Direct Delivery
    isDirectDelivery?: boolean;
    directDeliveryCode?: string;
    directDeliveryName?: string;
    subItems?: CustomerSummary[];
}
