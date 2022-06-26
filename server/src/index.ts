import { getAnalytics } from "firebase/analytics";
import express, { Application, Request, Response } from "express";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7MT1eZnCD35EOQEQkV_nQPteBreJBBug",
  authDomain: "news-in-numbers-7fc19.firebaseapp.com",
  projectId: "news-in-numbers-7fc19",
  storageBucket: "news-in-numbers-7fc19.appspot.com",
  messagingSenderId: "928273223508",
  appId: "1:928273223508:web:fd1135f068b4aac84282c1",
  measurementId: "G-6GDSXPS4EW"
};


async function main() {
    // Firebase/-store
    const serviceAccount = require("../../../../api-keys/news-in-numbers.json");
    initializeApp();
    const db = getFirestore();
    const dbUsers = await db.collection("users");

    // Express
    const expressApp = express();

    createEndpoints(expressApp, dbUsers);

    expressApp.listen("4000", () =>
        console.log(`Example app listening on port 4000!`)
    );
}

// TODO: Remove any by dbUsers
export function createEndpoints(app: express.Application, dbUsers: any) {
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

    app.get("/createUser/:name/:password", async (req: Request, res: Response) => {
        const user = {
            name: req.params.name,
            password: req.params.password
        };
        if (user.name.length < 5 || user.password.length < 5) {
          return res.send(400);
        }
        const dbRes = await dbUsers.add(user, () => {
            return res.send(500);
        });
        return res.send(dbRes.id);
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

    app.get("/article/:id", (_: Request, res: Response) => {
        return res.send("News In Numbers API online");
    });

    app.get("/createArticle/:tags/:title/:content/:imgSrc", (_: Request, res: Response) => {
        return res.send("News In Numbers API online");
    });

    app.get("/deleteArticle/:id", (_: Request, res: Response) => {
        return res.send("News In Numbers API online");
    });
}

main();
