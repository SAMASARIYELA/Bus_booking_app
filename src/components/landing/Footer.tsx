import { Link } from 'react-router-dom';
import { Bus, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <Bus className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold">Go My Bus</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your trusted partner for comfortable and affordable bus travel across the country.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-background text-sm transition-colors">
                  Search Buses
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-background text-sm transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-background text-sm transition-colors">
                  Popular Routes
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-background text-sm transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-background text-sm transition-colors">
                  Cancellation Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-background text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4" />
                support@busgo.com
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4" />
                1-800-BUS-TRIP
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 mt-0.5" />
                123 Transit Street<br />New York, NY 10001
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Go My Bus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
