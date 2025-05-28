"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
  BookOpen,
  Monitor,
  Network,
  Building,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface Lab {
  id: string;
  name: string;
  block: string;
  ipSubnet: string;
  labAssistantCount: number;
  quizCount: number;
  isActive: boolean;
  capacity: number;
  createdAt: string;
}

const mockLabs: Lab[] = Array.from({ length: 30 }, (_, i) => {
  const labNames = [
    "Computer Lab 1",
    "Computer Lab 2",
    "Programming Lab A",
    "Programming Lab B",
    "Network Lab",
    "Database Lab",
    "Software Engineering Lab",
    "AI/ML Lab",
    "Cybersecurity Lab",
    "Web Development Lab",
    "Mobile App Lab",
    "Data Science Lab",
    "Research Lab 1",
    "Research Lab 2",
    "Testing Lab",
    "Hardware Lab",
  ];

  const blocks = ["A", "B", "C", "D", "E", "F"];
  const subnets = [
    "192.168.1.0/24",
    "192.168.2.0/24",
    "192.168.3.0/24",
    "192.168.4.0/24",
    "10.0.1.0/24",
    "10.0.2.0/24",
    "10.0.3.0/24",
    "172.16.1.0/24",
    "172.16.2.0/24",
    "172.16.3.0/24",
  ];

  return {
    id: `uuid-lab-${i + 1}`,
    name: labNames[i % labNames.length],
    block: blocks[i % blocks.length],
    ipSubnet: subnets[i % subnets.length],
    labAssistantCount: Math.floor(Math.random() * 4) + 1,
    quizCount: Math.floor(Math.random() * 15) + 3,
    isActive: i % 8 !== 0,
    capacity: Math.floor(Math.random() * 30) + 20,
    createdAt: new Date(2024, i % 12, 1 + i).toISOString(),
  };
});

const AddLabDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string>("");

  const blockOptions = [
    { value: "A", label: "Block A" },
    { value: "B", label: "Block B" },
    { value: "C", label: "Block C" },
    { value: "D", label: "Block D" },
    { value: "E", label: "Block E" },
    { value: "F", label: "Block F" },
  ];

  const assistantOptions = [
    { value: "assistant1", label: "John Smith" },
    { value: "assistant2", label: "Sarah Davis" },
    { value: "assistant3", label: "Mike Johnson" },
    { value: "assistant4", label: "Emily Wilson" },
    { value: "assistant5", label: "David Brown" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Add Lab
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Lab</DialogTitle>
          <DialogDescription>
            Create a new lab with network configuration and assignments.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lab-name">Lab Name</Label>
              <Input id="lab-name" placeholder="Computer Lab 1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="block">Block</Label>
              <SearchableSelect
                options={blockOptions}
                value={selectedBlock}
                onValueChange={setSelectedBlock}
                placeholder="Select block"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ip-subnet">IP Subnet</Label>
              <Input
                id="ip-subnet"
                placeholder="192.168.1.0/24"
                pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}/[0-9]{1,2}$"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="30"
                min="1"
                max="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Assign Lab Assistants</Label>
            <SearchableSelect
              options={assistantOptions}
              value=""
              onValueChange={() => {}}
              placeholder="Select lab assistants"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Notes (Optional)</Label>
            <Input
              id="description"
              placeholder="Special equipment, software, or requirements..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Create Lab</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const sortOptions = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "block-asc", label: "Block (A-Z)" },
  { value: "block-desc", label: "Block (Z-A)" },
  { value: "capacity-desc", label: "Largest Capacity" },
  { value: "capacity-asc", label: "Smallest Capacity" },
  { value: "quizCount-desc", label: "Most Quizzes" },
  { value: "quizCount-asc", label: "Least Quizzes" },
];

