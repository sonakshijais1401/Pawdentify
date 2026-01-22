import React, { useState } from "react";

interface Appointment {
  id: string;
  petName: string;
  petType: string;
  doctor: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:MM
  notes?: string;
}

const doctors = [
  "Dr. Sarah Lee",
  "Dr. Miguel Santos",
  "Dr. Priya Patel",
  "Dr. Emily Wong",
];

const petTypes = [
  "Dog - Labrador",
  "Dog - German Shepherd",
  "Dog - Poodle",
  "Cat - Domestic",
  "Other",
];

export default function BookAppointment() {
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState(petTypes[0]);
  const [doctor, setDoctor] = useState(doctors[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName.trim() || !date || !time) {
      alert("Please provide pet name, appointment date and time.");
      return;
    }

    const appt: Appointment = {
      id: Date.now().toString(),
      petName: petName.trim(),
      petType,
      doctor,
      date,
      time,
      notes: notes.trim() || undefined,
    };

    setAppointments((prev) => [appt, ...prev]);

    // reset form
    setPetName("");
    setPetType(petTypes[0]);
    setDoctor(doctors[0]);
    setDate("");
    setTime("");
    setNotes("");
  };

  const formatDateTime = (d: string, t: string) => {
    try {
      const dt = new Date(`${d}T${t}`);
      return dt.toLocaleString();
    } catch (e) {
      return `${d} ${t}`;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white via-amber-50 to-white">
      <div className="w-full max-w-3xl">
        <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Book an Appointment</h2>
          <p className="text-sm text-gray-500 mb-6">Schedule a visit with one of our trusted vets.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Pet's Name</label>
                <input
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                  placeholder="e.g. Bella"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Pet Type / Breed</label>
                <select
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                >
                  {petTypes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Doctor</label>
                <select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                >
                  {doctors.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">Notes / Symptoms (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  placeholder="Describe symptoms or anything we should know"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>

        {/* Appointments list below the card */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3 text-gray-800">Upcoming Appointments</h3>
          {appointments.length === 0 ? (
            <p className="text-sm text-gray-500">No appointments yet.</p>
          ) : (
            <ul className="space-y-3">
              {appointments.map((a) => (
                <li key={a.id} className="flex items-start justify-between bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <div>
                    <div className="text-lg font-semibold text-gray-800">{a.petName}</div>
                    <div className="text-sm text-gray-500">{a.petType}</div>
                    {a.notes ? <div className="mt-2 text-sm text-gray-700">{a.notes}</div> : null}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-800">{a.doctor}</div>
                    <div className="text-sm text-gray-500">{formatDateTime(a.date, a.time)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
