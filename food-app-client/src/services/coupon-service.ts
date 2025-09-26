import apiClient from "@/api/api-client.ts";
import type {Coupon} from "@/types";

type BackendCoupon = {
    _id?: string;
    code: string;
    type: string;
    value: number;
    restaurantId?: string | null;
    minOrderAmount?: number;
    usageLimit?: number;
    usageCount: number;
    perUserLimit?: number;
    validFrom?: Date;
    validUntil?: Date;
    status: string;
    createdAt: string;
    updatedAt: string;
};

type CouponsResponseBackend = {
    coupons: BackendCoupon[];
    total: number;
    page: number;
    totalPages: number;
};

export type CouponsResponse = {
    coupons: Coupon[];
    total: number;
    page: number;
    totalPages: number;
};

function mapCoupon(doc: BackendCoupon): Coupon {
    return {
        id: doc._id ?? doc.code,
        code: doc.code,
        type: doc.type,
        value: doc.value,
        restaurantId: doc.restaurantId ?? null,
        minOrderAmount: doc.minOrderAmount,
        usageLimit: doc.usageLimit,
        usageCount: doc.usageCount,
        perUserLimit: doc.perUserLimit,
        validFrom: doc.validFrom,
        validUntil: doc.validUntil,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
}

export async function fetchCoupons(page = 1, limit = 20): Promise<CouponsResponse> {
    const {data} = await apiClient.get<CouponsResponseBackend>("/coupons", {
        params: {page, limit},
    });
    return {
        coupons: (data.coupons ?? []).map(mapCoupon),
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
    };
}