export default function LabPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [blockFilter, setBlockFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Lab>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterOpen, setFilterOpen] = useState(false);

  // Bulk selection state
  const [selectedLabs, setSelectedLabs] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<
    "activate" | "deactivate" | "delete" | null
  >(null);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: [
      "labs",
      page,
      pageSize,
      searchTerm,
      blockFilter,
      statusFilter,
      sortField,
      sortDirection,
    ],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100));

      let filteredLabs = [...mockLabs];

      if (searchTerm) {
        filteredLabs = filteredLabs.filter(
          (lab) =>
            lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lab.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lab.ipSubnet.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      if (blockFilter) {
        filteredLabs = filteredLabs.filter((lab) => lab.block === blockFilter);
      }

      if (statusFilter) {
        const isActive = statusFilter === "active";
        filteredLabs = filteredLabs.filter((lab) => lab.isActive === isActive);
      }

      filteredLabs.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
          if (sortField === "createdAt") {
            const aDate = new Date(aValue).getTime();
            const bDate = new Date(bValue).getTime();
            return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
          }
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          return sortDirection === "asc"
            ? (aValue ? 1 : 0) - (bValue ? 1 : 0)
            : (bValue ? 1 : 0) - (aValue ? 1 : 0);
        }

        return 0;
      });

      const totalLabs = filteredLabs.length;
      const totalPages = Math.ceil(totalLabs / pageSize);
      const paginatedLabs = filteredLabs.slice(
        (page - 1) * pageSize,
        page * pageSize,
      );

      return {
        labs: paginatedLabs,
        totalLabs,
        totalPages,
      };
    },
  });

  const handleSort = (field: keyof Lab) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIndicator = (field: keyof Lab) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  // Bulk action handlers
  const handleSelectAll = () => {
    if (!data?.labs) return;

    if (selectAll) {
      setSelectedLabs([]);
    } else {
      const currentPageLabIds = data.labs.map((lab) => lab.id);
      setSelectedLabs((prev) => {
        const otherPageSelected = prev.filter(
          (id) => !currentPageLabIds.includes(id),
        );
        return [...otherPageSelected, ...currentPageLabIds];
      });
    }
  };

  const handleSelectLab = (labId: string) => {
    setSelectedLabs((prev) => {
      if (prev.includes(labId)) {
        return prev.filter((id) => id !== labId);
      } else {
        return [...prev, labId];
      }
    });
  };

  const handleBulkAction = (action: "activate" | "deactivate" | "delete") => {
    setBulkActionType(action);
    setShowBulkConfirm(true);
  };

  const executeBulkAction = async () => {
    setIsBulkProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const actionText =
        bulkActionType === "activate"
          ? "activated"
          : bulkActionType === "deactivate"
            ? "deactivated"
            : "deleted";

      toast(`Successfully ${actionText} ${selectedLabs.length} lab(s)`, {
        style: { background: "#10B981", color: "white" },
      });

      setSelectedLabs([]);
      setShowBulkConfirm(false);
      setBulkActionType(null);
    } catch (error) {
      toast("Failed to perform bulk action", {
        style: { background: "#EF4444", color: "white" },
      });
      console.log(error);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Effect to manage bulk actions visibility
  React.useEffect(() => {
    setShowBulkActions(selectedLabs.length > 0);
  }, [selectedLabs]);

  // Effect to manage select all state
  React.useEffect(() => {
    if (data?.labs) {
      const currentPageLabIds = data.labs.map((lab) => lab.id);
      const selectedOnCurrentPage = selectedLabs.filter((id) =>
        currentPageLabIds.includes(id),
      );
      setSelectAll(
        selectedOnCurrentPage.length === currentPageLabIds.length &&
          currentPageLabIds.length > 0,
      );
    }
  }, [data?.labs, selectedLabs]);

  const generatePageNumbers = () => {
    const pages = [];
    const totalPages = data?.totalPages || 0;
    const currentPage = page;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 4) {
        pages.push("ellipsis-start");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("ellipsis-end");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const uniqueBlocks = Array.from(new Set(mockLabs.map((l) => l.block))).sort();

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Lab Management</CardTitle>
            <CardDescription>
              Manage computer labs, network settings, and assignments
            </CardDescription>
          </div>
          <AddLabDialog />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 w-full max-w-sm items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search labs..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <SlidersHorizontal size={16} />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <SearchableSelect
                  options={sortOptions}
                  value={`${sortField}-${sortDirection}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split("-") as [
                      keyof Lab,
                      "asc" | "desc",
                    ];
                    setSortField(field);
                    setSortDirection(direction);
                  }}
                  placeholder="Sort by..."
                  className="w-[160px]"
                />
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => setPageSize(parseInt(value))}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filterOpen && (
              <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/20 flex-wrap">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="block-filter"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Block:
                  </Label>
                  <SearchableSelect
                    value={blockFilter || "all"}
                    onValueChange={(value) =>
                      setBlockFilter(value === "all" ? null : value)
                    }
                    placeholder="All blocks"
                    options={[
                      { value: "all", label: "All Blocks" },
                      ...uniqueBlocks.map((block) => ({
                        value: block,
                        label: `Block ${block}`,
                      })),
                    ]}
                    className="w-[120px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="status-filter"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Status:
                  </Label>
                  <SearchableSelect
                    value={statusFilter || "all"}
                    onValueChange={(value) =>
                      setStatusFilter(value === "all" ? null : value)
                    }
                    placeholder="All status"
                    options={[
                      { value: "all", label: "All Status" },
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                    ]}
                    className="w-[120px]"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setBlockFilter(null);
                    setStatusFilter(null);
                    setSearchTerm("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}

            {/* Bulk Actions Bar */}
            {showBulkActions && (
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {selectedLabs.length} lab(s) selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("activate")}
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-950/50"
                  >
                    <UserCheck size={16} />
                    Activate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("deactivate")}
                    className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-950/50"
                  >
                    <UserX size={16} />
                    Deactivate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("delete")}
                    className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedLabs([]);
                      setSelectAll(false);
                    }}
                    className="hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            )}

            <div className="rounded-md border relative">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all labs"
                      />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Lab Name{getSortIndicator("name")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("block")}
                    >
                      Block{getSortIndicator("block")}
                    </TableHead>
                    <TableHead>IP Subnet</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("capacity")}
                    >
                      Capacity{getSortIndicator("capacity")}
                    </TableHead>
                    <TableHead>Lab Assistants</TableHead>
                    <TableHead>Quizzes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: pageSize }).map((_, index) => (
                      <TableRow key={`loading-${index}`}>
                        <TableCell>
                          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : data?.labs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        No labs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.labs.map((lab) => (
                      <TableRow key={lab.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedLabs.includes(lab.id)}
                            onCheckedChange={() => handleSelectLab(lab.id)}
                            aria-label={`Select ${lab.name}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Monitor
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span className="font-medium">{lab.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-700 border-orange-200"
                          >
                            <Building size={12} className="mr-1" />
                            Block {lab.block}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 font-mono text-sm">
                            <Network
                              size={14}
                              className="text-muted-foreground"
                            />
                            {lab.ipSubnet}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {lab.capacity} seats
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users
                              size={14}
                              className="text-muted-foreground"
                            />
                            {lab.labAssistantCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <BookOpen
                              size={14}
                              className="text-muted-foreground"
                            />
                            {lab.quizCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={lab.isActive ? "default" : "secondary"}
                          >
                            {lab.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Lab</DropdownMenuItem>
                              <DropdownMenuItem>
                                Manage Assistants
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Network Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem>View Quizzes</DropdownMenuItem>
                              <DropdownMenuItem>
                                Equipment List
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className={
                                  lab.isActive
                                    ? "text-red-600"
                                    : "text-green-600"
                                }
                              >
                                {lab.isActive ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {Math.min((page - 1) * pageSize + 1, data?.totalLabs || 0)} to{" "}
                {Math.min(page * pageSize, data?.totalLabs || 0)} of{" "}
                {data?.totalLabs || 0} labs
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                      className={
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {generatePageNumbers().map((pageNumber, index) => (
                    <PaginationItem key={index}>
                      {pageNumber === "ellipsis-start" ||
                      pageNumber === "ellipsis-end" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(pageNumber as number);
                          }}
                          isActive={pageNumber === page}
                        >
                          {pageNumber}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < (data?.totalPages || 0)) setPage(page + 1);
                      }}
                      className={
                        page === (data?.totalPages || 0)
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Action Confirmation Dialog */}
      <AlertDialog open={showBulkConfirm} onOpenChange={setShowBulkConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkActionType === "delete"
                ? "Delete Labs"
                : bulkActionType === "activate"
                  ? "Activate Labs"
                  : "Deactivate Labs"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {bulkActionType === "delete"
                ? `Are you sure you want to delete ${selectedLabs.length} lab(s)? This action cannot be undone.`
                : `Are you sure you want to ${bulkActionType} ${selectedLabs.length} lab(s)?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeBulkAction}
              disabled={isBulkProcessing}
              className={
                bulkActionType === "delete" ? "bg-red-600 hover:bg-red-700" : ""
              }
            >
              {isBulkProcessing ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
