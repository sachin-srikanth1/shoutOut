'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Sample events data
  const events = [
    {
      id: '1',
      title: 'Interview with TechCorp',
      date: new Date(2024, 1, 15),
      time: '2:30 PM',
      type: 'interview'
    },
    {
      id: '2',
      title: 'Networking Coffee',
      date: new Date(2024, 1, 18),
      time: '4:00 PM',
      type: 'coffee'
    },
    {
      id: '3',
      title: 'Mentorship Session',
      date: new Date(2024, 1, 20),
      time: '10:00 AM',
      type: 'mentorship'
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDayName = (day: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'interview':
        return 'bg-blue-500';
      case 'networking':
        return 'bg-green-500';
      case 'mentorship':
        return 'bg-purple-500';
      case 'coffee':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-medium text-foreground">Calendar</h1>
          </div>
          <p className="text-muted-foreground">Manage your schedule and upcoming events</p>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-medium text-foreground">{getMonthName(currentDate)}</h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isToday = day && day.toDateString() === new Date().toDateString();
              const isSelected = selectedDate && day && day.toDateString() === selectedDate.toDateString();
              const dayEvents = day ? getEventsForDate(day) : [];
              
              return (
                <div
                  key={index}
                  className={`min-h-[80px] p-2 border border-border/30 rounded-lg transition-all duration-200 ${
                    day 
                      ? 'hover:bg-muted/30 cursor-pointer' 
                      : 'bg-muted/20'
                  } ${
                    isToday ? 'bg-purple-100 dark:bg-purple-900/20 border-purple-300' : ''
                  } ${
                    isSelected ? 'bg-purple-200 dark:bg-purple-800/30 border-purple-400' : ''
                  }`}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-purple-700 dark:text-purple-300' : 'text-foreground'
                      }`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded ${getEventColor(event.type)} text-white truncate`}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Events for {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <div className="space-y-3">
              {getEventsForDate(selectedDate).map(event => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm"
                >
                  <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)}`}></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
              {getEventsForDate(selectedDate).length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No events scheduled for this date
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 