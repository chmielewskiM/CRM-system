export const orderButtons = [
  {
    key: 1,
    content: 'All',
    as: 'a',
    size: 'small' as const,
    compact: true,
    className: 'active',
    functionArg: 'allOrders'
  },
  {
    key: 2,
    content: 'Sale',
    as: 'a',
    size: 'small' as const,
    compact: true,
    functionArg: 'saleOrders'
  },
  {
    key: 3,
    content: 'Purchase',
    as: 'a',
    size: 'small' as const,
    compact: true,
    functionArg: 'purchaseOrders'
  },
];
