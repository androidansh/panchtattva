import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { csvWatershedData } from "./data/csv-watershed-data";
import GoogleMapsMap from "./GoogleMapsMap";
import high2dImage from "./assets/high-2d.jpeg";
import medium2dImage from "./assets/medium-2d.jpeg";
import low2dImage from "./assets/low-2d.jpeg";

/* =========================================================
   DEMONSTRATION WATERSHED DATA
========================================================= */

const watershedData = {
  high: {
    name: "High Priority Watershed",
    rainfall: 1203,
    monsoonRainfall: 760,
    ndvi: 0.25,
    slope: 3.53,
    elevationMin: 48,
    elevationMax: 76,
    erosion: "High",
    runoff: "Moderate–High",
    waterAvailability: "Low",
    area: 42.6,
    ponds: 2,
    waterBodies: 1,
    checkDams: 0,
    score: 86,
    recommendation: "High estimated soil loss combined with relatively high rainfall and 3.53° slope indicates a location requiring active soil and water conservation measures.",
    actions: [
      "Farm ponds & rainwater harvesting",
      "Contour bunding and field bund strengthening",
      "Vegetation and soil-cover improvement",
      "Runoff-channel treatment",
    ],
  },
  medium: {
    name: "Medium Priority Watershed",
    rainfall: 1167,
    monsoonRainfall: 748,
    ndvi: 0.42,
    slope: 6,
    elevationMin: 45,
    elevationMax: 68,
    erosion: "Moderate",
    runoff: "Moderate",
    waterAvailability: "Moderate",
    area: 36.8,
    ponds: 3,
    waterBodies: 2,
    checkDams: 1,
    score: 57,
    recommendation: "Moderate estimated soil loss with good seasonal vegetation conditions suggests preventive and maintenance-focused watershed management.",
    actions: [
      "Maintain existing vegetation cover",
      "Small-scale rainwater harvesting",
      "Contour-based soil conservation",
      "Periodic erosion assessment",
    ],
  },
  low: {
    name: "Low Priority Watershed",
    rainfall: 1066,
    monsoonRainfall: 771,
    ndvi: 0.61,
    slope: 3,
    elevationMin: 42,
    elevationMax: 59,
    erosion: "Moderate / relatively controlled",
    runoff: "Low–Moderate",
    waterAvailability: "Good",
    area: 31.4,
    ponds: 4,
    waterBodies: 3,
    checkDams: 2,
    score: 28,
    recommendation: "Lower slope and comparatively lower rainfall indicate lower immediate intervention requirements, while seasonal vegetation response remains strong.",
    actions: [
      "Maintain existing watershed structures",
      "Protect existing vegetation",
      "Localized rainwater harvesting where required",
      "Intervene only where localized degradation is detected",
    ],
  },
};

const priorityZones = [
  {
    key: "high",
    center: [24.815399, 86.842470],
    radius: 5000,
    color: "#d94b55",
    label: "High",
    createdYear: 2012,
  },
  {
    key: "medium",
    center: [24.831280, 86.783349],
    radius: 5000,
    color: "#d59a2a",
    label: "Medium",
    createdYear: 2012,
  },
  {
    key: "low",
    center: [25.064722, 84.771944],
    radius: 5000,
    color: "#4e9a69",
    label: "Low",
    createdYear: 2014,
  },
];

const watershed2dImages = {
  high: high2dImage,
  medium: medium2dImage,
  low: low2dImage,
};

const thematicZones = [
  {
    center: [25.63, 85.18],
    radius: 9000,
    rainfall: 1180,
    ndvi: 0.25,
    slope: 9,
    erosion: 85,
  },
  {
    center: [25.56, 85.10],
    radius: 8000,
    rainfall: 1040,
    ndvi: 0.42,
    slope: 6,
    erosion: 52,
  },
  {
    center: [25.67, 85.08],
    radius: 7500,
    rainfall: 960,
    ndvi: 0.61,
    slope: 3,
    erosion: 25,
  },
  {
    center: [25.60, 85.22],
    radius: 6500,
    rainfall: 1100,
    ndvi: 0.34,
    slope: 8,
    erosion: 72,
  },
];

const vegetationPoints = [
  [25.645, 85.15],
  [25.65, 85.158],
  [25.64, 85.16],
  [25.655, 85.175],
  [25.635, 85.185],
  // [25.66, 85.185]
  [24.815399, 86.842470],
];

/* =========================================================
   THEMATIC MAP STYLING
========================================================= */

function getThemeStyle(theme, zone) {
  if (theme === "rainfall") {
    return {
      fill:
        zone.rainfall >= 1120
          ? "#8f3038"
          : zone.rainfall >= 1020
            ? "#d97706"
            : "#d9a441",
      label: `${zone.rainfall} mm`,
    };
  }

  if (theme === "ndvi") {
    return {
      fill:
        zone.ndvi < 0.3
          ? "#c94b55"
          : zone.ndvi < 0.5
            ? "#c6a12b"
            : "#4c9467",
      label: `NDVI ${zone.ndvi}`,
    };
  }

  if (theme === "slope") {
    return {
      fill:
        zone.slope >= 8
          ? "#c94b55"
          : zone.slope >= 5
            ? "#d59a2a"
            : "#4e9a69",
      label: `${zone.slope}° slope`,
    };
  }

  return {
    fill:
      zone.erosion >= 70
        ? "#8f3038"
        : zone.erosion >= 40
          ? "#d59a2a"
          : "#4e9a69",
    label: `${zone.erosion}% risk`,
  };
}

