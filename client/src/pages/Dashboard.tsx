import { Sidebar } from "@/components/Sidebar";
import { StatsCard } from "@/components/StatsCard";
import { useConversations } from "@/hooks/use-conversations";
import { useAppointments } from "@/hooks/use-appointments";
import { MessageSquare, CalendarCheck, Users, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { data: conversations } = useConversations();
  const { data: appointments } = useAppointments();

  const totalConversations = conversations?.length || 0;
  const totalAppointments = appointments?.length || 0;
  
  // Mock data for analytics chart
  const data = [
    { name: 'Mon', calls: 40, appointments: 24 },
    { name: 'Tue', calls: 30, appointments: 13 },
    { name: 'Wed', calls: 20, appointments: 58 },
    { name: 'Thu', calls: 27, appointments: 39 },
    { name: 'Fri', calls: 18, appointments: 48 },
    { name: 'Sat', calls: 23, appointments: 38 },
    { name: 'Sun', calls: 34, appointments: 43 },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Overview of your AI receptionist's performance.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-sm font-medium text-muted-foreground">System Operational</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Conversations" 
              value={totalConversations} 
              change="+12%" 
              trend="up" 
              icon={MessageSquare} 
              color="text-blue-600"
            />
            <StatsCard 
              title="Appointments Booked" 
              value={totalAppointments} 
              change="+5%" 
              trend="up" 
              icon={CalendarCheck} 
              color="text-green-600"
            />
            <StatsCard 
              title="Active Users" 
              value="1,234" 
              change="+2%" 
              trend="up" 
              icon={Users} 
              color="text-purple-600"
            />
            <StatsCard 
              title="Conversion Rate" 
              value="24%" 
              change="-1%" 
              trend="down" 
              icon={TrendingUp} 
              color="text-orange-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-bold font-display mb-6">Weekly Activity</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: '#F1F5F9'}} 
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    />
                    <Bar dataKey="calls" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={32} />
                    <Bar dataKey="appointments" fill="#10B981" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-bold font-display mb-4">Recent Appointments</h3>
              <div className="space-y-4">
                {appointments?.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {apt.customerName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{apt.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(apt.startTime).toLocaleDateString()} • {new Date(apt.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      apt.status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                      apt.status === 'completed' ? 'bg-green-50 text-green-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
                {(!appointments || appointments.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No upcoming appointments
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
