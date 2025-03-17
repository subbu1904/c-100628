
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { 
  CreditCard, Package, User, Settings, ChevronRight, 
  Check, AlertCircle, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Loader from '@/components/Loader';

const Dashboard = () => {
  const { user, upgradeToPermium, downgradeToFree } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPremiumLoading, setPremiumLoading] = useState(false);

  if (user.loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  if (!user.isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleUpgrade = async () => {
    setPremiumLoading(true);
    try {
      const success = await upgradeToPermium();
      if (success) {
        toast({
          title: "Upgraded to Premium",
          description: "You now have access to premium features",
        });
      }
    } catch (error) {
      toast({
        title: "Upgrade Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setPremiumLoading(false);
    }
  };

  const handleDowngrade = async () => {
    setPremiumLoading(true);
    try {
      const success = await downgradeToFree();
      if (success) {
        toast({
          title: "Downgraded to Free",
          description: "Your membership has been changed to the free plan",
        });
      }
    } catch (error) {
      toast({
        title: "Downgrade Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setPremiumLoading(false);
    }
  };

  const isPremium = user.profile?.membership.type === 'premium';

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start px-3">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-3 font-medium text-primary">
                    <Package className="mr-2 h-4 w-4" />
                    Membership
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-3">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-3">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Welcome, {user.profile?.name}</h1>
              <p className="text-muted-foreground">
                Manage your membership and account settings
              </p>
            </div>
            
            <div className="grid gap-6">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Current Plan</CardTitle>
                  <CardDescription>
                    You are currently on the {isPremium ? 'Premium' : 'Free'} plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium flex items-center">
                          {isPremium ? (
                            <>
                              <span className="text-primary mr-2">Premium Plan</span>
                              <Check className="h-4 w-4 text-green-500" />
                            </>
                          ) : (
                            <>
                              <span>Free Plan</span>
                            </>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {isPremium 
                            ? 'You have access to all premium features'
                            : 'Basic access to crypto tracking'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {isPremium ? (
                    <Button variant="outline" onClick={handleDowngrade} disabled={isPremiumLoading}>
                      {isPremiumLoading ? <Loader size="small" /> : 'Downgrade to Free'}
                    </Button>
                  ) : (
                    <Button onClick={handleUpgrade} disabled={isPremiumLoading}>
                      {isPremiumLoading ? <Loader size="small" /> : 'Upgrade to Premium'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
              
              {/* Plan Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan Comparison</CardTitle>
                  <CardDescription>
                    Compare the features of our Free and Premium plans
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Feature</h3>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Free</h3>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Premium</h3>
                    </div>
                    
                    {/* Features */}
                    <div className="text-sm">Track top assets</div>
                    <div className="text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></div>
                    <div className="text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></div>
                    
                    <div className="text-sm">Basic asset details</div>
                    <div className="text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></div>
                    <div className="text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></div>
                    
                    <div className="text-sm">Price charts</div>
                    <div className="text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></div>
                    <div className="text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></div>
                    
                    <div className="text-sm">Price alerts</div>
                    <div className="text-center"><AlertCircle className="h-4 w-4 mx-auto text-red-500" /></div>
                    <div className="text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></div>
                    
                    <div className="text-sm">Portfolio tracking</div>
                    <div className="text-center"><AlertCircle className="h-4 w-4 mx-auto text-red-500" /></div>
                    <div className="text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></div>
                    
                    <div className="text-sm">Advanced analytics</div>
                    <div className="text-center"><AlertCircle className="h-4 w-4 mx-auto text-red-500" /></div>
                    <div className="text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
