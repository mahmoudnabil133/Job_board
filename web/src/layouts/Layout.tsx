import { Outlet, Link, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  const linkStyle = (path: string) =>
    `px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-blue-500 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">MyApp</h1>

          <div className="flex gap-2">
            <Link to="/" className={linkStyle("/")}>
              Home
            </Link>
            <Link to="/todo" className={linkStyle("/todo")}>
              Todo
            </Link>
            <Link to="/products" className={linkStyle("/products")}>
              Products
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-5xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
