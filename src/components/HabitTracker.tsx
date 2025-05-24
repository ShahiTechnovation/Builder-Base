
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Calendar, Flame, Target } from 'lucide-react';
import { HabitEntry } from '../types';

export const HabitTracker = () => {
  const [todayEntry, setTodayEntry] = useState('');
  const [mood, setMood] = useState<HabitEntry['mood']>('productive');
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [streak, setStreak] = useState(0);

  const today = new Date().toDateString();

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem('habitEntries');
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      setEntries(parsed);
      calculateStreak(parsed);
    }
  }, []);

  const calculateStreak = (entries: HabitEntry[]) => {
    const sortedEntries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    setStreak(currentStreak);
  };

  const saveEntry = () => {
    if (!todayEntry.trim()) return;

    const newEntry: HabitEntry = {
      date: today,
      entry: todayEntry,
      mood
    };

    const updatedEntries = entries.filter(entry => entry.date !== today);
    updatedEntries.push(newEntry);
    
    setEntries(updatedEntries);
    localStorage.setItem('habitEntries', JSON.stringify(updatedEntries));
    calculateStreak(updatedEntries);
    setTodayEntry('');
  };

  const todaysEntry = entries.find(entry => entry.date === today);

  const moodEmojis = {
    excited: '🚀',
    productive: '💪',
    learning: '🧠',
    struggling: '🤔',
    accomplished: '🎉'
  };

  const moodColors = {
    excited: 'bg-orange-100 text-orange-800',
    productive: 'bg-green-100 text-green-800',
    learning: 'bg-blue-100 text-blue-800',
    struggling: 'bg-yellow-100 text-yellow-800',
    accomplished: 'bg-purple-100 text-purple-800'
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Daily Development Habit</span>
          </div>
          <div className="flex items-center space-x-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">{streak} day streak</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {todaysEntry ? (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Today's Entry</span>
              <Badge className={moodColors[todaysEntry.mood]}>
                {moodEmojis[todaysEntry.mood]} {todaysEntry.mood}
              </Badge>
            </div>
            <p className="text-green-700">{todaysEntry.entry}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                What did you develop today or what are you planning to develop?
              </label>
              <Textarea
                value={todayEntry}
                onChange={(e) => setTodayEntry(e.target.value)}
                placeholder="Share your development progress, challenges, or plans..."
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                How are you feeling about your development today?
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(moodEmojis).map(([moodKey, emoji]) => (
                  <Button
                    key={moodKey}
                    variant={mood === moodKey ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMood(moodKey as HabitEntry['mood'])}
                    className="flex items-center space-x-1"
                  >
                    <span>{emoji}</span>
                    <span className="capitalize">{moodKey}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <Button onClick={saveEntry} disabled={!todayEntry.trim()}>
              Save Today's Entry
            </Button>
          </div>
        )}

        {entries.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Recent Entries
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {entries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((entry, index) => (
                  <div key={index} className="flex items-start justify-between p-2 bg-gray-50 rounded text-sm">
                    <div className="flex-1">
                      <p className="text-gray-800">{entry.entry}</p>
                      <p className="text-gray-500 text-xs mt-1">{entry.date}</p>
                    </div>
                    <Badge variant="outline" className={`ml-2 ${moodColors[entry.mood]}`}>
                      {moodEmojis[entry.mood]}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
