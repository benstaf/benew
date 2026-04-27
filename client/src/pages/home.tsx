import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowRight, 
  TrendingUp, 
  Activity, 
  Target, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Users, 
  BarChart3, 
  Search,
  Rocket,
  Mail,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BuiltOnYCBadge } from "@/components/BuiltOnYCBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { LEADERBOARD_DATA } from "./leaderboardData";

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  readTime: number;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const FORM_URL = "https://forms.gle/oYh3teZ8xU7QrvN18";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.338c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
  </svg>
);

const DiscordIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
  </svg>
);

const PaperIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
  </svg>
);

// Data for momentum chart
const momentumData = [
  { day: "0", pOutperformer: 100, baseline: 100 },
  { day: "15", pOutperformer: 105, baseline: 101 },
  { day: "30", pOutperformer: 112, baseline: 102 },
  { day: "45", pOutperformer: 125, baseline: 104 },
  { day: "60", pOutperformer: 140, baseline: 105 },
  { day: "75", pOutperformer: 155, baseline: 107 },
  { day: "90", pOutperformer: 180, baseline: 108 },
];

export default function Home() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: recentPosts } = useQuery<PostMeta[]>({ queryKey: ["/api/posts"] });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({
      title: "Access Requested",
      description: "You've been added to the early access list.",
    });
    setEmail("");
    setRole("");
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-200 border-b ${isScrolled ? "bg-white/80 backdrop-blur-md border-border" : "bg-transparent border-transparent"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-[#FF6600] text-white font-bold text-[24px] rounded flex items-center justify-center w-10 h-10 select-none pb-0.5" style={{ fontFamily: '"Arimo", sans-serif', letterSpacing: '-0.05em' }}>
              YC
            </div>
            <span className="font-semibold text-lg tracking-tight">Bench</span>
          </div>
          
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#leaderboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Leaderboard</a>
            <a
              href="https://github.com/benstaf/ycbench"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <GithubIcon /> GitHub
            </a>
            <a
              href="https://discord.gg/ekrySuRBf4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <DiscordIcon /> Discord
            </a>
            <a
              href="https://arxiv.org/abs/2604.02378"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <PaperIcon /> Paper
            </a>
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
              <a href={FORM_URL} target="_blank" rel="noopener noreferrer">Submit Model</a>
            </Button>
          </div>
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        {/* Mobile menu drawer */}
        {menuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-border px-4 py-4 flex flex-col gap-4">
            <a href="#leaderboard" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1">Leaderboard</a>
            <a
              href="https://github.com/benstaf/ycbench"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1"
            >
              <GithubIcon /> GitHub
            </a>
            <a
              href="https://discord.gg/ekrySuRBf4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1"
            >
              <DiscordIcon /> Discord
            </a>
            <a
              href="https://arxiv.org/abs/2604.02378"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1"
            >
              <PaperIcon /> Paper
            </a>
            <Link href="/blog" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1">Blog</Link>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full w-full">
              <a href={FORM_URL} target="_blank" rel="noopener noreferrer">Submit Model</a>
            </Button>
          </div>
        )}
      </nav>

      <main className="pt-24 pb-0">
        {/* 1. Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-12 max-w-6xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <BuiltOnYCBadge />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-tight">
            Predict the Next <br/>
            <span className="text-primary">YC Outperformers</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            YC Bench is a live benchmark to forecast the top 10% Y Combinator startups at Demo Day.
          </p>
          <Card className="max-w-xl mx-auto border border-border shadow-sm p-6 mb-8 bg-white/50 backdrop-blur-sm text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Have a predictive model?
            </p>
            <h3 className="text-xl font-semibold mb-6">
              Submit it to the YC Bench leaderboard
            </h3>
            <Button
              asChild
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-white rounded-md text-base"
            >
              <a href="https://forms.gle/oYh3teZ8xU7QrvN18" target="_blank" rel="noopener noreferrer">
                Submit Your Model →
              </a>
            </Button>
          </Card>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Live evaluation</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Cohort-relative signals</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Fast iteration</span>
          </div>
        </section>

        {/* 2. YC Credibility Strip */}
        <section className="border-y border-border bg-secondary/50 py-4">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 text-sm font-mono text-muted-foreground uppercase tracking-wider">
            <span>Built upon Y Combinator batches</span>
            <span className="hidden sm:inline">•</span>
            <span>Cohort-relative benchmarking</span>
            <span className="hidden sm:inline">•</span>
            <span>Fast evaluation cycles</span>
          </div>
        </section>

        {/* 5. The Core Insight */}
        <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">The Core Insight</h2>
          <div className="prose prose-lg mx-auto text-muted-foreground space-y-6">
            <p className="text-2xl text-foreground font-medium">Forecasting startup success normally takes years.<br/>YC Bench makes it measurable in months.</p>
            <p>
              Y Combinator startups launch in synchronized batches, allowing models to measure relative execution and short-term outperformance, instead of waiting for distant outcomes like unicorns or exits.
            </p>
          </div>
        </section>

        {/* 3. Live Leaderboard Preview */}
        <section id="leaderboard" className="py-24 bg-secondary/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Live Benchmark Leaderboard
              </h2>
              <p className="text-muted-foreground">
                Can you beat the baseline?
              </p>
            </div>
            <Card className="border border-border/50 shadow-md overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead className="font-semibold text-foreground py-6 w-1/2">Model</TableHead>
                      <TableHead className="font-semibold text-foreground text-center py-6 w-1/4">Precision</TableHead>
                      <TableHead className="font-semibold text-foreground text-center py-6 w-1/4">Recall</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-primary/10 border-y border-primary/20">
                      <TableCell className="font-semibold text-primary py-6 flex items-center gap-2">
                        <Rocket className="w-4 h-4" /> Your model?
                      </TableCell>
                      <TableCell className="text-center font-mono font-semibold py-6">?</TableCell>
                      <TableCell className="text-center font-mono font-semibold py-6">?</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium py-6">YC Bench Baseline</TableCell>
                      <TableCell className="text-center font-mono font-semibold py-6">70%</TableCell>
                      <TableCell className="text-center font-mono font-semibold py-6">55%</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/50 transition-colors">
                      <TableCell className="text-muted-foreground py-6">Random Predictor</TableCell>
                      <TableCell className="text-center font-mono text-muted-foreground py-6">10%</TableCell>
                      <TableCell className="text-center font-mono text-muted-foreground py-6">10%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </section>

    
    {/* 4. Model Leaderboard Table */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-border">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">Top 20 Startups — W26 Batch</h2>
            <p className="text-muted-foreground mb-8">
              Score = % of runs where startup was selected. Ranked by average across 10 LLMs.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border shadow-md">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-secondary/70 border-b border-border">
                    <th className="sticky left-0 bg-secondary/70 z-10 py-4 px-3 text-left font-semibold w-8">#</th>
                    <th className="sticky left-8 bg-secondary/70 z-10 py-4 px-4 text-left font-semibold min-w-[150px] border-r border-border">Startup</th>
                    <th className="py-4 px-4 text-center font-semibold text-primary whitespace-nowrap border-r border-border">LLM Average</th>
                    {["Claude","GPT","Gemini","Grok","GLM","Kimi","DeepSeek","Qwen","MiniMax","Mimo"].map(m => (
                      <th key={m} className="py-4 px-3 text-center font-semibold text-muted-foreground whitespace-nowrap">{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LEADERBOARD_DATA.map((row, i) => (
                    <tr key={row.name as string} className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-secondary/10'}`}>
                      <td className="sticky left-0 py-3 px-3 font-mono text-xs text-muted-foreground bg-inherit z-10">{i + 1}</td>
                      <td className="sticky left-8 py-3 px-4 font-medium bg-inherit z-10 border-r border-border whitespace-nowrap">{row.name as string}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-primary border-r border-border">
                        {row["LLM Average"] as number}
                      </td>
                      {["Claude","GPT","Gemini","Grok","GLM","Kimi","DeepSeek","Qwen","MiniMax","Mimo"].map(m => {
                        const v = row[m] as number ?? 0;
                        const cls = v === 0 ? 'text-muted-foreground/30' : v >= 80 ? 'text-green-700 font-semibold' : v >= 40 ? 'text-foreground' : 'text-muted-foreground';
                        return (
                          <td key={m} className={`py-3 px-3 text-center font-mono text-xs ${cls}`}>
                            {v > 0 ? v : '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </section>
        </div>

        {/* 6. How It Works */}
        <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">A forward-looking approach to test predictive models.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-secondary/80 -z-10"></div>
            {[
              {
                step: "1",
                title: "Models Predict",
                desc: "Models forecast which YC startups will outperform their batch peers using short-term execution velocity signals.",
                icon: <Target className="w-6 h-6 text-primary" />
              },
              {
                step: "2",
                title: "Measure Velocity",
                desc: "Short-term velocity signals are measured over the next 90 days across the entire cohort.",
                icon: <Activity className="w-6 h-6 text-primary" />
              },
              {
                step: "3",
                title: "Evaluate & Rank",
                desc: "Predictions are evaluated against ground truth and ranked on a live leaderboard.",
                icon: <BarChart3 className="w-6 h-6 text-primary" />
              }
            ].map((item, i) => (
              <div key={i} className="relative bg-white pt-8 px-6 pb-8 border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow yc-shadow text-center group">
                <div className="w-16 h-16 mx-auto bg-accent rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary/10 group-hover:-translate-y-1 transition-transform">
                  {item.icon}
                </div>
                <div className="absolute top-4 left-4 text-xs font-mono font-bold text-muted-foreground bg-secondary px-2 py-1 rounded">
                  STEP {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Evaluation Metrics */}
        <section className="py-24 bg-foreground text-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
              Evaluation Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Precision", desc: "How often predicted top startups actually rank among the batch's top performers." },
                { name: "Recall", desc: "How many of the true top-performing startups are captured within the predictions." },
              ].map((metric, i) => (
                <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">{metric.name}</h3>
                  <p className="text-zinc-400 text-sm">{metric.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Why YC Data & 9. Protocol */}
        <section id="protocol" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why YC Data Works</h2>
              <p className="text-lg text-muted-foreground mb-8">
                This structure enables low-noise relative benchmarking that is impossible in the general startup ecosystem.
              </p>
              <ul className="space-y-4">
                {[
                  "Batch-based cohorts",
                  "Shared time zero",
                  "Comparable funding environments",
                  "Large synchronized startup groups"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                    <span className="text-lg font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-secondary/50 p-8 rounded-2xl border border-border">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Search className="w-6 h-6 text-primary" /> Benchmark Protocol
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex gap-3"><span className="font-mono text-primary font-bold">01</span><span>Predictions are frozen at evaluation time</span></li>
                <li className="flex gap-3"><span className="font-mono text-primary font-bold">02</span><span>Velocity is measured over the next 90 days</span></li>
                <li className="flex gap-3"><span className="font-mono text-primary font-bold">03</span><span>Startups are ranked relative to their YC batch peers</span></li>
                <li className="flex gap-3"><span className="font-mono text-primary font-bold">04</span><span>Model performance is computed using standardized velocity metrics</span></li>
                <li className="flex gap-3"><span className="font-mono text-primary font-bold">05</span><span>Leaderboards update every evaluation cycle</span></li>
              </ul>
              <div className="mt-8 p-4 bg-white rounded-lg text-sm font-medium border border-border text-foreground">
                This ensures fair, transparent, and reproducible evaluation.
              </div>
            </div>
          </div>
        </section>

        {/* 11. Use Cases */}
        <section className="py-24 bg-secondary/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Who is this for?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <TrendingUp className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Investors</CardTitle>
                  <CardDescription>Identify and access hot deals before Demo Day.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border">
                <CardHeader>
                  <Rocket className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Founders</CardTitle>
                  <CardDescription>Benchmark company velocity relative to batch peers.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border">
                <CardHeader>
                  <Search className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Researchers</CardTitle>
                  <CardDescription>Study predictive signals in startup ecosystems.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* 12. Roadmap */}
        <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">YC Bench Roadmap</h2>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {[
              { phase: "Phase 1", title: "Baseline Validation", active: false },
              { phase: "Phase 2", title: "Open Model Submissions", active: true },
              { phase: "Phase 3", title: "Live Performance Leaderboard", active: false },
              { phase: "Phase 4", title: "AI-Native YC-Only Funds", active: false },
            ].map((step, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${step.active ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
                  {step.active ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-border bg-white shadow-sm">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-foreground">{step.phase}</div>
                    {step.active && <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Current</span>}
                  </div>
                  <div className="text-muted-foreground">{step.title}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Get Involved */}
        <section className="py-24 bg-secondary/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Involved</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                YC Bench is open. Join the community and help build the benchmark.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                {
                  title: "Submit Predictions",
                  desc: "Run your model on the current YC cohort and submit predictions to the leaderboard.",
                  icon: <Target className="w-6 h-6 text-primary" />,
                },
                {
                  title: "Improve Evaluation Metrics",
                  desc: "Propose better metrics, scoring rules or calibration methods.",
                  icon: <BarChart3 className="w-6 h-6 text-primary" />,
                },
                {
                  title: "Build Datasets",
                  desc: "Help curate, clean, and expand startup signal datasets across YC batches.",
                  icon: <Activity className="w-6 h-6 text-primary" />,
                },
                {
                  title: "Build Visualization Tools",
                  desc: "Create dashboards and charts that make benchmark results easier to explore.",
                  icon: <TrendingUp className="w-6 h-6 text-primary" />,
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent border border-primary/10 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
<div className="flex flex-col sm:flex-row gap-4 justify-center">
  <a href={FORM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold text-base transition-colors shadow-sm">
    <Rocket className="w-5 h-5" />
    Submit your Model
  </a>
  <a href="https://github.com/benstaf/ycbench" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-8 py-4 text-white rounded-lg font-semibold text-base transition-colors shadow-sm hover:opacity-90" style={{ background: "#FF8C3A" }}>
    <GithubIcon className="w-5 h-5" />
    Contribute on GitHub
  </a>
  <a href="https://discord.gg/ekrySuRBf4" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-8 py-4 text-white rounded-lg font-semibold text-base transition-colors shadow-sm hover:opacity-90" style={{ background: "#FF8C3A" }}>
    <DiscordIcon className="w-5 h-5" />
    Join Discord Community
  </a>
</div>
          </div>
        </section>

        {/* Recent Blog Posts */}
        {recentPosts && recentPosts.length > 0 && (
          <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-border">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">From the Blog</h2>
                <p className="text-muted-foreground">Insights on startup velocity, YC benchmarking, and signal-driven evaluation.</p>
              </div>
              <Link href="/blog" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline shrink-0">
                All posts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.slice(0, 3).map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <article className="group bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col cursor-pointer">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime} min
                      </span>
                    </div>
                    <h3 className="font-semibold text-base leading-snug mb-2 group-hover:text-primary transition-colors flex-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                      {post.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </article>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                View all posts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Contact Us Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-8">Contact Us</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4 text-muted-foreground text-lg">
                  <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-foreground mb-1">Email</div>
                    <a href="mailto:info@ycbench.com" className="hover:text-primary transition-colors">info@ycbench.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-muted-foreground text-lg">
                  <Target className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-foreground mb-1">Address</div>
                    <address className="not-italic">
                      YC Bench<br />
                      548 Market St PMB 41382<br />
                      San Francisco, CA 94104<br />
                      USA
                    </address>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-border shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0336215160846!2d-122.4018898!3d37.7891283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808b8b30531f%3A0x6a0f4435987a049d!2s548%20Market%20St%20%2341382%2C%20San%20Francisco%2C%20CA%2094104!5e0!3m2!1sen!2sus!4v1709999999999!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-[#FF6600] text-white font-bold text-[20px] rounded flex items-center justify-center w-8 h-8 select-none pb-0.5" style={{ fontFamily: '"Arimo", sans-serif', letterSpacing: '-0.05em' }}>
              YC
            </div>
            <span className="font-semibold text-lg tracking-tight">Bench</span>
          </div>
          <p className="text-sm text-muted-foreground">
            A live benchmark for evaluating predictive models of YC outperformance.
          </p>
        </div>
      </footer>
    </div>
  );
}
