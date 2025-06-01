import { relations } from "drizzle-orm";
import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

import { users } from "../schema";

export const files = mysqlTable("files", {
    id: int("id").autoincrement().primaryKey(),
    url: varchar("url", { length: 512 }).notNull(),
    userId: int("user_id").notNull(),
    fileKey: varchar("file_key", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdateFn(() => new Date()),
});

export const filesRelations = relations(files, ({ one }) => ({
    user: one(users, {
        fields: [files.userId],
        references: [users.id],
    }),
}));
