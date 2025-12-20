export interface Permission {
  id: number;
  module: string;
  action: string;
  roleId: number;
}

export interface Role {
  id: number;
  name: string;
  isStatic: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
  _count: {
    users: number;
  };
}

export interface PermissionFormData {
  roleId: string;
  permissions: Array<{
    module: string;
    action: string;
  }>;
}