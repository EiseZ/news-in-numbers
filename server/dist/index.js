"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEndpoints = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
require("dotenv/config");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const argon2_1 = __importDefault(require("argon2"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default("sk_test_51LFM0qGCmjW4WxM6nK21clE5HLrTGyfsEZZQPwG0x0EZ5EMKW9ofE76AxEjzn3A08mQhO1mzEH3e4s2LrnvM4YNm00MOggx6VV", { apiVersion: "2020-08-27" });
const firebaseConfig = {
    apiKey: "AIzaSyD7MT1eZnCD35EOQEQkV_nQPteBreJBBug",
    authDomain: "news-in-numbers-7fc19.firebaseapp.com",
    projectId: "news-in-numbers-7fc19",
    storageBucket: "news-in-numbers-7fc19.appspot.com",
    messagingSenderId: "928273223508",
    appId: "1:928273223508:web:fd1135f068b4aac84282c1",
    measurementId: "G-6GDSXPS4EW"
};
const aesKey = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
async function main() {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        return;
    }
    const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT);
    (0, app_1.initializeApp)();
    const db = (0, firestore_1.getFirestore)();
    const dbUsers = await db.collection("users");
    const dbArticles = await db.collection("articles");
    const expressApp = (0, express_1.default)();
    expressApp.use((0, cors_1.default)({
        origin: "http://localhost:3000",
        credentials: true,
    }));
    expressApp.use((0, express_session_1.default)({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
        cookie: {
            secure: false,
            sameSite: "strict",
        }
    }));
    createEndpoints(expressApp, dbUsers, dbArticles);
    expressApp.listen("4000", () => console.log(`Example app listening on port 4000!`));
}
function createEndpoints(app, dbUsers, dbArticles) {
    app.get("/", (_, res) => {
        return res.send("News In Numbers API online");
    });
    app.get("/user/:id", async (req, res) => {
        const dbRes = await dbUsers.doc(req.params.id).get({}, () => {
            return res.send(500);
        });
        if (!dbRes.exists) {
            return res.send(404);
        }
        return res.send(dbRes.data());
    });
    app.get("/login/:email/:password", async (req, res) => {
        const dbRes = await dbUsers.where("email", "==", req.params.email.toLowerCase()).get({}, () => {
            return res.send(500);
        });
        if (dbRes.empty) {
            return res.send(404);
        }
        const user = dbRes.docs[0];
        const passCorrect = await argon2_1.default.verify(user.data().password, req.params.password);
        if (!passCorrect) {
            return res.send(403);
        }
        req.session.userId = user.id;
        return res.send(200);
    });
    app.get("/createUser/:email/:password", async (req, res) => {
        const dbResCheck = await dbUsers.where("email", "==", req.params.email.toLowerCase()).get({}, () => {
            return res.send(500);
        });
        if (!dbResCheck.empty) {
            return res.send(409);
        }
        const passHash = await argon2_1.default.hash(req.params.password);
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
    app.get("/deleteUser/:id", async (req, res) => {
        if (!req.params.id) {
            return res.send(400);
        }
        const dbRes = await dbUsers.doc(req.params.id).delete({}, () => {
            return res.send(500);
        });
        return res.send(200);
    });
    app.get("/articles/:n", async (req, res) => {
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
        const dbRes = await dbArticles.limit(parseInt(req.params.n)).get({}, () => {
            return res.send(500);
        });
        if (dbRes.empty) {
            return res.send(404);
        }
        let articles = [];
        dbRes.forEach((article) => {
            articles.push(article.data());
        });
        return res.send(articles);
    });
    app.get("/article/:id", async (req, res) => {
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
        const dbRes = await dbArticles.doc(req.params.id).get({}, () => {
            return res.send(500);
        });
        if (!dbRes.exists) {
            return res.send(404);
        }
        return res.send(dbRes.data());
    });
    app.get("/createArticle/:tags/:title/:content/:imgSrc", async (req, res) => {
        const article = {
            tags: req.params.tags.replace(/_/g, " ").split(","),
            title: req.params.title,
            content: req.params.content,
            imgSrc: req.params.imgSrc
        };
        const dbRes = await dbArticles.add(article, () => {
            return res.send(500);
        });
        return res.send(dbRes.id);
    });
    app.get("/deleteArticle/:id", async (req, res) => {
        if (!req.params.id) {
            return res.send(400);
        }
        const dbRes = await dbArticles.doc(req.params.id).delete({}, () => {
            return res.send(500);
        });
        return res.send(200);
    });
    app.post("/create-checkout-session", async (_, res) => {
        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            line_items: [
                {
                    price: "price_1LFM7cGCmjW4WxM6QknDdl19",
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
    app.post("/payment-successfull/:paymentId", async (req, res) => {
        const session = await stripe.checkout.sessions.retrieve(req.params.paymentId);
        if (session.payment_status === "paid") {
            console.log(req.session.userId);
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
            await userDoc.update({ payed: true }).catch(() => { return res.send(500); });
            return res.send(200);
        }
        return res.send(402);
    });
}
exports.createEndpoints = createEndpoints;
main();
//# sourceMappingURL=index.js.map