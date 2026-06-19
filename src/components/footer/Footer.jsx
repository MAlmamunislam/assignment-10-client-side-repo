import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-[#030014] border-t border-white/5 pt-16 pb-8 px-6 text-gray-400">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔹 মেইন ফুটার গ্রিড সেকশন */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* ১. ব্র্যান্ড পরিচিতি ও সোশ্যাল আইকন বক্স */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
              {/* Zap/Lightning SVG Icon */}
              <div className="p-2 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <span>Prompt<span className="text-[#a855f7]">Hub</span></span>
            </Link>
            
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              The premier marketplace for AI prompts. Discover, share, and monetize prompts for ChatGPT, Claude, Midjourney, and more.
            </p>

            {/* সোশ্যাল আইকনস (বিশুদ্ধ অফিশিয়াল SVG কাস্টম সেট) */}
            <div className="flex items-center gap-3 mt-2">
              {[
                {
                  // GitHub SVG
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                  ),
                  href: "#"
                },
                {
                  // X (Twitter) Offical SVG
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                    </svg>
                  ),
                  href: "#"
                },
                {
                  // LinkedIn SVG
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  ),
                  href: "#"
                },
                {
                  // Mail SVG
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  ),
                  href: "#"
                }
              ].map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href}
                  className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-gray-500 hover:text-[#a855f7] hover:border-[#a855f7]/30 hover:bg-[#a855f7]/5 transition-all duration-300 flex items-center justify-center"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ২. প্ল্যাটফর্ম লিংক কলাম */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#a855f7] mb-5">Platform</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/all-prompts" className="hover:text-white transition-colors">All Prompts</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Featured</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Top Creators</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Trending</Link></li>
            </ul>
          </div>

          {/* ৩. অ্যাকাউন্ট লিংক কলাম */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-500 mb-5">Account</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Premium</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Creator Program</Link></li>
            </ul>
          </div>

          {/* ৪. কোম্পানি লিংক কলাম */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-5">Company</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* 🔹 কপিরাইট ও সিস্টেম স্ট্যাটাস বার */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-600">
          <p>© 2026 PromptHub. All rights reserved.</p>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full text-emerald-500/90">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;