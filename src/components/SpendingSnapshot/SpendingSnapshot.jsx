import { useEffect, useMemo, useState } from "react";
import { fetchSpend, downloadSpendCsv } from "../../service/Analytics";
import "./SpendingSnapshot.css";
import toast from "react-hot-toast";

// build YYYY-MM-DD (local) strings for the last N days, inclusive of today
// format YYYY-MM-DD in *local* time
const ymdLocal = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

// build last N day keys (includes *today*), in local time
const buildDayKeys = (days) => {
    const keys = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        keys.push(ymdLocal(d));
    }
    return keys;
};

// best-effort local date key from API value
const toLocalKey = (val) => {
    if (!val) return '';
    // If API already sends 'YYYY-MM-DD', keep it
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const d = new Date(val);
    if (isNaN(d)) return String(val).slice(0, 10);
    d.setHours(0, 0, 0, 0);
    return ymdLocal(d);
};

// merge API buckets onto the full window
const normalizeBuckets = (apiBuckets, windowDays) => {
    const map = new Map(
        (apiBuckets ?? []).map(b => [toLocalKey(b.date), Number(b.amount) || 0])
    );
    return buildDayKeys(windowDays).map(key => ({
        date: key,
        amount: map.get(key) ?? 0
    }));
};

const fromYmdLocal = (ymd) => {
    if (!ymd) return new Date(NaN);
    const [y, m, d] = ymd.split('-').map(Number);
    // This constructs a LOCAL midnight date (no UTC shift)
    return new Date(y, m - 1, d);
};


const SpendingSnapshot = ({ defaultWindow = 30 }) => {
    const [windowDays, setWindowDays] = useState(defaultWindow);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log(data)

    const load = async (wd) => {
        setLoading(true);
        try {
            const res = await fetchSpend(wd);
            const padded = normalizeBuckets(res.data?.buckets, wd);
            // recompute total from padded (so today’s zero still appears)
            const total = padded.reduce((s,b) => s + (b.amount||0), 0);
            setData({ total, windowDays: wd, buckets: padded });
        } catch (e) {
            console.error(e);
            toast.error("Unable to load spending");
            setData({ total: 0, windowDays: wd, buckets: normalizeBuckets([], wd) });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(windowDays);
    }, [windowDays]);

    // Debug
    useEffect(() => {
        if (data) console.log('buckets', data.buckets);
    }, [data]);


    const max = useMemo(() => {
        if (!data?.buckets?.length) return 0;
        return Math.max(...data.buckets.map(b => Number(b.amount) || 0));
    }, [data]);

    return (
        <section className="ss-card">
            <div className="section-header">
                <div className="section-title">
                    <i className="bi bi-graph-up-arrow section-icon" />
                    Spending snapshot
                </div>
                <div className="section-actions">
                    <select
                        className="dash-select"
                        value={String(windowDays)}
                        onChange={(e) => setWindowDays(Number(e.target.value))}
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                    </select>
                    <button className="btn btn-sm btn-outline-warning">Download CSV</button>
                </div>
            </div>

            {loading ? (
                <div className="ss-empty">Loading...</div>
                ) : (
                        <>
                            <div className="ss-total">
                                Total: <span className="money">${Number(data.total || 0).toFixed(2)}</span> ({data.windowDays}d)
                            </div>

                            <div
                                className="ss-bars ss-bars--grid"
                                style={{
                                    height: 'clamp(220px, 20vh, 340px)',                 // <- required
                                    gridTemplateColumns: `repeat(${data?.buckets?.length || 0}, 1fr)`,
                                    columnGap: (data?.buckets?.length || 0) > 14 ? 8 : 14,
                                    padding: '8px 16px 12px'
                                }}
                            >
                                {(() => {
                                    const buckets = data?.buckets || [];
                                    const vals = buckets.map(b => Number(b.amount) || 0);
                                    const max  = Math.max(1, ...vals);                   // avoid /0

                                    return buckets.map((b, i) => {
                                        const amt   = Number(b.amount) || 0;
                                        const pct   = (amt / max) * 100;
                                        const h     = amt > 0 ? Math.max(pct, 6) : 4;      // 4px stub for zeros
                                        const label = fromYmdLocal(b.date)
                                            .toLocaleDateString([], { month: 'short', day: '2-digit' });

                                        return (
                                            <div className="ss-bar" key={i}>
                                                <div
                                                    className="ss-bar-fill"
                                                    style={{ height: `${h}%` }}
                                                    title={`${label}: $${amt.toFixed(2)}`}
                                                />
                                                <div className="ss-bar-label">{label}</div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </>
                    )
            }
        </section>
    );
};

export default SpendingSnapshot;



