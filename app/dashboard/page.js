"use client"
import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ToastContainer, toast, Bounce } from "react-toastify"

const Dashboard = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [urls, seturls] = useState([])
    const [isLoading, setisLoading] = useState(true)

    useEffect(() => {
        if (status == 'loading') return

        if (!session) {
            router.push(`/auth/signin?callbackUrl=${encodeURIComponent('/dashboard')}`)
            return
        }

        fetchUrls()
    }, [session, status, router])

    const fetchUrls = async () => {
        try {
            const response = await fetch('/api/dashboard')
            const data = await response.json()

            if (data.success) {
                seturls(data.urls)
            } else {
                toast.error(data.message || 'Failed to fetch URLs')
            }
        } catch (error) {
            console.error('Error fetching URLs:', error)
            toast.error('Failed to fetch URLs')
        } finally {
            setisLoading(false)
        }
    }

    const copyToClipboard = async (url) => {
        try {
            await navigator.clipboard.writeText(url)
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
        } catch (error) {
            console.error('Failed to copy: ', err)
            toast.error("Failed to copy link")
        }
    }

    const deleteUrl = async (id) => {
        if (!confirm('Are you sure you want to delete this URL?')) return

        try {
            const response = await fetch(`/api/dashboard?id=${id}`, {
                method: 'DELETE'
            })
            const data = await response.json()

            if (data.success) {
                seturls(urls.filter(url => url.id !== id))
                toast.success('URL deleted successfully')
            } else {
                toast.error(data.message || 'Failed to delete URL')
            }
        } catch (error) {
            console.error('Error deleting URL:', error)
            toast.error('Failed to delete URL')
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (status == 'loading' || isLoading) {
        return (
            <div className="min-h-screen bg-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    if (!session) {
        return null
    }

    return (
        <div className="min-h-screen bg-purple-50 py-12">
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

            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white shadow-lg rounded-xl p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="font-bold text-3xl text-gray-800">My Dashboard</h1>
                            <p className="text-gray-600 mt-2">Welcome back, {session.user.name}</p>
                        </div>
                        <Link href="/shorten">
                            <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold transition-colors cursor-pointer">
                                Create New Link
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-purple-100 p-6 rounded-lg text-center">
                            <h3 className="text-2xl font-bold text-purple-800">{urls.length}</h3>
                            <p className="text-purple-600">Total Links</p>
                        </div>
                        <div className="bg-green-100 p-6 rounded-lg text-center">
                            <h3 className="text-2xl font-bold text-purple-800">
                                {urls.reduce((total, url) => total + url.clicks, 0)}
                            </h3>
                            <p className="text-purple-600">Total Clicks</p>
                        </div>
                        <div className="bg-blue-100 p-6 rounded-lg text-center">
                            <h3 className="text-2xl font-bold text-blue-800">
                                {/* the number of URLs that were created in the past 7 days. */}
                                {urls.filter(url => new Date(url.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                            </h3>
                            <p className="text-blue-600">Links This Week</p>
                        </div>
                    </div>

                    {urls.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No links yet</h3>
                            <p className="text-gray-500 mb-6">Create your first short link to get started!</p>
                            <Link href="/shorten">
                                <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold transition-colors cursor-pointer">
                                    Create First Link
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Links</h2>
                            {urls.map((url) => (
                                <div key={url.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-medium text-purple-600 truncate">
                                                    <Link href={url.fullShortUrl} target="_blank" rel="noopener noreferrer" className="hover:text-purple-800">
                                                        {url.fullShortUrl}
                                                    </Link>
                                                </h3>
                                                <button
                                                    onClick={() => copyToClipboard(url.fullShortUrl)}
                                                    className="text-gray-400 hover:text-purple-600 transition-colors cursor-pointer"
                                                    title="Copy to clipboard"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className="text-gray-600 truncate text-sm mb-2">{url.originalUrl}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>Created: {formatDate(url.createdAt)}</span>
                                                <span>Clicks: {url.clicks}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={url.fullShortUrl} target="_blank" rel="noopener noreferrer">
                                                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                                                    Visit
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => deleteUrl(url.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard