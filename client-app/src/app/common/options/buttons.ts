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

export const filterTasksButtons = [
  {
    key: 1,
    content: 'My',
    as: 'a',
    size: 'small' as const,
    compact: true,
    className: 'active',
    functionArg: 'myTasks'
  },
  {
    key: 2,
    content: 'Shared',
    as: 'a',
    size: 'small' as const,
    compact: true,
    functionArg: 'allSharedTasks'
  },
];
export const filterSharedTasksButtons = [
  {
    key: 1,
    content: 'All',
    as: 'a',
    size: 'small' as const,
    compact: true,
    className: 'active',
    functionArg: 'allSharedTasks'
  },
  {
    key: 2,
    content: 'Accepted',
    as: 'a',
    size: 'small' as const,
    compact: true,
    functionArg: 'acceptedTasks'
  },
  {
    key: 3,
    content: 'Refused',
    as: 'a',
    size: 'small' as const,
    compact: true,
    functionArg: 'refusedTasks'
  },
  {
    key: 4,
    content: 'Done',
    as: 'a',
    size: 'small' as const,
    compact: true,
    functionArg: 'doneTasks'
  }
];
