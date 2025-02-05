import {
  Folder as FolderIcon,
  FileIcon,
  Trash2Icon,
  Loader2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { deleteFile, deleteFolder } from "~/server/actions";
import type { files_table, folders_table } from "~/server/db/schema";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const k = 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = (bytes / Math.pow(k, i)).toFixed(2);
  return `${size} ${units[i]}`;
}

export function FileRow(props: { file: typeof files_table.$inferSelect }) {
  const { file } = props;

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFile(file.id);
    } catch (error) {
      setIsDeleting(false);
      return <div> Error deleting the file</div>;
    }
  };

  return (
    <li
      key={file.id}
      className={`hover:bg-gray-750 border-b border-gray-700 px-6 py-4 ${isDeleting ? "bg-gray-800 opacity-50" : ""} `}
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <a
            href={file.url}
            className="flex items-center text-gray-100 hover:text-blue-400"
            target="_blank"
          >
            <FileIcon className="mr-3" size={20} />
            {file.name}
          </a>
        </div>
        <div className="col-span-2 text-gray-400">{file.type}</div>
        <div className="col-span-3 text-gray-400">
          {formatFileSize(file.size)}
        </div>
        <div className="col-span-1 text-gray-400">
          <Button
            variant="ghost"
            onMouseDown={handleDelete}
            disabled={isDeleting}
            aria-label="Delete file"
          >
            {isDeleting ? (
              <Loader2Icon size={20} className="animate-spin" />
            ) : (
              <Trash2Icon size={20} />
            )}
          </Button>
        </div>
      </div>
    </li>
  );
}

export function FolderRow(props: {
  folder: typeof folders_table.$inferSelect;
}) {
  const { folder } = props;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteFolder(folder.id);
    } catch (e) {
      setIsDeleting(false);
      return <div> Error deleting the folder</div>;
    }
  };
  return (
    <li
      key={folder.id}
      className={`hover:bg-gray-750 border-b border-gray-700 px-6 py-4 ${isDeleting ? "bg-gray-800 opacity-50" : ""} ?`}
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <Link
            href={`/f/${folder.id}`}
            className="flex items-center text-gray-100 hover:text-blue-400"
          >
            <FolderIcon className="mr-3" size={20} />
            {folder.name}
          </Link>
        </div>
        <div className="col-span-2 text-gray-400">Folder</div>
        <div className="col-span-3 text-gray-400"></div>
        <div className="col-span-1 text-gray-400">
          <Button
            variant="ghost"
            onMouseDown={handleDelete}
            disabled={isDeleting}
            aria-label="Delete folder"
          >
            {isDeleting ? (
              <Loader2Icon size={20} className="animate-spin" />
            ) : (
              <Trash2Icon size={20} />
            )}
          </Button>
        </div>
      </div>
    </li>
  );
}
