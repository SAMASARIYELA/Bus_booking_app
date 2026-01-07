import { Bus, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchForm } from './SearchForm';

export const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl animate-float" />
      </div>

      <div className="container relative mx-auto px-4 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Bus className="h-4 w-4" />
              <span>Trusted by 1M+ travelers</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              Book Your
              <span className="gradient-text"> Bus Journey</span>
              <br />
              With Ease
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg">
              Discover comfortable and affordable bus tickets to your favorite destinations. 
              Fast booking, flexible cancellation, and 24/7 support.
            </p>

            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">500+</p>
                  <p className="text-sm text-muted-foreground">Routes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">Daily</p>
                  <p className="text-sm text-muted-foreground">Departures</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="font-semibold">1M+</p>
                  <p className="text-sm text-muted-foreground">Happy Travelers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Search Form */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <SearchForm />
          </div>
        </div>
      </div>
    </section>
  );
};
