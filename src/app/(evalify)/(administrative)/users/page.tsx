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
  Trash2,
  UserCheck,
  UserX,
  CheckSquare,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  MANAGER = "MANAGER",
  SUPERVISOR = "SUPERVISOR",
}

interface User {
  id: string;
  name: string;
  email: string;
  profileId: string;
  image: string | null;
  role: Role;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
  lastPasswordChange: string | null;
}

const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `uuid-${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  profileId: `profile-${i + 1}`,
  image: i % 3 === 0 ? `https://i.pravatar.cc/150?u=${i}` : null,
  role: Object.values(Role)[i % 4],
  phoneNumber: `+1 (555) ${100 + i}-${1000 + i}`,
  isActive: i % 5 !== 0,
  createdAt: new Date(2024, 0, 1 + i).toISOString(), // Static dates starting from Jan 1, 2024
  lastPasswordChange:
    i % 2 === 0
      ? new Date(2024, 0, 15 + i).toISOString() // Static dates for password changes
      : null,
}));

const AddUserDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    profileId: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { success, error } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!selectedRole) {
      newErrors.role = "Role is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!formData.profileId.trim()) {
      newErrors.profileId = "Profile ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      success("User created successfully", {
        description: `${formData.name} has been added to the system.`,
      });

      // Reset form and close dialog
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        profileId: "",
        isActive: true,
      });
      setSelectedRole("");
      setErrors({});
      setOpen(false);
    } catch (err) {
      error("Error creating user", {
        description: "There was an error creating the user. Please try again.",
      });
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account with role and permissions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <SearchableSelect
                options={Object.values(Role).map((role) => ({
                  value: role,
                  label: role,
                }))}
                value={selectedRole}
                onValueChange={(value) => {
                  setSelectedRole(value);
                  if (errors.role) {
                    setErrors((prev) => ({ ...prev, role: "" }));
                  }
                }}
                placeholder="Select role"
                searchPlaceholder="Search roles..."
                className={errors.role ? "border-red-500" : ""}
              />
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profileId">Profile ID</Label>
            <Input
              id="profileId"
              placeholder="profile-123"
              value={formData.profileId}
              onChange={(e) => handleInputChange("profileId", e.target.value)}
              className={errors.profileId ? "border-red-500" : ""}
            />
            {errors.profileId && (
              <p className="text-sm text-red-500">{errors.profileId}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                handleInputChange("isActive", checked as boolean)
              }
            />
            <Label htmlFor="active">Active Account</Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterOpen, setFilterOpen] = useState(false);

  // Multiple selection state
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Bulk operation states
  const [bulkActionType, setBulkActionType] = useState<
    "activate" | "deactivate" | "delete" | null
  >(null);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const { success, error: showError } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: [
      "users",
      page,
      pageSize,
      searchTerm,
      roleFilter,
      statusFilter,
      sortField,
      sortDirection,
    ],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let filteredUsers = [...mockUsers];

      if (searchTerm) {
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      if (roleFilter) {
        filteredUsers = filteredUsers.filter(
          (user) => user.role === roleFilter,
        );
      }

      if (statusFilter) {
        const isActive = statusFilter === "active";
        filteredUsers = filteredUsers.filter(
          (user) => user.isActive === isActive,
        );
      }

      filteredUsers.sort((a, b) => {
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

        if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          return sortDirection === "asc"
            ? (aValue ? 1 : 0) - (bValue ? 1 : 0)
            : (bValue ? 1 : 0) - (aValue ? 1 : 0);
        }

        return 0;
      });

      const totalUsers = filteredUsers.length;
      const totalPages = Math.ceil(totalUsers / pageSize);
      const paginatedUsers = filteredUsers.slice(
        (page - 1) * pageSize,
        page * pageSize,
      );

      return {
        users: paginatedUsers,
        totalUsers,
        totalPages,
      };
    },
  });

  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIndicator = (field: keyof User) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  // Bulk action handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allUserIds = data?.users.map((user) => user.id) || [];
      setSelectedUsers(allUserIds);
      setSelectAll(true);
    } else {
      setSelectedUsers([]);
      setSelectAll(false);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
      setSelectAll(false);
    }
  };

  const handleBulkAction = (action: "activate" | "deactivate" | "delete") => {
    setBulkActionType(action);
    setShowBulkConfirm(true);
  };

  const executeBulkAction = async () => {
    if (!bulkActionType || selectedUsers.length === 0) return;

    setIsBulkProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const actionText = {
        activate: "activated",
        deactivate: "deactivated",
        delete: "deleted",
      }[bulkActionType];

      success("Bulk action completed", {
        description: `${selectedUsers.length} users have been ${actionText}.`,
      });

      // Reset selections
      setSelectedUsers([]);
      setSelectAll(false);
      setShowBulkConfirm(false);
      setBulkActionType(null);
    } catch (error) {
      showError("Error", {
        description: "There was an error processing the bulk action.",
      });
      console.log(error);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Update showBulkActions based on selected users
  React.useEffect(() => {
    setShowBulkActions(selectedUsers.length > 0);
  }, [selectedUsers]);

  // Update selectAll state based on current page selections
  React.useEffect(() => {
    if (data?.users) {
      const currentPageUserIds = data.users.map((user) => user.id);
      const selectedOnCurrentPage = selectedUsers.filter((id) =>
        currentPageUserIds.includes(id),
      );
      setSelectAll(
        selectedOnCurrentPage.length === currentPageUserIds.length &&
          currentPageUserIds.length > 0,
      );
    }
  }, [data?.users, selectedUsers]);
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

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

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">
              User Management
            </CardTitle>
            <CardDescription>
              Manage, filter, and create user accounts
            </CardDescription>
          </div>
          <AddUserDialog />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Bulk Actions Bar */}
            {showBulkActions && (
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    {selectedUsers.length} user
                    {selectedUsers.length !== 1 ? "s" : ""} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("activate")}
                    className="gap-2 text-green-600 border-green-300 hover:bg-green-50"
                  >
                    <UserCheck className="h-4 w-4" />
                    Activate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("deactivate")}
                    className="gap-2 text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <UserX className="h-4 w-4" />
                    Deactivate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("delete")}
                    className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedUsers([]);
                      setSelectAll(false);
                    }}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex gap-2 w-full max-w-sm items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
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
                <Select
                  value={`${sortField}-${sortDirection}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split("-") as [
                      keyof User,
                      "asc" | "desc",
                    ];
                    setSortField(field);
                    setSortDirection(direction);
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="email-asc">Email (A-Z)</SelectItem>
                    <SelectItem value="email-desc">Email (Z-A)</SelectItem>
                    <SelectItem value="role-asc">Role (A-Z)</SelectItem>
                    <SelectItem value="role-desc">Role (Z-A)</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="isActive-desc">Active First</SelectItem>
                    <SelectItem value="isActive-asc">Inactive First</SelectItem>
                  </SelectContent>
                </Select>
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
                    htmlFor="role-filter"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Role:
                  </Label>
                  <SearchableSelect
                    options={[
                      { value: "all", label: "All Roles" },
                      ...Object.values(Role).map((role) => ({
                        value: role,
                        label: role,
                      })),
                    ]}
                    value={roleFilter || "all"}
                    onValueChange={(value) =>
                      setRoleFilter(value === "all" ? null : value)
                    }
                    placeholder="All roles"
                    searchPlaceholder="Search roles..."
                    className="w-[140px]"
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
                    options={[
                      { value: "all", label: "All Status" },
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                    ]}
                    value={statusFilter || "all"}
                    onValueChange={(value) =>
                      setStatusFilter(value === "all" ? null : value)
                    }
                    placeholder="All status"
                    searchPlaceholder="Search status..."
                    className="w-[120px]"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setRoleFilter(null);
                    setStatusFilter(null);
                    setSearchTerm("");
                  }}
                >
                  Reset Filters
                </Button>
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
                        aria-label="Select all users"
                      />
                    </TableHead>
                    <TableHead className="w-[50px]">
                      <span className="sr-only">Avatar</span>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Name{getSortIndicator("name")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("email")}
                    >
                      Email{getSortIndicator("email")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("role")}
                    >
                      Role{getSortIndicator("role")}
                    </TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("isActive")}
                    >
                      Status{getSortIndicator("isActive")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      Created{getSortIndicator("createdAt")}
                    </TableHead>
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
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                              <div className="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : data?.users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={(checked) =>
                              handleSelectUser(user.id, checked as boolean)
                            }
                            aria-label={`Select ${user.name}`}
                          />
                        </TableCell>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={user.image || undefined} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.role === Role.ADMIN
                                ? "bg-red-100 text-red-800 border-red-200"
                                : user.role === Role.MANAGER
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : user.role === Role.SUPERVISOR
                                    ? "bg-amber-100 text-amber-800 border-amber-200"
                                    : "bg-green-100 text-green-800 border-green-200"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.phoneNumber}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.isActive ? "default" : "secondary"}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
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
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
                              <DropdownMenuItem
                                className={
                                  user.isActive
                                    ? "text-red-600"
                                    : "text-green-600"
                                }
                              >
                                {user.isActive ? "Deactivate" : "Activate"}
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
                {Math.min((page - 1) * pageSize + 1, data?.totalUsers || 0)} to{" "}
                {Math.min(page * pageSize, data?.totalUsers || 0)} of{" "}
                {data?.totalUsers || 0} users
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
            <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
            <AlertDialogDescription>
              {bulkActionType === "delete" ? (
                <>
                  Are you sure you want to delete {selectedUsers.length} user
                  {selectedUsers.length !== 1 ? "s" : ""}? This action cannot be
                  undone.
                </>
              ) : (
                <>
                  Are you sure you want to {bulkActionType}{" "}
                  {selectedUsers.length} user
                  {selectedUsers.length !== 1 ? "s" : ""}?
                </>
              )}
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
              {isBulkProcessing ? "Processing..." : `Yes, ${bulkActionType}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
