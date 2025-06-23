"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

const Navbar = () => {
    const [isMenuOpen, setisMenuOpen] = useState(false)
    const { data: session, status } = useSession()

    const toggleMenu = () => {
        setisMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setisMenuOpen(false)
    }

    const handleSignOut = () => {
        signOut()
        closeMenu()
    }

    return (
        <nav className='h-16 bg-purple-700 flex justify-between px-3 items-center text-white' aria-label="Main navigation">
            <div className="logo font-bold text-2xl">
                <Link href="/">TinyLink</Link>
            </div>

            <ul className='hidden md:flex gap-4 items-center'>
                <li><Link href="/" className='hover:bg-purple-600 transition-colors px-2 py-1 rounded-lg'>Home</Link></li>
                <li><Link href="/about" className='hover:bg-purple-600 transition-colors px-2 py-1 rounded-lg'>About</Link></li>
                <li><Link href="/shorten" className='hover:bg-purple-600 transition-colors px-2 py-1 rounded-lg'>Shorten</Link></li>
                <li><Link href="/contact" className='hover:bg-purple-600 transition-colors px-2 py-1 rounded-lg'>Contact Us</Link></li>
                {session && (
                    <li><Link href="/dashboard" className='hover:bg-purple-600 transition-colors px-2 py-1 rounded-lg'>My Links</Link></li>
                )}
                <li>
                    <div className="flex gap-3">
                        <Link href="/shorten"><button className='bg-purple-500 hover:bg-purple-400 rounded-lg p-3 py-1 font-bold transition-colors cursor-pointer'>Try Now</button></Link>
                        {session ? (
                            <div className='flex items-center gap-3'>
                                <span className='text-sm'>Hi, {session.user.name?.split(' ')[0]}</span>
                                <button onClick={handleSignOut} className='bg-red-500 hover:bg-red-400 rounded-lg p-3 py-1 font-bold transition-colors cursor-pointer'>Sign Out</button>
                            </div>
                        ) : (
                            <button onClick={() => signIn(undefined, {callbackUrl:'/dashboard'})} className='bg-green-500 hover:bg-green-400 rounded-lg p-3 py-1 font-bold transition-colors cursor-pointer'>Sign In</button>
                        )}
                        <Link href="/github" target='_blank' rel='noopener noreferrer'><button className='bg-purple-500 hover:bg-purple-400 rounded-lg p-3 py-1 font-bold transition-colors cursor-pointer'>GitHub</button></Link>
                    </div>
                </li>
            </ul>

            <button className='md:hidden p-2 hover:bg-purple-600 rounded-lg transition-colors' aria-label="Toggle mobile menu" onClick={toggleMenu}>
                <svg className={`w-6 h-6 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    {isMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            <div className={`absolute top-16 left-0 right-0 bg-purple-700 shadow-lg transform transition-all duration-300 ease-in-out md:hidden ${isMenuOpen
                ? 'opacity-100 translate-y-0 visible'
                : 'opacity-0 -translate-y-2 invisible'
                }`}>
                <ul className='flex flex-col py-2'>
                    <li>
                        <Link href="/" className='block px-4 py-3 hover:bg-purple-600 transition-colors border-b border-purple-600 border-opacity-30' onClick={closeMenu}>Home</Link>
                    </li>
                    <li>
                        <Link href="/about" className='block px-4 py-3 hover:bg-purple-600 transition-colors border-b border-purple-600 border-opacity-30' onClick={closeMenu}>About
                        </Link>
                    </li>
                    <li>
                        <Link href="/shorten" className='block px-4 py-3 hover:bg-purple-600 transition-colors border-b border-purple-600 border-opacity-30' onClick={closeMenu}>Shorten
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" className='block px-4 py-3 hover:bg-purple-600 transition-colors border-b border-purple-600 border-opacity-30' onClick={closeMenu}>Contact Us
                        </Link>
                    </li>
                    <li className='px-4 py-3'>
                        <div className="flex flex-col gap-2">
                            <Link href="/shorten" onClick={closeMenu}>
                                <button className='w-full bg-purple-500 hover:bg-purple-400 rounded-lg p-3 py-2 font-bold transition-colors'>
                                    Try Now
                                </button>
                            </Link>
                            {session ? (
                                <div className='flex flex-col gap-2'>
                                    <span className='text-sm text-center'>Hi, {session.user.name?.split(' ')[0]}</span>
                                    <button onClick={handleSignOut} className='w-full bg-red-500 hover:bg-red-400 rounded-lg p-3 py-2 font-bold transition-colors'>
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => signIn(undefined, {callbackUrl:'/dashboard'})} className='w-full bg-green-500 hover:bg-green-400 rounded-lg p-3 py-2 font-bold transition-colors'>
                                    Sign In
                                </button>
                            )}
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar