'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'relative flex flex-col gap-4 sm:flex-row',
          defaultClassNames.months,
        ),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        month_caption: cn(
          'flex h-7 items-center justify-center px-1',
          defaultClassNames.month_caption,
        ),
        caption_label: cn('text-sm font-medium', defaultClassNames.caption_label),
        nav: cn(
          'absolute inset-x-0 top-0 flex items-center justify-between',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          defaultClassNames.button_next,
        ),
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
          defaultClassNames.weekday,
        ),
        weeks: cn('mt-2', defaultClassNames.weeks),
        week: cn('mt-2 flex w-full', defaultClassNames.week),
        day: cn(
          'relative h-9 w-9 p-0 text-center text-sm [&:has([aria-selected=true])]:bg-accent first:[&:has([aria-selected=true])]:rounded-l-md last:[&:has([aria-selected=true])]:rounded-r-md focus-within:relative focus-within:z-20',
          defaultClassNames.day,
        ),
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
          defaultClassNames.day_button,
        ),
        range_end: cn('range-end', defaultClassNames.range_end),
        selected: cn(
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          defaultClassNames.selected,
        ),
        today: cn('bg-accent text-accent-foreground', defaultClassNames.today),
        outside: cn(
          'text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
          defaultClassNames.outside,
        ),
        disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
        range_middle: cn(
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
          defaultClassNames.range_middle,
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ className: iconClassName, orientation, ...iconProps }) =>
          orientation === 'left' ? (
            <ChevronLeft
              className={cn('h-4 w-4', iconClassName)}
              {...iconProps}
            />
          ) : (
            <ChevronRight
              className={cn('h-4 w-4', iconClassName)}
              {...iconProps}
            />
          ),
      }}
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }
