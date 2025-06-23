import clientPromise from "@/lib/mongodb"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"

export default async function Page({ params }) {
    const shorturl = (await params).shorturl

    const client = await clientPromise
    const db = client.db("tinylink")
    const collection = db.collection("url")

    const doc = await collection.findOne({ shorturl: shorturl })

    if (doc) {
        await collection.updateOne(
            { shorturl: shorturl },
            {
                $inc: { clicks: 1 },
                $set: { lastClicked: new Date() }
            }
        )
        console.log(`Redirecting ${shorturl} to ${doc.url}`)
        redirect(doc.url)
    }
    else {
        notFound()
    }
}