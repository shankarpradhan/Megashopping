export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white text-center p-4">
        <p className="text-xl">
          Built with ❤️ using Next.js, Node.js, Express, and MongoDB.
        </p>
        <p className="text-xl mt-2">
          Designed by{" "}
          <a
            href="https://myportfolio-611e3.web.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            @Shankar Pradhan
          </a>
        </p>
        <p className="text-lg">
          &copy; {new Date().getFullYear()} MegaShop. All rights reserved.
        </p>
      </footer>
    );
  }
  