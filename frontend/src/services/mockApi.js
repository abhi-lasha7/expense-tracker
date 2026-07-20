// Mock data for development
const mockUser = {
  email: 'abhilasha@gmail.com',
  name: 'Abhilasha',
};

const mockTransactions = [
  { id: 1, amount: 500, description: 'Lunch', date: '2026-07-20', category: { id: 1, name: 'Food', type: 'EXPENSE' } },
  { id: 2, amount: 1500, description: 'Salary', date: '2026-07-15', category: { id: 2, name: 'Salary', type: 'INCOME' } },
  { id: 3, amount: 300, description: 'Movie', date: '2026-07-18', category: { id: 1, name: 'Entertainment', type: 'EXPENSE' } },
  { id: 4, amount: 200, description: 'Groceries', date: '2026-07-19', category: { id: 1, name: 'Food', type: 'EXPENSE' } },
];

const mockSummary = {
  month: '2026-07',
  totalIncome: 1500,
  totalExpense: 1000,
  balance: 500,
  categoryBreakdown: [
    { categoryName: 'Food', type: 'EXPENSE', total: 700 },
    { categoryName: 'Entertainment', type: 'EXPENSE', total: 300 },
    { categoryName: 'Salary', type: 'INCOME', total: 1500 },
  ],
};

export const mockApiCalls = {
  getSummary: () => Promise.resolve({ data: mockSummary }),
  getTransactions: () => Promise.resolve({ data: mockTransactions }),
  getCategories: () => Promise.resolve({ data: [{ id: 1, name: 'Food', type: 'EXPENSE' }, { id: 2, name: 'Salary', type: 'INCOME' }] }),
};