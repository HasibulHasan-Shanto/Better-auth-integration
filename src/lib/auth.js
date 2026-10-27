import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db("better-auth-database");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.BETTER_AUTH_GOOGL_ID,
            clientSecret: process.env.BETTER_AUTH_CLIENT_SECRET
        },
        github: {
            clientId: process.env.BETTER_AUTH_GIT_CLIENT_ID,
            clientSecret: process.env.BETTER_AUTH_GIT_CLIENT_SECRET
        }
    },
    database: mongodbAdapter(db, {
        client,
    }),
});