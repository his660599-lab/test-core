import { Sidebar } from "@/components/Sidebar";
import { useAppointments } from "@/hooks/use-appointments";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function CalendarPage() {
  const { data: appointments } = useAppointments();

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date();
  
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Calendar</h1>
              <p className="text-muted-foreground mt-1">Manage your schedule and appointments.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white rounded-lg border border-border p-1 shadow-sm">
                <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 font-medium text-sm">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <button className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Appointment
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 border-b border-border bg-muted/20">
              {days.map(day => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid - Static Mock for Visuals */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5 divide-x divide-y divide-border/50">
              {Array.from({ length: 35 }).map((_, i) => {
                const dayNum = i - 2; // Offset for start of month
                const isCurrentMonth = dayNum > 0 && dayNum <= 31;
                
                // Find appointments for this day (mock logic)
                const dayAppointments = appointments?.filter(apt => {
                  const d = new Date(apt.startTime);
                  return d.getDate() === dayNum && isCurrentMonth;
                });

                return (
                  <div key={i} className={`min-h-[120px] p-2 ${!isCurrentMonth ? 'bg-muted/10' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-medium ${
                        isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/50'
                      } ${dayNum === currentDate.getDate() ? 'bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
                        {dayNum > 0 && dayNum <= 31 ? dayNum : ''}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {dayAppointments?.map(apt => (
                        <div key={apt.id} className="bg-primary/10 border border-primary/20 rounded px-2 py-1">
                          <p className="text-xs font-semibold text-primary truncate">{apt.customerName}</p>
                          <p className="text-[10px] text-primary/80">
                            {new Date(apt.startTime).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
