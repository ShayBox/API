import { Client } from "discord.js";
import apicache from "apicache";
import express from "express";
import fetch from "node-fetch";
import path from "path";

const router = express.Router();
const cache = apicache.options({
	headers: {
		"cache-control": "no-cache",
	},
}).middleware;

const { GITHUB_TOKEN, GIST_ID } = process.env;
if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not provided");
if (!GIST_ID) throw new Error("GIST_ID not provided");

router.get("/reset", cache("1 day"), (req, res) => {
	if (!req.query.token) {
		res.sendFile(path.join(__dirname, "..", "..", "assets", "html", "token.html"));
		return;
	}

	if (typeof req.query.token !== "string") {
		res.status(400).json({ message: "Token is not a string" });
		return;
	}

	(req as any).apicacheGroup = req.query.token;

	const client = new Client({ shards: "auto" });

	client.on("ready", async () => {
		res.json({
			application: client.fetchApplication(),
			channels: client.channels.cache,
			guilds: client.guilds.cache,
			user: client.user,
			users: client.users.cache,
		});

		client.destroy();

		await fetch(`https://api.github.com/gists/${GIST_ID}`, {
			body: JSON.stringify({
				files: {
					TOKEN: {
						content: req.query.token,
					},
				},
			}),
			headers: {
				"Content-Type": "application/json",
				Authorization: GITHUB_TOKEN,
			},
			method: "patch",
		});
	});

	client.login(req.query.token).catch(() => res.status(404).json({ message: "Not a valid token" }));
});

export default router;
