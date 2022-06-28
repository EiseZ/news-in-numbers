import { getAnalytics } from "firebase/analytics";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import expressSession from "express-session";
import "dotenv/config";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import argon2 from "argon2";
import stripeCore from "stripe";

const stripe = new stripeCore("sk_test_51LFM0qGCmjW4WxM6nK21clE5HLrTGyfsEZZQPwG0x0EZ5EMKW9ofE76AxEjzn3A08mQhO1mzEH3e4s2LrnvM4YNm00MOggx6VV", { apiVersion: "2020-08-27" });

const firebaseConfig = {
  apiKey: "AIzaSyD7MT1eZnCD35EOQEQkV_nQPteBreJBBug",
  authDomain: "news-in-numbers-7fc19.firebaseapp.com",
  projectId: "news-in-numbers-7fc19",
  storageBucket: "news-in-numbers-7fc19.appspot.com",
  messagingSenderId: "928273223508",
  appId: "1:928273223508:web:fd1135f068b4aac84282c1",
  measurementId: "G-6GDSXPS4EW"
};

const aesKey = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];

declare module 'express-session' {
  export interface SessionData {
    userId: String;
  }
}

async function main() {
    // Firebase/-store
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        return;
    }
    const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT);
    initializeApp();
    const db = getFirestore();
    const dbUsers = await db.collection("users");
    const dbArticles = await db.collection("articles");

    // Express
    const expressApp = express();
    expressApp.use(cors({
            origin: "http://localhost:3000",
            credentials: true,
    }));
    expressApp.use(expressSession({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
        cookie: {
            secure: false,
            sameSite: "strict",
        }
    }));

    createEndpoints(expressApp, dbUsers, dbArticles);

    expressApp.listen("4000", () =>
        console.log(`Example app listening on port 4000!`)
    );
}

// TODO: Remove any by dbUsers
export function createEndpoints(app: express.Application, dbUsers: any, dbArticles: any) {
    app.get("/", (_: Request, res: Response) => {
        return res.send("News In Numbers API online");
    });

    app.get("/user/:id", async (req: Request, res: Response) => {
        const dbRes = await dbUsers.doc(req.params.id).get({}, () => {
            return res.send(500);
        });
        if (!dbRes.exists) {
            return res.send(404);
        }
        return res.send(dbRes.data());
    });

    app.get("/login/:email/:password", async (req: Request, res: Response) => {
        const dbRes = await dbUsers.where("email", "==", req.params.email.toLowerCase()).get({}, () => {
            return res.send(500);
        });
        if (dbRes.empty) {
            return res.send(404);
        }
        const user = dbRes.docs[0];
        const passCorrect = await argon2.verify(user.data().password, req.params.password);

        if (!passCorrect) {
            return res.send(403);
        }
        req.session.userId = user.id;
        return res.send(200);
    });

    app.get("/createUser/:email/:password", async (req: Request, res: Response) => {
        // Check if user already exists
        const dbResCheck = await dbUsers.where("email", "==", req.params.email.toLowerCase()).get({}, () => {
            return res.send(500);
        });
        if (!dbResCheck.empty) {
            return res.send(409);
        }

        const passHash = await argon2.hash(req.params.password);
        const user = {
            email: req.params.email.toLowerCase(),
            password: passHash,
            date: new Date(),
            payed: false,
        };
        if (user.email.length < 5 || user.password.length < 5) {
          return res.send(400);
        }
        const dbRes = await dbUsers.add(user, () => {
            return res.send(500);
        });

        req.session.userId = dbRes.id;
        return res.send(200);
    });

    app.get("/deleteUser/:id", async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.send(400);
        }
        const dbRes = await dbUsers.doc(req.params.id).delete({}, () => {
            return res.send(500);
        });
        return res.send(200);
    });

    app.get("/articles/:n", async (req: Request, res: Response) => {
        // Check if user payed
        if (!req.session.userId) {
            return res.send(401);
        }
        const dbResUser = await dbUsers.doc(req.session.userId).get({}, () => {
            return res.send(500);
        });
        if (!dbResUser.exists) {
            return res.send(403);
        }
        if (!dbResUser.data().payed) {
            return res.send(402);
        }

        // Get articles
        const dbRes = await dbArticles.limit(parseInt(req.params.n)).get({}, () => {
            return res.send(500);
        });
        if (dbRes.empty) {
            return res.send(404);
        }
        let articles: {}[] = [];
        // TODO: Remove any
        dbRes.forEach((article: any) => {
            articles.push(article.data());
        });
        return res.send(articles);
    });

    app.get("/article/:id", async (req: Request, res: Response) => {
        // Check if user payed
        if (!req.session.userId) {
            return res.send(401);
        }
        const dbResUser = await dbUsers.doc(req.session.userId).get({}, () => {
            return res.send(500);
        });
        if (!dbResUser.exists) {
            return res.send(403);
        }
        if (!dbResUser.data().payed) {
            return res.send(402);
        }

        // Get article
        const dbRes = await dbArticles.doc(req.params.id).get({}, () => {
            return res.send(500);
        });
        if (!dbRes.exists) {
            return res.send(404);
        }
        return res.send(dbRes.data());
    });

    app.get("/createArticle/:tags/:title/:content/:imgSrc", async (req: Request, res: Response) => {
        const article = {
            tags: req.params.tags.replace(/_/g, " ").split(","),
            title: req.params.title,
            content: req.params.content,
            imgSrc: req.params.imgSrc
        };
        const dbRes = await dbArticles.add(article, () => {
            return res.send(500);
        });
        return res.send(dbRes.id)
    });

    app.get("/deleteArticle/:id", async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.send(400);
        }
        const dbRes = await dbArticles.doc(req.params.id).delete({}, () => {
            return res.send(500);
        });
        return res.send(200);
    });

    app.post("/create-checkout-session", async (_: Request, res: Response) => {
        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            line_items: [
            {
                price: "price_1LFM7cGCmjW4WxM6QknDdl19",
                // For metered billing, do not pass quantity
                quantity: 1,
            },
            ],
            payment_method_types: ["card"],
            mode: 'subscription',
            success_url: `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.DOMAIN}/cancel`,
        });

        if (!session.url) {
            return res.send(500);
        }
        return res.send({ url: session.url });
    });

    app.post("/payment-successfull/:paymentId", async (req: Request, res: Response) => {
        const session = await stripe.checkout.sessions.retrieve(req.params.paymentId);
        if (session.payment_status === "paid") {
            // Change user to payed user
            console.log(req.session.userId)
            if (!req.session.userId) {
                return res.send(401);
            }
            const userDoc = await dbUsers.doc(req.session.userId);
            const dbRes = await userDoc.get({}, () => {
                return res.send(500);
            });
            if (!dbRes.exists) {
                return res.send(403);
            }
            await userDoc.update({ payed: true }).catch(() => { return res.send(500) });
            return res.send(200);
        }
        return res.send(402);
    });
}

main();
