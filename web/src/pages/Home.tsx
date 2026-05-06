const Home = () => {
  return (
    <div className="text-center mt-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome 👋</h1>

      <p className="text-gray-600 mb-6">
        This is your simple React app with routing, tasks, and products.
      </p>

      <div className="flex justify-center gap-4">
        <a
          href="/todo"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition"
        >
          Go to Todo
        </a>

        <a
          href="/products"
          className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition"
        >
          View Products
        </a>
      </div>
    </div>
  );
};

export default Home;
