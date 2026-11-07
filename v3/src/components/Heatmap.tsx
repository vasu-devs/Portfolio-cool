import data from '../data/github.json';

// Last year of GitHub contributions, one cell per day, columns are weeks (snapshot via gh CLI).
const days = data.days as [string, number][];
const max = Math.max(...days.map(([, c]) => c));
const level = (c: number) => (c === 0 ? 0 : c < max * 0.12 ? 1 : c < max * 0.3 ? 2 : c < max * 0.6 ? 3 : 4);
const firstWeekday = new Date(days[0][0] + 'T00:00:00Z').getUTCDay();

export function Heatmap() {
  return (
    <figure className="heat" aria-label={`${data.total.toLocaleString('en-US')} GitHub contributions in the last year`}>
      <div className="heat-grid" style={{ ['--offset' as string]: firstWeekday }}>
        {days.map(([date, count], i) => (
          <i key={date} className={`l${level(count)}`} style={{ ['--c' as string]: Math.floor((i + firstWeekday) / 7) }} title={`${count} on ${date}`} />
        ))}
      </div>
      <figcaption>
        <b>{data.total.toLocaleString('en-US')}</b> contributions in the last year.
      </figcaption>
    </figure>
  );
}
