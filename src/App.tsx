import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  BellRing,
  DollarSign,
  Target,
  ArrowUpRight,
  Phone,
  MessageCircle,
  Copy,
  Trash2,
  Edit2,
  LogOut,
  User as UserIcon,
  Mail,
  Lock,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, isToday, isAfter, parseISO } from 'date-fns';
import { cn, Lead, Commission, Template, Stats, User } from './types';

import { Language, Theme, translations } from './translations';

// --- Components ---

const Card = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={cn("bg-white dark:bg-slate-800 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden transition-colors", className)} {...props}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) => {
  const variants = {
    default: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
    success: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    danger: "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
    info: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider", variants[variant])}>
      {children}
    </span>
  );
};

// --- Auth Components ---

const LoginPage = ({ onLogin, onSwitch, t }: { onLogin: (user: User) => void; onSwitch: () => void; t: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        onLogin(await res.json());
      } else {
        setError(t.errorLogin);
      }
    } catch (err) {
      setError(t.errorConnection);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg">I</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.welcomeBack}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{t.loginSubtitle}</p>
        </div>
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-sm rounded-xl border border-rose-100 dark:border-rose-900/50">{error}</div>}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" placeholder={t.emailPlaceholder} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.password}</label>
                <button 
                  type="button" 
                  onClick={() => setShowForgotPassword(!showForgotPassword)}
                  className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {t.forgotPassword}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" placeholder={t.passwordPlaceholder} />
              </div>
            </div>

            <AnimatePresence>
              {showForgotPassword && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-xl border border-amber-100 dark:border-amber-900/50 flex items-start gap-2">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <p>{t.forgotPasswordMessage.replace('{email}', 'support@insuretrack.id')}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md">{t.loginNow}</button>
          </form>
          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {t.noAccount} <button onClick={onSwitch} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">{t.registerFree}</button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

const RegisterPage = ({ onRegister, onSwitch, t }: { onRegister: (user: User) => void; onSwitch: () => void; t: any }) => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', company: '' });
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const user = await res.json();
        setIsSuccess(true);
        setTimeout(() => onRegister(user), 3000);
      } else {
        setError(t.errorRegister);
      }
    } catch (err) {
      setError(t.errorConnection);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md text-center">
          <Card className="p-8">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.successRegister}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{t.welcomeMessage.replace('{name}', formData.name).replace('{email}', formData.email)}</p>
            <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">
              <Clock size={18} /> {t.redirecting}
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg">I</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.register} InsureTrack</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{t.registerSubtitle}</p>
        </div>
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-sm rounded-xl border border-rose-100 dark:border-rose-900/50">{error}</div>}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.name}</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" placeholder={t.namePlaceholder} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" placeholder={t.emailPlaceholder} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.company}</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" placeholder={t.companyPlaceholder} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" placeholder={t.passwordHint} />
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md mt-4">{t.registerFree}</button>
          </form>
          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {t.haveAccount} <button onClick={onSwitch} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">{t.login}</button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('insuretrack_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('insuretrack_lang') as Language) || 'id';
  });
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('insuretrack_theme') as Theme) || 'light';
  });
  const t = translations[language];

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('insuretrack_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('insuretrack_lang', language);
  }, [language]);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'commissions' | 'templates' | 'profile'>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [reminders, setReminders] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [leadsRes, commsRes, tempsRes, statsRes, remindersRes] = await Promise.all([
        fetch(`/api/leads?userId=${user.id}`),
        fetch(`/api/commissions?userId=${user.id}`),
        fetch('/api/templates'),
        fetch(`/api/stats?userId=${user.id}`),
        fetch(`/api/reminders?userId=${user.id}`)
      ]);

      const checkResponse = async (res: Response) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API Error (${res.status}): ${text.slice(0, 100)}`);
        }
        return res.json();
      };

      const [leadsData, commsData, tempsData, statsData, remindersData] = await Promise.all([
        checkResponse(leadsRes),
        checkResponse(commsRes),
        checkResponse(tempsRes),
        checkResponse(statsRes),
        checkResponse(remindersRes)
      ]);

      setLeads(leadsData);
      setCommissions(commsData);
      setTemplates(tempsData);
      setStats(statsData);
      setReminders(remindersData);

      // Check if we should send email reminder (once per day)
      const lastReminderDate = localStorage.getItem(`last_reminder_${user.id}`);
      const today = new Date().toISOString().slice(0, 10);
      if (remindersData.length > 0 && lastReminderDate !== today) {
        await fetch('/api/reminders/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
        localStorage.setItem(`last_reminder_${user.id}`, today);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('insuretrack_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('insuretrack_user');
    setActiveTab('dashboard');
  };

  const handleAddLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const data = { ...Object.fromEntries(formData.entries()), userId: user.id };
    
    const url = editingLead ? `/api/leads/${editingLead.id}` : '/api/leads';
    const method = editingLead ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    setIsLeadModalOpen(false);
    setEditingLead(null);
    fetchData();
  };

  const handleDeleteLead = async (id: number) => {
    if (confirm(t.confirmDeleteLead)) {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleAddCommission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const data = { ...Object.fromEntries(formData.entries()), userId: user.id };
    
    await fetch('/api/commissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    setIsCommissionModalOpen(false);
    fetchData();
  };

  const handleSetTarget = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const data = { ...Object.fromEntries(formData.entries()), userId: user.id };
    
    await fetch('/api/targets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    setIsTargetModalOpen(false);
    fetchData();
  };

  const handleAddTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    setIsTemplateModalOpen(false);
    fetchData();
  };

  const handleDeleteTemplate = async (id: number) => {
    if (confirm(language === 'id' ? "Hapus template ini?" : "Delete this template?")) {
      await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  if (!user) {
    return authMode === 'login' ? (
      <LoginPage onLogin={handleLogin} onSwitch={() => setAuthMode('register')} t={t} />
    ) : (
      <RegisterPage onRegister={handleLogin} onSwitch={() => setAuthMode('login')} t={t} />
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New': return <Badge variant="info">{t.new}</Badge>;
      case 'Follow Up': return <Badge variant="warning">{t.followUp}</Badge>;
      case 'Meeting': return <Badge variant="info">{t.meeting}</Badge>;
      case 'Closing': return <Badge variant="success">{t.closing}</Badge>;
      case 'Closed': return <Badge variant="default">{t.closed}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Cold': return <Badge variant="default">{t.cold}</Badge>;
      case 'Warm': return <Badge variant="warning">{t.warm}</Badge>;
      case 'Hot': return <Badge variant="danger">{t.hot}</Badge>;
      default: return <Badge>{cat}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const upcomingFollowUps = leads.filter(l => l.follow_up_date && (isToday(parseISO(l.follow_up_date)) || isAfter(parseISO(l.follow_up_date), new Date()))).sort((a, b) => a.follow_up_date.localeCompare(b.follow_up_date));

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-900 text-slate-900 dark:text-white font-sans transition-colors">
      {/* Sidebar / Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-black/5 dark:border-white/5 px-6 py-3 flex justify-around items-center z-50 md:top-0 md:bottom-auto md:flex-col md:w-20 md:h-full md:border-t-0 md:border-r transition-colors">
        <div className="hidden md:flex items-center justify-center mb-8 mt-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">I</div>
        </div>
        <button onClick={() => setActiveTab('dashboard')} className={cn("p-2 rounded-xl transition-colors", activeTab === 'dashboard' ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300")}>
          <TrendingUp size={24} />
        </button>
        <button onClick={() => setActiveTab('leads')} className={cn("p-2 rounded-xl transition-colors", activeTab === 'leads' ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300")}>
          <Users size={24} />
        </button>
        <button onClick={() => setActiveTab('commissions')} className={cn("p-2 rounded-xl transition-colors", activeTab === 'commissions' ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300")}>
          <DollarSign size={24} />
        </button>
        <button onClick={() => setActiveTab('templates')} className={cn("p-2 rounded-xl transition-colors", activeTab === 'templates' ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300")}>
          <MessageSquare size={24} />
        </button>
        <button onClick={() => setActiveTab('profile')} className={cn("p-2 rounded-xl transition-colors", activeTab === 'profile' ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300")}>
          <UserIcon size={24} />
        </button>
      </nav>

      {/* Main Content */}
      <main className="pb-24 pt-6 px-4 md:pl-28 md:pr-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight dark:text-white">
              {activeTab === 'dashboard' && t.dashboard}
              {activeTab === 'leads' && t.leads}
              {activeTab === 'commissions' && t.commissions}
              {activeTab === 'templates' && t.templates}
              {activeTab === 'profile' && t.settings}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {activeTab === 'dashboard' && t.dashboardSubtitle}
              {activeTab === 'leads' && t.leadsSubtitle}
              {activeTab === 'commissions' && t.commissionsSubtitle}
              {activeTab === 'templates' && t.templatesSubtitle}
              {activeTab === 'profile' && t.settingsSubtitle}
            </p>
          </div>
          <div className="flex gap-2">
            {activeTab === 'leads' && (
              <button 
                onClick={() => { setEditingLead(null); setIsLeadModalOpen(true); }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Plus size={18} /> {t.newLead}
              </button>
            )}
            {activeTab === 'commissions' && (
              <button 
                onClick={() => setIsCommissionModalOpen(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Plus size={18} /> {t.recordClosing}
              </button>
            )}
            {activeTab === 'templates' && (
              <button 
                onClick={() => setIsTemplateModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Plus size={18} /> {t.addTemplate}
              </button>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {reminders.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <BellRing size={24} className="animate-bounce" />
                      </div>
                      <h2 className="text-xl font-bold">{t.followUpToday}</h2>
                    </div>
                    <p className="text-indigo-100 mb-6 max-w-md">{t.followUpSubtitle.replace('{count}', reminders.length.toString())}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {reminders.map(lead => (
                        <div key={lead.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex justify-between items-center group hover:bg-white/20 transition-colors">
                          <div>
                            <p className="font-bold text-sm">{lead.name}</p>
                            <p className="text-xs text-indigo-200">{lead.phone || (language === 'id' ? 'Tidak ada nomor' : 'No phone')}</p>
                          </div>
                          <a 
                            href={`https://wa.me/${lead.phone}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 bg-emerald-500 text-white rounded-lg hover:scale-110 transition-transform shadow-md"
                          >
                            <MessageCircle size={16} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                </motion.div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                      <DollarSign size={20} />
                    </div>
                    <Badge variant="success">{t.thisMonth}</Badge>
                  </div>
                  <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{t.totalCommission}</h3>
                  <p className="text-2xl font-bold dark:text-white">{formatCurrency(stats?.monthlyCommission || 0)}</p>
                </Card>

                <Card className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                      <Target size={20} />
                    </div>
                    <button onClick={() => setIsTargetModalOpen(true)} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">{t.changeTarget}</button>
                  </div>
                  <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{t.monthlyTarget}</h3>
                  <p className="text-2xl font-bold dark:text-white">{formatCurrency(stats?.monthlyTarget || 0)}</p>
                  <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${Math.min(((stats?.monthlyCommission || 0) / (stats?.monthlyTarget || 1)) * 100, 100)}%` }}
                    />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                      <Calendar size={20} />
                    </div>
                  </div>
                  <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{t.followUpToday}</h3>
                  <p className="text-2xl font-bold dark:text-white">{upcomingFollowUps.filter(l => isToday(parseISO(l.follow_up_date))).length}</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
                {/* Follow Up List */}
                <Card>
                  <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-sm dark:text-white">{t.followUpAgenda}</h3>
                    <button onClick={() => setActiveTab('leads')} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{t.viewAll}</button>
                  </div>
                  <div className="divide-y divide-black/5 dark:divide-white/5 max-h-[400px] overflow-y-auto">
                    {upcomingFollowUps.length > 0 ? upcomingFollowUps.map(lead => (
                      <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm dark:text-white">{lead.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock size={10} /> {format(parseISO(lead.follow_up_date), 'dd MMM yyyy')}
                              </span>
                              {getCategoryBadge(lead.category)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a href={`https://wa.me/${lead.phone}`} target="_blank" rel="noreferrer" className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors">
                            <MessageCircle size={18} />
                          </a>
                        </div>
                      </div>
                    )) : (
                      <div className="p-8 text-center text-slate-400 text-sm">{t.noAgenda}</div>
                    )}
                  </div>
                </Card>

                {/* Lead Status Chart */}
                <Card className="p-6 min-w-0">
                  <h3 className="font-bold text-sm mb-6 dark:text-white">{t.leadStatusDistribution}</h3>
                  <div className="w-full relative min-w-0">
                    <ResponsiveContainer width="100%" height={300} minWidth={0}>
                      <PieChart>
                        <Pie
                          data={stats?.leadStats || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                          nameKey="status"
                        >
                          {(stats?.leadStats || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#94a3b8'][index % 5]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', borderColor: theme === 'dark' ? '#334155' : '#e2e8f0', color: theme === 'dark' ? '#fff' : '#000' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {(stats?.leadStats || []).map((entry, index) => (
                      <div key={entry.status} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#94a3b8'][index % 5] }} />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{entry.status} ({entry.count})</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'leads' && (
            <motion.div 
              key="leads"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder={t.searchLeads}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-black/5 dark:border-white/5 rounded-xl text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors dark:text-white">
                    <Filter size={18} /> {t.filterStatus}
                  </button>
                </div>
              </div>

              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-black/5 dark:border-white/5">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{language === 'id' ? 'Nama & Info' : 'Name & Info'}</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.category}</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.status}</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.followUp}</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">{language === 'id' ? 'Aksi' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      {leads.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-xs">
                                {lead.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-sm dark:text-white">{lead.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{lead.phone || '-'} • {lead.age || '-'} {language === 'id' ? 'thn' : 'yo'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">{getCategoryBadge(lead.category)}</td>
                          <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <Calendar size={14} />
                              {lead.follow_up_date ? format(parseISO(lead.follow_up_date), 'dd MMM yyyy') : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => { setEditingLead(lead); setIsLeadModalOpen(true); }}
                                className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                              <a href={`https://wa.me/${lead.phone}`} target="_blank" rel="noreferrer" className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors">
                                <MessageCircle size={16} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'commissions' && (
            <motion.div 
              key="commissions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{t.totalCommission} ({language === 'id' ? 'Semua Waktu' : 'All Time'})</h3>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(commissions.reduce((sum, c) => sum + c.commission_amount, 0))}
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{language === 'id' ? 'Rata-rata Komisi / Closing' : 'Average Commission / Closing'}</h3>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(commissions.length > 0 ? commissions.reduce((sum, c) => sum + c.commission_amount, 0) / commissions.length : 0)}
                  </p>
                </Card>
              </div>

              <Card>
                <div className="p-4 border-b border-black/5 dark:border-white/5">
                  <h3 className="font-bold text-sm dark:text-white">{t.closingHistory}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-black/5 dark:border-white/5">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.date}</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.lead}</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.premium}</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rate</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">{t.commission}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      {commissions.map(comm => (
                        <tr key={comm.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{format(parseISO(comm.date), 'dd MMM yyyy')}</td>
                          <td className="px-6 py-4 font-semibold text-sm dark:text-white">{comm.lead_name || (language === 'id' ? 'Umum' : 'General')}</td>
                          <td className="px-6 py-4 text-sm dark:text-slate-300">{formatCurrency(comm.premium)}</td>
                          <td className="px-6 py-4 text-sm dark:text-slate-300">{comm.commission_rate}%</td>
                          <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400 text-sm">{formatCurrency(comm.commission_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'templates' && (
            <motion.div 
              key="templates"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {templates.map(template => (
                <Card key={template.id} className="flex flex-col h-full">
                  <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm dark:text-white">{template.title}</h3>
                      <Badge variant="info">{template.category}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(template.content);
                          alert(language === 'id' ? "Template disalin!" : "Template copied!");
                        }}
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                      >
                        <Copy size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                      "{template.content}"
                    </p>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <Card className="p-8 text-center">
                <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {user.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold dark:text-white">{user.name}</h2>
                <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                <div className="mt-4 inline-block px-4 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-semibold">
                  {user.company || (language === 'id' ? 'Agen Independen' : 'Independent Agent')}
                </div>
              </Card>

              <div className="grid grid-cols-1 gap-4">
                <Card className="p-6">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-indigo-600" /> {t.theme}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setTheme('light')}
                      className={cn("p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all", theme === 'light' ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-slate-50 dark:bg-slate-700 border-black/5 dark:border-white/5 text-slate-600 dark:text-slate-300")}
                    >
                      <Clock size={16} /> {t.light}
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={cn("p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all", theme === 'dark' ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-slate-50 dark:bg-slate-700 border-black/5 dark:border-white/5 text-slate-600 dark:text-slate-300")}
                    >
                      <AlertCircle size={16} /> {t.dark}
                    </button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <MessageSquare size={18} className="text-indigo-600" /> {t.language}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setLanguage('id')}
                      className={cn("p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all", language === 'id' ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-slate-50 dark:bg-slate-700 border-black/5 dark:border-white/5 text-slate-600 dark:text-slate-300")}
                    >
                      🇮🇩 {t.indonesian}
                    </button>
                    <button 
                      onClick={() => setLanguage('en')}
                      className={cn("p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all", language === 'en' ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-slate-50 dark:bg-slate-700 border-black/5 dark:border-white/5 text-slate-600 dark:text-slate-300")}
                    >
                      🇺🇸 {t.english}
                    </button>
                  </div>
                </Card>

                <Card className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white">{t.email}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl">
                      <Building size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white">{t.company}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{user.company || '-'}</p>
                    </div>
                  </div>
                </Card>

                <button 
                  onClick={handleLogout}
                  className="w-full p-4 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
                >
                  <LogOut size={20} /> {t.logout}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isLeadModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transition-colors"
            >
              <div className="p-6 border-b border-black/5 dark:border-white/5">
                <h3 className="text-lg font-bold dark:text-white">{editingLead ? (language === 'id' ? 'Edit Prospek' : 'Edit Lead') : t.newLead}</h3>
              </div>
              <form onSubmit={handleAddLead} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.name}</label>
                    <input name="name" defaultValue={editingLead?.name} required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{language === 'id' ? 'Umur' : 'Age'}</label>
                    <input name="age" type="number" defaultValue={editingLead?.age} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{language === 'id' ? 'Nomor WhatsApp' : 'WhatsApp Number'}</label>
                  <input name="phone" placeholder="62812..." defaultValue={editingLead?.phone} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.category}</label>
                    <select name="category" defaultValue={editingLead?.category || 'Cold'} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white">
                      <option value="Cold">Cold</option>
                      <option value="Warm">Warm</option>
                      <option value="Hot">Hot</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.status}</label>
                    <select name="status" defaultValue={editingLead?.status || 'New'} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white">
                      <option value="New">{t.new}</option>
                      <option value="Follow Up">{t.followUp}</option>
                      <option value="Meeting">{t.meeting}</option>
                      <option value="Closing">{t.closing}</option>
                      <option value="Closed">{t.closed}</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.followUpDate}</label>
                  <input name="follow_up_date" type="date" defaultValue={editingLead?.follow_up_date} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{language === 'id' ? 'Catatan' : 'Notes'}</label>
                  <textarea name="notes" defaultValue={editingLead?.notes} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 h-20 resize-none dark:text-white" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsLeadModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">{t.cancel}</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">{t.save}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isCommissionModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transition-colors"
            >
              <div className="p-6 border-b border-black/5 dark:border-white/5">
                <h3 className="text-lg font-bold dark:text-white">{t.recordClosing}</h3>
              </div>
              <form onSubmit={handleAddCommission} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{language === 'id' ? 'Pilih Nasabah' : 'Select Lead'}</label>
                  <select name="lead_id" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white">
                    <option value="">-- {language === 'id' ? 'Pilih Prospek' : 'Select Lead'} --</option>
                    {leads.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.premium}</label>
                    <input name="premium" type="number" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rate Komisi (%)</label>
                    <input name="commission_rate" type="number" defaultValue="20" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{language === 'id' ? 'Tanggal Closing' : 'Closing Date'}</label>
                  <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsCommissionModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">{t.cancel}</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">{t.save}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isTargetModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transition-colors"
            >
              <div className="p-6 border-b border-black/5 dark:border-white/5">
                <h3 className="text-lg font-bold dark:text-white">{t.changeTarget}</h3>
              </div>
              <form onSubmit={handleSetTarget} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{language === 'id' ? 'Bulan' : 'Month'}</label>
                  <input name="month" type="month" defaultValue={new Date().toISOString().slice(0, 7)} required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.monthlyTarget} (IDR)</label>
                  <input name="target_amount" type="number" defaultValue={stats?.monthlyTarget} required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsTargetModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">{t.cancel}</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">{t.save}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isTemplateModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transition-colors"
            >
              <div className="p-6 border-b border-black/5 dark:border-white/5">
                <h3 className="text-lg font-bold dark:text-white">{t.addTemplate}</h3>
              </div>
              <form onSubmit={handleAddTemplate} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{language === 'id' ? 'Judul Template' : 'Template Title'}</label>
                  <input name="title" placeholder="Contoh: Follow Up 1" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.category}</label>
                  <select name="category" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white">
                    <option value="Follow Up">{t.followUp}</option>
                    <option value="Objection">{language === 'id' ? 'Keberatan' : 'Objection'}</option>
                    <option value="Appointment">{language === 'id' ? 'Janji Temu' : 'Appointment'}</option>
                    <option value="Closing">{t.closing}</option>
                    <option value="Other">{language === 'id' ? 'Lainnya' : 'Other'}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{language === 'id' ? 'Isi Pesan' : 'Message Content'}</label>
                  <textarea name="content" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-black/5 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 h-32 resize-none dark:text-white" placeholder="Tulis script chat Anda di sini..." />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsTemplateModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">{t.cancel}</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">{t.save}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
