import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface GuideSubsection {
  id: string
  title: string
  content: JSX.Element
}

interface GuideSection {
  id: string
  title: string
  icon: string
  description: string
  subsections: GuideSubsection[]
}

export const programPhasesSection: GuideSection = {
  id: 'program-phases',
  title: 'Program Phases',
  icon: '📊',
  description: 'Detailed breakdown of each training phase',
  subsections: [
    {
      id: 'phase-1-details',
      title: 'Phase 1: Shoulder Emphasis (Weeks 1-8)',
      content: (
        <div className="space-y-4">
          <p className="text-sm">
            The first phase builds a strong foundation with emphasis on overhead pressing and back development.
          </p>

          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Workout A: Chest, Shoulders, Triceps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="bg-background border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted text-xs">
                        <tr>
                          <th className="text-left p-2">Exercise</th>
                          <th className="text-left p-2">Sets × Reps</th>
                          <th className="text-left p-2">Method</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-t">
                          <td className="p-2">Incline Barbell Press</td>
                          <td className="p-2">3 × 4-5, 6-7, 8-10</td>
                          <td className="p-2">RPT</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Standing Press</td>
                          <td className="p-2">3 × 6-8, 8-10, 8-10</td>
                          <td className="p-2">RPT</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Triceps Rope Pushdowns</td>
                          <td className="p-2">3 × 6-8, 8-10, 10-12</td>
                          <td className="p-2">RPT</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Lateral Raises</td>
                          <td className="p-2">1 × 12-15 + 3 × 4-6</td>
                          <td className="p-2">Rest-Pause</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Hanging Knee Raises</td>
                          <td className="p-2">3 × 8-12</td>
                          <td className="p-2">Straight Sets</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Workout B: Back, Biceps, Legs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="bg-background border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted text-xs">
                        <tr>
                          <th className="text-left p-2">Exercise</th>
                          <th className="text-left p-2">Sets × Reps</th>
                          <th className="text-left p-2">Method</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-t">
                          <td className="p-2">Weighted Chinups</td>
                          <td className="p-2">3 × 4, 6, 8</td>
                          <td className="p-2">RPT</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Incline DB Hammer Curls</td>
                          <td className="p-2">3 × 6-8, 6-8, 8-10</td>
                          <td className="p-2">RPT</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Bulgarian Split Squats</td>
                          <td className="p-2">4 × 6-8</td>
                          <td className="p-2">Kino Rep</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">DB Romanian Deadlifts</td>
                          <td className="p-2">4 × 10-12</td>
                          <td className="p-2">Kino Rep</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Face Pulls</td>
                          <td className="p-2">4 × 12-15</td>
                          <td className="p-2">Kino Rep</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
            <h4 className="font-semibold mb-2">Focus for This Phase</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Build overhead pressing strength (standing press)</li>
              <li>Develop upper chest (incline press)</li>
              <li>Build lat width and thickness (weighted chinups)</li>
              <li>Create shoulder definition (lateral raises)</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'phase-2-details',
      title: 'Phase 2: Chest Emphasis (Weeks 9-16)',
      content: (
        <div className="space-y-4">
          <p className="text-sm">
            Phase 2 shifts focus to chest development with weighted dips and incline dumbbell pressing.
          </p>

          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Workout A: Chest, Shoulders, Triceps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="bg-background border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted text-xs">
                        <tr>
                          <th className="text-left p-2">Exercise</th>
                          <th className="text-left p-2">Sets × Reps</th>
                          <th className="text-left p-2">Method</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-t">
                          <td className="p-2">Incline Dumbbell Press</td>
                          <td className="p-2">3 × 6-8, 8-10, 10-12</td>
                          <td className="p-2">RPT</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Weighted Dips</td>
                          <td className="p-2">3 × 6, 8, 10</td>
                          <td className="p-2">RPT</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">One-Arm OH Triceps Ext</td>
                          <td className="p-2">3 × 8-10, 10-12, 12-15</td>
                          <td className="p-2">RPT</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">DB Upright Rows</td>
                          <td className="p-2">4 × 10-15</td>
                          <td className="p-2">Kino Rep</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Side-to-Side Knee Ups</td>
                          <td className="p-2">3 × 8-12</td>
                          <td className="p-2">Straight Sets</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Workout B: Back, Biceps, Legs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="bg-background border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted text-xs">
                        <tr>
                          <th className="text-left p-2">Exercise</th>
                          <th className="text-left p-2">Sets × Reps</th>
                          <th className="text-left p-2">Method</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-t">
                          <td className="p-2">Weighted Pullups</td>
                          <td className="p-2">3 × 6, 8, 8</td>
                          <td className="p-2">RPT</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Incline DB Bicep Curls</td>
                          <td className="p-2">3 × 6-8</td>
                          <td className="p-2">RPT</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Box Squats</td>
                          <td className="p-2">5 × 6</td>
                          <td className="p-2">Kino Rep</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Single-Leg RDL or Hip Thrusts</td>
                          <td className="p-2">3 × 8-12</td>
                          <td className="p-2">Kino Rep</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Seated Bent-Over Flyes</td>
                          <td className="p-2">1 × 12-15 + 3 × 4-6</td>
                          <td className="p-2">Rest-Pause</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
            <h4 className="font-semibold mb-2">Focus for This Phase</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Massive chest development (weighted dips)</li>
              <li>Upper chest detail (incline dumbbell press)</li>
              <li>Leg strength foundation (box squats)</li>
              <li>Back width (weighted pullups)</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'phase-3-details',
      title: 'Phase 3: Return to Shoulder (Weeks 17-24)',
      content: (
        <div className="space-y-4">
          <p className="text-sm">
            Phase 3 returns to the Phase 1 workout structure. After 8 weeks on different exercises,
            you'll return with renewed strength and hit new PRs on your key lifts.
          </p>

          <div className="bg-muted/50 border-l-4 border-muted-foreground/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Why Return to Phase 1?</h4>
            <p className="text-sm">
              The exercise rotation prevents plateaus and burnout. After 8 weeks on different movements,
              your body is primed to progress rapidly on the original exercises. Most people find they
              can add 15-20 lbs to their lifts when returning to Phase 1.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Same as Phase 1</h4>
            <p className="text-sm">
              Follow the exact same workout structure as Phase 1 (Weeks 1-8). Track your progress
              and compare to your Phase 1 numbers - you should see significant strength gains!
            </p>
          </div>

          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
            <h4 className="font-semibold mb-2">After 24 Weeks</h4>
            <p className="text-sm mb-2">
              Once you complete all three phases (6 months total), you can:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Repeat the 3-phase cycle</li>
              <li>Try MEGA Training for 12 weeks (muscle growth focus)</li>
              <li>Explore specialization routines (target specific muscle groups)</li>
              <li>Switch to the 3-Day Split (advanced lifters)</li>
            </ul>
          </div>
        </div>
      ),
    },
  ],
}

export const standardsSection: GuideSection = {
  id: 'standards',
  title: 'Standards & Benchmarks',
  icon: '📈',
  description: 'Goals to strive for at different levels',
  subsections: [
    {
      id: 'strength-standards',
      title: 'Strength Standards',
      content: (
        <div className="space-y-4">
          <p className="text-sm">
            Use these standards to gauge your progress and set goals. All standards are based on
            bodyweight ratios for true relative strength.
          </p>

          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Incline Bench Press</CardTitle>
                <CardDescription>5 reps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Good:</span>
                    <span>1.0× bodyweight</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Great:</span>
                    <span>1.2× bodyweight</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                    <span className="font-medium">Godlike:</span>
                    <span className="font-semibold">1.4× bodyweight</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Example (175 lbs): Good = 175 lbs, Great = 210 lbs, Godlike = 245 lbs
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Weighted Chinups</CardTitle>
                <CardDescription>5 reps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Good:</span>
                    <span>+30% bodyweight</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Great:</span>
                    <span>+50% bodyweight</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                    <span className="font-medium">Godlike:</span>
                    <span className="font-semibold">+70% bodyweight</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Example (175 lbs): Good = +52 lbs, Great = +87 lbs, Godlike = +122 lbs
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Standing Barbell Press</CardTitle>
                <CardDescription>5 reps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Good:</span>
                    <span>0.7× bodyweight</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Great:</span>
                    <span>0.85× bodyweight</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                    <span className="font-medium">Godlike:</span>
                    <span className="font-semibold">1.0× bodyweight</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Example (175 lbs): Good = 122 lbs, Great = 148 lbs, Godlike = 175 lbs
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Weighted Dips</CardTitle>
                <CardDescription>6 reps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Good:</span>
                    <span>+50% bodyweight</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Great:</span>
                    <span>+75% bodyweight</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                    <span className="font-medium">Godlike:</span>
                    <span className="font-semibold">+100% bodyweight</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Example (175 lbs): Good = +87 lbs, Great = +131 lbs, Godlike = +175 lbs
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Barbell Curl</CardTitle>
                <CardDescription>5 reps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Good:</span>
                    <span>0.55× bodyweight</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Great:</span>
                    <span>0.65× bodyweight</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                    <span className="font-medium">Godlike:</span>
                    <span className="font-semibold">0.75× bodyweight</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Example (175 lbs): Good = 96 lbs, Great = 113 lbs, Godlike = 131 lbs
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'measurement-standards',
      title: 'Body Measurement Standards',
      content: (
        <div className="space-y-4">
          <p className="text-sm">
            These ratios create the ideal Greek God proportions: V-taper, square chest, and balanced development.
          </p>

          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Waist (at belly button)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Good:</span>
                    <span>47% of height</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Great:</span>
                    <span>46% of height</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                    <span className="font-medium">Godlike:</span>
                    <span className="font-semibold">45% of height</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Example (5'10" = 70"): Good = 32.9", Great = 32.2", Godlike = 31.5"
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Chest (relaxed, mid-chest)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Good:</span>
                    <span>1.3× waist</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Great:</span>
                    <span>1.35× waist</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                    <span className="font-medium">Godlike:</span>
                    <span className="font-semibold">1.4× waist</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Example (32" waist): Good = 41.6", Great = 43.2", Godlike = 44.8"
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Arms (flexed, cold)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Good:</span>
                    <span>46% of waist</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">Great:</span>
                    <span>48% of waist</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary/10 rounded">
                    <span className="font-medium">Godlike:</span>
                    <span className="font-semibold">50% of waist</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Example (32" waist): Good = 14.7", Great = 15.4", Godlike = 16.0"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/50 border-l-4 border-muted-foreground/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Measurement Tips</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Measure first thing in the morning for consistency</li>
              <li>Waist: relaxed posture, no sucking in, at belly button level</li>
              <li>Chest: relaxed, mid-chest, normal breath</li>
              <li>Arms: flexed hard, measure widest point (cold, not post-workout)</li>
            </ul>
          </div>
        </div>
      ),
    },
  ],
}

export const advancedProgramsSection: GuideSection = {
  id: 'advanced-programs',
  title: 'Advanced Programs',
  icon: '🚀',
  description: 'MEGA Training, specializations, and advanced splits',
  subsections: [
    {
      id: 'mega-training-overview',
      title: 'MEGA Training (12 Weeks)',
      content: (
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">What is MEGA Training?</h4>
            <p className="text-sm">
              <strong>Minimum Effort Growth Acceleration</strong> - A 12-week program designed to maximize
              muscle growth by adding extra volume exercises without overtraining. Best used after 6 months
              of Strength & Density work.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">When to Use MEGA Training</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>After completing 6 months of Strength & Density phases</li>
              <li>When you want to focus on muscle size over pure strength</li>
              <li>To break through muscle growth plateaus</li>
              <li>Maximum 12 weeks at a time (2:1 ratio with S&D work)</li>
            </ul>
          </div>

          <div className="bg-muted/50 border-l-4 border-muted-foreground/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">⚠️ Important Notes</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Don't push every set to failure - keep 1 rep in the tank</li>
              <li>Use Kinobody Superhero Stack for best results (Octane, Aminos, Gains)</li>
              <li>Don't do MEGA training year-round - alternate with S&D phases</li>
              <li>Expect slower strength gains, but rapid muscle growth</li>
            </ul>
          </div>

          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
            <h4 className="font-semibold mb-2">MEGA Training Structure</h4>
            <p className="text-sm mb-2">
              Heavy compound movements (RPT) + Extra volume work (Kino Rep Training)
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Phase 1: 6 weeks (Pullups, Close-Grip Bench focus)</li>
              <li>Phase 2: 6 weeks (Chinups, Barbell Press focus)</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'specialization-routines',
      title: 'Specialization Routines',
      content: (
        <div className="space-y-4">
          <p className="text-sm">
            Target specific muscle groups with extra volume while maintaining overall development.
            Use for 6 weeks at a time.
          </p>

          <div className="grid gap-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Chest Specialization</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">Add 2 sets to incline press + flat press work</p>
                <div className="bg-muted p-2 rounded text-xs">
                  Incline Bench: 5 sets × 5,6,8,8,8 + Flat Bench: 3 sets × 6,8,10
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shoulder Specialization</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">Add 2 sets to standing press</p>
                <div className="bg-muted p-2 rounded text-xs">
                  Standing Press: 5 sets × 5,6,8,8,8 (same weight last 3 sets)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Back Specialization</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">Switch to pullups + add 2 sets</p>
                <div className="bg-muted p-2 rounded text-xs">
                  Weighted Pullups: 5 sets × 5,6,8,8,8 (can drop to LAT pulldowns for last sets)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Biceps Specialization</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">Add extra biceps exercise</p>
                <div className="bg-muted p-2 rounded text-xs">
                  Close-Grip Chinups + Barbell Curls + Incline DB Curls (2 sets)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Triceps Specialization</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">Add rope extensions at end</p>
                <div className="bg-muted p-2 rounded text-xs">
                  Incline Press + Dips/Close-Grip + Skull Crushers + Rope Ext (2 sets)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Legs Specialization</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">Add barbell squats or pistols</p>
                <div className="bg-muted p-2 rounded text-xs">
                  Squats: 3 sets × 5,6,8 (RPT) + 5 lbs every workout
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/50 border-l-4 border-muted-foreground/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Specialization Tips</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Only specialize 1-2 muscle groups at a time</li>
              <li>Run for 6 weeks maximum</li>
              <li>Return to normal programming after to avoid overtraining</li>
              <li>Great for bringing up lagging body parts</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'three-day-split',
      title: '3-Day Split (Advanced)',
      content: (
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">When to Use 3-Day Split</h4>
            <p className="text-sm mb-2">
              After several years of training, the 2-day split becomes very taxing. The 3-day split
              allows more exercise variety and focus on specific muscle groups while reducing per-workout fatigue.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Weekly Schedule</h4>
            <div className="bg-background border rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Monday:</span>
                <span>Shoulders, Back, Triceps</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Wednesday:</span>
                <span>Legs, Traps, Neck</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Friday:</span>
                <span>Chest, Biceps, Rear Delts</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
            <h4 className="font-semibold mb-2">Benefits of 3-Day Split</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Less fatigue per workout vs 2-day split</li>
              <li>More exercise variety</li>
              <li>Can focus on shoulder press when completely fresh</li>
              <li>Includes neck and trap work for complete physique</li>
              <li>Most muscle groups hit 2× per week (direct + indirect)</li>
            </ul>
          </div>

          <div className="bg-muted/50 border-l-4 border-muted-foreground/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Programming Strategy</h4>
            <p className="text-sm">
              Alternate between 3-day split (3 months) and 2-day split (2-3 months) to keep progressing.
              The 2-day split helps you hit new PRs, then switch to 3-day for volume and variety.
            </p>
          </div>
        </div>
      ),
    },
  ],
}