/* =========================================================
   MINI DEM VISUALIZATION
========================================================= */

function MiniTerrain({ data }) {
  const range = data.elevationMax - data.elevationMin;

  return (
    <div className="mini-terrain">
      <div className="terrain-grid" />
      <div className="terrain-mountain terrain-mountain-back" />
      <div className="terrain-mountain terrain-mountain-front" />
      <div className="terrain-river" />
      <div className="terrain-contour contour-one" />
      <div className="terrain-contour contour-two" />
      <div className="terrain-contour contour-three" />

      <div className="terrain-label elevation-low">
        {data.elevationMin}m
      </div>

      <div className="terrain-label elevation-high">
        {data.elevationMax}m
      </div>

      <div className="terrain-compass">N</div>

      <div className="terrain-footer">
        <span>DEM TERRAIN</span>
        <b>Range {range} m</b>
      </div>
    </div>
  );
}

const metricDefinitions = {
  rainfall: { label: "Rainfall", unit: "mm", precision: 3 },
  ndvi: { label: "NDVI", unit: "", precision: 3 },
  slope: { label: "Slope", unit: "°", precision: 3 },
  area: { label: "Area", unit: "km²", precision: 3 },
};

function formatMetric(value) {
  return Number(value).toFixed(3);
}

const priorityYearwiseData = Object.fromEntries(
  Object.entries(csvWatershedData).map(([area, data]) => [
    area,
    {
      ...data,
      yearly: data.yearly.map((row) => ({
        ...row,
        area: row.area ?? watershedData[area].area,
      })),
      quarterly: data.quarterly.map((row) => ({
        ...row,
        area: row.area ?? watershedData[area].area,
      })),
    },
  ])
);

