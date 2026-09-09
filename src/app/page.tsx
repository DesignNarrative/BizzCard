import Link from "next/link";
import {
  CreditCard,
  QrCode,
  Users,
  Smartphone,
  ArrowRight,
  Zap,
  Shield,
  Globe,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">B</span>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              BizCard
            </span>
          </div>
          <Link
            href="/login"
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
            Your business card,
            <br />
            <span className="text-gray-400">always with you.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Create a stunning digital business card in 2 minutes. Share via QR
            code. Get leads instantly on your phone.
          </p>
          <div className="mt-10 flex items-center justify-center">
            <Link
              href="/login"
              className="px-8 py-3.5 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2 shadow-sm"
            >
              Create My Card
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-14">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: CreditCard,
                step: "1",
                title: "Create your card",
                desc: "Add your details — name, phone, services. Takes 2 minutes.",
              },
              {
                icon: QrCode,
                step: "2",
                title: "Share your QR",
                desc: "Show your QR code from your phone. No printing needed.",
              },
              {
                icon: Users,
                step: "3",
                title: "Get leads",
                desc: "Customers save your contact and send you enquiries instantly.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center p-6 bg-white rounded-2xl border border-gray-200"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 text-white rounded-xl mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-gray-400 mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
            Everything you need
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-lg mx-auto">
            A complete digital identity for your business.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Smartphone,
                title: "Phone is your card",
                desc: "No printing, no carrying. Show your QR from your phone.",
              },
              {
                icon: Users,
                title: "Instant leads",
                desc: "Customers send enquiries. You get them instantly.",
              },
              {
                icon: QrCode,
                title: "QR + Share",
                desc: "QR code, WhatsApp share, link — any way they want.",
              },
              {
                icon: Shield,
                title: "Always current",
                desc: "Change your number? Card updates. Old contacts still find you.",
              },
              {
                icon: Globe,
                title: "Works everywhere",
                desc: "Mobile, tablet, laptop — beautiful on every screen.",
              },
              {
                icon: Zap,
                title: "Fast & Simple",
                desc: "Lightning fast. Create your card and start sharing.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <item.icon className="w-5 h-5 text-gray-400 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center bg-gray-900 rounded-3xl p-10 sm:p-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to go digital?
          </h2>
          <p className="text-gray-400 mb-8">
            Create your BizCard in 2 minutes.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors"
          >
            Create My Card
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              BizCard
            </span>
          </div>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} BizCard. Your card, always with
            you.
          </p>
        </div>
      </footer>
    </div>
  );
}
