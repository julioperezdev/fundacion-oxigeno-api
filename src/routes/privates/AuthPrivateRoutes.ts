import {Router} from "express";
import {signUp} from "../../controller/AuthController";


const router = Router();

router.route("/signup")
.post(signUp);

export default router;
