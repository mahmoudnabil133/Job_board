function Contact() {
    return (
        <section className="bg-white py-16 px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Contact</h2>

            <p className="text-gray-600 mb-2">
                Email: hodanabil155@gmail.com
            </p>

            <p className="text-gray-600 mb-4">
                Phone: 01128806704
            </p>

            <div className="flex justify-center gap-6 mt-4">
                <a
                    href="https://github.com/mahmoudnabil133"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    GitHub
                </a>

                <a
                    href="https://www.linkedin.com/in/mahmoud-nabil-97278b24b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    LinkedIn
                </a>
            </div>
        </section>
    );
}

export default Contact;