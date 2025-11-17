// Nutrition Page
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MealPlanBuilder } from '@/components/nutrition/MealPlanBuilder'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNutrition } from '@/lib/hooks/useNutrition'
import { Settings, Loader2, Target, UtensilsCrossed, Activity, Flame } from 'lucide-react'

type ViewMode = 'targets' | 'meal-plans'

export function Nutrition() {
  const navigate = useNavigate()
  const { profile, targets, loading } = useNutrition()
  const [activeView, setActiveView] = useState<ViewMode>('targets')

  return (
    <Layout>
      {/* Header with Navigation */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-[#E6EDF3] mb-2">Nutrition</h1>
        <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#8B949E] mb-6">
          View your macro targets and plan your meals
        </p>

        {/* Navigation Pills with Edit Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setActiveView('targets')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                activeView === 'targets'
                  ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white shadow-md'
                  : 'bg-white dark:bg-[#161B22] text-[#5F6368] dark:text-[#8B949E] hover:bg-[#F5F5F5] dark:hover:bg-[#1C2128] border border-[#E8EAED] dark:border-[#30363D]'
              }`}
            >
              <Target className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xs:inline">Nutrition Targets</span>
              <span className="xs:hidden">Targets</span>
            </button>
            <button
              onClick={() => setActiveView('meal-plans')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                activeView === 'meal-plans'
                  ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white shadow-md'
                  : 'bg-white dark:bg-[#161B22] text-[#5F6368] dark:text-[#8B949E] hover:bg-[#F5F5F5] dark:hover:bg-[#1C2128] border border-[#E8EAED] dark:border-[#30363D]'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xs:inline">Meal Plans</span>
              <span className="xs:hidden">Plans</span>
            </button>
          </div>

          {/* Edit Profile Button - Always show but only visible when not loading */}
          <Button
            onClick={() => navigate('/settings')}
            variant="outline"
            size="sm"
            className="gap-1.5 sm:gap-2 flex-shrink-0 h-9 sm:h-10"
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Edit Profile</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeView === 'targets' && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#20808D] dark:text-[#1FB8CD]" />
            </div>
          ) : !profile || !targets ? (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="w-16 h-16 mx-auto mb-4 text-[#5F6368] dark:text-[#8B949E]" />
                <p className="text-[#5F6368] dark:text-[#8B949E] mb-4">
                  Complete your profile in Settings to see your nutrition targets
                </p>
                <Button onClick={() => navigate('/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Go to Settings
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Profile Summary & Quick Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col">
                      <Activity className="w-5 h-5 text-[#20808D] dark:text-[#1FB8CD] mb-3 flex-shrink-0" />
                      <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mb-1">Current Weight</p>
                      <p className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3]">{profile.bodyweight} lbs</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col">
                      <Target className="w-5 h-5 text-[#20808D] dark:text-[#1FB8CD] mb-3 flex-shrink-0" />
                      <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mb-1">Goal Weight</p>
                      <p className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3]">{profile.goal_bodyweight} lbs</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col">
                      <Flame className="w-5 h-5 text-amber-500 mb-3 flex-shrink-0" />
                      <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mb-1">Maintenance</p>
                      <p className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3]">{targets.maintenanceCalories}</p>
                      <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mt-0.5">cal/day (TDEE)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col">
                      <UtensilsCrossed className="w-5 h-5 text-green-500 mb-3 flex-shrink-0" />
                      <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mb-1">Goal Type</p>
                      <p className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3]">
                        {profile.goal_type === 'leanBulk' ? 'Lean Bulk' : 'Recomp'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Calorie & Macro Targets */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Training Days */}
                <Card className="border-2 border-[#20808D] dark:border-[#1FB8CD] overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Activity className="w-5 h-5 text-[#20808D] dark:text-[#1FB8CD] flex-shrink-0" />
                        <span className="truncate">Training Days</span>
                      </CardTitle>
                      <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#20808D] dark:bg-[#1FB8CD] text-white text-xs font-medium whitespace-nowrap flex-shrink-0">
                        {profile.goal_type === 'leanBulk' ? '+500 cal' : '+400 cal'}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-3xl sm:text-4xl font-bold text-[#20808D] dark:text-[#1FB8CD] truncate">{targets.trainingDayCalories}</p>
                      <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">calories per day</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">

                    {/* Protein */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#202124] dark:text-[#E6EDF3]">Protein</span>
                        <span className="font-bold text-[#202124] dark:text-[#E6EDF3]">{targets.protein}g</span>
                      </div>
                      <div className="h-2.5 bg-[#E8EAED] dark:bg-[#30363D] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                          style={{ width: `${targets.proteinPercentTraining}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[#5F6368] dark:text-[#8B949E]">
                        <span>{targets.proteinCalories} cal</span>
                        <span>{targets.proteinPercentTraining}%</span>
                      </div>
                    </div>

                    {/* Carbs */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#202124] dark:text-[#E6EDF3]">Carbs</span>
                        <span className="font-bold text-[#202124] dark:text-[#E6EDF3]">{targets.carbsTraining}g</span>
                      </div>
                      <div className="h-2.5 bg-[#E8EAED] dark:bg-[#30363D] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all"
                          style={{ width: `${targets.carbsPercentTraining}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[#5F6368] dark:text-[#8B949E]">
                        <span>{targets.carbsTrainingCalories} cal</span>
                        <span>{targets.carbsPercentTraining}%</span>
                      </div>
                    </div>

                    {/* Fat */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#202124] dark:text-[#E6EDF3]">Fat</span>
                        <span className="font-bold text-[#202124] dark:text-[#E6EDF3]">{targets.fat}g</span>
                      </div>
                      <div className="h-2.5 bg-[#E8EAED] dark:bg-[#30363D] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all"
                          style={{ width: `${targets.fatPercentTraining}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[#5F6368] dark:text-[#8B949E]">
                        <span>{targets.fatCalories} cal</span>
                        <span>{targets.fatPercentTraining}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rest Days */}
                <Card className="border-2 border-[#80868B] dark:border-[#6E7681] overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Flame className="w-5 h-5 text-[#80868B] dark:text-[#8B949E] flex-shrink-0" />
                        <span className="truncate">Rest Days</span>
                      </CardTitle>
                      <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#80868B] dark:bg-[#6E7681] text-white text-xs font-medium whitespace-nowrap flex-shrink-0">
                        {profile.goal_type === 'leanBulk' ? '+100 cal' : '-300 cal'}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-3xl sm:text-4xl font-bold text-[#80868B] dark:text-[#8B949E] truncate">{targets.restDayCalories}</p>
                      <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">calories per day</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    {/* Protein */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#202124] dark:text-[#E6EDF3]">Protein</span>
                        <span className="font-bold text-[#202124] dark:text-[#E6EDF3]">{targets.protein}g</span>
                      </div>
                      <div className="h-2.5 bg-[#E8EAED] dark:bg-[#30363D] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                          style={{ width: `${targets.proteinPercentRest}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[#5F6368] dark:text-[#8B949E]">
                        <span>{targets.proteinCalories} cal</span>
                        <span>{targets.proteinPercentRest}%</span>
                      </div>
                    </div>

                    {/* Carbs */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#202124] dark:text-[#E6EDF3]">Carbs</span>
                        <span className="font-bold text-[#202124] dark:text-[#E6EDF3]">{targets.carbsRest}g</span>
                      </div>
                      <div className="h-2.5 bg-[#E8EAED] dark:bg-[#30363D] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all"
                          style={{ width: `${targets.carbsPercentRest}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[#5F6368] dark:text-[#8B949E]">
                        <span>{targets.carbsRestCalories} cal</span>
                        <span>{targets.carbsPercentRest}%</span>
                      </div>
                    </div>

                    {/* Fat */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#202124] dark:text-[#E6EDF3]">Fat</span>
                        <span className="font-bold text-[#202124] dark:text-[#E6EDF3]">{targets.fat}g</span>
                      </div>
                      <div className="h-2.5 bg-[#E8EAED] dark:bg-[#30363D] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all"
                          style={{ width: `${targets.fatPercentRest}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[#5F6368] dark:text-[#8B949E]">
                        <span>{targets.fatCalories} cal</span>
                        <span>{targets.fatPercentRest}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Calculation Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How These Are Calculated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-[#202124] dark:text-[#E6EDF3]">Protein: 1g per lb of goal bodyweight</p>
                        <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">{profile.goal_bodyweight} lbs × 1g = {targets.protein}g</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-[#202124] dark:text-[#E6EDF3]">Fat: 0.35g per lb of current bodyweight</p>
                        <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">{profile.bodyweight} lbs × 0.35g = {targets.fat}g</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-[#202124] dark:text-[#E6EDF3]">Carbs: Remaining calories</p>
                        <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">Varies by training/rest day after protein & fat</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#20808D] dark:bg-[#1FB8CD] mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-[#202124] dark:text-[#E6EDF3]">Goal Strategy: {profile.goal_type === 'leanBulk' ? 'Lean Bulk' : 'Recomposition'}</p>
                        <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">
                          {profile.goal_type === 'leanBulk' ? '+500 cal training days, +100 cal rest days' : '+400 cal training days, -300 cal rest days'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {activeView === 'meal-plans' && (
        <MealPlanBuilder />
      )}
    </Layout>
  )
}
