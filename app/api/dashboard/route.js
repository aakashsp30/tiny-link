import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authoptions } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(request) {
    try {
        const session = await getServerSession(authoptions)

        if (!session) {
            return Response.json({ success: false, error: true, message: 'Unauthorized' }, { status: 401 })
        }

        const client = await clientPromise
        const db = client.db("tinylink")
        const collection = db.collection("url")

        const userUrls = await collection
            .find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .toArray()

        return Response.json({
            success: true,
            error: false,
            urls: userUrls.map(url => ({
                id: url._id,
                originalUrl: url.url,
                shortUrl: url.shorturl,
                fullShortUrl: `${process.env.NEXT_PUBLIC_HOST}/${url.shorturl}`,
                createdAt: url.createdAt,
                clicks: url.clicks || 0
            }))
        })
    } catch (error) {
        console.error('Dashboard API Error:', error)
        return Response.json({ success: false, error: true, message: 'Server error occurred' }, { status: 500 })
    }
}

export async function DELETE(request) {
    try {
        const session = await getServerSession(authoptions)

        if (!session) {
            return Response.json({ success: false, error: true, message: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const urlId = searchParams.get('id')

        if (!urlId) {
            return Response.json({ success: false, error: true, message: 'URL ID required' }, { status: 400 })
        }

        const client = await clientPromise
        const db = client.db("tinylink")
        const collection = db.collection("url")

        const result = await collection.deleteOne({
            _id: new ObjectId(urlId),
            userId: session.user.id
        })

        if (result.deletedCount === 0) {
            return Response.json({ success: false, error: true, message: 'URL not found or unauthorized' }, { status: 404 })
        }

        return Response.json({ success: true, error: false, message: 'URL deleted successfully' })
    } catch (error) {
        console.error('Delete URL Error:', error)
        return Response.json({ success: false, error: true, message: 'Server error occurred' }, { status: 500 })
    }
}