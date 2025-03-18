
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { UserProfile } from '@/types/user';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy, Award, Shield } from 'lucide-react';

interface UserRankBadgeProps {
  user: UserProfile;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const UserRankBadge: React.FC<UserRankBadgeProps> = ({ 
  user, 
  size = 'md',
  showIcon = true 
}) => {
  const { t } = useLanguage();
  
  if (!user.rank) return null;
  
  const getRankIcon = () => {
    if (!showIcon) return null;
    
    if (user.rank.level >= 8) {
      return <Trophy className="w-3 h-3 mr-1" />;
    } else if (user.rank.level >= 5) {
      return <Award className="w-3 h-3 mr-1" />;
    } else {
      return <Shield className="w-3 h-3 mr-1" />;
    }
  };
  
  const getRankColor = () => {
    const level = user.rank.level;
    if (level >= 8) return "bg-amber-500 hover:bg-amber-600";
    if (level >= 5) return "bg-slate-400 hover:bg-slate-500";
    if (level >= 3) return "bg-amber-700 hover:bg-amber-800";
    return "bg-teal-600 hover:bg-teal-700";
  };
  
  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0 font-medium",
    md: "text-xs px-2 py-0.5",
    lg: "text-sm px-2.5 py-1"
  };
  
  return (
    <Badge 
      className={`${getRankColor()} ${sizeClasses[size]} flex items-center`}
    >
      {getRankIcon()}
      {user.rank.title}
    </Badge>
  );
};

export default UserRankBadge;
