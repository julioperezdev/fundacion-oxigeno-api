"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../../controller/AuthController");
const router = express_1.Router();
router.route("/signup")
    .post(AuthController_1.signUp);
exports.default = router;
