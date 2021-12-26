const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7dpsf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function run() {
	try {
		await client.connect();
		const database = client.db('foodhuntdb');
		const items = database.collection('items');

		app.get('/items', async (req, res) => {
			const query = req.query;
			// const query = { type: type };
			console.log(query);
			const options = {
				sort: { title: 1 },
			};
			const cursor = items.find(query, options);
			const item = await cursor.toArray();
			res.json(item);
			if ((await cursor.count()) === 0) {
				console.log('No items found!');
			}
		});

		app.get('/items/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const item = await items.findOne(query);
			res.json(item);
		});

		app.post('/user', async (req, res) => {
			const user = req.body;
			console.log(user);
		});
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('food hunt');
});
app.listen(port, () => {
	console.log(`port number ${port}`);
});
