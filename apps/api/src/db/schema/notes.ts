import { relations } from "drizzle-orm";
import { int, mysqlTable, text, timestamp } from "drizzle-orm/mysql-core";

import { users, vaults } from "../schema";

export const notes = mysqlTable("notes", {
    id: int("id").autoincrement().primaryKey(),
    userId: int()
        .notNull()
        .references(() => users.id),
    vaultId: int()
        .notNull()
        .references(() => vaults.id),
    title: text("title").notNull(),
    content: text("content"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdateFn(() => new Date()),
});

export const notesRelations = relations(notes, ({ one }) => ({
    user: one(users, {
        fields: [notes.userId],
        references: [users.id],
    }),
    vault: one(vaults, {
        fields: [notes.vaultId],
        references: [vaults.id],
    }),
}));
