import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../config/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { db } = await connectToDatabase();
  console.log("request===>", req.method)
  switch (req.method) {
    case 'GET':
      const liveBets = await db.collection("lives").find().toArray();
      return res.status(200).json(liveBets);
    case 'POST':
      // const data = JSON.parse(req.body);
      console.log("------------saveLives-------------", req.body);
      console.log("transaction", req.body.transaction);
      console.log("playerAddress", req.body.playAddress);
      console.log("wager", (req.body.wager));
      console.log("numbets", (req.body.numbets));
      console.log("multiplier", req.body.multiplier);
      console.log("profit", req.body.profit);
      console.log("game", req.body.game);
      console.log("date", req.body.date);

      const newLive = {
        game: req.body.game,
        transaction: req.body.transaction,
        playAddress: req.body.playAddress,
        wager: Number(req.body.wager),
        numbets: req.body.numbets,
        multiplier: Number(req.body.multiplier),
        profit: Number(req.body.profit),
        date: new Date(req.body.date)
      };
      await db.collection("lives").insertOne(newLive);
      return res.status(200).json(newLive);
    default:
      return;
  }
};