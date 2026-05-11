import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function AddTransaction() {
  const { user } = useAuth();
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc || !amount || !user) return;
    await addDoc(collection(db, "users", user.uid, "transactions"), {
      description: desc,
      amount: parseInt(amount),
      type,
      createdAt: serverTimestamp(),
    });
    setDesc("");
    setAmount("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto px-4 py-6 mt-4 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl space-y-3"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-3 rounded-xl bg-white/80 border-none focus:outline-none focus:ring-2 focus:ring-white/60 text-gray-800"
        >
          <option value="expense">Pengeluaran</option>
          <option value="income">Pemasukan</option>
        </select>
        <input
          type="number"
          placeholder="Jumlah"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 p-3 rounded-xl bg-white/80 border-none focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-gray-500 text-gray-800"
          required
        />
      </div>
      <input
        type="text"
        placeholder="Deskripsi"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="w-full p-3 rounded-xl bg-white/80 border-none focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-gray-500 text-gray-800"
        required
      />
      <button
        type="submit"
        className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition"
      >
        Simpan Transaksi
      </button>
    </form>
  );
}