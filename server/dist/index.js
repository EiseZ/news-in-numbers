"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEndpoints = void 0;
const express_1 = __importDefault(require("express"));
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
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
    const serviceAccount = require("../../../../api-keys/news-in-numbers.json");
    (0, app_1.initializeApp)();
    const db = (0, firestore_1.getFirestore)();
    const dbUsers = await db.collection("users");
    const dbArticles = await db.collection("articles");
    const expressApp = (0, express_1.default)();
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
    app.get("/createUser/:name/:password", async (req, res) => {
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
    app.get("/deleteUser/:id", async (req, res) => {
        if (!req.params.id) {
            return res.send(400);
        }
        const dbRes = await dbUsers.doc(req.params.id).delete({}, () => {
            return res.send(500);
        });
        return res.send(200);
    });
    app.get("/article/:id", async (req, res) => {
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
}
exports.createEndpoints = createEndpoints;
main();
//# sourceMappingURL=index.js.map