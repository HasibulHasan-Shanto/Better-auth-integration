import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { Resend } from 'resend';

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db("better-auth-database");
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            void resend.emails.send({
                from: 'Acme <onboarding@resend.dev>',
                to: user.email,
                subject: 'Reset your password',
                html: `Click <a href="${url}">here</a> to reset your password.`,
            })
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 3600 // 1 hour
    }
    ,
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