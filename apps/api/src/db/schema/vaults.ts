import { relations } from "drizzle-orm";
import {
    integer,
    pgTable,
    serial,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

import { notes, passwords, users } from "./schema";

export const vaults = pgTable("vaults", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id),
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
