import { useAuth } from "./contexts/AuthContext";
import Dashboard from "./components/Dashboard";
import AddTransaction from "./components/AddTransaction";
import TransactionList from "./components/TransactionList";
import Login from "./components/Login";

function App() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600">
      {/* Navbar sederhana */}
      <div className="flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur border-b border-white/20">
        <h1 className="text-2xl font-bold text-white drop-shadow">TabungYuk</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur transition text-sm"
        >
          Keluar
        </button>
      </div>

      {/* Konten Utama */}
      <div className="container mx-auto py-8 px-4">
        <Dashboard />
        <AddTransaction />
        <TransactionList />
      </div>
    </div>
  );
}

export default App;