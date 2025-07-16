import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BankQuery, { SharedUsers } from "@/repo/bank/bank";
import userQueries from "@/repo/user-queries/user-queries";
import Bank from "@/repo/bank/bank";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Users, Crown, Shield, Trash2 } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select-virtual";
import { useMemo, useState, useCallback } from "react";
import { Button } from "../ui/button";

export default function ShareDialog(props: {
  bankId: string;
  open: boolean;
  onClose: () => void;
}) {
  const toast = useToast();
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: sharedUsers,
    error,
    isLoading,
  } = useQuery<SharedUsers>({
    queryKey: ["bankShare", props.bankId],
    queryFn: async () => {
      const response = await BankQuery.getBankUsers(props.bankId);
      return response;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
    enabled: props.open,
  });

  const { mutate: shareBank, isPending: isSharing } = useMutation({
    mutationFn: async (selectedStaff: string[]) =>
      await Bank.shareBank(props.bankId, selectedStaff),
    onSuccess: () => {
      toast.success("Bank access shared successfully!");
      queryClient.invalidateQueries({ queryKey: ["bankShare", props.bankId] });
      setSelectedStaff([]);
    },
    onError: (error: Error) => {
      toast.error("Failed to share bank access", {
        description: error.message,
      });
    },
  });

  const { mutate: unshareBank, isPending: isUnsharing } = useMutation({
    mutationFn: async (userId: string) =>
      await Bank.unshareBank(props.bankId, [userId]),
    onSuccess: () => {
      toast.success("Access removed successfully!");
      queryClient.invalidateQueries({ queryKey: ["bankShare", props.bankId] });
      setUserToRemove(null);
      setConfirmDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error("Failed to remove access", {
        description: error.message,
      });
      setUserToRemove(null);
      setConfirmDialogOpen(false);
    },
  });

  const handleShare = () => {
    if (selectedStaff.length === 0) {
      toast.error("No staff selected", {
        description: "Please select at least one staff member to share access.",
      });
      return;
    }
    shareBank(selectedStaff);
  };

  const handleRemoveAccess = useCallback((userId: string) => {
    setUserToRemove(userId);
    setConfirmDialogOpen(true);
  }, []);

  const confirmRemoveAccess = useCallback(() => {
    if (userToRemove) {
      unshareBank(userToRemove);
    }
  }, [userToRemove, unshareBank]);

  const cancelRemoveAccess = useCallback(() => {
    setUserToRemove(null);
    setConfirmDialogOpen(false);
  }, []);

  const { data: allStaff, isLoading: isStaffLoading } = useQuery({
    queryKey: ["allStaff"],
    queryFn: userQueries.fetchAllStaff,
    enabled: props.open,
  });

  if (error) {
    toast.error("Error loading shared users", {
      description: error.message,
    });
  }

  const staffOptions = useMemo(() => {
    if (!allStaff) return [];

    const existingUserIds =
      sharedUsers?.sharedUsers?.map((su) => su.user.id) || [];

    return allStaff
      .filter((staff) => !existingUserIds.includes(staff.id))
      .map((staff) => ({
        label: `${staff.name} (${staff.email})`,
        value: staff.id,
      }));
  }, [allStaff, sharedUsers]);

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case "OWNER":
        return <Crown className="h-4 w-4" />;
      case "ADMIN":
        return <Shield className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getTagVariant = (tag: string) => {
    switch (tag) {
      case "OWNER":
        return "default";
      case "ADMIN":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getUserName = useCallback(
    (userId: string) => {
      const user = sharedUsers?.sharedUsers?.find(
        (su) => su.user.id === userId,
      );
      return user ? user.user.name : "Selected user";
    },
    [sharedUsers],
  );

  return (
    <>
      <Dialog open={props.open} onOpenChange={props.onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Share Bank Access
            </DialogTitle>
            <DialogDescription>
              Users who have access to this question bank
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Failed to load shared users</p>
                <p className="text-sm">Please try again later</p>
              </div>
            ) : sharedUsers?.sharedUsers?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users have access to this bank</p>
                <p className="text-sm">You are the only one with access</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sharedUsers?.sharedUsers?.map((sharedUser) => (
                  <div
                    key={sharedUser.user.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {sharedUser.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {sharedUser.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {sharedUser.user.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={getTagVariant(sharedUser.tag)}
                        className="gap-1"
                      >
                        {getTagIcon(sharedUser.tag)}
                        {sharedUser.tag}
                      </Badge>

                      {sharedUser.tag !== "OWNER" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveAccess(sharedUser.user.id)}
                          disabled={isUnsharing}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <h3 className="font-medium">Add Staff Access</h3>
              </div>

              <Button
                onClick={handleShare}
                disabled={isSharing || selectedStaff.length === 0}
              >
                {isSharing ? "Sharing..." : "Share Access"}
              </Button>
            </div>

            {isStaffLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-32" />
              </div>
            ) : (
              <div className="space-y-3">
                <MultiSelect
                  options={staffOptions}
                  selected={selectedStaff}
                  onChange={setSelectedStaff}
                  placeholder="Select staff members to share access..."
                  className="w-full"
                  maxHeight={200}
                />

                {selectedStaff.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {selectedStaff.length} staff member(s) selected
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Access</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              {userToRemove ? getUserName(userToRemove) : ""}&apos;s access to
              this question bank? They will no longer be able to view or edit
              it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRemoveAccess}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveAccess}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isUnsharing ? "Removing..." : "Remove Access"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
