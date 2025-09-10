"use client";

import { z } from "zod";
import { FileText, ImageIcon, Loader2, Upload, XIcon } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CaseSchema } from "@/lib/schemas/case-schema";
import { useCreateCase } from "@/hooks/case/use-create-case";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/dummy-data";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type FormValues = z.infer<typeof CaseSchema>;

export function CaseForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(CaseSchema),
    defaultValues: { title: "", category: "", description: "", files: [] },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const { isCreatingCase, createCase } = useCreateCase();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await createCase(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Title <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a clear, descriptive title for your case"
                  disabled={form.formState.isSubmitting || isCreatingCase}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Category <span className="text-destructive">*</span>
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Description <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-32"
                  placeholder="Provide a detailed description of your legal matter, including relevant background information, key issues, and what you're looking to achieve"
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-xs">
                Be as specific as possible to help lawyers understand your needs
                and provide accurate quotes
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <Label>Documents (Optional)</Label>
              <p className="text-sm text-gray-500">
                Upload relevant documents (PDF or PNG files, max 10 files)
              </p>

              <div className="w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                >
                  <Upload className="w-10 h-10 text-gray-400" />
                  <span className="mt-3 text-sm font-medium text-gray-900">
                    Click to upload files
                  </span>
                  <span className="text-xs text-gray-500">
                    PDF or PNG files up to 10MB each
                  </span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.png"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files ?? []);

                    const validTypes = ["application/pdf", "image/png"];
                    const invalidFiles = selectedFiles.filter(
                      (file) => !validTypes.includes(file.type)
                    );

                    if (invalidFiles.length > 0) {
                      toast.error("Only PDF and PNG files are allowed");
                      return;
                    }

                    const value = field.value ?? [];

                    if (value.length + selectedFiles.length > 10) {
                      toast.error("Maximum 10 files allowed");
                      return;
                    }

                    field.onChange([...value, ...selectedFiles]);
                  }}
                />
              </div>

              {field.value && field.value.length > 0 && (
                <div className="space-y-3 mt-4">
                  <Label>Selected Files ({field.value.length}/10)</Label>
                  <div className="space-y-2">
                    {field.value.map((file: File, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {file.type === "application/pdf" ? (
                            <FileText className="h-5 w-5 text-red-500" />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-indigo-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="hover:!bg-gray-200"
                          onClick={() =>
                            field.onChange(
                              field.value?.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between items-center w-full mt-4">
          <Button
            type="button"
            variant="outline"
            disabled={form.formState.isSubmitting || isCreatingCase}
            asChild
          >
            <Link href="/client/dashboard">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isCreatingCase}
          >
            {(form.formState.isSubmitting || isCreatingCase) && (
              <Loader2 className="animate-spin text-white" />
            )}
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}
