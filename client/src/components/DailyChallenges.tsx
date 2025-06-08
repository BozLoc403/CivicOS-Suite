import { Calendar, CheckCircle, Clock, Trophy, Target, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: string;
  pointsReward: number;
  difficulty: string;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  timeRemaining?: string;
}

interface DailyChallengesProps {
  challenges: Challenge[];
  streakDays: number;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-700 border-green-300';
    case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'hard': return 'bg-red-100 text-red-700 border-red-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'voting': return <Target className="h-4 w-4" />;
    case 'learning': return <Calendar className="h-4 w-4" />;
    case 'engagement': return <Trophy className="h-4 w-4" />;
    case 'advocacy': return <Flame className="h-4 w-4" />;
    default: return <CheckCircle className="h-4 w-4" />;
  }
};

export function DailyChallenges({ challenges, streakDays }: DailyChallengesProps) {
  const completedChallenges = challenges.filter(c => c.isCompleted);
  const activeChallenges = challenges.filter(c => !c.isCompleted);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Daily Challenges</h3>
        <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full">
          <Flame className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-700">
            {streakDays} day streak
          </span>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="space-y-4 mb-6">
        {activeChallenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  {getCategoryIcon(challenge.category)}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {challenge.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {challenge.description}
                  </p>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Trophy className="h-3 w-3 mr-1" />
                      {challenge.pointsReward} points
                    </span>
                    {challenge.timeRemaining && (
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {challenge.timeRemaining}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Progress</span>
                <span>{challenge.progress}/{challenge.maxProgress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3">Completed Today</h4>
          <div className="space-y-2">
            {completedChallenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h5 className="text-sm font-medium text-green-900">
                      {challenge.title}
                    </h5>
                    <p className="text-xs text-green-700">Completed</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-green-700">
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm font-medium">+{challenge.pointsReward}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {challenges.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">New challenges will appear daily!</p>
        </div>
      )}
    </div>
  );
}