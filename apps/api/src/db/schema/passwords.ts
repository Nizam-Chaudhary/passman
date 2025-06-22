import { relations } from "drizzle-orm";

import {
    int,
    json,
    mysqlTable,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";

import type { EncryptedPassword } from "@passman/schema/api";
import { users, vaults } from "../schema";

export const passwords = mysqlTable("passwords", {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    vaultId: int("vault_id")
        .notNull()
        .references(() => vaults.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }),
    url: varchar("url", { length: 255 }).notNull(),
    username: varchar("username", { length: 255 }).notNull(),
    password: json("password").$type<EncryptedPassword>().notNull(),
    faviconUrl: varchar("favicon_url", { length: 255 }),
    note: varchar("note", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdateFn(() => new Date()),
});

export const passwordsRelations = relations(passwords, ({ one }) => ({
    user: one(users, {
        fields: [passwords.userId],
        references: [users.id],
    }),
    vault: one(vaults, {
        fields: [passwords.userId],
        references: [vaults.id],
    }),
}));
