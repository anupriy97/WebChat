const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql')

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const con = mysql.createConnection({
	host: '0.0.0.0',
	user: 'root',
	password: '12345',
	database: "irc",
});

con.connect();

app.post('/api/authen', (req, res) => {
	let query = "SELECT COUNT(*) FROM users WHERE username = '" + req.body.username + "' AND password = '" + req.body.password + "'";

	con.query(query, (error, result) => {
		if (error) {
			throw error;
		}
		if (result[0]['COUNT(*)'] == 0) {
			console.log("Invalid username and password...");
			res.send({ verified: false, message: "Username and Password not Valid...Please Regsiter !!"})
		} else {
			console.log("User: " + req.body.username + " Successfully logged in...")
			res.send({ verified: true, message: "Successfully Logged in !"})
		}
	})
});

app.post('/api/register', (req, res) => {
	let query1 = "SELECT COUNT(*) FROM users WHERE username = '" + req.body.username + "' AND password = '" + req.body.password + "'";

	con.query(query1, (error, result) => {
		if (error) {
			throw error;
		}
		if (result[0]['COUNT(*)'] == 1) {
			console.log("Username: " + req.body.username + " already exists");
			res.send({ message: "Username already exists !!"})
		} else {
			let query2 = "INSERT INTO users (username, password) VALUES ('" + req.body.username + "', '" + req.body.password + "')";
			con.query(query2, (error, result) => {
				if (error) {
					throw error;
				}
				console.log("User successfully added !");
				res.send({ message: "Registered Successfully !" });
			});
		}
	})
});

app.get('/api/users', (req, res) => {
	let query = "SELECT * FROM users";
	con.query(query, (error, result) => {
		if (error) {
			throw error;
		}
		// console.log(result);
		res.send(result);
	});
})

app.post('/api/chats', (req, res) => {
	let query = "SELECT * FROM chatdb WHERE (msgFrom='" + req.body.user + "' AND msgTo='" + req.body.friend + "') OR (msgFrom='" + req.body.friend + "' AND msgTo='" + req.body.user + "')";
	con.query(query, (error, result) => {
		if (error) {
			throw error;
		}
		// console.log(result);
		res.send(result);
	});
});

app.post('/api/send', (req, res) => {
	let query = "INSERT INTO chatdb (msgFrom, msgTo, message) VALUES ('" + req.body.user + "', '" + req.body.friend + "', '" + req.body.message + "')";
	con.query(query, (error, result) => {
		if (error) {
			throw error;
		}
		console.log("Message Sent successfully!!");
		res.send({ message: "Successfully sent!" });
	});
});

app.listen(port, () => console.log(`Listening on port ${port}`));