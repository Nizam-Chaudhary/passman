import { relations } from "drizzle-orm";
import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

import { notes, passwords, users } from "../schema";

export const vaults = mysqlTable("vaults", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    userId: int("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdateFn(() => new Date()),
});

export const vaultsRelations = relations(vaults, ({ one, many }) => ({
    passwords: many(passwords),
    notes: many(notes),
    user: one(users, {
        fields: [vaults.userId],
        references: [users.id],
    }),
}));
