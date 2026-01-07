import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Bus, MapPin, Clock, Wifi, Zap, Wind, UtensilsCrossed, ArrowRight, Filter } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface BusRoute {
  id: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  price: number;
  bus_type: string;
  amenities: string[];
  available_seats: number;
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="h-4 w-4" />,
  'AC': <Wind className="h-4 w-4" />,
  'Power Outlets': <Zap className="h-4 w-4" />,
  'Snacks': <UtensilsCrossed className="h-4 w-4" />,
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [loading, setLoading] = useState(true);

  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';
  const passengers = parseInt(searchParams.get('passengers') || '1');

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      let query = supabase.from('bus_routes').select('*');

      if (origin) {
        query = query.ilike('origin', `%${origin}%`);
      }
      if (destination) {
        query = query.ilike('destination', `%${destination}%`);
      }

      const { data, error } = await query;

      if (!error && data) {
        setRoutes(data as BusRoute[]);
      }
      setLoading(false);
    };

    fetchRoutes();
  }, [origin, destination]);

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleBooking = (route: BusRoute) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${route.id}?date=${date}&passengers=${passengers}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Search Summary */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">From</p>
                <p className="font-semibold">{origin || 'All cities'}</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">To</p>
                <p className="font-semibold">{destination || 'All cities'}</p>
              </div>
            </div>
            {date && (
              <div className="ml-auto flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{format(new Date(date), 'MMM dd, yyyy')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">
            {loading ? 'Searching...' : `${routes.length} buses found`}
          </h2>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
                <div className="h-24 bg-secondary rounded-lg" />
              </div>
            ))}
          </div>
        ) : routes.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <Bus className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No buses found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or check back later.
            </p>
            <Button onClick={() => navigate('/')}>Go Back</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {routes.map((route, index) => (
              <div
                key={route.id}
                className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Time & Route */}
                  <div className="flex-1 grid grid-cols-3 gap-4 items-center">
                    <div className="text-center">
                      <p className="text-2xl font-display font-bold">{formatTime(route.departure_time)}</p>
                      <p className="text-sm text-muted-foreground">{route.origin}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-xs text-muted-foreground mb-1">{formatDuration(route.duration_minutes)}</p>
                      <div className="w-full h-0.5 bg-border relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-accent" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Direct</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-display font-bold">{formatTime(route.arrival_time)}</p>
                      <p className="text-sm text-muted-foreground">{route.destination}</p>
                    </div>
                  </div>

                  {/* Bus Info */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={route.bus_type === 'Luxury' ? 'default' : 'secondary'}>
                        {route.bus_type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {route.available_seats} seats left
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {route.amenities?.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md"
                        >
                          {amenityIcons[amenity] || null}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Book */}
                  <div className="flex items-center justify-between lg:flex-col lg:items-end gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-display font-bold text-primary">${route.price}</p>
                      <p className="text-xs text-muted-foreground">per person</p>
                    </div>
                    <Button onClick={() => handleBooking(route)} variant="hero">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
