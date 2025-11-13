import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../../hooks/useAuth";
import { ChangePasswordDialog } from "../auth/ChangePasswordDialog";

const UserMenu = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name?: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const renderMenuItems = () => {
    switch (role) {
      case "USER":
        return (
          <>
            <DropdownMenuItem asChild>
              <Link to="/user/dashboard">My Ratings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </>
        );
      case "STORE_OWNER":
        return (
          <>
            <DropdownMenuItem asChild>
              <Link to="/owner/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Store Ratings</DropdownMenuItem>
          </>
        );
      case "ADMIN":
        return (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin/dashboard">Admin Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/users">Manage Users</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/stores">Manage Stores</Link>
            </DropdownMenuItem>
          </>
        );
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
            alt={user.name || ""}
          />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {renderMenuItems()}
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <ChangePasswordDialog />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
