import { Shield, Clock, CreditCard, Headphones, MapPin, Zap } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'All our partner buses are verified and follow strict safety protocols.',
    color: 'primary',
  },
  {
    icon: Clock,
    title: 'On-Time Guarantee',
    description: 'Get your money back if your bus arrives more than 30 minutes late.',
    color: 'accent',
  },
  {
    icon: CreditCard,
    title: 'Easy Payments',
    description: 'Multiple payment options including cards, wallets, and UPI.',
    color: 'success',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our customer support team is always ready to help you.',
    color: 'primary',
  },
  {
    icon: MapPin,
    title: 'Live Tracking',
    description: 'Track your bus in real-time and never miss your pickup.',
    color: 'accent',
  },
  {
    icon: Zap,
    title: 'Instant Confirmation',
    description: 'Get your e-ticket instantly after booking.',
    color: 'success',
  },
];

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
};

export const Features = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Why Choose <span className="gradient-text">Go My Bus</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We make bus travel comfortable, affordable, and hassle-free.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`h-12 w-12 rounded-xl ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
