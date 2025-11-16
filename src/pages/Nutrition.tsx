// Nutrition Page
import { NutritionCalculator } from '@/components/nutrition/NutritionCalculator'
import { MealPlanBuilder } from '@/components/nutrition/MealPlanBuilder'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Nutrition() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nutrition</h1>
        <p className="text-muted-foreground">
          Calculate your macro targets and plan your meals
        </p>
      </div>

      <Tabs defaultValue="calculator" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="meal-plans">Meal Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <NutritionCalculator />
        </TabsContent>

        <TabsContent value="meal-plans">
          <MealPlanBuilder />
        </TabsContent>
      </Tabs>
    </div>
  )
}
