import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
    // useNewUrlParser: true,
}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
    throw new Error('Add Mongo URI to .env.local')
}

try {
    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
            client = new MongoClient(uri, options)
            global._mongoClientPromise = client.connect()
        }
        clientPromise = global._mongoClientPromise
    } else {
        client = new MongoClient(uri, options)
        clientPromise = client.connect()
    }
} catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
}


export default clientPromise