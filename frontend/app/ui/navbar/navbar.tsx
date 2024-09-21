import React from 'react';
import Link from 'next/link';
import { AnimatedSearchBar } from './animated-search-bar';
import { GlowingDashboardDropdown } from './glowing-dashboard-dropdown';
import "@/app/styles/link-animation.css"

const Navbar: React.FC = () => {
    return (
<nav className=" border-b p-6 flex flex-row justify-between items-center">
    <div>
<Link href="/" className="text-2xl font-bold">SPEED</Link>
    </div>
    <div className="flex flex-row items-center justify-center gap-6">
        <Link href="/" className="hover-underline-animation">Home</Link>
        <Link href="/submit-article" className="whitespace-nowrap hover-underline-animation">Submit Article</Link>
        <AnimatedSearchBar />
    </div>
<div>
<GlowingDashboardDropdown />
            </div>
      </nav>
    );
};

export default Navbar;