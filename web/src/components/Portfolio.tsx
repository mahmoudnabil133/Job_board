const projects = [
    {
        title: "Book Store App",
        description: "Read books online with filtering and search.",
        tech: "React, Express, MongoDB",
    },
    {
        title: "Appointment Booking System",
        description: "Full backend system with slots & scheduling.",
        tech: "NestJS, MongoDB",
    },
    {
        title: "Auth System",
        description: "JWT authentication with roles and permissions.",
        tech: "Node.js, Express",
    },
    {
        title: "Search Engine Feature",
        description: "Advanced filtering and category search.",
        tech: "React, MongoDB",
    },
    {
        title: "Microservices System",
        description: "Built with RabbitMQ and NestJS.",
        tech: "NestJS, RMQ",
    },
    {
        title: "Redis Caching Layer",
        description: "Optimized performance using Redis caching.",
        tech: "Node.js, Redis",
    },
];

function Portfolio() {
    return (
        <section className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Portfolio</h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                        >
                            <h3 className="text-xl font-semibold mb-2">
                                {project.title}
                            </h3>

                            <p className="text-gray-600 mb-2">
                                {project.description}
                            </p>

                            <span className="text-sm text-blue-500">
                {project.tech}
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Portfolio;