import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  Calendar,
  Ticket,
  MapPin,
  Clock,
  LogOut,
  User,
  Search,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, isPast, parseISO } from 'date-fns';

interface Booking {
  id: string;
  travel_date: string;
  seat_numbers: string[];
  total_amount: number;
  status: string;
  passenger_name: string;
  created_at: string;
  bus_routes: {
    origin: string;
    destination: string;
    departure_time: string;
    arrival_time: string;
    bus_type: string;
  };
}

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          travel_date,
          seat_numbers,
          total_amount,
          status,
          passenger_name,
          created_at,
          bus_routes (
            origin,
            destination,
            departure_time,
            arrival_time,
            bus_type
          )
        `)
        .eq('user_id', user.id)
        .order('travel_date', { ascending: false });

      if (!error && data) {
        setBookings(data as unknown as Booking[]);
      }
      setLoading(false);
    };

    fetchBookings();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const upcomingBookings = bookings.filter(b => !isPast(parseISO(b.travel_date)));
  const pastBookings = bookings.filter(b => isPast(parseISO(b.travel_date)));

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Ticket, color: 'primary' },
    { label: 'Upcoming Trips', value: upcomingBookings.length, icon: Calendar, color: 'accent' },
    { label: 'Total Spent', value: `$${bookings.reduce((sum, b) => sum + Number(b.total_amount), 0)}`, icon: MapPin, color: 'success' },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border p-6 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Bus className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-sidebar-foreground">Go My Bus</span>
        </div>

        <nav className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground font-medium">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </button>
          <button
            onClick={() => navigate('/search')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <Search className="h-5 w-5" />
            Search Buses
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <Ticket className="h-5 w-5" />
            My Bookings
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <User className="h-5 w-5" />
            Profile
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
          </div>
          <Button onClick={() => navigate('/search')} className="hidden sm:flex">
            <Search className="h-4 w-4 mr-2" />
            Book New Trip
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-10 w-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-display font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bookings */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">My Bookings</h2>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming ({upcomingBookings.length})
              </Button>
              <Button
                variant={activeTab === 'past' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('past')}
              >
                Past ({pastBookings.length})
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-secondary rounded-lg animate-pulse" />
              ))}
            </div>
          ) : displayedBookings.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No {activeTab} bookings</h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === 'upcoming'
                  ? "You don't have any upcoming trips yet."
                  : "You haven't completed any trips yet."}
              </p>
              {activeTab === 'upcoming' && (
                <Button onClick={() => navigate('/search')}>
                  Book a Trip
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {displayedBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="border border-border rounded-lg p-4 hover:bg-secondary/30 transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                        <Badge variant="outline">{booking.bus_routes.bus_type}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-lg font-semibold">
                        <span>{booking.bus_routes.origin}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.bus_routes.destination}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(parseISO(booking.travel_date), 'MMM dd, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.bus_routes.departure_time.substring(0, 5)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Ticket className="h-4 w-4" />
                          Seats: {booking.seat_numbers.join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-display font-bold text-primary">
                        ${booking.total_amount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Booked {format(parseISO(booking.created_at), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Sign Out */}
        <div className="lg:hidden mt-6">
          <Button variant="outline" className="w-full" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
