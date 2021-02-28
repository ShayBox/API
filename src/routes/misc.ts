import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/scmowns", async (req, res) => {
  const url = "https://gy4lj50e70.execute-api.us-west-1.amazonaws.com/SCMownsConn2020";
  const result = await fetch(url);
  const json = await result.json();
  const data = json.raw_text.split(".");
  const address = `${data[13]}.${data[29]}.${data[19]}.${data[data.length - 2]}:${data[10]}`;

  res.send(address);
});

export default router;
