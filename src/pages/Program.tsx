import { Layout } from '@/components/layout/Layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Dumbbell, Target } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { programChapters } from '@/data/programData';

export function Program() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#202124] dark:text-[#E6EDF3] mb-2">
            Greek God 2.0 Program
          </h1>
          <p className="text-[#5F6368] dark:text-[#8B949E]">
            Master the complete Kinobody training system
          </p>
        </div>

        {/* Program Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col">
                <BookOpen className="w-5 h-5 text-[#20808D] dark:text-[#1FB8CD] mb-3 flex-shrink-0" />
                <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mb-1">Total Chapters</p>
                <p className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3]">{programChapters.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col">
                <Dumbbell className="w-5 h-5 text-[#20808D] dark:text-[#1FB8CD] mb-3 flex-shrink-0" />
                <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mb-1">Program Duration</p>
                <p className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3]">6 Months+</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col">
                <Target className="w-5 h-5 text-[#20808D] dark:text-[#1FB8CD] mb-3 flex-shrink-0" />
                <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mb-1">Focus</p>
                <p className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3]">Strength & Aesthetics</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Content */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <Accordion type="single" collapsible className="w-full">
              {programChapters.map((chapter) => (
                <AccordionItem key={chapter.id} value={chapter.id}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xs text-[#5F6368] dark:text-[#8B949E] font-normal">
                        {chapter.number}
                      </span>
                      <span className="font-semibold text-[#202124] dark:text-[#E6EDF3]">
                        {chapter.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-[#202124] dark:prose-headings:text-[#E6EDF3] prose-p:text-[#5F6368] dark:prose-p:text-[#8B949E] prose-p:mb-4 prose-strong:text-[#202124] dark:prose-strong:text-[#E6EDF3] prose-li:text-[#5F6368] dark:prose-li:text-[#8B949E] prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-lg prose-h3:font-bold">
                      {chapter.title && (
                        <h3 className="text-xl font-bold text-[#202124] dark:text-[#E6EDF3] mb-4">
                          {chapter.title}
                        </h3>
                      )}
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {chapter.content}
                      </ReactMarkdown>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
