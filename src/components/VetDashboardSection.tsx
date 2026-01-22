import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  MessageCircle,
  Stethoscope,
  BarChart2,
  LogOut,
  CheckSquare,
  Eye,
  Video,
} from "lucide-react";

type AppointmentStatus = "Scheduled" | "Pending" | "Completed" | "In Progress";

type Appointment = {
  id: string;
  petName: string;
  breed: string;
  ownerName: string;
  time: string; // ISO or friendly string
  status: AppointmentStatus;
};

type Patient = {
  id: string;
  name: string;
  breed: string;
  lastSeen: string;
};

type Message = {
  id: string;
  from: string;
  preview: string;
  time: string;
  unread?: boolean;
};

export const VetDashboardSection: React.FC = () => {
  // Sample dummy data
  const [appointments] = useState<Appointment[]>([
    { id: "a1", petName: "Max", breed: "Labrador Retriever", ownerName: "Alice Johnson", time: "Today • 09:30 AM", status: "Scheduled" },
    { id: "a2", petName: "Bella", breed: "French Bulldog", ownerName: "Carlos Diaz", time: "Today • 10:00 AM", status: "In Progress" },
    { id: "a3", petName: "Luna", breed: "Beagle", ownerName: "Sophie Lee", time: "Today • 11:15 AM", status: "Pending" },
    { id: "a4", petName: "Buddy", breed: "German Shepherd", ownerName: "Tom Nguyen", time: "Today • 01:00 PM", status: "Scheduled" },
  ]);

  const [patients] = useState<Patient[]>([
    { id: "p1", name: "Rocky", breed: "Boxer", lastSeen: "2 days ago" },
    { id: "p2", name: "Milo", breed: "Pug", lastSeen: "5 days ago" },
    { id: "p3", name: "Daisy", breed: "Golden Retriever", lastSeen: "1 week ago" },
  ]);

  const [messages] = useState<Message[]>([
    { id: "m1", from: "Alice Johnson", preview: "Max's skin rash has returned, should I bring him back?", time: "2h", unread: true },
    { id: "m2", from: "Sophie Lee", preview: "Thanks for the consult, Luna is doing better.", time: "5h" },
    { id: "m3", from: "Carlos Diaz", preview: "Can we move Bella's appointment?", time: "Yesterday" },
  ]);

  const doctor = useMemo(() => ({ name: "Dr. Priya Sharma", title: "Veterinarian", avatarInitials: "PS" }), []);

  const totals = useMemo(() => ({
    todays: appointments.length,
    pending: appointments.filter((a) => a.status === "Pending").length,
    treated: 1243,
    messages: messages.filter((m) => m.unread).length,
  }), [appointments, messages]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-3 xl:col-span-2 bg-white rounded-2xl shadow-sm p-4 md:p-6 sticky top-6 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                {doctor.avatarInitials}
              </div>
              <div>
                <div className="text-sm font-semibold">{doctor.name}</div>
                <div className="text-xs text-gray-500">{doctor.title}</div>
              </div>
            </div>

            <nav className="space-y-1">
              <NavItem icon={<BarChart2 className="w-4 h-4" />} label="Dashboard" active />
              <NavItem icon={<Calendar className="w-4 h-4" />} label="Appointments" />
              <NavItem icon={<Users className="w-4 h-4" />} label="Patients" />
              <NavItem icon={<MessageCircle className="w-4 h-4" />} label="Messages" badge={totals.messages} />
              <NavItem icon={<Stethoscope className="w-4 h-4" />} label="Analytics" />
              <NavItem icon={<CheckSquare className="w-4 h-4" />} label="Settings" />

              <div className="border-t border-gray-100 mt-4 pt-4">
                <button className="w-full flex items-center gap-3 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-md">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="md:col-span-9 xl:col-span-10">
            <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {doctor.name.split(" ")[0]}</h1>
                <p className="text-sm text-gray-500 mt-1">Here's what's happening at your clinic today</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-sm font-semibold">{doctor.name}</span>
                  <span className="text-xs text-gray-500">{doctor.title}</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">{doctor.avatarInitials}</div>
              </div>
            </motion.header>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard title="Today's Appointments" value={totals.todays.toString()} icon={<Calendar className="w-5 h-5 text-amber-500" />} />
              <StatCard title="Pending Consultations" value={totals.pending.toString()} icon={<MessageCircle className="w-5 h-5 text-rose-500" />} />
              <StatCard title="Total Pets Treated" value={totals.treated.toString()} icon={<Users className="w-5 h-5 text-sky-500" />} />
              <StatCard title="Messages" value={totals.messages.toString()} icon={<MessageCircle className="w-5 h-5 text-green-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Appointments list */}
              <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Appointments</h2>
                  <div className="text-sm text-gray-500">Today • {new Date().toLocaleDateString()}</div>
                </div>

                <div className="space-y-3">
                  {appointments.map((a) => (
                    <motion.div whileHover={{ y: -4 }} key={a.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center font-semibold text-amber-700">{a.petName.charAt(0)}</div>
                        <div>
                          <div className="font-semibold">{a.petName} • <span className="text-xs text-gray-500">{a.breed}</span></div>
                          <div className="text-sm text-gray-500">Owner: {a.ownerName}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600 text-right">
                          <div>{a.time}</div>
                          <div className={`text-xs mt-1 ${statusColor(a.status)}`}>{a.status}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="text-sm px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-100">View</button>
                          <button className="text-sm px-3 py-2 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700">Complete</button>
                          <button className="text-sm px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            Join
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

              </section>

              {/* Right column: Patients + Messages + Analytics */}
              <aside className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
                  <h3 className="text-sm font-semibold mb-3">Recently Treated Patients</h3>
                  <ul className="space-y-3">
                    {patients.map((p) => (
                      <li key={p.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">{p.name.charAt(0)}</div>
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.breed} • {p.lastSeen}</div>
                          </div>
                        </div>
                        <button className="text-xs px-3 py-1 rounded-md bg-amber-50 border border-amber-100 text-amber-600">Details</button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Messages</h3>
                    <div className="text-xs text-gray-500">{messages.length} new</div>
                  </div>
                  <ul className="space-y-3">
                    {messages.map((m) => (
                      <li key={m.id} className={`flex items-start gap-3 ${m.unread ? "bg-amber-50 p-3 rounded-md" : ""}`}>
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center text-slate-700">{m.from.charAt(0)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm">{m.from}</div>
                            <div className="text-xs text-gray-400">{m.time}</div>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{m.preview}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
                  <h3 className="text-sm font-semibold mb-3">Quick Analytics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <MiniStat label="New Patients" value="24" />
                    <MiniStat label="Avg Wait (min)" value="18" />
                    <MiniStat label="Completed" value="18" />
                    <MiniStat label="Online Consults" value="6" />
                  </div>
                </div>

              </aside>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default VetDashboardSection;

/* --- Subcomponents --- */

function NavItem({ icon, label, active = false, badge }: { icon: React.ReactNode; label: string; active?: boolean; badge?: number }) {
  return (
    <div className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${active ? "bg-amber-50" : "hover:bg-gray-50"}`}>
      <div className="w-8 h-8 flex items-center justify-center text-amber-600">{icon}</div>
      <div className="flex-1 text-sm font-medium">{label}</div>
      {badge ? <div className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-md">{badge}</div> : null}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-semibold">{value}</div>
      </div>
    </motion.div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}

function statusColor(status: AppointmentStatus) {
  switch (status) {
    case "Scheduled":
      return "text-amber-600";
    case "In Progress":
      return "text-indigo-600";
    case "Pending":
      return "text-rose-600";
    case "Completed":
      return "text-emerald-600";
    default:
      return "text-gray-600";
  }
}
