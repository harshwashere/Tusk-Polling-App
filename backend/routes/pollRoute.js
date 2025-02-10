import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { bookmarkpoll, closepoll, createpoll, deletepoll, getallpolls, getbookmarkedpoll, getpollbyid, getvotedpolls, voteonpoll } from "../controllers/pollController.js";

const pollroute = Router()

pollroute.post("/create", protect, createpoll)

pollroute.get("/getallpolls", protect, getallpolls)

pollroute.get("/votedpolls", protect, getvotedpolls)

pollroute.get("/:id", protect, getpollbyid)

pollroute.post("/:id/vote", protect, voteonpoll)

pollroute.post("/:id/close", protect, closepoll)

pollroute.post("/:id/bookmark", protect, bookmarkpoll)

pollroute.get("/user/bookmarked", protect, getbookmarkedpoll)

pollroute.delete("/:id/delete", protect, deletepoll)

export default pollroute