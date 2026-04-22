// src/pages/Wallet.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import axios from '../utils/axios';
import { useTranslation } from 'react-i18next';
import { 
  CreditCard, ArrowUpCircle, ArrowDownCircle, History, Wallet as WalletIcon,
  Copy, CheckCircle, AlertCircle
} from 'lucide-react';

const depositSchema = z.object({
  reference: z.string().min(3, 'Transaction reference is required'),
  mobileNumber: z.string().optional(),
});

const withdrawSchema = z.object({
  amount: z.number().min(50, 'Minimum withdrawal 50 coins'),
  method: z.string().min(1, 'Select a method'),
  accountNo: z.string().min(5, 'Account number is required'),
});

const COIN_PACKAGES = [
  { amount: 50, price: '৳50', label: 'Starter', bonus: 0 },
  { amount: 100, price: '৳100', label: 'Regular', bonus: 5 },
  { amount: 250, price: '৳250', label: 'Pro', bonus: 15 },
  { amount: 500, price: '৳500', label: 'Elite', bonus: 40 },
  { amount: 1000, price: '৳1000', label: 'Legend', bonus: 100 },
];

const PAYMENT_METHODS = [
  { id: 'bkash', name: 'bKash', logo: '🔴', account: '017XXXXXXXX', type: 'mobile' },
  { id: 'nagad', name: 'Nagad', logo: '🟠', account: '018XXXXXXXX', type: 'mobile' },
  { id: 'rocket', name: 'Rocket', logo: '🔵', account: '019XXXXXXXX', type: 'mobile' },
  { id: 'bank', name: 'Bank Transfer', logo: '🏦', account: '1234567890', type: 'bank' },
];

const WITHDRAW_METHODS = [
  { id: 'bkash', name: 'bKash', logo: '🔴' },
  { id: 'nagad', name: 'Nagad', logo: '🟠' },
  { id: 'rocket', name: 'Rocket', logo: '🔵' },
];

