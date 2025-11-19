import { useState } from 'react'
import { Search, Bookmark, ChevronsDown, ChevronsUp } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { programPhasesSection, standardsSection, advancedProgramsSection } from '@/components/guide/AdditionalGuideSections'

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

export default function Guide() {
  const [searchTerm, setSearchTerm] = useState('')
  const [bookmarkedSections, setBookmarkedSections] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem('guideBookmarks') || '[]'))
  )
  const [openSections, setOpenSections] = useState<Record<string, string[]>>({})

  const toggleBookmark = (sectionId: string) => {
    const newBookmarks = new Set(bookmarkedSections)
    if (newBookmarks.has(sectionId)) {
      newBookmarks.delete(sectionId)
    } else {
      newBookmarks.add(sectionId)
    }
    setBookmarkedSections(newBookmarks)
    localStorage.setItem('guideBookmarks', JSON.stringify([...newBookmarks]))
  }

  const expandAll = (sections: GuideSection[]) => {
    const allOpen: Record<string, string[]> = {}
    sections.forEach(section => {
      allOpen[section.id] = section.subsections.map(sub => sub.id)
    })
    setOpenSections(allOpen)
  }

  const collapseAll = () => {
    setOpenSections({})
  }

  const toggleExpandAll = (sections: GuideSection[]) => {
    const allExpanded = sections.every(section =>
      openSections[section.id]?.length === section.subsections.length
    )

    if (allExpanded) {
      collapseAll()
    } else {
      expandAll(sections)
    }
  }

  const areAllExpanded = (sections: GuideSection[]) => {
    return sections.length > 0 && sections.every(section =>
      openSections[section.id]?.length === section.subsections.length
    )
  }

  const guideSections: GuideSection[] = [
    {
      id: 'quick-start',
      title: 'Quick Start',
      icon: '🎯',
      description: 'Get started with the program',
      subsections: [
        {
          id: 'your-first-week',
          title: 'Your First Week',
          content: (
            <div className="space-y-4">
              <p>
                Welcome to the Greek God 2.0 program! Here's what you need to know to get started:
              </p>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Training Schedule</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Train 3 days per week on non-consecutive days (e.g., Monday/Wednesday/Friday)</li>
                  <li>Alternate between Workout A and Workout B</li>
                  <li>Week 1: A → B → A</li>
                  <li>Week 2: B → A → B</li>
                </ul>
              </div>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">What to Expect</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Focus on learning proper form for the 5 indicator exercises</li>
                  <li>Start conservative with weights - perfect your technique</li>
                  <li>Track every workout in a notebook or app</li>
                  <li>Rest 3 minutes between heavy sets</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          id: 'understanding-phases',
          title: 'Understanding the Phases',
          content: (
            <div className="space-y-4">
              <p>
                The Greek God 2.0 program is structured in three 8-week phases:
              </p>
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Phase 1: Shoulder Emphasis</CardTitle>
                    <CardDescription>Weeks 1-8</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      Build a strong foundation with focus on overhead pressing and weighted chinups.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      Key exercises: Incline Barbell Press, Standing Press, Weighted Chinups
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Phase 2: Chest Emphasis</CardTitle>
                    <CardDescription>Weeks 9-16</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      Shift focus to chest development with weighted dips and incline dumbbell work.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      Key exercises: Incline Dumbbell Press, Weighted Dips, Box Squats
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Phase 3: Return to Shoulder</CardTitle>
                    <CardDescription>Weeks 17-24</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      Return to Phase 1 exercises with renewed vigor and hit new PRs.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      Same as Phase 1 - you'll be stronger now!
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ),
        },
        {
          id: 'key-principles',
          title: 'Key Principles Summary',
          content: (
            <div className="space-y-4">
              <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
                <h4 className="font-semibold mb-2">The Golden Rules</h4>
                <ol className="list-decimal list-inside space-y-2">
                  <li><strong>Build Strength</strong> - Focus on increasing weight on the 5 indicator exercises</li>
                  <li><strong>Heavy Sets First</strong> - Use Reverse Pyramid Training (heaviest set when fresh)</li>
                  <li><strong>Progressive Overload</strong> - Use the double progression model to add weight consistently</li>
                  <li><strong>Rest &amp; Recover</strong> - Train 3x per week with full recovery between sessions</li>
                  <li><strong>Stay Lean</strong> - Build relative strength (strength-to-bodyweight ratio)</li>
                </ol>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'training-methods',
      title: 'Training Methods',
      icon: '💪',
      description: 'Learn the core training techniques',
      subsections: [
        {
          id: 'reverse-pyramid-training',
          title: 'Reverse Pyramid Training (RPT)',
          content: (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What It Is</h4>
                <p className="text-sm">
                  Perform your heaviest set first when completely fresh, then reduce weight by ~10%
                  for subsequent sets with higher reps. This maximizes strength gains and muscle fiber recruitment.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Why It Works</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Maximum CNS Stimulation:</strong> Heavy set primes your nervous system</li>
                  <li><strong>Greater Fiber Recruitment:</strong> Lighter sets feel easier after heavy set</li>
                  <li><strong>Optimal Volume:</strong> More productive reps without excessive fatigue</li>
                  <li><strong>Strength Focus:</strong> You're fresh for your most important set</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example: Incline Bench Press</h4>
                <div className="bg-background border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-2">Set</th>
                        <th className="text-left p-2">Weight</th>
                        <th className="text-left p-2">Reps</th>
                        <th className="text-left p-2">Rest</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-2">1 (Heavy)</td>
                        <td className="p-2">225 lbs</td>
                        <td className="p-2">5</td>
                        <td className="p-2">3 min</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">2 (-10%)</td>
                        <td className="p-2">205 lbs</td>
                        <td className="p-2">6</td>
                        <td className="p-2">3 min</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">3 (-10%)</td>
                        <td className="p-2">185 lbs</td>
                        <td className="p-2">8</td>
                        <td className="p-2">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Warmup Protocol</h4>
                <p className="text-sm mb-2">Before your heavy set, perform 2-3 buildup sets:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>60% of work weight × 5 reps (rest 2 min)</li>
                  <li>75% of work weight × 3 reps (rest 2 min)</li>
                  <li>90% of work weight × 1 rep (rest 3 min)</li>
                </ul>
              </div>

              <div className="bg-muted/50 border-l-4 border-muted-foreground/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Pro Tip</h4>
                <p className="text-sm">
                  Always take at least 3 minutes rest between RPT sets. Rushing will drastically
                  reduce your strength on subsequent sets.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'double-progression',
          title: 'Double Progression Model',
          content: (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">The Strategy</h4>
                <p className="text-sm">
                  Progress within a rep range before adding weight. Once you hit the top of the range,
                  increase weight and drop back to the bottom of the range.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example: 4-5 Rep Range</h4>
                <div className="bg-background border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-2">Workout</th>
                        <th className="text-left p-2">Weight</th>
                        <th className="text-left p-2">Reps</th>
                        <th className="text-left p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-2">1</td>
                        <td className="p-2">200 lbs</td>
                        <td className="p-2">5</td>
                        <td className="p-2">✅ Hit top of range</td>
                      </tr>
                      <tr className="border-t bg-primary/5">
                        <td className="p-2">2</td>
                        <td className="p-2">205 lbs</td>
                        <td className="p-2">4</td>
                        <td className="p-2">⬆️ Add weight, drop reps</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">3</td>
                        <td className="p-2">205 lbs</td>
                        <td className="p-2">5</td>
                        <td className="p-2">✅ Hit top of range</td>
                      </tr>
                      <tr className="border-t bg-primary/5">
                        <td className="p-2">4</td>
                        <td className="p-2">210 lbs</td>
                        <td className="p-2">4</td>
                        <td className="p-2">⬆️ Add weight, drop reps</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">5</td>
                        <td className="p-2">210 lbs</td>
                        <td className="p-2">5</td>
                        <td className="p-2">✅ Hit top of range</td>
                      </tr>
                      <tr className="border-t bg-primary/5">
                        <td className="p-2">6</td>
                        <td className="p-2">215 lbs</td>
                        <td className="p-2">4</td>
                        <td className="p-2">⬆️ Add weight, drop reps</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Result: +15 lbs in 6 workouts (optimal rate of progression)
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Dumbbell Exercises (Wider Range)</h4>
                <p className="text-sm mb-2">
                  Since dumbbells increase by 10 lbs total (5 per hand), use wider rep ranges:
                </p>
                <div className="bg-background border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-2">Workout</th>
                        <th className="text-left p-2">Weight (per DB)</th>
                        <th className="text-left p-2">Reps</th>
                        <th className="text-left p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-2">1</td>
                        <td className="p-2">35 lbs</td>
                        <td className="p-2">4</td>
                        <td className="p-2">Build in range (4-6)</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">2</td>
                        <td className="p-2">35 lbs</td>
                        <td className="p-2">5</td>
                        <td className="p-2">Building...</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">3</td>
                        <td className="p-2">35 lbs</td>
                        <td className="p-2">6</td>
                        <td className="p-2">✅ Hit top</td>
                      </tr>
                      <tr className="border-t bg-primary/5">
                        <td className="p-2">4</td>
                        <td className="p-2">40 lbs</td>
                        <td className="p-2">4</td>
                        <td className="p-2">⬆️ Add weight</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
                <h4 className="font-semibold mb-2">Target: +10-15 lbs Per Month</h4>
                <p className="text-sm">
                  This progression model ensures consistent, sustainable strength gains without plateaus.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'kino-rep-training',
          title: 'Kino Rep Training',
          content: (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What It Is</h4>
                <p className="text-sm">
                  Start with lighter weight and progressively increase the load each set while maintaining
                  the same rep range (typically 10-12 or 12-15 reps). This builds volume without draining
                  the nervous system.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">When to Use It</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Leg exercises (Bulgarian split squats, Romanian deadlifts)</li>
                  <li>Assistance movements (face pulls, upright rows)</li>
                  <li>Higher rep accessory work</li>
                  <li>Building mind-muscle connection</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example: Dumbbell Romanian Deadlifts</h4>
                <div className="bg-background border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-2">Set</th>
                        <th className="text-left p-2">Weight (per DB)</th>
                        <th className="text-left p-2">Reps</th>
                        <th className="text-left p-2">Rest</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-2">1</td>
                        <td className="p-2">40 lbs</td>
                        <td className="p-2">12</td>
                        <td className="p-2">90 sec</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">2</td>
                        <td className="p-2">50 lbs</td>
                        <td className="p-2">12</td>
                        <td className="p-2">90 sec</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">3</td>
                        <td className="p-2">60 lbs</td>
                        <td className="p-2">12</td>
                        <td className="p-2">90 sec</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">4</td>
                        <td className="p-2">70 lbs</td>
                        <td className="p-2">10</td>
                        <td className="p-2">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Progression</h4>
                <p className="text-sm">
                  When you can hit the top of the rep range on all sets, increase weight by 5 lbs
                  (per dumbbell) on all sets next workout.
                </p>
              </div>

              <div className="bg-muted/50 border-l-4 border-muted-foreground/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Benefits</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Pre-fatigue prevents need for extremely heavy weights</li>
                  <li>Shorter rest periods (60-90 seconds) improve conditioning</li>
                  <li>Develops mind-muscle connection</li>
                  <li>Great for adding extra 20% muscle growth on top of heavy work</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          id: 'rest-pause-training',
          title: 'Rest-Pause Training',
          content: (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What It Is</h4>
                <p className="text-sm">
                  Perform a set to near-failure, rest only 10-15 seconds, then continue for more reps
                  with the same weight. Repeat for 3-4 mini-sets. This maximizes muscle fiber recruitment
                  with lighter weights.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">When to Use It</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Lateral raises (shoulder medial head)</li>
                  <li>Bent-over flyes (rear deltoids)</li>
                  <li>Face pulls</li>
                  <li>Other isolation movements</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example: Lateral Raises</h4>
                <div className="bg-background border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-2">Set Type</th>
                        <th className="text-left p-2">Weight</th>
                        <th className="text-left p-2">Reps</th>
                        <th className="text-left p-2">Rest</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t bg-primary/5">
                        <td className="p-2">Activation</td>
                        <td className="p-2">20 lbs</td>
                        <td className="p-2">12-15</td>
                        <td className="p-2">10-15 sec</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">Mini-set 1</td>
                        <td className="p-2">20 lbs</td>
                        <td className="p-2">4-6</td>
                        <td className="p-2">10-15 sec</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">Mini-set 2</td>
                        <td className="p-2">20 lbs</td>
                        <td className="p-2">4-6</td>
                        <td className="p-2">10-15 sec</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">Mini-set 3</td>
                        <td className="p-2">20 lbs</td>
                        <td className="p-2">4-6</td>
                        <td className="p-2">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Progression</h4>
                <p className="text-sm">
                  When you can do 15 reps on activation set followed by 6 reps on all mini-sets,
                  increase weight next workout.
                </p>
              </div>

              <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
                <h4 className="font-semibold mb-2">Why It Works</h4>
                <p className="text-sm">
                  With only 10-15 seconds rest, your body stays in a state of maximum muscle fiber
                  recruitment. Every rep becomes highly productive for muscle growth, even with lighter weights.
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'exercise-reference',
      title: 'Exercise Reference',
      icon: '🏋️',
      description: 'The 5 indicator exercises and assistance movements',
      subsections: [
        {
          id: 'indicator-exercises',
          title: 'The 5 Indicator Exercises',
          content: (
            <div className="space-y-4">
              <p className="text-sm">
                These five movements are the foundation of the Greek God physique. Track progress on these
                exercises to ensure your program is working.
              </p>

              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">1. Incline Barbell Bench Press</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      <strong>Target:</strong> Upper chest, front shoulders, triceps
                    </p>
                    <p className="text-sm">
                      <strong>Why:</strong> Develops the upper pecs more effectively than flat bench.
                      Creates the square, masculine chest look. More functional pressing angle.
                    </p>
                    <div className="bg-muted p-3 rounded text-sm">
                      <strong>Form Tips:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Set bench to 30-45 degree angle</li>
                        <li>Retract shoulder blades</li>
                        <li>Lower bar to upper chest</li>
                        <li>Drive through heels</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">2. Standing Shoulder Press</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      <strong>Target:</strong> Shoulders, upper chest, triceps, core
                    </p>
                    <p className="text-sm">
                      <strong>Why:</strong> Builds powerful, rounded shoulders. Fills in upper chest below
                      collarbone. Engages core for full-body strength.
                    </p>
                    <div className="bg-muted p-3 rounded text-sm">
                      <strong>Form Tips:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Start with bar at shoulder height</li>
                        <li>Press straight up, not forward</li>
                        <li>Keep core tight throughout</li>
                        <li>Full lockout at top</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">3. Weighted Chinups</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      <strong>Target:</strong> Lats, biceps, upper back
                    </p>
                    <p className="text-sm">
                      <strong>Why:</strong> The ultimate back and biceps builder. Can't cheat like rows.
                      Closed-chain movement = superior muscle recruitment.
                    </p>
                    <div className="bg-muted p-3 rounded text-sm">
                      <strong>Form Tips:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Underhand grip, shoulder-width</li>
                        <li>Pull chin over bar</li>
                        <li>Control the descent</li>
                        <li>Add weight with dip belt</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">4. Weighted Dips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      <strong>Target:</strong> Chest, triceps, front shoulders
                    </p>
                    <p className="text-sm">
                      <strong>Why:</strong> Massive pressing strength gains. Progresses smoothly - expect
                      +45 lbs in 3 months. Builds powerful triceps and full chest.
                    </p>
                    <div className="bg-muted p-3 rounded text-sm">
                      <strong>Form Tips:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Slight forward lean for chest emphasis</li>
                        <li>Lower until upper arms parallel to ground</li>
                        <li>Don't go too deep (shoulder strain)</li>
                        <li>Press up explosively</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">5. Bulgarian Split Squat / Box Squat</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      <strong>Target:</strong> Quads, hamstrings, glutes
                    </p>
                    <p className="text-sm">
                      <strong>Why:</strong> Both build strong, athletic legs. Alternate every few months
                      to prevent plateaus. Box squats ensure proper depth; Bulgarian split squats are
                      safer for those with back issues.
                    </p>
                    <div className="bg-muted p-3 rounded text-sm">
                      <strong>Form Tips (Bulgarian):</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Rear foot elevated on bench</li>
                        <li>Front foot far enough forward</li>
                        <li>Descend until rear knee nearly touches ground</li>
                        <li>Drive through front heel</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ),
        },
        {
          id: 'assistance-movements',
          title: 'Assistance Movements',
          content: (
            <div className="space-y-4">
              <p className="text-sm">
                These exercises support the indicator lifts and ensure complete physique development.
              </p>

              <div className="space-y-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Close-Grip Bench Press</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Triceps and upper chest emphasis. Elbows tucked, builds powerful pressing strength.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Barbell Curls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Best biceps exercise for progressive overload. Build to 135 lbs for powerful arms.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Incline Dumbbell Curls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Arms locked to bench = pure biceps isolation. Alternate with barbell curls every 3-4 weeks.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Skull Crushers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Primary triceps mass builder. Builds lockout strength. Progress to 135 lbs.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Rope Extensions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Higher rep triceps work. Best for Kino rep or rest-pause training.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Lateral Raises</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      <strong>Essential!</strong> Medial deltoid not fully worked by pressing. Builds V-taper.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Bent-Over Flyes / Face Pulls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Rear deltoids for balanced, healthy shoulders. Prevents injury. Creates full, rounded look.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Romanian Deadlift</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Posterior chain development (hamstrings, glutes, low back). Safer than conventional deadlifts.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Calf Raises</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Prevent chicken legs. Keep calves same size as upper arms for balance.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ),
        },
      ],
    },
    programPhasesSection,
    standardsSection,
    advancedProgramsSection,
  ]

  const filteredSections = guideSections.filter(section => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      section.title.toLowerCase().includes(searchLower) ||
      section.description.toLowerCase().includes(searchLower) ||
      section.subsections.some(sub => sub.title.toLowerCase().includes(searchLower))
    )
  })

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Greek God 2.0 Guide</h1>
          <p className="text-muted-foreground">
            Complete reference for the training program
          </p>
        </div>

        {/* Search Bar with Expand/Collapse Button */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search guide..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => toggleExpandAll(filteredSections)}
            className="flex items-center gap-2 shrink-0"
          >
            {areAllExpanded(filteredSections) ? (
              <>
                <ChevronsUp className="h-4 w-4" />
                <span className="hidden md:inline">Collapse All</span>
              </>
            ) : (
              <>
                <ChevronsDown className="h-4 w-4" />
                <span className="hidden md:inline">Expand All</span>
              </>
            )}
          </Button>
        </div>

        {/* Bookmarked Sections */}
        {bookmarkedSections.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              My Bookmarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from(bookmarkedSections).map(sectionId => {
                const section = guideSections.find(s => s.id === sectionId)
                if (!section) return null
                return (
                  <Button
                    key={sectionId}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    {section.icon} {section.title}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
        )}

        {/* Guide Sections */}
        {filteredSections.map(section => (
          <Card key={section.id} id={section.id}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleBookmark(section.id)}
                  className="shrink-0 h-10 w-10 p-0"
                >
                  <Bookmark
                    className={`h-4 w-4 ${
                      bookmarkedSections.has(section.id) ? 'fill-current' : ''
                    }`}
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion
                type="multiple"
                className="w-full"
                value={openSections[section.id] || []}
                onValueChange={(value) => {
                  setOpenSections(prev => ({
                    ...prev,
                    [section.id]: value
                  }))
                }}
              >
                {section.subsections.map((subsection, index) => (
                  <AccordionItem
                    key={subsection.id}
                    value={subsection.id}
                    className={index === section.subsections.length - 1 ? 'border-b-0' : ''}
                  >
                    <AccordionTrigger className="text-left">
                      {subsection.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4">
                        {subsection.content}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}

        {filteredSections.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No results found for "{searchTerm}"
          </div>
        )}
      </div>
    </Layout>
  )
}
