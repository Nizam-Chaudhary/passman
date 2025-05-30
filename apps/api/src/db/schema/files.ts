import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { users } from "./schema";

export const files = pgTable("files", {
    id: serial("id").primaryKey(),
    url: varchar("url", { length: 512 }).notNull(),
    fileKey: varchar("file_key", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdateFn(() => new Date()),
});

export const filesRelations = relations(files, ({ one }) => ({
    user: one(users),
}));
