import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mx-auto w-[min(1180px,calc(100%-48px))] border-t border-gray-200 py-8 font-sans max-md:w-[calc(100%-32px)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <Link
            className="mb-2 inline-block text-[25px] font-extrabold tracking-[-1.5px]"
            href="/"
          >
            bengalBooking<span className="text-primary">.</span>
          </Link>
          <p className="text-sm text-gray-600">Moments made easy.</p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4">Discover</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/explore" className="text-gray-600 hover:text-black">
                Browse Events
              </Link>
            </li>
            <li>
              <Link
                href="/#categories"
                className="text-gray-600 hover:text-black"
              >
                Categories
              </Link>
            </li>
            <li>
              <a href="/#about" className="text-gray-600 hover:text-black">
                About us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4">For Sellers</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/seller/register"
                className="text-gray-600 hover:text-black"
              >
                Become a Seller
              </Link>
            </li>
            <li>
              <Link
                href="/seller/login"
                className="text-gray-600 hover:text-black"
              >
                Seller Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4">Connect</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="text-gray-600 hover:text-black">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-black">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-black">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between border-t border-gray-200 pt-6 text-sm text-gray-600 md:flex-row">
        <p>&copy; {currentYear} Bengal Booking. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-black">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-black">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
