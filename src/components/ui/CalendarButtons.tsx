"use client";

import { Calendar, Download } from "lucide-react";
import { BattleMock } from "./BattleCard";

export default function CalendarButtons({ battle }: { battle: BattleMock }) {
    const start = new Date(battle.scheduled_at);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

    // Format YYYYMMDDTHHMMSSZ
    const formatDateForCal = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const gcalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=🔥+THE+KITCHEN:+${encodeURIComponent(battle.artist_a.display_name)}+vs+${encodeURIComponent(battle.artist_b.display_name)}&dates=${formatDateForCal(start)}/${formatDateForCal(end)}&details=Live+rap+battle+at+thekitchen.gg/battles/${battle.id}+—+Cast+your+vote+after+the+battle!&location=thekitchen.gg`;

    const downloadICS = () => {
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Kitchen//Battle//EN
BEGIN:VEVENT
UID:${battle.id}@thekitchen.gg
DTSTAMP:${formatDateForCal(new Date())}
DTSTART:${formatDateForCal(start)}
DTEND:${formatDateForCal(end)}
SUMMARY:🔥 THE KITCHEN: ${battle.artist_a.display_name} vs ${battle.artist_b.display_name}
DESCRIPTION:Live P2P rap battle. Watch and vote at thekitchen.gg/battles/${battle.id}
URL:https://thekitchen.gg/battles/${battle.id}
BEGIN:VALARM
TRIGGER:-PT30M
ACTION:DISPLAY
DESCRIPTION:Battle starting in 30 minutes — get to The Kitchen!
END:VALARM
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${battle.artist_a.username}_vs_${battle.artist_b.username}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex gap-4">
            <a
                href={gcalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-char border border-smoke hover:border-ember text-smoke hover:text-white-app font-bebas text-lg tracking-wider clip-angled transition-colors"
            >
                <Calendar className="w-5 h-5 text-ember" /> GOOGLE CALENDAR
            </a>
            <button
                onClick={downloadICS}
                className="flex items-center gap-2 px-6 py-3 bg-char border border-smoke hover:border-ember text-smoke hover:text-white-app font-bebas text-lg tracking-wider clip-angled transition-colors"
            >
                <Download className="w-5 h-5 text-smoke" /> .ICS
            </button>
        </div>
    );
}
