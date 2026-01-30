export const BookingStatus = {
    AVAILABLE: 'AVAILABLE',
    PROVISIONAL: 'PROVISIONAL',
    CONFIRMED: 'CONFIRMED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const PaymentStatus = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    REFUNDED: 'REFUNDED'
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
