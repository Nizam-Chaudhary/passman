import { relations } from "drizzle-orm";

import {
    boolean,
    int,
    json,
    mysqlTable,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";

import type { MasterKey } from "@passman/schema/api";
import { files, passwords, vaults } from "../schema";

export const users = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    userName: varchar("user_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    masterPassword: varchar("master_password", { length: 255 }),
    masterKey: json("master_key").$type<MasterKey>(),
    recoveryKey: json("recovery_key").$type<MasterKey>(),
    isVerified: boolean("is_verified").default(false).notNull(),
    otp: varchar("otp", { length: 6 }).notNull(),
    fileId: int(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date()),
});

export const usersRelations = relations(users, ({ one, many }) => ({
    passwords: many(passwords),
    vaults: many(vaults),
    file: one(files, { references: [files.id], fields: [users.fileId] }),
}));
