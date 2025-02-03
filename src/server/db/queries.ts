import "server-only";

import {
  files_table as filesSchema,
  folders_table as foldersSchema,
  DB_FolderType,
  DB_FileType,
} from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";

export const QUERIES = {
  getFolders: function (folderId: number) {
    // since i am returning a promise, no need to async/await. Node smart enough to infer from returning a promise
    return db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.parent, folderId));
  },

  getFiles: function (folderId: number) {
    return db
      .select()
      .from(filesSchema)
      .where(eq(filesSchema.parent, folderId));
  },

  getAllParentsForFolder: async function (folderId: number) {
    const parents = [];
    let currentId: number | null = folderId;
    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(foldersSchema)
        .where(eq(foldersSchema.id, currentId));

      if (!folder[0]) {
        throw new Error("Parent folder not found");
      }
      parents.unshift(folder[0]);
      currentId = folder[0]?.parent;
    }
    return parents;
  },
};

export const MUTATIONS = {
  createFile: async function (input: {
    file: {
      name: string;
      size: number;
      url: string;
      parent: number;
    };
    userId: string;
  }) {
    return await db.insert(filesSchema).values({ ...input.file, parent: 1 });
  },
};
