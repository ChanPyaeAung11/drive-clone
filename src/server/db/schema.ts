import "server-only";

import {
  bigint,
  text,
  index,
  singlestoreTableCreator,
} from "drizzle-orm/singlestore-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = singlestoreTableCreator(
  (name) => `drive-clone_${name}`,
);
export const files = createTable(
  "files_table",
  {
    id: bigint("id", { mode: "bigint", unsigned: true })
      .primaryKey()
      .autoincrement(),
    name: text("name").notNull(),
    size: bigint("size", { mode: "bigint", unsigned: true }).notNull(),
    url: text("url").notNull(),
    parent: bigint("parent", { mode: "bigint", unsigned: true }).notNull(),
  },
  (t) => {
    return [index("idx_parent").on(t.parent)];
  },
);

export const folders = createTable(
  "folders_table",
  {
    id: bigint("id", { mode: "bigint", unsigned: true })
      .primaryKey()
      .autoincrement(),
    name: text("name").notNull(),
    parent: bigint("parent", { mode: "bigint", unsigned: true }),
  },
  (t) => {
    return [index("idx_parent").on(t.parent)];
  },
);
