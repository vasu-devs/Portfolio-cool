import { useEffect, useState } from 'react';

interface Day {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionData {
    total: number;
    days: Day[];
}

// Blue scale matched to the site accent.
const LEVEL_COLORS = ['#eeeeef', '#bfdbfe', '#60a5fa', '#2563eb', '#1e3a8a'];

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Self-rendered contribution heatmap. Pulls the same public API the old
// react-github-calendar used, but renders locally so a library failure can
// never blank the section; on fetch error it degrades to a profile link.
export const ContributionGraph = ({ username }: { username: string }) => {
    const [data, setData] = useState<ContributionData | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const load = async (attempt = 0) => {
            try {
                const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                if (cancelled) return;
                const days: Day[] = json.contributions ?? [];
                const total =
                    json.total?.lastYear ??
                    days.reduce((acc: number, d: Day) => acc + (d.count || 0), 0);
                setData({ total, days });
            } catch (e) {
                if (cancelled) return;
                if (attempt < 2) {
                    setTimeout(() => load(attempt + 1), 1500 * (attempt + 1));
                } else {
                    console.warn('Contribution graph failed to load:', e);
                    setFailed(true);
                }
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [username]);

    if (failed) {
        return (
            <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-border-primary rounded-lg p-4 font-mono text-xs text-fg-secondary hover:text-fg-primary transition-colors"
            >
                couldn't load the contribution graph — view it on github.com/{username} →
            </a>
        );
    }

    if (!data) {
        return (
            <div className="border border-border-primary rounded-lg p-4">
                <div className="h-[110px] rounded bg-bg-secondary animate-pulse" />
            </div>
        );
    }

    // Chunk days into weeks (columns). The API returns days in date order.
    const weeks: Day[][] = [];
    let week: Day[] = [];
    for (const day of data.days) {
        const dow = new Date(day.date).getDay();
        if (dow === 0 && week.length > 0) {
            weeks.push(week);
            week = [];
        }
        week.push(day);
    }
    if (week.length > 0) weeks.push(week);

    // Month labels: mark the first week where a new month starts.
    const monthMarks: { index: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((w, i) => {
        const m = new Date(w[0].date).getMonth();
        if (m !== lastMonth) {
            monthMarks.push({ index: i, label: MONTH_LABELS[m] });
            lastMonth = m;
        }
    });

    const CELL = 11;
    const GAP = 3;
    const width = weeks.length * (CELL + GAP);
    const height = 7 * (CELL + GAP) + 16;

    return (
        <div className="border border-border-primary rounded-lg p-4 bg-bg-primary">
            <div className="overflow-x-auto scrollbar-thin" data-lenis-prevent>
                <svg
                    width={width}
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    className="block"
                    role="img"
                    aria-label={`${data.total.toLocaleString()} GitHub contributions in the last year`}
                >
                    {monthMarks.map((m) => (
                        <text
                            key={`${m.label}-${m.index}`}
                            x={m.index * (CELL + GAP)}
                            y={10}
                            className="fill-fg-secondary"
                            style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
                        >
                            {m.label}
                        </text>
                    ))}
                    {weeks.map((w, wi) =>
                        w.map((day) => {
                            const dow = new Date(day.date).getDay();
                            return (
                                <rect
                                    key={day.date}
                                    x={wi * (CELL + GAP)}
                                    y={16 + dow * (CELL + GAP)}
                                    width={CELL}
                                    height={CELL}
                                    rx={2.5}
                                    fill={LEVEL_COLORS[day.level] ?? LEVEL_COLORS[0]}
                                >
                                    <title>{`${day.date}: ${day.count} contribution${day.count === 1 ? '' : 's'}`}</title>
                                </rect>
                            );
                        })
                    )}
                </svg>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-primary">
                <span className="font-mono text-[11px] text-fg-secondary">
                    {data.total.toLocaleString()} contributions in the last year
                </span>
                <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-fg-secondary">less</span>
                    {LEVEL_COLORS.map((c) => (
                        <span key={c} className="w-2.5 h-2.5 rounded-[3px]" style={{ background: c }} />
                    ))}
                    <span className="font-mono text-[10px] text-fg-secondary">more</span>
                </div>
            </div>
        </div>
    );
};
