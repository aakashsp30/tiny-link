"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { ToastContainer, toast, Bounce } from 'react-toastify';

const Shorten = () => {
    const [url, seturl] = useState("")
    const [shorturl, setshorturl] = useState("")
    const [generated, setgenerated] = useState("")
    const [isLoading, setisLoading] = useState(false)

    const isValidUrl = (string) => {
        try {
            new URL(string)
            return true
        } catch (_) {
            return false
        }
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generated)
            toast.success("Link copied to clipboard!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            })
        } catch (err) {
            console.error('Failed to copy: ', err)
            toast.error("Failed to copy link")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!url.trim()) {
            toast.error("Please enter a URL")
            return
        }

        if (!isValidUrl(url)) {
            toast.error("Please enter a valid URL (include http:// or https://)")
            return
        }

        if (!shorturl.trim()) {
            toast.error("Please enter a preferred short text");
            return;
        }

        if (shorturl.length < 3) {
            toast.error("Short URL must be at least 3 characters long");
            return;
        }

        if (!/^[a-zA-Z0-9-_]+$/.test(shorturl)) {
            toast.error("Short URL can only contain letters, numbers, hyphens, and underscores");
            return;
        }

        setisLoading(true)

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: url.trim(),
                    shorturl: shorturl.trim()
                }),
            })

            const result = await response.json()

            if (result.error) {
                toast.error(result.message || "Failed to generate short URL")
            }
            else {
                setgenerated(`${process.env.NEXT_PUBLIC_HOST}/${shorturl}`);
                seturl("");
                setshorturl("");
                toast.success(result.message || "Short URL generated successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
            }
        } catch (error) {
            console.error("Network error:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setisLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-purple-50 py-12'>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <div className='bg-white shadow-lg rounded-xl p-8 max-w-2xl mx-auto'>
                <h1 className='font-bold text-3xl text-center text-gray-800 mb-8'>Generate Your Short URLs</h1>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div>
                        <label htmlFor="url" className='block text-sm font-medium text-gray-700 mb-2'>
                            Original URL
                        </label>
                        <input id="url" type="url" value={url} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200' placeholder='https://example.com/very-long-url' onChange={e => { seturl(e.target.value) }} disabled={isLoading} />
                    </div>

                    <div>
                        <label htmlFor="shorturl" className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Short Text
                        </label>
                        <input id="shorturl" type="text" value={shorturl} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200' placeholder='my-short-link' onChange={e => setshorturl(e.target.value)} disabled={isLoading}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Only letters, numbers, hyphens, and underscores allowed. Minimum 3 characters.
                        </p>
                    </div>

                    <button type="submit" disabled={isLoading} className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-200 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 cursor-pointer'}`}>
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </div>
                        ) : (
                            'Generate Short URL'
                        )}
                    </button>
                </form>

                {generated && (
                    <div className='mt-8 p-6 bg-green-50 border border-green-200 rounded-lg'>
                        <h2 className='font-bold text-lg text-green-800 mb-3'>
                            🎉 Your Short URL is Ready!
                        </h2>

                        <div className='flex items-center gap-3 p-3 bg-white border border-green-300 rounded-lg'>
                            <code className='flex-1 text-purple-600 font-mono break-all'>
                                <Link href={generated} target="_blank" rel="noopener noreferrer" className="hover:text-purple-800 transition-colors">
                                    {generated}
                                </Link>
                            </code>

                            <button onClick={copyToClipboard} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer" title="Copy to clipboard">
                                Copy
                            </button>
                        </div>

                        <p className="text-sm text-green-700 mt-2">
                            Click the link to test it, or copy it to share!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Shorten
