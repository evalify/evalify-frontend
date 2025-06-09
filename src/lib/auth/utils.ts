enum UserType {
  SUPERUSER = "superuser",
  ADMIN = "admin",
  MANAGER = "manager",
  STAFF = "staff",
  STUDENT = "student",
}

// Utility function to check if user has any of the required roles
export function hasRequiredRole(
  userRole: string | undefined,
  requiredRoles: UserType[],
): boolean {
  if (!userRole || requiredRoles.length === 0) return false;
  return requiredRoles.includes(userRole as UserType);
}

// Utility function to check if user belongs to any of the required groups
export function belongsToRequiredGroup(
  userGroups: string[] | undefined,
  requiredGroups: string[],
): boolean {
  if (!userGroups || requiredGroups.length === 0) return false;
  return requiredGroups.some((group) => userGroups.includes(group));
}

// Combined utility function to check both roles and groups
export function hasAccess(
  userRoles: string[] | undefined,
  userGroups: string[] | undefined,
  requiredRoles: UserType[] = [],
  requiredGroups: string[] = [],
): boolean {
  const hasRole =
    requiredRoles.length === 0 ||
    (userRoles?.some((role) => hasRequiredRole(role, requiredRoles)) ?? false);
  const hasGroup =
    requiredGroups.length === 0 ||
    belongsToRequiredGroup(userGroups, requiredGroups);

  // User needs to satisfy both role and group requirements if both are specified
  return hasRole && hasGroup;
}

export { UserType };
