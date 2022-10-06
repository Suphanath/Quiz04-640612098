import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";
import { checkToken } from "../../backendLibs/checkToken";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    if (!user?.isAdmin)
      return res.status(403).json({
        ok: false,
        message: "Permission denied",
      });
    //return res.status(403).json({ ok: false, message: "Permission denied" });
    const users = readUsersDB();
    let countAdmin = 0;
    let countUser = 0;
    let amountMoney = 0;
    users.forEach((ele) => {
      if (ele.isAdmin) {
        countAdmin++;
      } else {
        countUser++;
        amountMoney += ele.money;
      }
    });
    //compute DB summary
    return res.status(200).json({
      ok: true,
      userCount: countUser,
      adminCount: countAdmin,
      totalMoney: amountMoney,
    });
    //return response
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
