import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, 
  Mail, 
  MessageSquare, 
  Reply, 
  Users, 
  ArrowUpRight,
  Target,
  Rocket
} from 'lucide-react';
import { motion } from 'motion/react';
import { leadService } from '../services/leadService';
import { outreachService } from '../services/outreachService';

const data = [
  { name: 'Mon', emails: 45, whatsapp: 32 },
  { name: 'Tue', emails: 52, whatsapp: 38 },
  { name: 'Wed', emails: 38, whatsapp: 42 },
  { name: 'Thu', emails: 65, whatsapp: 50 },
  { name: 'Fri', emails: 48, whatsapp: 35 },
  { name: 'Sat', emails: 20, whatsapp: 15 },
  { name: 'Sun', emails: 15, whatsapp: 10 },
];

const miniChartData = [
  { value: 40 }, { value: 60 }, { value: 45 }, { value: 70 }, { value: 55 }, { value: 80 }
];

const pipelineData = [
  { name: 'New', value: 45, color: '#f27d26' },
  { name: 'Contacted', value: 30, color: '#f27d26bb' },
  { name: 'Replied', value: 15, color: '#f27d2688' },
  { name: 'Converted', value: 10, color: '#f27d2644' },
];

const StatCard = ({ title, value, icon: Icon, trend, data: miniData }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
        <Icon size={20} className="text-[var(--color-brand-primary)]" />
      </div>
      <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full uppercase tracking-wider">
        <TrendingUp size={12} />
        {trend}
      </div>
    </div>
    
    <div>
      <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1">{title}</p>
      <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
    </div>

    <div className="absolute right-0 bottom-0 w-24 h-16 opacity-30">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={miniData}>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-brand-primary)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-brand-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="var(--color-brand-primary)" 
            fillOpacity={1} 
            fill="url(#gradient)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [stats, setStats] = React.useState({
    totalLeads: 0,
    emailsSent: 0,
    whatsappSent: 0,
    repliesReceived: 0,
    recentActivity: [] as any[]
  });

  React.useEffect(() => {
    const unsubLeads = leadService.subscribeToLeads((leads) => {
      setStats(prev => ({ ...prev, totalLeads: leads.length }));
    });

    const unsubLogs = outreachService.subscribeToLogs((logs) => {
      const emails = logs.filter(l => l.type === 'email').length;
      const wa = logs.filter(l => l.type === 'whatsapp').length;
      setStats(prev => ({ 
        ...prev, 
        emailsSent: emails, 
        whatsappSent: wa,
        recentActivity: logs.slice(0, 5)
      }));
    });

    return () => {
      unsubLeads();
      unsubLogs();
    };
  }, []);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif italic font-black"
          >
            Growth <span className="text-[var(--color-brand-primary)] not-italic">Dashboard</span>
          </motion.h2>
          <p className="text-white/40 mt-2 font-mono text-xs uppercase tracking-widest">REAL-TIME OUTREACH ANALYTICS SYSTEM v2.0</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
            EXPORT DATA
          </button>
          <button className="px-5 py-2.5 bg-[var(--color-brand-primary)] text-black rounded-xl text-xs font-bold hover:scale-105 transition-all flex items-center gap-2">
            <Rocket size={16} />
            NEW CAMPAIGN
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="TOTAL LEADS" value={stats.totalLeads.toLocaleString()} icon={Users} trend="+0%" data={miniChartData} />
        <StatCard title="EMAILS SENT" value={stats.emailsSent.toLocaleString()} icon={Mail} trend="+0%" data={[...miniChartData].reverse()} />
        <StatCard title="WA MESSAGES" value={stats.whatsappSent.toLocaleString()} icon={MessageSquare} trend="+0%" data={miniChartData} />
        <StatCard title="REPLIES" value={stats.repliesReceived.toLocaleString()} icon={Reply} trend="+0%" data={miniChartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-[var(--color-brand-primary)]/10 flex items-center justify-center border border-[var(--color-brand-primary)]/20">
                 <Target size={20} className="text-[var(--color-brand-primary)]" />
               </div>
               <div>
                  <h4 className="text-lg font-bold">Outreach Performance</h4>
                  <p className="text-white/40 text-xs font-mono uppercase">WEEKLY AGGREGATE DATA</p>
               </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: 12, fontWeight: 700 }}
                />
                <Bar dataKey="emails" fill="var(--color-brand-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="whatsapp" fill="rgba(255,255,255,0.2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8"
          >
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Lead Pipeline</h4>
            <div className="space-y-6">
              {pipelineData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-end text-xs">
                    <span className="font-bold uppercase tracking-tight">{item.name}</span>
                    <span className="text-white/40 font-mono italic">{item.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 rounded-3xl p-8 group overflow-hidden relative"
          >
            <div className="relative z-10">
              <h4 className="text-2xl font-serif italic text-[var(--color-brand-primary)] mb-2">Automate Everything</h4>
              <p className="text-sm text-white/60 mb-6 leading-relaxed">Let AI find, contact, and follow-up while you focus on code.</p>
              <button className="w-full bg-[var(--color-brand-primary)] text-black font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(242,125,38,0.4)] transition-all flex items-center justify-center gap-2">
                UPGRADE TO ELITE
                <ArrowUpRight size={18} />
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[var(--color-brand-primary)] opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold">Recent Outreach Activity</h4>
            <p className="text-xs text-white/40 font-mono mt-1 uppercase">LIVE FEED FROM MULTI-CHANNEL QUEUE</p>
          </div>
          <button className="text-[var(--color-brand-primary)] text-xs font-bold hover:underline">VIEW ALL QUEUE</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 font-mono">
                <th className="px-8 py-4">Company</th>
                <th className="px-8 py-4">Channel</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-white/20 italic text-xs">No recent activity detected. Start outreach to see logs.</td>
                </tr>
              ) : stats.recentActivity.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white/20">
                         {row.company ? row.company[0] : '?'}
                       </div>
                       <span className="text-sm font-bold">{row.company}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       {row.type === 'email' ? <Mail size={14}/> : <MessageSquare size={14}/>}
                       <span className="text-[11px] font-mono tracking-tighter uppercase">{row.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-mono text-white/30">{new Date(row.timestamp).toLocaleTimeString()}</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-white/5 border border-white/5 text-green-400`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
