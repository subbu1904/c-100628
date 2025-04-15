
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Search, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/user';

// Mock user data for demonstration
const mockUsers = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'premium' as UserRole,
    createdAt: '2025-01-15T10:30:00Z',
    status: 'active'
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'free' as UserRole,
    createdAt: '2025-02-20T14:45:00Z',
    status: 'active'
  },
  {
    id: 'user3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'expert' as UserRole,
    createdAt: '2025-01-05T09:15:00Z',
    status: 'inactive'
  },
  {
    id: 'user4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'admin' as UserRole,
    createdAt: '2024-12-10T16:20:00Z',
    status: 'active'
  },
  {
    id: 'user5',
    name: 'Michael Wilson',
    email: 'michael@example.com',
    role: 'free' as UserRole,
    createdAt: '2025-03-01T11:50:00Z',
    status: 'suspended'
  }
];

const UsersManagement: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: t('admin.userDeleted'),
      description: t('admin.userDeletedDescription'),
    });
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'suspended' : 'active';
        return { ...user, status: newStatus };
      }
      return user;
    }));
    
    toast({
      title: t('admin.statusUpdated'),
      description: t('admin.statusUpdatedDescription'),
    });
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'premium': return 'purple';
      case 'expert': return 'yellow';
      default: return 'secondary';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t('admin.userManagement')}</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              {t('admin.addUser')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.addNewUser')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p>{t('admin.addUserFormDescription')}</p>
              {/* Add user form would go here */}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t('admin.searchUsers')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.name')}</TableHead>
              <TableHead>{t('admin.email')}</TableHead>
              <TableHead>{t('admin.role')}</TableHead>
              <TableHead>{t('admin.joinDate')}</TableHead>
              <TableHead>{t('admin.status')}</TableHead>
              <TableHead className="text-right">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role) as any}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(user.status) as any}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(user.id)}
                      title={user.status === 'active' ? t('admin.suspend') : t('admin.activate')}
                    >
                      {user.status === 'active' ? 
                        <XCircle className="h-4 w-4" /> : 
                        <CheckCircle className="h-4 w-4" />
                      }
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title={t('admin.edit')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUser(user.id)}
                      title={t('admin.delete')}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersManagement;
