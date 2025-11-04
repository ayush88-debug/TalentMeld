import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { logout } from '../store/authSlice';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
      try {
        await signOut(auth);
        dispatch(logout());
        navigate('/');
      } catch (error) {
        console.error("Logout failed:", error);
      }
  };


  const RightControls = () => (
    <nav className="flex items-center gap-4">
      {authStatus && (
        <div className="flex items-center gap-16">

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userData?.avatar} alt={userData?.name} />
                  <AvatarFallback>
                    {userData?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 p-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-0">
                <div className="flex flex-col space-y-1 px-2">
                  <p className="text-sm font-medium leading-none">{userData?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userData?.email}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer py-2 px-3"
                onClick={() => navigate('/workspace')}
              >
                Workspace
              </DropdownMenuItem>
              
              <DropdownMenuItem
                className="cursor-pointer py-2 px-3"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer py-2 px-3"
                onClick={handleLogout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col justify-center items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          TalentMeld
        </Link>

        <RightControls />
      </div>
    </header>
  );
};

export default Header;
