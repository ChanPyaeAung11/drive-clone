"use client";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createFolder } from "~/server/actions";

import { FolderPlus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { create } from "domain";

export function NewFolderButton(props: {
  parentFolderId: number;
  userId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => setIsOpen(false);
  return (
    <div>
      <Button
        variant={"secondary"}
        onMouseDown={() => {
          setIsOpen(true);
        }}
      >
        New Folder
        <FolderPlus />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <InputForm
            parentFolderId={props.parentFolderId}
            userId={props.userId}
            onSuccess={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const FormSchema = z.object({
  folderName: z
    .string()
    .min(1, {
      message: "Folder name cannot be empty",
    })
    .max(255, "Folder name is too long")
    .trim(),
});

export function InputForm(props: {
  parentFolderId: number;
  userId: string;
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      folderName: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    // without await, isLoading doesnt change practically and shows up on UI
    const createResult = await createFolder(
      props.parentFolderId,
      props.userId,
      data.folderName,
    );
    setIsLoading(false);
    if (createResult.success) {
      props.onSuccess();
      toast({
        title: `You have created this folder:`,
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{data.folderName}</code>
          </pre>
        ),
      });
    } else {
      props.onSuccess();
      toast({
        variant: "destructive",
        title: `There was a problem with your request.`,
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              Failed to create ${data.folderName}
            </code>
          </pre>
        ),
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onMouseDown={form.handleSubmit(onSubmit)}
        className="w-2/3 space-y-6"
      >
        <FormField // shadcn component for all props related to form
          control={form.control} //react hook form pass us control for state and validation
          name="folderName" // name allows us to refer via data.
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folder Name</FormLabel>
              <FormControl>
                <Input placeholder="Fantastic 4" {...field} />
              </FormControl>
              <FormDescription>This will be your folder name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}
