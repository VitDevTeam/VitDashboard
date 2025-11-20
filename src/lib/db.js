import postgres from "postgres";
import {DB_URL} from '$env/static/private'
const sql = postgres(DB_URL, {max:3, min:1})

export default sql