export default function Wallet() {
  const { t } = useTranslation();
  const [wallet, setWallet] = useState({ balance: 0, transactions: [], pendingWithdraw: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('deposit');
  const [depositStep, setDepositStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [copied, setCopied] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const { register: registerDeposit, handleSubmit: handleDepositSubmit, formState: { errors: depositErrors, isSubmitting: isDepositSubmitting }, reset: resetDeposit } = useForm({
    resolver: zodResolver(depositSchema)
  });
  const { register: registerWithdraw, handleSubmit: handleWithdrawSubmit, formState: { errors: withdrawErrors, isSubmitting: isWithdrawSubmitting }, reset: resetWithdraw } = useForm({
    resolver: zodResolver(withdrawSchema)
  });

  const fetchWallet = useCallback(async () => {
    try {
      const { data } = await axios.get('/wallet');
      setWallet(data);
    } catch (error) {
      toast.error(t('wallet.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const onDeposit = async (data) => {
    try {
      await axios.post('/wallet/deposit-request', {
        amount: selectedPackage.amount,
        method: selectedMethod.id,
        reference: data.reference,
        mobileNumber: data.mobileNumber,
      });
      setDepositStep(3);
      toast.success(t('wallet.depositRequested'));
      fetchWallet();
      window.dispatchEvent(new Event('wallet-updated')); // নাভবার আপডেট
      resetDeposit();
    } catch (err) {
      toast.error(err.response?.data?.message || t('error.generic'));
    }
  };

  const onWithdraw = async (data) => {
    try {
      await axios.post('/wallet/withdraw-request', {
        amount: data.amount,
        method: data.method,
        accountNo: data.accountNo,
      });
      toast.success('Withdrawal request submitted');
      fetchWallet();
      window.dispatchEvent(new Event('wallet-updated'));
      resetWithdraw();
      setActiveTab('history');
    } catch (err) {
      toast.error(err.response?.data?.message || t('error.generic'));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied!');
  };

  const typeColor = {
    deposit: 'text-green-400',
    entry_fee: 'text-red-400',
    prize: 'text-yellow-400',
    withdrawal: 'text-orange-400'
  };
  const typeSign = {
    deposit: '+',
    entry_fee: '-',
    prize: '+',
    withdrawal: '-'
  };

  const filteredTransactions = wallet.transactions?.filter(tx => 
    filterType === 'all' ? true : tx.type === filterType
  ) || [];

  if (loading) return <WalletSkeleton />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen py-8 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto">
        {/* ব্যালেন্স কার্ড - ফিক্সড (ডার্ক ও লাইট মোডে সঠিক) */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative overflow-hidden rounded-2xl p-6 mb-8 border shadow-xl bg-white/90 dark:bg-black/30 backdrop-blur-md border-gray-200 dark:border-white/20"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-2">
              <WalletIcon size={16} /> {t('wallet.balance')}
            </p>
            <p className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">
              {wallet.balance.toLocaleString()}
              <span className="text-xl ml-2 text-purple-600 dark:text-purple-300">E-Coins</span>
            </p>
            {wallet.pendingWithdraw > 0 && (
              <p className="text-orange-600 dark:text-orange-300 text-sm mt-2 flex items-center gap-1">
                <AlertCircle size={14} /> Pending withdrawal: {wallet.pendingWithdraw} coins
              </p>
            )}
          </div>
        </motion.div>

        {/* ট্যাবস */}
        <div className="flex gap-2 mb-6 bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-1 backdrop-blur">
          {[
            { id: 'deposit', label: t('wallet.deposit'), icon: ArrowDownCircle },
            { id: 'withdraw', label: 'Withdraw', icon: ArrowUpCircle },
            { id: 'history', label: t('wallet.history'), icon: History },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* কন্টেন্ট এলাকা (আপনার পুরনো কোডের মতো, শুধু dark ক্লাস যোগ করা) */}
        <AnimatePresence mode="wait">
          {activeTab === 'deposit' && (
            <motion.div
              key="deposit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
            >
              {depositStep === 1 && (
                <>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Buy E-Coins</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {COIN_PACKAGES.map(pkg => (
                      <button
                        key={pkg.amount}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          selectedPackage?.amount === pkg.amount
                            ? 'border-purple-500 bg-purple-900/40 shadow-lg scale-[1.02]'
                            : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 hover:border-gray-500'
                        }`}
                      >
                        <p className="text-gray-900 dark:text-white font-bold text-xl">{pkg.amount} <span className="text-xs text-purple-600 dark:text-purple-400">coins</span></p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{pkg.price}</p>
                        {pkg.bonus > 0 && (
                          <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                            +{pkg.bonus} bonus
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <p className="text-gray-700 dark:text-gray-400 text-sm mb-2">Payment Method</p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {PAYMENT_METHODS.map(method => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                          selectedMethod.id === method.id
                            ? 'border-purple-500 bg-purple-900/40 text-white'
                            : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        <span className="text-xl">{method.logo}</span>
                        {method.name}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={!selectedPackage}
                    onClick={() => setDepositStep(2)}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
                  >
                    Proceed to Payment
                  </button>
                </>
              )}

              {depositStep === 2 && selectedPackage && (
                <form onSubmit={handleDepositSubmit(onDeposit)} className="space-y-5">
                  <div className="bg-gray-100 dark:bg-gray-800/70 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Package</span>
                      <span className="text-gray-900 dark:text-white font-bold">{selectedPackage.amount} coins</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Amount (BDT)</span>
                      <span className="text-gray-900 dark:text-white font-bold">{selectedPackage.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Method</span>
                      <span className="text-gray-900 dark:text-white">{selectedMethod.name}</span>
                    </div>
                    <div className="border-t border-gray-300 dark:border-gray-700 pt-3 mt-2">
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Send payment to:</p>
                      <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-900 p-2 rounded-lg">
                        <span className="font-mono text-gray-900 dark:text-white">{selectedMethod.account}</span>
                        <button type="button" onClick={() => copyToClipboard(selectedMethod.account)} className="text-purple-600 dark:text-purple-400 hover:text-purple-700">
                          {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                      <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-2">⚠️ {t('wallet.mockNote') || 'Include reference number in the next field'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">Transaction Reference *</label>
                    <input
                      {...registerDeposit('reference')}
                      placeholder="e.g. TrxABC123"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {depositErrors.reference && <p className="text-red-500 text-xs mt-1">{depositErrors.reference.message}</p>}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setDepositStep(1)} className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                      Back
                    </button>
                    <button type="submit" disabled={isDepositSubmitting} className="flex-1 bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition">
                      {isDepositSubmitting ? 'Submitting...' : 'Confirm Deposit'}
                    </button>
                  </div>
                </form>
              )}

              {depositStep === 3 && (
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-4">✅</motion.div>
                  <p className="text-gray-900 dark:text-white text-xl font-semibold">Request Sent!</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Admin will approve within 24 hours.</p>
                  <button
                    onClick={() => { setDepositStep(1); setSelectedPackage(null); }}
                    className="mt-6 text-purple-600 dark:text-purple-400 underline"
                  >
                    Make another deposit
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'withdraw' && (
            <motion.div
              key="withdraw"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Withdraw Coins</h3>
              <form onSubmit={handleWithdrawSubmit(onWithdraw)} className="space-y-5">
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">Amount (min 50 coins)</label>
                  <input
                    type="number"
                    {...registerWithdraw('amount', { valueAsNumber: true })}
                    placeholder="Enter amount"
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                  />
                  {withdrawErrors.amount && <p className="text-red-500 text-xs mt-1">{withdrawErrors.amount.message}</p>}
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">Withdraw Method</label>
                  <select {...registerWithdraw('method')} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white">
                    <option value="">Select</option>
                    {WITHDRAW_METHODS.map(m => (
                      <option key={m.id} value={m.id}>{m.logo} {m.name}</option>
                    ))}
                  </select>
                  {withdrawErrors.method && <p className="text-red-500 text-xs mt-1">{withdrawErrors.method.message}</p>}
                </div>

                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">Account Number (bKash/Nagad)</label>
                  <input {...registerWithdraw('accountNo')} placeholder="01XXXXXXXXX" className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white" />
                  {withdrawErrors.accountNo && <p className="text-red-500 text-xs mt-1">{withdrawErrors.accountNo.message}</p>}
                </div>

                <button type="submit" disabled={isWithdrawSubmitting} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition">
                  {isWithdrawSubmitting ? 'Processing...' : 'Request Withdrawal'}
                </button>
                <p className="text-gray-500 text-xs text-center mt-2">Withdrawals are processed within 48 hours.</p>
              </form>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h3>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-900 dark:text-white"
                >
                  <option value="all">All</option>
                  <option value="deposit">Deposit</option>
                  <option value="entry_fee">Entry Fees</option>
                  <option value="prize">Prizes</option>
                  <option value="withdrawal">Withdrawals</option>
                </select>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <History size={48} className="mx-auto mb-3 opacity-30" />
                  <p>{t('wallet.noTransactions')}</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {filteredTransactions.map((tx, idx) => (
                    <motion.div
                      key={tx._id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${tx.type === 'deposit' ? 'bg-green-900/40' : tx.type === 'entry_fee' ? 'bg-red-900/40' : 'bg-yellow-900/40'}`}>
                          {tx.type === 'deposit' ? <ArrowDownCircle size={20} className="text-green-400" /> : 
                           tx.type === 'entry_fee' ? <ArrowUpCircle size={20} className="text-red-400" /> :
                           <CreditCard size={20} className="text-yellow-400" />}
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white capitalize">{tx.type.replace('_', ' ')}</p>
                          <p className="text-gray-500 text-xs">
                            {tx.note || tx.method} · {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            tx.status === 'approved' || tx.status === 'completed' ? 'bg-green-900 text-green-400' :
                            tx.status === 'pending' ? 'bg-yellow-900 text-yellow-400' : 'bg-red-900 text-red-400'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                      <p className={`font-bold text-lg ${typeColor[tx.type]}`}>
                        {typeSign[tx.type]}{tx.amount}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function WalletSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 mb-8 animate-pulse">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="flex gap-2 mb-6">
          <div className="h-12 flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          <div className="h-12 flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          <div className="h-12 flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 h-96 animate-pulse"></div>
      </div>
    </div>
  );
}