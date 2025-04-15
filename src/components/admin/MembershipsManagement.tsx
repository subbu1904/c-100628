
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from "@/components/ui/badge";
import { Crown, CreditCard, Users, Calendar, DollarSign, Edit, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock membership plans data
const membershipPlans = [
  {
    id: 'plan1',
    name: 'Basic',
    price: 0,
    billingCycle: 'monthly',
    features: ['Basic access', 'Limited predictions', '5 favorites'],
    active: true
  },
  {
    id: 'plan2',
    name: 'Premium',
    price: 9.99,
    billingCycle: 'monthly',
    features: ['Full access', 'Unlimited predictions', 'Expert insights', 'Priority support'],
    active: true
  },
  {
    id: 'plan3',
    name: 'Premium Annual',
    price: 99.99,
    billingCycle: 'yearly',
    features: ['Full access', 'Unlimited predictions', 'Expert insights', 'Priority support', '2 months free'],
    active: true
  },
  {
    id: 'plan4',
    name: 'Enterprise',
    price: 29.99,
    billingCycle: 'monthly',
    features: ['Everything in Premium', 'API access', 'Dedicated account manager', 'Custom features'],
    active: false
  }
];

// Mock subscribers data
const mockSubscribers = [
  {
    id: 'sub1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    plan: 'Premium',
    startDate: '2025-01-15T10:30:00Z',
    endDate: '2025-02-15T10:30:00Z',
    autoRenew: true,
    status: 'active'
  },
  {
    id: 'sub2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    plan: 'Premium Annual',
    startDate: '2025-01-10T14:45:00Z',
    endDate: '2026-01-10T14:45:00Z',
    autoRenew: true,
    status: 'active'
  },
  {
    id: 'sub3',
    userName: 'Robert Johnson',
    userEmail: 'robert@example.com',
    plan: 'Premium',
    startDate: '2024-12-20T09:15:00Z',
    endDate: '2025-01-20T09:15:00Z',
    autoRenew: false,
    status: 'expiring'
  }
];

const MembershipsManagement: React.FC = () => {
  const { t } = useLanguage();
  const [plans, setPlans] = useState(membershipPlans);
  const [subscribers, setSubscribers] = useState(mockSubscribers);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const togglePlanStatus = (planId: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId ? { ...plan, active: !plan.active } : plan
    ));
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('admin.membershipPlans')}</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Tag className="mr-2 h-4 w-4" />
                {t('admin.addPlan')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('admin.createMembershipPlan')}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p>{t('admin.membershipPlanFormDescription')}</p>
                {/* Add plan form would go here */}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id} className={`${!plan.active ? 'opacity-70' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      {plan.name === 'Premium' || plan.name === 'Premium Annual' ? 
                        <Crown className="h-5 w-5 mr-2 text-amber-500" /> : 
                        <Tag className="h-5 w-5 mr-2" />
                      }
                      {plan.name}
                    </CardTitle>
                    <CardDescription>{plan.billingCycle}</CardDescription>
                  </div>
                  <Badge variant={plan.active ? 'default' : 'secondary'}>
                    {plan.active ? t('admin.active') : t('admin.inactive')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4 flex items-center">
                  <DollarSign className="h-6 w-6" />
                  {plan.price === 0 ? 'Free' : plan.price}
                  <span className="text-sm text-muted-foreground ml-1">
                    {plan.price > 0 && `/${plan.billingCycle === 'monthly' ? 'mo' : 'yr'}`}
                  </span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  {t('admin.edit')}
                </Button>
                <Button 
                  variant={plan.active ? "secondary" : "default"} 
                  size="sm"
                  onClick={() => togglePlanStatus(plan.id)}
                >
                  {plan.active ? t('admin.deactivate') : t('admin.activate')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('admin.currentSubscribers')}</h2>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              {t('admin.subscribersList')}
            </CardTitle>
            <CardDescription>{t('admin.subscribersDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.subscriber')}</TableHead>
                  <TableHead>{t('admin.plan')}</TableHead>
                  <TableHead>{t('admin.startDate')}</TableHead>
                  <TableHead>{t('admin.endDate')}</TableHead>
                  <TableHead>{t('admin.autoRenew')}</TableHead>
                  <TableHead>{t('admin.status')}</TableHead>
                  <TableHead className="text-right">{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subscriber.userName}</div>
                        <div className="text-sm text-muted-foreground">{subscriber.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {subscriber.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(subscriber.startDate)}</TableCell>
                    <TableCell>{formatDate(subscriber.endDate)}</TableCell>
                    <TableCell>
                      <Badge variant={subscriber.autoRenew ? "default" : "outline"}>
                        {subscriber.autoRenew ? t('admin.enabled') : t('admin.disabled')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={subscriber.status === 'active' ? "success" : "warning"}>
                        {subscriber.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <CreditCard className="h-4 w-4 mr-2" />
                        {t('admin.manage')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Crown className="w-5 h-5 mr-2 text-primary" />
              {t('admin.subscriptionStats')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45</div>
            <div className="text-sm text-muted-foreground">
              {t('admin.totalActiveSubscriptions')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              {t('admin.renewals')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">
              {t('admin.upcomingRenewals')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-primary" />
              {t('admin.revenue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$1,249.99</div>
            <div className="text-sm text-muted-foreground">
              {t('admin.monthlyRevenue')}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MembershipsManagement;
