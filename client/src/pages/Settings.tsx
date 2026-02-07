import { Sidebar } from "@/components/Sidebar";
import { useTenant, useUpdateTenant } from "@/hooks/use-tenant";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTenantSchema } from "@shared/schema";
import { z } from "zod";
import { useEffect } from "react";
import { Loader2, Palette, Clock, Bot, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const settingsSchema = insertTenantSchema.pick({
  name: true,
  slug: true,
  branding: true,
  businessHours: true,
});

export default function Settings() {
  const { data: tenant, isLoading } = useTenant();
  const { mutate: updateTenant, isPending } = useUpdateTenant();

  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      slug: "",
      branding: {
        accentColor: "#4F46E5",
        voiceStyle: "professional"
      },
      businessHours: {}
    }
  });

  useEffect(() => {
    if (tenant) {
      form.reset({
        name: tenant.name,
        slug: tenant.slug,
        branding: tenant.branding || {},
        businessHours: tenant.businessHours || {}
      });
    }
  }, [tenant, form]);

  const onSubmit = (data: any) => {
    updateTenant(data);
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-1">Configure your AI receptionist and workspace.</p>
            </div>
            <Button 
              onClick={form.handleSubmit(onSubmit)} 
              disabled={isPending}
              className="btn-primary"
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>

          <div className="grid gap-8">
            
            {/* General Section */}
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/10 flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="font-bold">General Information</h3>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Business Name</label>
                  <input 
                    {...form.register("name")}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Subdomain (Slug)</label>
                  <div className="flex">
                    <input 
                      {...form.register("slug")}
                      className="flex-1 px-4 py-2 rounded-l-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                    <div className="px-4 py-2 bg-muted border border-l-0 border-border rounded-r-lg text-sm text-muted-foreground">
                      .receptionist.ai
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Branding Section */}
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/10 flex items-center gap-3">
                <Palette className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold">Branding & Widget</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Accent Color</label>
                    <div className="flex gap-4 items-center">
                      <input 
                        type="color" 
                        {...form.register("branding.accentColor")}
                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                      />
                      <span className="text-sm text-muted-foreground">Pick a color for your chat widget.</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Voice Tone</label>
                    <select 
                      {...form.register("branding.voiceStyle")}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="professional">Professional & Formal</option>
                      <option value="friendly">Friendly & Casual</option>
                      <option value="enthusiastic">Energetic & Enthusiastic</option>
                    </select>
                  </div>
                </div>
                
                {/* Widget Preview */}
                <div className="border border-border rounded-xl p-4 bg-muted/10 relative h-64 flex items-end justify-end">
                  <div className="absolute top-4 left-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Widget Preview
                  </div>
                  
                  {/* Chat Bubble Mockup */}
                  <div className="bg-white rounded-2xl rounded-br-none shadow-lg p-4 mb-16 mr-4 max-w-[200px] border border-border">
                    <p className="text-sm text-foreground">Hi there! How can I help you book an appointment today?</p>
                  </div>

                  {/* Widget Button */}
                  <div 
                    className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-transform hover:scale-105"
                    style={{ backgroundColor: form.watch("branding.accentColor") }}
                  >
                    <Bot className="w-7 h-7" />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/10 flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-600" />
                <h3 className="font-bold">Business Hours</h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  AI will only book appointments during these windows.
                </p>
                <div className="grid gap-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium">{day}</div>
                      <input 
                        type="time" 
                        defaultValue="09:00"
                        className="px-3 py-1.5 rounded border border-border text-sm"
                      />
                      <span className="text-muted-foreground text-sm">to</span>
                      <input 
                        type="time" 
                        defaultValue="17:00"
                        className="px-3 py-1.5 rounded border border-border text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
