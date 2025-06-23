import Image from "next/image";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
})

export default function Home() {
  return (
    <main className="bg-purple-100 min-h-screen">
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[60vh]">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight ${poppins.className}`}>
              The best URL shortener in the market
            </h1>

            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
              We are the most straightforward URL shortener in the world. Most URL shorteners will track you or ask for your details to login. We understand your needs and have created this simple, privacy-focused URL shortener.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/shorten"><button className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-6 py-3 font-bold transition-colors duration-200 cursor-pointer">Try Now</button></Link>
              <Link href="/github" target="_blank" rel="noopener noreferrer"><button className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-6 py-3 font-bold transition-colors duration-200 cursor-pointer">GitHub</button></Link>
            </div>
          </div>

          <div className="relative h-64">
            <Image className="mix-blend-darken object-contain" src="/vector.jpg" fill sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw, 50vw" alt="vector" priority></Image>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose TinyLink?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-gray-600">No tracking, no data collection. Your privacy matters to us.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Shorten URLs instantly with our optimized infrastructure.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Simple & Clean</h3>
              <p className="text-gray-600">No complex features, just straightforward URL shortening.</p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
