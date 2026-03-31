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
  BarChart3,
  Search,
  Rocket,
  Mail,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BuiltOnYCBadge } from "@/components/BuiltOnYCBadge";
import {
  Card,
  CardContent,
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

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

// Momentum chart data
const momentumData = [
  { day: "0", pOutperformer: 100, baseline: 100 },
  { day: "30", pOutperformer: 120, baseline: 102 },
  { day: "60", pOutperformer: 145, baseline: 105 },
  { day: "90", pOutperformer: 180, baseline: 108 },
];

// ✅ YOUR DATA
const startupData = [
  { name: "Pocket", velocity: 162000000 },
  { name: "Mango Medical", velocity: 2000000 },
  { name: "Didit", velocity: 1000000 },
  { name: "Corvera", velocity: 300000 },
  { name: "Samora AI", velocity: 250000 },
  { name: "Avoice", velocity: 240000 },
  { name: "21st", velocity: 150000 },
  { name: "OctaPulse", velocity: 50000 },
  { name: "Luel", velocity: 28500 },
  { name: "Pax Historia", velocity: 14000 },
  { name: "OpenSpec", velocity: 3000 },
];

const topStartups = [...startupData]
  .sort((a, b) => b.velocity - a.velocity)
  .slice(0, 5);

function formatVelocity(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
}

export default function Home() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: recentPosts } = useQuery<PostMeta[]>({
    queryKey: ["/api/posts"],
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
    <div className="min-h-screen bg-background">
      {/* NAV */}
      <nav className={`fixed top-0 w-full z-50 transition-all border-b ${
        isScrolled ? "bg-white/80 backdrop-blur-md" : "bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#FF6600] text-white font-bold w-10 h-10 flex items-center justify-center rounded">
              YC
            </div>
            <span className="font-semibold">Bench</span>
          </div>
        </div>
      </nav>

      <main className="pt-24">

        {/* HERO */}
        <section className="text-center max-w-4xl mx-auto px-6 py-20">
          <BuiltOnYCBadge />
          <h1 className="text-5xl font-bold mt-6 mb-4">
            Predict the Next YC Outperformers
          </h1>
          <p className="text-muted-foreground mb-8">
            A live benchmark evaluating startup velocity.
          </p>

          <form onSubmit={handleJoin} className="flex gap-3 justify-center">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit">Join</Button>
          </form>
        </section>

        {/* LEADERBOARD */}
        <section className="py-20 bg-secondary/30">
          <div className="max-w-4xl mx-auto px-6">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead className="text-right">Precision</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>VelocityNet</TableCell>
                    <TableCell className="text-right">0.62</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </div>
        </section>

        {/* 🚀 RADAR (UPDATED) */}
        <section className="py-20 max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Top Predicted Outperformers
          </h2>

          <Card className="p-6">
            <div className="space-y-4">
              {topStartups.map((company, i) => (
                <div key={i} className="flex justify-between">
                  <div className="flex gap-3">
                    <span>{i + 1}</span>
                    <span>{company.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {formatVelocity(company.velocity)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* CHART */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto h-[300px]">
            <ResponsiveContainer>
              <LineChart data={momentumData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <RechartsTooltip />
                <Line dataKey="pOutperformer" stroke="#FF6600" />
                <Line dataKey="baseline" stroke="#999" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

      </main>
    </div>
  );
}
