import express from 'express';
import { Client, KeyInfo, ThreadID } from '@textile/hub';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';

const { API_KEY, API_SECRET, DB_ID, JWT_SECRET } = require('../../config');

const app = express();

app.set('trust proxy', 1)
app.use(
    bodyParser.json(),
    (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', ['GET', 'POST']);
        res.header('Access-Control-Allow-Headers', '*');
        next();
    }
);

const threadId = ThreadID.fromString(DB_ID);

async function getClient() {
    const keyInfo: KeyInfo = {
        key: API_KEY,
        secret: API_SECRET
    };

    return await Client.withKeyInfo(keyInfo);
}

// ______________ROUTES________________

app.get('/exists/:publicKey', async (req, res) => {
    const publicKey = req.params.publicKey;
    const client = await getClient();  //how to not call this every endpoint???

    try {
        const user = await client.findByID(threadId, "Publishers", publicKey);
        res.send(user.instance);
    } catch {
        const newPublisher = {
            _id: publicKey,
            nonce: Math.floor(Math.random() * 10000),
            website: ""
        }
        await client.create(threadId, "Publishers", [newPublisher]);
        res.send(newPublisher);
    }
});

app.post('/users/auth', async (req, res) => {
    const { _id, signature } = req.body;

    //get user from db again
    const client = await getClient();
    const user = await client.findByID(threadId, "Publishers", _id);
    const msg = `I am signing my one-time nonce: ${user.instance.nonce}`;

    //recover signature
    const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
    const address = recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });

    //check sig and public key match
    if (address.toLowerCase() !== _id.toLowerCase()) {
      res.status(401).send({ error: 'Signature verification failed' });
    }

    //create and return jwt
    const accessToken = jwt.sign(_id, JWT_SECRET);
    res.json({ token: accessToken });
});

app.get('/publisher', verifyToken, (req, res) => {
    console.log("Publisher!");
    res.send("YOU ARE LOGGED IN");
});

app.get('/current-user', (req, res) => {
    res.send(document.cookie);
});

// ______________MIDDLEWARES________________

function verifyToken(req: any, res: any, next: any) {
    const bearerHeader = req.headers['authorization'];
    const token = bearerHeader && bearerHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if(err) {
            res.sendStatus(403);
        } else {
            req.user = user;
            next();
        }
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});