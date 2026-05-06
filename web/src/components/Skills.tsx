const skills = [
    "Node.js",
    "NestJS",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Redis",
    "Docker",
    "REST APIs",
    "Microservices",
    "JWT Auth",
    "React",
    "Git & GitHub",
];

function Skills() {
    return (
        <section className="bg-white py-16 px-6">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Skills</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {skills.map((skill, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 p-4 rounded-lg text-center shadow hover:shadow-md transition"
                        >
                            {skill}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Skills;