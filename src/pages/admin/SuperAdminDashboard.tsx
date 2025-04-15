
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Users, Tag, MapPin, Search, Palette, Crown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import UsersManagement from '@/components/admin/UsersManagement';
import MembershipsManagement from '@/components/admin/MembershipsManagement';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Check if user has admin access
  React.useEffect(() => {
    if (!user.isAuthenticated || user.profile?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const menuItems = [
    { icon: <Users className="h-5 w-5" />, label: t('admin.users'), value: 'users' },
    { icon: <Crown className="h-5 w-5" />, label: t('admin.memberships'), value: 'memberships' },
    { icon: <Tag className="h-5 w-5" />, label: t('admin.categories'), value: 'categories' },
    { icon: <MapPin className="h-5 w-5" />, label: t('admin.locations'), value: 'locations' },
    { icon: <Search className="h-5 w-5" />, label: t('admin.searchParams'), value: 'search' },
    { icon: <Palette className="h-5 w-5" />, label: t('admin.themes'), value: 'themes' },
    { icon: <MessageSquare className="h-5 w-5" />, label: t('admin.messages'), value: 'messages' },
    { icon: <Settings className="h-5 w-5" />, label: t('admin.settings'), value: 'settings' },
  ];

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('admin.superAdminDashboard')}</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">{t('admin.quickActions')}</Button>
          </SheetTrigger>
          <SheetContent>
            <div className="space-y-4 py-4">
              <h3 className="text-lg font-medium">{t('admin.quickActions')}</h3>
              <div className="grid gap-2">
                {menuItems.map((item) => (
                  <Button 
                    key={item.value} 
                    variant="ghost" 
                    className="justify-start"
                    onClick={() => navigate(`/admin/${item.value}`)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              {t('admin.usersOverview')}
            </CardTitle>
            <CardDescription>{t('admin.totalUsersDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">150</div>
            <div className="text-sm text-muted-foreground">
              +12 {t('admin.newThisWeek')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Crown className="w-5 h-5 mr-2 text-primary" />
              {t('admin.premiumUsers')}
            </CardTitle>
            <CardDescription>{t('admin.premiumUsersDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45</div>
            <div className="text-sm text-muted-foreground">
              30% {t('admin.conversionRate')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-primary" />
              {t('admin.activeDiscussions')}
            </CardTitle>
            <CardDescription>{t('admin.activeDiscussionsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28</div>
            <div className="text-sm text-muted-foreground">
              +5 {t('admin.newToday')}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {menuItems.map((item) => (
            <TabsTrigger key={item.value} value={item.value} className="flex items-center">
              {item.icon}
              <span className="ml-2 hidden md:inline">{item.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="memberships" className="space-y-4">
          <MembershipsManagement />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">{t('admin.categoryManagement')}</h2>
            <Button onClick={() => navigate('/admin/categories')}>
              {t('admin.viewAllCategories')}
            </Button>
          </div>
          <p>{t('admin.categoryManagementDescription')}</p>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.locationsManagement')}</CardTitle>
              <CardDescription>{t('admin.locationsManagementDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t('admin.comingSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.searchParameters')}</CardTitle>
              <CardDescription>{t('admin.searchParametersDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t('admin.comingSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.themeManagement')}</CardTitle>
              <CardDescription>{t('admin.themeManagementDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t('admin.comingSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.messageManagement')}</CardTitle>
              <CardDescription>{t('admin.messageManagementDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t('admin.comingSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.systemSettings')}</CardTitle>
              <CardDescription>{t('admin.systemSettingsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t('admin.comingSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;
