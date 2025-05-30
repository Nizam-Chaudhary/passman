import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { users, vaults } from "./schema";

export const notes = pgTable("notes", {
    id: serial().primaryKey(),
    userId: integer()
        .notNull()
        .references(() => users.id),
    vaultId: integer()
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
