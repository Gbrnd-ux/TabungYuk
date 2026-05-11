import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function TransactionList() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "transactions"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(items);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 mt-4 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl">
      <h3 className="text-white text-lg font-semibold mb-3">Riwayat Transaksi</h3>
      {transactions.length === 0 ? (
        <p className="text-white/70">Belum ada transaksi.</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center p-3 bg-white/10 border border-white/20 rounded-xl"
            >
              <span className="text-white">{t.description}</span>
              <span
                className={
                  t.type === "income" ? "text-green-300" : "text-red-300"
                }
              >
                {t.type === "income" ? "+" : "-"} Rp {t.amount.toLocaleString("id-ID")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}