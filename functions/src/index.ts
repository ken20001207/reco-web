import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { User } from "../../src/utils/classes";

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const app = require("express")();
const cors = require("cors")();

app.use(cors);

function updateUserData(data: User) {
    const ref = db.collection("userdata").doc(data.username);
    return ref.set(data);
}

app.post("/update", (req: any, res: any) => {
    try {
        res.json(updateUserData(JSON.parse(req.body)));
    } catch (err) {
        res.write(err.message);
    }
});

app.get("/userdata/:id", async (req: any, res: any) => {
    const ref = db.collection("userdata").doc(req.params.id);
    ref.get()
        .then(doc => {
            res.json(doc.data());
        })
        .catch(err => {
            res.json({ code: 501, error: err });
        });
});

export const api = functions.https.onRequest(app);
