import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.string("firstName").notNullable();
    table.string("lastName").notNullable();
    table.string("bankAccountNumber").unique();
    table.string("bankName").defaultTo("Raven Bank");
    table.decimal("balance", 15, 2).defaultTo(0.0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
    table.uuid("userId").references("id").inTable("users").onDelete("CASCADE");
    table.enum("type", ["DEPOSIT", "TRANSFER"]).notNullable();
    table.string("reference").notNullable();
    table.decimal("amount", 15, 2).notNullable();
    table.string("senderBank").nullable();
    table.string("senderName").nullable();
    table.string("recipientBank").nullable();
    table.string("recipientName").nullable();
    table.string("recipientAccount").nullable();
    table.enum("status", ["PENDING", "SUCCESS", "FAILED"]).defaultTo("PENDING");
    table.json("metadata").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("transactions");
  await knex.schema.dropTable("users");
}
