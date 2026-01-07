import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

const popularCities = ['New York', 'Boston', 'Washington DC', 'Los Angeles', 'San Francisco', 'Chicago', 'Miami', 'Seattle'];

export const SearchForm = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date>();
  const [passengers, setPassengers] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      origin: origin || '',
      destination: destination || '',
      date: date ? format(date, 'yyyy-MM-dd') : '',
      passengers: passengers.toString(),
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="glass-card rounded-2xl p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
          <Search className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-display font-semibold">Find Your Bus</h2>
          <p className="text-sm text-muted-foreground">Search from hundreds of routes</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid gap-4">
          {/* Origin */}
          <div className="space-y-2">
            <Label htmlFor="origin" className="text-sm font-medium">From</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="origin"
                placeholder="Enter origin city"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="pl-10 h-12 bg-secondary/50 border-0"
                list="origin-cities"
              />
              <datalist id="origin-cities">
                {popularCities.map(city => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-sm font-medium">To</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <Input
                id="destination"
                placeholder="Enter destination city"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10 h-12 bg-secondary/50 border-0"
                list="destination-cities"
              />
              <datalist id="destination-cities">
                {popularCities.map(city => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Date and Passengers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full h-12 justify-start bg-secondary/50 hover:bg-secondary/70 text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {date ? format(date, 'MMM dd') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Passengers</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                  className="pl-10 h-12 bg-secondary/50 border-0"
                />
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full">
          Search Buses
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>

      <div className="pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground mb-2">Popular routes:</p>
        <div className="flex flex-wrap gap-2">
          {['NYC → Boston', 'LA → SF', 'Miami → Orlando'].map((route) => (
            <button
              key={route}
              type="button"
              className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
              onClick={() => {
                const [from, to] = route.split(' → ');
                const cityMap: Record<string, string> = {
                  'NYC': 'New York',
                  'LA': 'Los Angeles',
                  'SF': 'San Francisco',
                };
                setOrigin(cityMap[from] || from);
                setDestination(cityMap[to] || to);
              }}
            >
              {route}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
