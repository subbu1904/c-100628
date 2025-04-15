
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';
import { Edit, Trash, Plus, Search, CheckCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

// Sample membership plans
const membershipPlans = [
  {
    id: 'plan1',
    name: 'Basic',
    price: 0,
    billingCycle: 'free',
    features: ['Limited asset tracking', 'Basic predictions', 'Standard support'],
    status: 'active',
    usersCount: 78
  },
  {
    id: 'plan2',
    name: 'Premium',
    price: 9.99,
    billingCycle: 'monthly',
    features: ['Unlimited asset tracking', 'Advanced predictions', 'Priority support', 'Expert insights'],
    status: 'active',
    usersCount: 45
  },
  {
    id: 'plan3',
    name: 'Pro',
    price: 19.99,
    billingCycle: 'monthly',
    features: ['Everything in Premium', 'API access', 'Custom alerts', '24/7 phone support', 'White-label options'],
    status: 'active',
    usersCount: 23
  },
  {
    id: 'plan4',
    name: 'Enterprise',
    price: 99.99,
    billingCycle: 'monthly',
    features: ['Everything in Pro', 'Dedicated account manager', 'Custom integrations', 'Team access'],
    status: 'inactive',
    usersCount: 12
  }
];

const MembershipsManagement: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Filter plans based on search term
  const filteredPlans = membershipPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeletePlan = (planId: string) => {
    toast({
      title: t('admin.planDeleted'),
      description: t('admin.planDeletedDescription'),
    });
  };
  
  const handleStatusChange = (planId: string) => {
    toast({
      title: t('admin.planStatusChanged'),
      description: t('admin.planStatusChangedDescription'),
    });
  };
  
  const formatPrice = (price: number, cycle: string) => {
    if (cycle === 'free') return t('admin.free');
    return `$${price} / ${t(`admin.${cycle}`)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t('admin.membershipPlans')}</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.addPlan')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.createNewPlan')}</DialogTitle>
              <DialogDescription>
                {t('admin.createPlanDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p>{t('admin.planFormDescription')}</p>
              {/* Plan form would go here */}
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => {
                toast({
                  title: t('admin.planCreated'),
                  description: t('admin.planCreatedDescription'),
                });
              }}>
                {t('admin.createPlan')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t('admin.searchPlans')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.planName')}</TableHead>
              <TableHead>{t('admin.price')}</TableHead>
              <TableHead>{t('admin.features')}</TableHead>
              <TableHead>{t('admin.usersCount')}</TableHead>
              <TableHead>{t('admin.status')}</TableHead>
              <TableHead className="text-right">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>{formatPrice(plan.price, plan.billingCycle)}</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside text-sm">
                    {plan.features.slice(0, 2).map((feature, index) => (
                      <li key={index} className="text-muted-foreground">
                        {feature}
                      </li>
                    ))}
                    {plan.features.length > 2 && (
                      <li className="text-muted-foreground">
                        +{plan.features.length - 2} {t('admin.more')}
                      </li>
                    )}
                  </ul>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="font-medium">{plan.usersCount}</span>
                    <span className="ml-1 text-muted-foreground text-xs">
                      {t('admin.users')}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                    {plan.status === 'active' ? 
                      t('admin.active') : 
                      t('admin.inactive')
                    }
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStatusChange(plan.id)}
                      title={plan.status === 'active' ? t('admin.deactivate') : t('admin.activate')}
                    >
                      <CheckCircle className="h-4 w-4" />
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
                      onClick={() => handleDeletePlan(plan.id)}
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

export default MembershipsManagement;
