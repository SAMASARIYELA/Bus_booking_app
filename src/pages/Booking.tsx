import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Bus, MapPin, Clock, User, Mail, Phone, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

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

const Booking = () => {
  const { routeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [route, setRoute] = useState<BusRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const date = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const passengers = parseInt(searchParams.get('passengers') || '1');

  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState(user?.email || '');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchRoute = async () => {
      const { data, error } = await supabase
        .from('bus_routes')
        .select('*')
        .eq('id', routeId)
        .maybeSingle();

      if (!error && data) {
        setRoute(data as BusRoute);
      }
      setLoading(false);
    };

    fetchRoute();
  }, [routeId, user, navigate]);

  // Generate mock seats
  const generateSeats = () => {
    const seats = [];
    for (let i = 1; i <= 40; i++) {
      seats.push(`${Math.ceil(i / 4)}${String.fromCharCode(65 + ((i - 1) % 4))}`);
    }
    return seats;
  };

  const seats = generateSeats();

  const toggleSeat = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else if (selectedSeats.length < passengers) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleBooking = async () => {
    if (!route || !user) return;

    if (selectedSeats.length !== passengers) {
      setError(`Please select ${passengers} seat(s)`);
      return;
    }

    if (!passengerName || !passengerEmail) {
      setError('Please fill in all required fields');
      return;
    }

    setBooking(true);
    setError(null);

    const { error } = await supabase.from('bookings').insert({
      user_id: user.id,
      route_id: route.id,
      travel_date: date,
      seat_numbers: selectedSeats,
      total_amount: route.price * passengers,
      passenger_name: passengerName,
      passenger_email: passengerEmail,
      passenger_phone: passengerPhone,
    });

    if (error) {
      setError(error.message);
      setBooking(false);
    } else {
      toast({
        title: 'Booking Confirmed!',
        description: 'Your bus ticket has been booked successfully.',
      });
      navigate('/dashboard');
    }
  };

  const formatTime = (time: string) => time.substring(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-secondary rounded-xl" />
            <div className="h-64 bg-secondary rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12 text-center">
          <h1 className="text-2xl font-bold">Route not found</h1>
          <Button onClick={() => navigate('/search')} className="mt-4">
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Route Summary */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={route.bus_type === 'Luxury' ? 'default' : 'secondary'}>
                {route.bus_type}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {format(new Date(date), 'EEEE, MMMM dd, yyyy')}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-center">
                <p className="text-3xl font-display font-bold">{formatTime(route.departure_time)}</p>
                <p className="text-muted-foreground">{route.origin}</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="h-5 w-5 text-muted-foreground mb-1" />
                <div className="w-full h-0.5 bg-border relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-accent" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.floor(route.duration_minutes / 60)}h {route.duration_minutes % 60}m
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display font-bold">{formatTime(route.arrival_time)}</p>
                <p className="text-muted-foreground">{route.destination}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Seat Selection */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Select Seats ({selectedSeats.length}/{passengers})</h3>
              <div className="mb-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-secondary" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-primary" />
                  <span>Selected</span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-2 grid grid-cols-2 gap-2">
                  {seats.slice(0, 20).map((seat) => (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      className={`h-10 rounded-lg text-sm font-medium transition-all ${
                        selectedSeats.includes(seat)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/70'
                      }`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-center text-muted-foreground text-xs">
                  Aisle
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-2">
                  {seats.slice(20, 40).map((seat) => (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      className={`h-10 rounded-lg text-sm font-medium transition-all ${
                        selectedSeats.includes(seat)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/70'
                      }`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Passenger Details</h3>
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={passengerEmail}
                      onChange={(e) => setPassengerEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Price Summary */}
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ticket Price</span>
                    <span>${route.price} × {passengers}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${route.price * passengers}</span>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={booking || selectedSeats.length !== passengers}
                >
                  {booking ? 'Processing...' : 'Confirm Booking'}
                  <Check className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
