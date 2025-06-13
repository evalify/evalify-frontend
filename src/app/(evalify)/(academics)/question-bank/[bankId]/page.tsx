"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Bank from "@/repo/bank/bank";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Topic {
  id: string;
  name: string;
}

function TopicSidebar({
  topics,
  selectedTopics,
  onTopicToggle,
  onCreateTopic,
  onDeleteTopic,
  onEditTopic,
  isCreating = false,
}: {
  topics: Topic[];
  selectedTopics: string[];
  onTopicToggle: (topicId: string) => void;
  onCreateTopic: (name: string) => void;
  onDeleteTopic: (topicId: string) => void;
  onEditTopic: (topicId: string, name: string) => void;
  isCreating?: boolean;
}) {
  const [newTopicName, setNewTopicName] = useState("");
  const [editingTopic, setEditingTopic] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleCreateTopic = () => {
    if (newTopicName.trim()) {
      onCreateTopic(newTopicName.trim());
      setNewTopicName("");
    }
  };

  const handleEditTopic = (topicId: string, newName: string) => {
    if (newName.trim()) {
      onEditTopic(topicId, newName.trim());
      setEditingTopic(null);
    }
  };

  const startEditing = (topic: Topic) => {
    setEditingTopic({ id: topic.id, name: topic.name });
  };

  const cancelEditing = () => {
    setEditingTopic(null);
  };

  const getDisplayName = (name: string) => {
    return name.length > 30 ? `${name.slice(0, 30)}...` : name;
  };

  return (
    <TooltipProvider>
      <Card className="w-80 h-full">
        <CardHeader className="">
          <CardTitle className="text-lg">Topics ({topics.length})</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="p-2 space-y-2">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors group ${
                    selectedTopics.includes(topic.id)
                      ? "bg-accent border-primary"
                      : ""
                  }`}
                >
                  {editingTopic?.id === topic.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editingTopic.name}
                        onChange={(e) =>
                          setEditingTopic({
                            ...editingTopic,
                            name: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleEditTopic(topic.id, editingTopic.name);
                          if (e.key === "Escape") cancelEditing();
                        }}
                        className="text-sm h-8"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          handleEditTopic(topic.id, editingTopic.name)
                        }
                        className="h-8 px-2"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditing}
                        className="h-8 px-2"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div
                        className="flex-1 cursor-pointer min-w-0"
                        onClick={() => onTopicToggle(topic.id)}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm font-medium block">
                              {getDisplayName(topic.name)}
                            </span>
                          </TooltipTrigger>
                          {topic.name.length > 30 && (
                            <TooltipContent>
                              <p>{topic.name}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 flex-shrink-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => startEditing(topic)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteTopic(topic.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2 justify-center items-center">
              <Input
                placeholder="Enter topic name"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateTopic();
                }}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={handleCreateTopic}
                disabled={!newTopicName.trim() || isCreating}
                className=""
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

export default function BankPage({
  params,
}: {
  params: Promise<{
    bankId: string;
  }>;
}) {
  const param = use(params);
  const { bankId } = param;
  const router = useRouter();
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const { data: bank, isLoading: bankLoading } = useQuery({
    queryKey: ["bank", bankId],
    queryFn: () => Bank.getBankById(bankId),
  });

  const { data: topics, isLoading: isLoadingTopics } = useQuery({
    queryKey: ["bankTopics", bankId],
    queryFn: () => Bank.getBankTopics(bankId),
    enabled: !!bank,
  });

  const createTopicMutation = useMutation({
    mutationFn: (topicName: string) => Bank.addBankTopic(bankId, topicName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankTopics", bankId] });
      success("Topic created successfully");
    },
    onError: (err) => {
      error("Failed to create topic");
      console.error("Error creating topic:", err);
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: (topicId: string) => Bank.deleteBankTopic(bankId, topicId),
    onSuccess: (_, topicId) => {
      queryClient.invalidateQueries({ queryKey: ["bankTopics", bankId] });
      setSelectedTopics((prev) => prev.filter((id) => id !== topicId));
      success("Topic deleted successfully");
    },
    onError: (err) => {
      error("Failed to delete topic");
      console.error("Error deleting topic:", err);
    },
  });

  const editTopicMutation = useMutation({
    mutationFn: ({ topicId, name }: { topicId: string; name: string }) =>
      Bank.updateBankTopic(bankId, topicId, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankTopics", bankId] });
      success("Topic updated successfully");
    },
    onError: (err) => {
      error("Failed to update topic");
      console.error("Error updating topic:", err);
    },
  });

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId],
    );
  };

  const handleCreateTopic = (topicName: string) => {
    createTopicMutation.mutate(topicName);
  };

  const handleDeleteTopic = (topicId: string) => {
    deleteTopicMutation.mutate(topicId);
  };

  const handleEditTopic = (topicId: string, name: string) => {
    editTopicMutation.mutate({ topicId, name });
  };

  if (bankLoading || isLoadingTopics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!bank || !topics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Bank not found</div>
      </div>
    );
  }

  const selectedTopicNames = selectedTopics
    .map((id) => topics.find((topic) => topic.id === id)?.name)
    .filter(Boolean);

  return (
    <div className="flex bg-background">
      {/* Topic Sidebar */}
      <div className="border-r">
        <TopicSidebar
          topics={topics}
          selectedTopics={selectedTopics}
          onTopicToggle={handleTopicToggle}
          onCreateTopic={handleCreateTopic}
          onDeleteTopic={handleDeleteTopic}
          onEditTopic={handleEditTopic}
          isCreating={createTopicMutation.isPending}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl">{bank.name}</CardTitle>
                <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                  <span>Course Code: {bank.courseCode}</span>
                  <span>Semester: {bank.semester}</span>
                  <span>Questions: {bank.questions}</span>
                </div>
                {selectedTopicNames.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {selectedTopicNames.map((name, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={() =>
                  router.push(`/question-bank/${bankId}/question/create`)
                }
                disabled={selectedTopics.length === 0}
              >
                Add Question
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content Area */}
        <div className="mt-8">
          {selectedTopics.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Select one or more topics to view questions
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Questions for selected topics will be displayed here
              <div className="mt-2 text-sm">
                {selectedTopics.length} topic
                {selectedTopics.length !== 1 ? "s" : ""} selected
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