function MetricChartModal({ area, metric, mode, onModeChange, onClose }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [quarterStartYear, setQuarterStartYear] = useState("");
  const [quarterEndYear, setQuarterEndYear] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("ALL");
  const definition = metricDefinitions[metric];
  const data = priorityYearwiseData[area];
  const quarterYears = [...new Set(data.quarterly.map((point) => point.year))];
  const hasQuarterRange = mode === "yearly" || (quarterStartYear && quarterEndYear);

  const points = mode === "yearly"
    ? data.yearly
    : data.quarterly.filter((point) => (
      hasQuarterRange
      && Number(point.year) >= Number(quarterStartYear)
      && Number(point.year) <= Number(quarterEndYear)
      && (selectedQuarter === "ALL" || point.period === selectedQuarter)
    ));
  const calculationPoints = points.length > 0 ? points : data.quarterly;
  const years = calculationPoints.map((point) => Number(point.year));
  const firstYear = Math.min(...years);
  const lastYear = Math.max(...years);
  const values = calculationPoints.map((point) => point[metric]);
  const maximum = Math.max(...values);
  const minimum = Math.min(...values);
  const spread = maximum - minimum || 1;
  const chartPoints = points.map((point, pointIndex) => ({
    x: points.length === 1 ? 315 : 80 + (pointIndex * 470) / (points.length - 1),
    y: 205 - ((point[metric] - minimum) / spread) * 155,
    label: mode === "yearly" ? point.year : `${point.year} ${point.period}`,
    axisLabel: mode === "yearly"
      ? String(point.year).slice(-2)
      : `${point.period} '${String(point.year).slice(-2)}`,
    value: point[metric],
  }));
  const pointsAttribute = chartPoints.map(({ x, y }) => `${x},${y}`).join(" ");
  const axisValues = [maximum, minimum + spread / 2, minimum];

  function formatValue(value) {
    return `${value.toFixed(definition.precision)}${definition.unit ? ` ${definition.unit}` : ""}`;
  }

  function selectQuarterStartYear(event) {
    setQuarterStartYear(event.target.value);
    setQuarterEndYear("");
    setHoveredPoint(null);
  }

  function selectQuarterEndYear(event) {
    setQuarterEndYear(event.target.value);
    setHoveredPoint(null);
  }

  function selectQuarter(event) {
    setSelectedQuarter(event.target.value);
    setHoveredPoint(null);
  }

  return (
    <div className="metric-modal-overlay" onClick={onClose}>
      <div className="metric-modal" onClick={(event) => event.stopPropagation()}>
        <button className="metric-modal-close" onClick={onClose} aria-label="Close chart">×</button>
        <div className="metric-modal-header">
          <div>
            <h2>{definition.label} trend</h2>
            <p className="metric-year-range">Data from {firstYear} to {lastYear}</p>
          </div>
          <div className="metric-controls">
            <div className="chart-mode-switch" role="tablist" aria-label="Chart period">
              <button className={mode === "yearly" ? "active" : ""} onClick={() => onModeChange("yearly")} role="tab" aria-selected={mode === "yearly"}>Year wise</button>
              <button className={mode === "quarterly" ? "active" : ""} onClick={() => onModeChange("quarterly")} role="tab" aria-selected={mode === "quarterly"}>Quarter wise</button>
            </div>
            {mode === "quarterly" && (
              <div className="quarter-year-range" aria-label="Quarterly year range">
                <span>Year range</span>
                <select value={quarterStartYear} onChange={selectQuarterStartYear} aria-label="Start year">
                  <option value="">From</option>
                  {quarterYears.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
                <span className="quarter-range-separator">to</span>
                <select value={quarterEndYear} onChange={selectQuarterEndYear} aria-label="End year">
                  <option value="">To</option>
                  {quarterYears
                    .filter((year) => !quarterStartYear || Number(year) >= Number(quarterStartYear))
                    .map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
                <span>Quarter</span>
                <select value={selectedQuarter} onChange={selectQuarter} aria-label="Quarter">
                  <option value="ALL">ALL</option>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {!hasQuarterRange ? (
          <div className="metric-chart metric-empty-chart" role="status">
            select year range first
          </div>
        ) : (
          <div className="metric-chart line-chart" role="img" aria-label={`${definition.label} ${mode} line chart`}>
            <svg viewBox="0 0 600 260" preserveAspectRatio="none">
            <rect className="chart-surface" x="30" y="10" width="540" height="240" />
            {[50, 127.5, 205].map((gridY, axisIndex) => (
              <g key={gridY}>
                <line className="chart-grid-line" x1="80" x2="550" y1={gridY} y2={gridY} />
                <text className="chart-axis-label" x="72" y={gridY + 4} textAnchor="end">
                  {formatValue(axisValues[axisIndex])}
                </text>
              </g>
            ))}
            <polyline className={`chart-line ${area}`} points={pointsAttribute} />
            {chartPoints.map((chartPoint) => (
              <g
                key={chartPoint.label}
                className="chart-point-group"
                onMouseEnter={() => setHoveredPoint(chartPoint)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle className={`chart-point-hit-area ${area}`} cx={chartPoint.x} cy={chartPoint.y} r="14" />
                <circle className={`chart-point ${area}`} cx={chartPoint.x} cy={chartPoint.y} r="5" />
                <text
                  className="chart-label"
                  x={chartPoint.x}
                  y="238"
                  textAnchor="middle"
                  transform={mode === "quarterly" ? `rotate(-90 ${chartPoint.x} 238)` : undefined}
                >
                  {chartPoint.axisLabel}
                </text>
                {hoveredPoint?.label === chartPoint.label && (
                  <g className="chart-tooltip" pointerEvents="none">
                    <rect x={chartPoint.x - 48} y={Math.max(8, chartPoint.y - 43)} width="96" height="26" rx="6" />
                    <text x={chartPoint.x} y={Math.max(25, chartPoint.y - 25)} textAnchor="middle">
                      {formatValue(chartPoint.value)}
                    </text>
                  </g>
                )}
              </g>
            ))}
            </svg>
          </div>
        )}

        <p className="metric-source-note">**data from GOOGLE EARTH ENGINE</p>
      </div>
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [started, setStarted] = useState(false);
  const [stateName, setStateName] = useState("");
  const [level, setLevel] = useState("india");
  const [selectedArea, setSelectedArea] = useState(null);

  // Cinematic dashboard entry sequence
  const [introPhase, setIntroPhase] = useState("idle");
  const [requestedPlace, setRequestedPlace] = useState("Bihar");
  const introTimersRef = useRef([]);

  const [baseMap, setBaseMap] = useState("satellite");
  const [activeTheme, setActiveTheme] = useState("none");

  const [showContours, setShowContours] = useState(true);
  const [showPonds, setShowPonds] = useState(true);
  const [showDrainage, setShowDrainage] = useState(true);
  const [showVegetation, setShowVegetation] = useState(true);
  const [showCheckDams, setShowCheckDams] = useState(true);
  const [showWaterBodies, setShowWaterBodies] = useState(true);

  const [showTerrain, setShowTerrain] = useState(false);
  const [activeMetric, setActiveMetric] = useState(null);
  const [chartMode, setChartMode] = useState("yearly");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapOnly, setMapOnly] = useState(false);

  const selectedData = selectedArea
    ? {
      ...watershedData[selectedArea],
      ...priorityYearwiseData[selectedArea].yearly.at(-1),
    }
    : null;

  const currentLocation = useMemo(() => {
    if (level === "patna") return "Patna Watershed Region";
    if (level === "bihar") return "Bihar";
    return "India";
  }, [level]);

  function startExploration() {
    const raw = stateName.trim();
    const state = raw.toLowerCase();

    // Keep the original Bihar demo, while also accepting latitude/longitude.
    const coordinateMatch = raw.match(
      /^\\s*(-?\\d+(?:\\.\\d+)?)\\s*[, ]\\s*(-?\\d+(?:\\.\\d+)?)\\s*$/
    );

    if (state === "bihar" || coordinateMatch) {
      // Clear any previous animation timers before starting a new journey.
      introTimersRef.current.forEach(clearTimeout);

      setRequestedPlace(
        coordinateMatch
          ? `${Number(coordinateMatch[1]).toFixed(4)}, ${Number(
              coordinateMatch[2]
            ).toFixed(4)}`
          : "Bihar"
      );

      setStarted(true);
      setSelectedArea(null);
      setLevel("india");
      setIntroPhase("globe");
      setMapOnly(false);

      // Deliberately paced: Earth → Bihar → Patna → watershed map.
      introTimersRef.current = [
        // 0–2s: quick scanning-earth beat, same look as the Bihar step.
        setTimeout(() => {
          setIntroPhase("ready");
          setLevel("patna");
        }, 2000),

        // 2–5s: smooth zoom from India into Bihar.
        setTimeout(() => {
          setIntroPhase("ready");
          setLevel("patna");
        }, 5000),

        // 5–8s: Patna zoom finishes, then reveal the watershed dashboard.
        setTimeout(() => {
          setIntroPhase("ready");
          setMapOnly(false);
        }, 8000),
      ];

      return;
    }

    alert(
      "For this demonstration, please enter Bihar or a latitude, longitude pair."
    );
  }

  useEffect(() => {
    return () => introTimersRef.current.forEach(clearTimeout);
  }, []);

  function selectWatershed(area) {
    setSelectedArea(area);
    setActiveMetric(null);
    setActiveTheme("none");

    // Keep the selected watershed zoomed on the map, but return to the
    // normal dashboard workspace so Analysis, 2D/3D Visualization,
    // Thematic Maps and GIS Layers are visible below/alongside the map.
    setShowContours(true);
    setShowPonds(true);
    setShowDrainage(true);
    setShowVegetation(true);
    setShowCheckDams(true);
    setShowWaterBodies(true);

    // IMPORTANT:
    // Do not keep fullscreen map-only mode after selecting a watershed.
    // The current code already contains the analysis/visualization sections;
    // mapOnly=true was simply hiding them.
    setMapOnly(false);
    setSidebarOpen(true);
  }

  function goBack() {
    introTimersRef.current.forEach(clearTimeout);
    introTimersRef.current = [];
    setShowTerrain(false);
    setActiveMetric(null);
    setSelectedArea(null);
    setActiveTheme("none");
    setMapOnly(false);
    setSidebarOpen(true);
    setLevel("india");
    setIntroPhase("idle");
    setStarted(false);
  }

  /* =======================================================
     LANDING PAGE
  ======================================================= */

  if (!started) {
    return (
      <div className="app landing-page">

        <div className="landing-bg" aria-hidden="true">
          <span className="bg-blob blob-a" />
          <span className="bg-blob blob-b" />
          <span className="bg-blob blob-c" />
          <span className="flow-layer" />
        </div>

        <div className="landing-logo-corner">
          <img
            src="/panchtattva-logo.png"
            alt="PanchTattva"
            style={{ borderRadius: "8%", border: "4px solid #5f0d0d" }}
          />
        </div>

        {/* <header className="landing-header">

          <div className="brand">
            <img
              src="/panchtattva-logo.png"
              alt="PanchTattva"
              className="brand-logo"
            />
          </div>

          <div className="landing-status">
            <span className="status-dot" />
            GIS Decision Support System
          </div>

        </header> */}

        <div className="hero-row">

          <aside className="side-panel side-panel-left">

            <div className="side-card">
              <span className="side-card-icon">≈</span>
              <b>Every drop counted</b>
              <p>
                A single watershed captures rainfall for every
                farm, pond and well downstream of it.
              </p>
            </div>

            <div className="side-card">
              <span className="side-card-icon">!</span>
              <b>Erosion risk</b>
              <p>
                Bare, steep slopes lose topsoil fast — often the
                first sign a watershed needs attention.
              </p>
            </div>

            <div className="side-card">
              <span className="side-card-icon">⌁</span>
              <b>Recharge, not just runoff</b>
              <p>
                Restoring a watershed lifts falling groundwater
                tables faster than any pump could.
              </p>
            </div>

          </aside>

          <main className="landing-main">

            <div className="hero-content">

              {/* <div className="hero-logo-wrap">
                <img
                  src="/panchtattva-logo.png"
                  alt="PanchTattva Mapping Monitoring Managing Sustaining"
                  className="hero-logo"
                />
              </div> */}

              <span className="hero-kicker">
                GEOSPATIAL • SATELLITE • TERRAIN • WATER
              </span>

              <h2>
                Smart Watershed
                <span>Planning & Analysis</span>
              </h2>

              <p className="hero-description">
                A GIS-based decision support platform for
                watershed monitoring, environmental assessment,
                water-resource planning and sustainable development.
              </p>

              <div className="search-orbit">
                <div className="state-search">

                  <span className="search-icon">⌖</span>

                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") startExploration();
                    }}
                    placeholder="Enter state name, e.g. Bihar"
                    aria-label="State name"
                  />

                  <button onClick={startExploration}>
                    Explore <span>→</span>
                  </button>

                </div>
              </div>

              <small className="search-hint">
                Demonstration coverage:
                <b> Bihar</b>
              </small>

            </div>

          </main>

          <aside className="side-panel side-panel-right">

            <div className="side-card">
              <span className="side-card-icon">◉</span>
              <b>Satellite-driven</b>
              <p>
                Terrain, rainfall and vegetation mapped from
                satellite imagery and DEM data.
              </p>
            </div>

            <div className="side-card">
              <span className="side-card-icon">△</span>
              <b>Priority scoring</b>
              <p>
                Every zone ranked by erosion, runoff and slope
                risk, automatically.
              </p>
            </div>

            <div className="side-card">
              <span className="side-card-icon">▰</span>
              <b>Built for planners</b>
              <p>
                Turns raw geospatial data into concrete,
                actionable interventions.
              </p>
            </div>

          </aside>

        </div>

        <section className="info-section">

          <div className="info-column">

            <span className="section-kicker">WHY IT MATTERS</span>
            <h3>Why watersheds matter</h3>

            <ul className="info-list">
              <li>
                <span className="info-icon">≈</span>
                <div>
                  <b>Water security</b>
                  <p>
                    A watershed catches every drop of rainfall
                    and channels it into the wells, ponds and
                    rivers a community depends on.
                  </p>
                </div>
              </li>

              <li>
                <span className="info-icon">◈</span>
                <div>
                  <b>Slower, gentler runoff</b>
                  <p>
                    Healthy vegetation and contours slow monsoon
                    runoff, letting water soak into the soil
                    instead of stripping it away.
                  </p>
                </div>
              </li>

              <li>
                <span className="info-icon">!</span>
                <div>
                  <b>Falling groundwater</b>
                  <p>
                    A degraded watershed means drier summers,
                    lower groundwater tables and shrinking
                    farm yields.
                  </p>
                </div>
              </li>

              <li>
                <span className="info-icon">⌁</span>
                <div>
                  <b>The most cost-effective fix</b>
                  <p>
                    Restoring a watershed remains one of the
                    most cost-effective ways to build long-term
                    water security for a region.
                  </p>
                </div>
              </li>
            </ul>

          </div>

          <div className="info-column approach">

            <span className="section-kicker">OUR APPROACH</span>
            <h3>What PanchTattva does</h3>

            <ul className="info-list">
              <li>
                <span className="info-icon">◉</span>
                <div>
                  <b>Maps the terrain</b>
                  <p>
                    Combines satellite imagery and DEM data to
                    map rainfall, vegetation, slope and
                    elevation for a region.
                  </p>
                </div>
              </li>

              <li>
                <span className="info-icon">△</span>
                <div>
                  <b>Flags priority zones</b>
                  <p>
                    Highlights the zones where erosion and
                    runoff put water security most at risk,
                    ranked by priority.
                  </p>
                </div>
              </li>

              <li>
                <span className="info-icon">▰</span>
                <div>
                  <b>Recommends interventions</b>
                  <p>
                    Suggests specific fixes for each zone —
                    check dams, farm ponds, contour bunding —
                    based on its conditions.
                  </p>
                </div>
              </li>

              <li>
                <span className="info-icon">⌖</span>
                <div>
                  <b>Tracks progress on one dashboard</b>
                  <p>
                    Gives planners a single map to monitor
                    water resources as interventions are
                    built out.
                  </p>
                </div>
              </li>
            </ul>

          </div>

        </section>

      </div>
    );
  }

  /* =======================================================
     DASHBOARD
  ======================================================= */

  return (
    <div className={`app dashboard ${introPhase !== "idle" && introPhase !== "ready" ? "cinematic-active" : ""}`}>

      {introPhase !== "idle" && introPhase !== "ready" && (
        <div
          className={`cinematic-intro phase-${introPhase}`}
          aria-live="polite"
        >
          <div className="cinematic-globe" aria-hidden="true">
            <div className="globe-aura" />
            <img
              className="real-earth"
              src="https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg"
              alt=""
            />
            <div className="globe-vignette" />
            <div className="globe-atmosphere" />
          </div>

          <div className="cinematic-copy">
            <span className="cinematic-kicker">
              PANCHTATTVA • GEOSPATIAL ENGINE
            </span>

            <h1>
              {introPhase === "globe" && "Scanning Earth"}
              {introPhase === "bihar" && "Locating Bihar"}
              {introPhase === "patna" && "Zooming into watershed areas"}
            </h1>

            <p>
              {introPhase === "globe" &&
                "Rotating Earth • preparing the satellite journey."}
              {introPhase === "bihar" &&
                `Target identified: ${requestedPlace}. Moving into the Bihar watershed region.`}
              {introPhase === "patna" &&
                "Synchronizing satellite imagery with Patna rural watershed zones."}
            </p>

            <div className="cinematic-location">
              <span className="location-pulse" />
              <b>
                {introPhase === "globe" && "EARTH"}
                {introPhase === "bihar" && "BIHAR, INDIA"}
                {introPhase === "patna" && "PATNA, BIHAR"}
              </b>
            </div>

            <div className="cinematic-progress">
              <span className={introPhase === "globe" ? "active" : ""} />
              <span className={introPhase === "bihar" ? "active" : ""} />
              <span className={introPhase === "patna" ? "active" : ""} />
              <span />
            </div>
          </div>
        </div>
      )}

      <div className={`dashboard-actions ${mapOnly ? "map-only-actions" : ""}`}>
        {!mapOnly && (
          <img
            className="dashboard-brand"
            src="/panchtattva-logo.png"
            alt="PanchTattva"
          />
        )}
        {!mapOnly && (
          <>
            {selectedArea && (() => {
              const zone = priorityZones.find((item) => item.key === selectedArea);
              return zone ? (
                <div className="selected-area-meta">
                  <div className="selected-area-meta-item">
                    <span className="selected-area-meta-label">Latitude</span>
                    <b>{zone.center[0].toFixed(6)}</b>
                  </div>
                  <div className="selected-area-meta-item">
                    <span className="selected-area-meta-label">Longitude</span>
                    <b>{zone.center[1].toFixed(6)}</b>
                  </div>
                  <div className="selected-area-meta-item">
                    <span className="selected-area-meta-label">Made in year</span>
                    <b>{zone.createdYear}</b>
                  </div>
                </div>
              ) : null;
            })()}
            <button className="back-button" onClick={goBack}>
              ← Back
            </button>
          </>
        )}

      </div>

      {mapOnly && level === "patna" && (
        <button className="map-only-back" onClick={goBack}>
          ← Back
        </button>
      )}

      <div className={`workspace ${mapOnly ? "map-only-workspace" : ""}`}>

        <aside className={`sidebar ${sidebarOpen ? "open" : ""} ${mapOnly ? "map-only-sidebar" : ""}`}>

          <div className="sidebar-heading">

            <div>
              <span>MAP CONTROL</span>
              <h3>Layers & Analysis</h3>
            </div>

            <button onClick={() => setSidebarOpen(false)}>
              ×
            </button>

          </div>

          <div className="sidebar-logo">
            <img
              src="/panchtattva-logo.png"
              alt="PanchTattva"
            />
          </div>

          <div className="sidebar-section">

            <label>BASE MAP</label>

            {[
              ["satellite", "Satellite", "▦"],
              ["hybrid", "Hybrid", "⊞"],
              ["street", "Street", "⌖"],
            ].map(([key, label, icon]) => (
              <button
                key={key}
                className={`layer-button ${baseMap === key ? "active" : ""
                  }`}
                onClick={() => setBaseMap(key)}
              >
                <span className="layer-icon">{icon}</span>
                {label}
                {baseMap === key && <b>✓</b>}
              </button>
            ))}

          </div>

          {level === "patna" && selectedData && (
            <>
              <div className="sidebar-section">

                <label>THEMATIC MAPS</label>

                {[
                  ["rainfall", "Rainfall", "≈"],
                  ["ndvi", "NDVI / Vegetation", "◈"],
                  ["slope", "Slope", "△"],
                  ["erosion", "Erosion Risk", "!"],
                ].map(([key, label, icon]) => (
                  <button
                    key={key}
                    className={`layer-button ${activeTheme === key ? "active" : ""
                      }`}
                    onClick={() =>
                      setActiveTheme(
                        activeTheme === key ? "none" : key
                      )
                    }
                  >
                    <span className="layer-icon">{icon}</span>
                    {label}
                    {activeTheme === key && <b>✓</b>}
                  </button>
                ))}

              </div>

              <div className="sidebar-section">

                <label>GIS LAYERS</label>

                {[
                  ["Contours", showContours, setShowContours, "⌁"],
                  ["Ponds", showPonds, setShowPonds, "○"],
                  ["Water Bodies", showWaterBodies, setShowWaterBodies, "≈"],
                  ["Drainage", showDrainage, setShowDrainage, "╱"],
                  ["Vegetation", showVegetation, setShowVegetation, "●"],
                  ["Proposed Check Dams", showCheckDams, setShowCheckDams, "▰"],
                ].map(([label, checked, setter, icon]) => (
                  <label className="toggle-row" key={label}>

                    <span>
                      <i>{icon}</i>
                      {label}
                    </span>

                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setter(!checked)}
                    />

                  </label>
                ))}

              </div>
            </>
          )}

          <div className="sidebar-footer">

            <div className="coverage-card">
              <span>●</span>
              <div>
                <b>Coverage</b>
                <small>Bihar demonstration area</small>
              </div>
            </div>

          </div>

        </aside>

        <main className={`content ${mapOnly ? "map-only-content" : ""}`}>

          <section className="map-section">

            {mapOnly && level === "patna" && (
              <div className="map-only-base-controls">
                <span className="map-control-title">MAP VIEW</span>
                {[
                  ["satellite", "Satellite"],
                  ["hybrid", "Hybrid"],
                  ["terrain", "Terrain"],
                  ["street", "Street"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    className={baseMap === key ? "active" : ""}
                    onClick={() => setBaseMap(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div className="section-heading">

              <div className="map-heading-group">
                {!sidebarOpen && !mapOnly && (
                  <button
                    className="open-sidebar-button map-heading-sidebar-button"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open layers and analysis sidebar"
                  >
                    ☰
                  </button>
                )}
                <div>
                <span className="section-kicker">
                  GEOSPATIAL MONITORING
                </span>
                <h2>Watershed Map</h2>
                </div>
              </div>

              <div className="map-location">
                ⌖ {currentLocation}
              </div>

            </div>

            <div className="map-frame">
              <GoogleMapsMap
                level={level}
                cinematic={introPhase !== "idle"}
                baseMap={baseMap}
                activeTheme={activeTheme}
                selectedArea={selectedArea}
                onSelectArea={selectWatershed}
                onLevelChange={setLevel}
                showContours={showContours}
                showPonds={showPonds}
                showDrainage={showDrainage}
                showVegetation={showVegetation}
                showCheckDams={showCheckDams}
                showWaterBodies={showWaterBodies}
                priorityZones={priorityZones}
                thematicZones={thematicZones}
                vegetationPoints={vegetationPoints}
                getThemeStyle={getThemeStyle}
                mapOnly={mapOnly}
              />

              {mapOnly && selectedArea && (
                <div className={`priority-map-note priority-${selectedArea}`}>
                  <strong>{selectedArea.toUpperCase()} PRIORITY AREA</strong>
                  <span>Priority colour hidden · GIS layers are now visible</span>
                </div>
              )}

              <div className="map-overlay-badge">
                <span className="pulse-dot" />
                {baseMap.toUpperCase()} MAP
              </div>

              <div className="map-help">
                {introPhase !== "ready" && level === "india" &&
                  "Preparing global satellite view"}
                {introPhase !== "ready" && level === "bihar" &&
                  "Entering Bihar watershed region"}
                {introPhase !== "ready" && level === "patna" &&
                  "Zooming into Patna watershed areas"}

                {introPhase === "ready" && level === "india" &&
                  "Click the highlighted Bihar region"}
                {introPhase === "ready" && level === "bihar" &&
                  "Click Patna to enter the watershed view"}
                {introPhase === "ready" && level === "patna" &&
                  !selectedArea &&
                  `Showing ${requestedPlace} → watershed priority areas`}
                {selectedArea &&
                  `${selectedArea.toUpperCase()} PRIORITY AREA · Priority colour cleared · GIS layers are now visible`}
              </div>

            </div>

          </section>

          {/* <section className="analysis-section"> */}
          <section className="visualization-section">
            <div className="section-heading compact">
              <div>
                <h2>Analysis of the selected area</h2>
              </div>
              
              {selectedData && (
                <span className={`priority-badge ${selectedArea}`}>
                  {selectedArea.toUpperCase()} PRIORITY
                </span>
              )}
            </div>
            {!selectedData ? (
              <div className="empty-analysis">
                <div className="empty-icon">⌖</div>
                <div>
                  <b>No watershed selected</b>
                  <span>
                    Select a priority zone on the map to view
                    rainfall, NDVI, slope, erosion and
                    water-resource indicators.
                  </span>
                </div>
              </div>
            ) : (
              <div className="analysis-grid">

                <div className={`analysis-card primary ${selectedArea}-priority`}>

                  <div className="analysis-card-top">

                    <div>
                      <h3>{selectedData.name}</h3>
                      <p>Patna District • Rural Watershed Zone</p>
                    </div>

                    <div className="score-ring">
                      <b>{selectedData.score}</b>
                      <span>Priority</span>
                    </div>

                  </div>

                  <div className="metric-row">
                    <button className="metric-button" onClick={() => setActiveMetric("rainfall")}>
                      <span>Rainfall</span>
                      <b>{formatMetric(selectedData.rainfall)}<small> mm</small></b>
                    </button>
                    <button className="metric-button" onClick={() => setActiveMetric("ndvi")}>
                      <span>NDVI</span>
                      <b>{formatMetric(selectedData.ndvi)}</b>
                    </button>
                    <button className="metric-button" onClick={() => setActiveMetric("slope")}>
                      <span>Slope</span>
                      <b>{formatMetric(selectedData.slope)}°</b>
                    </button>
                    <button className="metric-button" onClick={() => setActiveMetric("area")}>
                      <span>Area</span>
                      <b>{formatMetric(selectedData.area)}<small> km²</small></b>
                    </button>
                  </div>

                  <div className="data-source-note">
                    Data source: <b>Google Earth Engine</b>
                  </div>

                </div>

                <div className="analysis-card conditions">

                  <span className="card-label">
                    CURRENT CONDITIONS
                  </span>

                  <div className="condition-item">
                    <span>Annual Rainfall</span>
                    <b>{Number(selectedData.rainfall).toFixed(3)} mm</b>
                  </div>

                  <div className="condition-item">
                    <span>Erosion Risk</span>
                    <b>{selectedData.erosion}</b>
                  </div>

                  <div className="condition-item">
                    <span>Surface Runoff Potential</span>
                    <b>{selectedData.runoff}</b>
                  </div>

                  <div className="condition-item">
                    <span>Monsoon/Q3 Rainfall</span>
                    <b>{selectedData.monsoonRainfall} mm</b>
                  </div>

                </div>

                <div className="analysis-card recommendation-card">

                  <span className="card-label">
                    RECOMMENDED ACTION
                  </span>

                  <div className="recommendation-list">
                    {selectedData.actions.map((action) => (
                      <span key={action}>✓ {action}</span>
                    ))}
                  </div>

                </div>

                {/* <div className="analysis-card resources-card">

                  <span className="card-label">
                    WATER RESOURCES
                  </span>

                  <div className="resource-stats">
                    <div>
                      <b>{selectedData.ponds}</b>
                      <span>Ponds</span>
                    </div>
                    <div>
                      <b>{selectedData.waterBodies}</b>
                      <span>Water Bodies</span>
                    </div>
                    <div>
                      <b>{selectedData.checkDams}</b>
                      <span>Check Dams</span>
                    </div>
                  </div>

                </div> */}

              </div>
            )}
          </section>

          <section className="summary-section">
            <div className="summary-card">
              <span className="card-label">SUMMARY</span>
              {/* <b className="summary-priority">&gt; {selectedArea ? `${selectedArea.toUpperCase()} PRIORITY` : "SELECT A WATERSHED"}</b> */}
              <p>
                {selectedData
                  ? selectedData.recommendation
                  : "Select a watershed to view its summary."}
              </p>
            </div>
          </section>

          <section className="visualization-section">
            <div className="section-heading compact">
              <div>
                <h2>Visualization for watershed development</h2>
              </div>

              {selectedData && (
                <button
                  className="terrain-action"
                  onClick={() => setShowTerrain(true)}
                >
                  Open detailed 3D analysis →
                </button>
              )}

            </div>

            <div className="visual-grid">

              <div className="visual-card">

                <div className="visual-card-header">
                  <div>
                    <h3>2D Visualization</h3>
                  </div>
                  <span>GIS LAYERS</span>
                </div>

                {selectedData ? (
                  <div className="visual-2d">
                    <img
                      src={watershed2dImages[selectedArea]}
                      alt={`${selectedArea} priority watershed 2D visualization`}
                    />
                  </div>
                ) : (
                  <div className="visual-placeholder">
                    Select a watershed to generate the development map.
                  </div>
                )}

              </div>

              <div className="visual-card">

                <div className="visual-card-header">
                  <div>
                    <h3>3D Visualization</h3>
                  </div>
                  <span>DEM TERRAIN</span>
                </div>

                {selectedData ? (
                  <div className="visual-clickable">
                    <MiniTerrain data={selectedData} />
                    <button
                      className="visual-open-button"
                      onClick={() => setShowTerrain(true)}
                    >
                      Explore 3D terrain
                    </button>
                  </div>
                ) : (
                  <div className="visual-placeholder">
                    Select a watershed to preview its terrain model.
                  </div>
                )}

              </div>

            </div>

          </section>

        </main>
      </div>

      {showTerrain && selectedData && (
        <div
          className="terrain-overlay"
          onClick={() => setShowTerrain(false)}
        >
          <div
            className="terrain-modal terrain-modal-shell"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="terrain-close"
              onClick={() => setShowTerrain(false)}
            >
              ×
            </button>

            <div className="terrain-modal-header">
              <div>
                <span className="section-kicker">
                  DIGITAL ELEVATION MODEL
                </span>
                <h2>3D Watershed Terrain</h2>
                <p>
                  {selectedData.name} • Patna, Bihar
                </p>
              </div>
            </div>

            <MiniTerrain data={selectedData} />

            <div className="terrain-stats">
              <div>
                <span>Minimum Elevation</span>
                <b>{selectedData.elevationMin} m</b>
              </div>
              <div>
                <span>Maximum Elevation</span>
                <b>{selectedData.elevationMax} m</b>
              </div>
              <div>
                <span>Elevation Range</span>
                <b>
                  {selectedData.elevationMax -
                    selectedData.elevationMin}{" "}
                  m
                </b>
              </div>
              <div>
                <span>Average Slope</span>
                <b>{selectedData.slope}°</b>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeMetric && selectedArea && (
        <MetricChartModal
          area={selectedArea}
          metric={activeMetric}
          mode={chartMode}
          onModeChange={setChartMode}
          onClose={() => setActiveMetric(null)}
        />
      )}

    </div>
  );
}

export default App;
