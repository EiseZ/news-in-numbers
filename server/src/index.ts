import { getAnalytics } from "firebase/analytics";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import aesjs from "aes-js";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import argon2 from "argon2";

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
            origin: "http://localhost:3000"
    }));
    expressApp.use(cookieParser());

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

        // Encrypt user id
        const userIdBytes = aesjs.utils.utf8.toBytes(user.id);
        let aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(5));
        const encryptedId = aesCtr.encrypt(userIdBytes);
        const encryptedIdHex = aesjs.utils.hex.fromBytes(encryptedId);

        if (passCorrect) {
            return res.writeHead(200, {
                "Set-Cookie": `userId=${encryptedIdHex}; HttpOnly`,
                "Access-Control-Allow-Credentials": "true"
            }).send();
        }
        return res.send(403);
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
            date: new Date()
        };
        if (user.email.length < 5 || user.password.length < 5) {
          return res.send(400);
        }
        const dbRes = await dbUsers.add(user, () => {
            return res.send(500);
        });
        
        // Encrypt user id
        const userIdBytes = aesjs.utils.utf8.toBytes(dbRes.id);
        let aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(5));
        const encryptedId = aesCtr.encrypt(userIdBytes);
        const encryptedIdHex = aesjs.utils.hex.fromBytes(encryptedId);
        return res.writeHead(200, {
            "Set-Cookie": `userId=${encryptedIdHex}; HttpOnly`,
            "Access-Control-Allow-Credentials": "true"
        }).send();
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
}

main();
