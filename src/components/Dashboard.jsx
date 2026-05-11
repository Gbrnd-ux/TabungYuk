import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "transactions"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let income = 0;
      let expense = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === "income") income += data.amount;
        else expense += data.amount;
      });
      setTotalIncome(income);
      setTotalExpense(expense);
      setBalance(income - expense);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Kartu Saldo */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Saldo Sekarang</p>
              <p
                className={`text-2xl font-bold ${
                  balance >= 0 ? "text-green-300" : "text-red-300"
                }`}
              >
                Rp {balance.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        {/* Kartu Pemasukan */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Total Pemasukan</p>
              <p className="text-2xl font-bold text-green-300">
                Rp {totalIncome.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>

        {/* Kartu Pengeluaran */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-red-300">
                Rp {totalExpense.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-400/20 flex items-center justify-center">
              <span className="text-2xl">📉</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}