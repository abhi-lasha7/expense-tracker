import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApiCalls } from '../services/mockApi';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { LogOut, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, transactionsRes] = await Promise.all([
          mockApiCalls.getSummary(),
          mockApiCalls.getTransactions(),
        ]);
        setSummary(summaryRes.data);
        setTransactions(transactionsRes.data.slice(0, 5)); // Last 5 transactions
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading your dashboard...</div>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Expense Tracker
            </h1>
            <p className="text-gray-400 text-sm">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Income Card */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Income</p>
                <p className="text-3xl font-bold text-green-400 mt-2">₹{summary?.totalIncome.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500/30" />
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Expense</p>
                <p className="text-3xl font-bold text-red-400 mt-2">₹{summary?.totalExpense.toLocaleString()}</p>
              </div>
              <TrendingDown className="w-12 h-12 text-red-500/30" />
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Balance</p>
                <p className={`text-3xl font-bold mt-2 ${summary?.balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                  ₹{summary?.balance.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-blue-500/30" />
            </div>
          </div>
        </div>

        {/* Charts and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <div className="lg:col-span-1 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={summary?.categoryBreakdown || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ categoryName, value }) => `${categoryName}: ₹${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {summary?.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-gray-400">{tx.category.name} • {new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <p className={`text-lg font-semibold ${tx.category.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.category.type === 'INCOME' ? '+' : '-'}₹{tx.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}