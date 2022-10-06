import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";
import { checkToken } from "../../backendLibs/checkToken";

export default function withdrawRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    const user = checkToken(req);
    if (!user || user.isAdmin)
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to withdraw",
      });
    //return res.status(403).json({ ok: false, message: "You do not have permission to withdraw" });

    const amount = req.body.amount;
    //validate body
    if (typeof amount !== "number")
      return res.status(400).json({ ok: false, message: "Invalid amount" });

    //check if amount < 1
    if (amount < 1)
      return res
        .status(400)
        .json({ ok: false, message: "Amount must be greater than 0" });
    // return res.status(400).json({ ok: false, message: "Amount must be greater than 0" });
    const users = readUsersDB();
    //find and update money in DB (if user has enough money)
    const userResult = users.find((x) => x.username === user.username);
    if (userResult.money < amount)
      return res
        .status(400)
        .json({ ok: false, message: "You do not has enough money" });
    userResult.money -= amount;
    writeUsersDB(users);
    //return res.status(400).json({ ok: false, message: "You do not has enough money" });
    return res.status(200).json({ ok: true, money: userResult.money });

    //return response
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
