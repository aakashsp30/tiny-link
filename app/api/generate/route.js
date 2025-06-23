import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authoptions } from "@/lib/auth";

export async function POST(request) {
    try {
        const body = await request.json()
        const session = await getServerSession(authoptions)

        const client = await clientPromise
        const db = client.db("tinylink")
        const collection = db.collection("url")

        const doc = await collection.findOne({ shorturl: body.shorturl })
        if (doc) {
            return Response.json({ success: false, error: true, message: 'URL already exists!' })
        }

        const urlDoc = {
            url: body.url,
            shorturl: body.shorturl,
            createdAt: new Date(),
            userId: session?.user?.id || null,
            userEmail: session?.user?.email || null,
            clicks: 0
        }

        const result = await collection.insertOne(urlDoc)
        return Response.json({ success: true, error: false, message: 'URL Generated Successfully' })
    } catch (error) {
        console.error('API Error:', error)
        return Response.json({ success: false, error: true, message: 'Server error occurred' })
    }

}