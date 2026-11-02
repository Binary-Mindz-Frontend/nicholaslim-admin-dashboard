export type AdEvent = {
  impression?: number;
  click?: number;
  createdAt?: string;
};

export type AdMetrics = {
  impressions: number;
  clicks: number;
  ctr: number;
};

type AdLike = {
  analytics?: AdEvent[];
  totalImpression?: number;
  impression?: number;
  totalClick?: number;
  click?: number;
  ctr?: number;
};

export function metricsFromAd(ad?: AdLike | null): AdMetrics {
  const events = Array.isArray(ad?.analytics) ? ad.analytics : null;

  if (events) {
    let impressions = 0;
    let clicks = 0;
    for (const event of events) {
      impressions += Number(event?.impression) || 0;
      clicks += Number(event?.click) || 0;
    }
    return { impressions, clicks, ctr: clickThroughRate(clicks, impressions) };
  }

  const impressions = Number(ad?.totalImpression ?? ad?.impression ?? 0);
  const clicks = Number(ad?.totalClick ?? ad?.click ?? 0);
  const ctr =
    ad?.ctr !== undefined && ad?.ctr !== null
      ? Number(ad.ctr)
      : clickThroughRate(clicks, impressions);

  return { impressions, clicks, ctr };
}

export function weeklyTrends(ad: AdLike | null | undefined, months: number) {
  const events = Array.isArray(ad?.analytics) ? ad.analytics : [];
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - months);
  const span = Math.max(end.getTime() - start.getTime(), 1);
  const buckets = [0, 1, 2, 3].map((index) => ({
    week: `Week ${index + 1}`,
    impressions: 0,
    clicks: 0,
  }));

  for (const event of events) {
    const time = new Date(event?.createdAt ?? "").getTime();
    if (Number.isNaN(time) || time < start.getTime() || time > end.getTime()) {
      continue;
    }
    const index = Math.min(3, Math.floor(((time - start.getTime()) / span) * 4));
    buckets[index].impressions += Number(event?.impression) || 0;
    buckets[index].clicks += Number(event?.click) || 0;
  }

  return buckets;
}

export function formatCtr(ctr: number) {
  return `${Number(ctr.toFixed(2))}%`;
}

export function adRedirectUrl(raw?: string | null) {
  const value = raw?.trim();
  if (!value) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
  return `https://${value}`;
}

function clickThroughRate(clicks: number, impressions: number) {
  if (impressions <= 0) return 0;
  return Number(((clicks / impressions) * 100).toFixed(2));
}
