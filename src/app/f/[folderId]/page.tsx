import {
  files as filesSchema,
  folders as foldersSchema,
} from "~/server/db/schema";
import { db } from "~/server/db";
import DriveContents from "../../drive-contents";
import { eq } from "drizzle-orm";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>; // since folderId is diff depend on users, make it a promise
}) {
  const params = await props.params; // await will let compiler and all layers know below this is dynamic code
  const parsedFolderId = parseInt(params.folderId);
  if (isNaN(parsedFolderId)) return <div> Invalid Folder Id</div>;

  console.log(params.folderId);
  const files = await db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, parsedFolderId));
  const folders = await db
    .select()
    .from(foldersSchema)
    .where(eq(foldersSchema.parent, parsedFolderId));
  return <DriveContents files={files} folders={folders} />;
}
