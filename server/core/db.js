import { MongoClient, ServerApiVersion } from "mongodb";
const createDbConnection = (mongoUri) => {
    const client = new MongoClient(mongoUri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });
    const getSiteComplete = async (site) => {
        await client.connect();
        const database = client.db("pat");
        const collection = database.collection("boards");
        return await collection.findOne({
            site,
        });
    };
    const getSiteDetails = async (site) => {
        await client.connect();
        const database = client.db("pat");
        const collection = database.collection("boards");
        return await collection.findOne({ site }, { projection: { site: 1, details: 1 } });
    };
    const getBoard = async (site) => {
        await client.connect();
        const database = client.db("pat");
        const collection = database.collection("boards");
        return await collection.findOne({ site }, { projection: { site: 1, board: 1 } });
    };
    const updateBoard = async (site, board) => {
        await client.connect();
        const database = client.db("pat");
        const collection = database.collection("boards");
        return await collection.updateOne({ site }, { $set: { board } });
    };
    const saveLogs = async (logs) => {
        await client.connect();
        const database = client.db("pat");
        const collection = database.collection("logs");
        return await collection.insertMany(logs);
    };
    const tryCatchWrap = (fn) => async (...args) => {
        try {
            return await fn(...args);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            //await client.close();
        }
    };
    return {
        getSiteComplete: tryCatchWrap(getSiteComplete),
        getSiteDetails: tryCatchWrap(getSiteDetails),
        getBoard: tryCatchWrap(getBoard),
        updateBoard: tryCatchWrap(updateBoard),
        saveLogs: tryCatchWrap(saveLogs),
    };
};
export default createDbConnection;
