import { defineEventHandler, toWebRequest } from "h3";
import app from "../app";

export default defineEventHandler((event) => app.fetch(toWebRequest(event)));
