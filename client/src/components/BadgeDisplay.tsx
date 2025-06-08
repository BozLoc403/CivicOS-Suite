import { Trophy, Star, Zap, Shield, Crown, Award, Medal, Target } from "lucide-react";
import { motion } from "framer-motion";

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  earnedAt?: string;
  progress?: number;
  isCompleted: boolean;
}

interface BadgeDisplayProps {
  badges: Badge[];
  userLevel: number;
  civicPoints: number;
  showAnimation?: boolean;
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
    case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

const getIconComponent = (iconName: string) => {
  const iconProps = { className: "h-6 w-6" };
  switch (iconName) {
    case 'trophy': return <Trophy {...iconProps} />;
    case 'star': return <Star {...iconProps} />;
    case 'zap': return <Zap {...iconProps} />;
    case 'shield': return <Shield {...iconProps} />;
    case 'crown': return <Crown {...iconProps} />;
    case 'award': return <Award {...iconProps} />;
    case 'medal': return <Medal {...iconProps} />;
    case 'target': return <Target {...iconProps} />;
    default: return <Trophy {...iconProps} />;
  }
};

export function BadgeDisplay({ badges, userLevel, civicPoints, showAnimation = true }: BadgeDisplayProps) {
  const completedBadges = badges.filter(badge => badge.isCompleted);
  const inProgressBadges = badges.filter(badge => !badge.isCompleted && badge.progress && badge.progress > 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Level {userLevel}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">{civicPoints} points</span>
          </div>
        </div>
      </div>

      {/* Completed Badges */}
      {completedBadges.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-800 mb-3">Earned Badges</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {completedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={showAnimation ? { scale: 0, opacity: 0 } : {}}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`relative p-4 rounded-lg border-2 ${getRarityColor(badge.rarity)} hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2">
                    {getIconComponent(badge.icon)}
                  </div>
                  <h5 className="text-sm font-medium mb-1">{badge.name}</h5>
                  <p className="text-xs opacity-75">{badge.description}</p>
                  {badge.earnedAt && (
                    <p className="text-xs mt-2 opacity-60">
                      Earned {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {badge.rarity === 'legendary' && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="h-3 w-3 text-white" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Badges */}
      {inProgressBadges.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3">In Progress</h4>
          <div className="space-y-3">
            {inProgressBadges.map((badge) => (
              <div key={badge.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="opacity-60">
                      {getIconComponent(badge.icon)}
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-800">{badge.name}</h5>
                      <p className="text-xs text-gray-600">{badge.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {badge.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${badge.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {completedBadges.length === 0 && inProgressBadges.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Start participating to earn your first badge!</p>
        </div>
      )}
    </div>
  );
}