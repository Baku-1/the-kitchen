export interface CalendarEvent {
    id: string;
    artist_a_name: string;
    artist_b_name: string;
    scheduled_at: Date | string;
    title?: string;
}

export const addToGoogleCalendar = (event: CalendarEvent) => {
    const start = new Date(event.scheduled_at)
        .toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(new Date(event.scheduled_at).getTime() + 2 * 60 * 60 * 1000)
        .toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const title = encodeURIComponent(
        `🔥 THE KITCHEN: ${event.artist_a_name} vs ${event.artist_b_name}`
    );
    const details = encodeURIComponent(
        `Live rap battle. Watch and vote at the-kitchen-one.vercel.app/battles/${event.id}`
    );
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=the-kitchen-one.vercel.app`;
    window.open(url, '_blank');
};

export const downloadICS = (event: CalendarEvent) => {
    const start = new Date(event.scheduled_at)
        .toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(new Date(event.scheduled_at).getTime() + 2 * 60 * 60 * 1000)
        .toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//The Kitchen//Battle//EN',
        'BEGIN:VEVENT',
        `UID:${event.id}@thekitchen.gg`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:🔥 THE KITCHEN: ${event.artist_a_name} vs ${event.artist_b_name}`,
        `DESCRIPTION:Live rap battle. Vote at the-kitchen-one.vercel.app/battles/${event.id}`,
        `URL:https://the-kitchen-one.vercel.app/battles/${event.id}`,
        'BEGIN:VALARM',
        'TRIGGER:-PT30M',
        'ACTION:DISPLAY',
        'DESCRIPTION:Battle starting in 30 minutes — get to The Kitchen!',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([ics], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `kitchen-battle-${event.id}.ics`;
    a.click();
};
