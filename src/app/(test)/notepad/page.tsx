"use client";

import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function NotepadPage() {
  const [content, setContent] = useState<string>("");

  const updateContent = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <div className="container mx-auto py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Evalify Notepad</h1>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-[200px] grid-cols-2 mx-auto mb-4">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <TiptapEditor
              className="bg-card shadow-sm"
              initialContent={content}
              onUpdate={updateContent}
            />
          </TabsContent>
          <TabsContent value="preview">
            <ContentPreview
              content={content}
              className="bg-card shadow-sm border rounded-md"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
