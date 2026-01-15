import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronRight,
  Globe,
  LineChart,
  Play,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { value: "500+", label: "Agencies Trust Us" },
  { value: "₹50Cr+", label: "Ad Spend Managed" },
  { value: "10,000+", label: "Campaigns Optimized" },
  { value: "35%", label: "Avg. ROAS Improvement" },
];

const features = [
  {
    icon: Globe,
    title: "Multi-Platform Integration",
    description:
      "Connect Google Ads and Meta Ads in one unified dashboard. No more switching between platforms.",
  },
  {
    icon: Bot,
    title: "AI-Powered Insights",
    description:
      "Get intelligent recommendations powered by GPT-4 and Claude. Spot opportunities before your competitors.",
  },
  {
    icon: BarChart3,
    title: "Automated Reporting",
    description:
      "Generate beautiful, white-labeled reports automatically. Impress clients without the manual work.",
  },
  {
    icon: Target,
    title: "Budget Optimization",
    description:
      "AI analyzes spending patterns and suggests optimal budget allocation across campaigns.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Invite your team with role-based access. Account managers, analysts, and admins - all in sync.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption, SOC 2 compliance, and OAuth 2.0. Your data is always protected.",
  },
];

const testimonials = [
  {
    quote:
      "DataDrip cut our reporting time by 80%. What used to take 2 days now takes 30 minutes.",
    author: "Priya Sharma",
    role: "Founder, DigitalFirst Agency",
    avatar: "PS",
  },
  {
    quote:
      "The AI insights are game-changing. We discovered a 40% budget optimization opportunity we completely missed.",
    author: "Rahul Verma",
    role: "Performance Lead, GrowthHackers",
    avatar: "RV",
  },
  {
    quote:
      "Finally, a tool built for Indian agencies. INR pricing, IST timezone, GST invoicing - they get us.",
    author: "Ananya Krishnan",
    role: "CEO, BrandBoost Media",
    avatar: "AK",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "2,999",
    period: "month",
    description: "Perfect for freelancers and small agencies",
    features: [
      "5 client accounts",
      "Google Ads integration",
      "Basic AI insights",
      "Weekly reports",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Growth",
    price: "7,999",
    period: "month",
    description: "For growing agencies with multiple clients",
    features: [
      "15 client accounts",
      "Google Ads + Meta integration",
      "Advanced AI insights",
      "Daily reports",
      "White-label reports",
      "Priority support",
      "Team collaboration (5 users)",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Scale",
    price: "14,999",
    period: "month",
    description: "For established agencies at scale",
    features: [
      "50 client accounts",
      "All integrations",
      "Unlimited AI insights",
      "Real-time reports",
      "Custom branding",
      "Dedicated support",
      "Unlimited team members",
      "API access",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const integrations = [
  { name: "Google Ads", status: "live" },
  { name: "Meta Ads", status: "live" },
  { name: "LinkedIn Ads", status: "coming" },
  { name: "Twitter Ads", status: "coming" },
  { name: "TikTok Ads", status: "coming" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">DataDrip</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground">
              Testimonials
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Login
            </Link>
            <Button asChild>
              <Link href="/login">Start Free Trial</Link>
            </Button>
          </div>
          <Button asChild className="md:hidden">
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 blur-[100px]" />

          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Now with GPT-4 & Claude AI</span>
              <ChevronRight className="h-4 w-4" />
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Stop Juggling Ad Platforms.
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {" "}Start Growing.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              DataDrip unifies your Google Ads and Meta campaigns with AI-powered insights.
              Spend less time on reports, more time scaling your clients.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="h-12 px-8 text-base">
                <Link href="/login">
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
                <Link href="#demo">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required · Setup in 5 minutes · Cancel anytime
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold md:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Logos */}
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-8 text-sm font-medium text-muted-foreground">
              TRUSTED BY LEADING AGENCIES ACROSS INDIA
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale md:gap-16">
              {["DigitalFirst", "GrowthHackers", "BrandBoost", "AdScale", "MediaMint", "ClickWise"].map(
                (name) => (
                  <div key={name} className="text-xl font-bold">
                    {name}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Everything You Need to Scale Your Agency
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                One platform to manage all your clients' ad accounts, generate insights, and deliver results.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border/60 transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted/30 py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">Up and Running in 5 Minutes</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                No complex setup. No developer needed. Just connect and go.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Connect Your Accounts",
                  description:
                    "Link your Google Ads and Meta Business accounts with secure OAuth. Takes 2 minutes.",
                },
                {
                  step: "02",
                  title: "Add Your Clients",
                  description:
                    "Create client profiles and assign ad accounts. Organize everything in one place.",
                },
                {
                  step: "03",
                  title: "Get AI Insights",
                  description:
                    "Our AI analyzes your data and delivers actionable recommendations instantly.",
                },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="mb-4 text-6xl font-bold text-primary/20">{item.step}</div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">Connect All Your Ad Platforms</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Bring all your advertising data into one unified dashboard.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center gap-3 rounded-full border bg-background px-6 py-3"
                >
                  <div className={`h-3 w-3 rounded-full ${
                    integration.status === "live" ? "bg-green-500" : "bg-amber-500"
                  }`} />
                  <span className="font-medium">{integration.name}</span>
                  {integration.status === "coming" && (
                    <span className="text-xs text-muted-foreground">Soon</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="bg-muted/30 py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">Loved by Agencies Across India</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                See why 500+ agencies trust DataDrip for their marketing intelligence.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.author} className="border-border/60">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5 fill-primary text-primary"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-lg">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">Simple, Transparent Pricing</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                No hidden fees. No surprises. Scale as you grow.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative border-border/60 ${
                    plan.popular ? "border-primary shadow-lg" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">₹{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="mt-6 w-full"
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/login">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                Need a custom plan for your enterprise?{" "}
                <Link href="/contact" className="text-primary underline">
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Ready to 10x Your Agency&apos;s Efficiency?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Join 500+ agencies already using DataDrip to manage ₹50Cr+ in ad spend. Start your free trial today.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild className="h-12 px-8">
                <Link href="/login">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 border-primary-foreground/20 px-8 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">DataDrip</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Marketing intelligence platform for digital agencies. Made with love in India.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Product</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-foreground">Integrations</Link></li>
                <li><Link href="/changelog" className="hover:text-foreground">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-foreground">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2026 DataDrip. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Twitter
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                LinkedIn
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
