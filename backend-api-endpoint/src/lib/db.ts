import { db_config } from "@/config/db";
import knex from "knex";

const db = knex(db_config);

export default db;
