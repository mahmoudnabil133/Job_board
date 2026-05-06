function Hero() {
    return (
        <section className="min-h-screen flex flex-col justify-center items-center text-center bg-white">
            <img
                src="./img.png"
                alt="Mahmoud"
                className="w-40 h-40 rounded-full object-cover mb-4 shadow-lg"
            />

            <h1 className="text-4xl font-bold mb-2">Mahmoud Nabil</h1>
            <p className="text-lg text-gray-600">
                Backend Developer | Node.js | NestJS
            </p>
        </section>
    );
}

export default Hero;