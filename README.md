# TransitSync 🚇
### One journey. Multiple modes. Fewer surprises.

TransitSync is an offline-first, Ahmedabad-focused public transport journey planner built during **METRO HACKS by GDG Gandhinagar**.

It explores a practical problem with urban commuting: reaching a destination often requires more than one mode of transport. A metro may cover most of the journey, but commuters still need to figure out the connection to a city bus, BRTS stop, or last-mile ride.

TransitSync brings these parts of a journey into one interface, helping commuters understand their metro route, possible transfers, delays, and onward travel options without depending on a continuously available internet connection for its core application.

**Live demo:** https://metrohacks-transitsync-gdg.netlify.app/

---

## The problem we're solving

Public transport journeys are rarely as simple as boarding one vehicle and getting off at the final stop.

A commuter might need to:

- Find a metro route between two stations.
- Understand whether the journey requires a transfer.
- Account for a possible delay before making the next connection.
- Identify onward travel options after reaching the destination metro station.
- Access basic journey-planning information even when connectivity is unreliable.

When these decisions are scattered across different websites, apps, and transport systems, planning a single journey becomes unnecessarily complicated.

TransitSync explores a more coordinated approach: **plan the metro journey first, then consider what happens before and after it.**

The focus is not just on finding a route between two stations. It is on making the overall journey easier to understand.

## What TransitSync does

### 🚉 Metro journey planning

TransitSync includes Ahmedabad Metro station and line data for four lines:

- Blue Line
- Red Line
- Yellow Line
- Violet Line

The planner uses the available station and interchange data to calculate a route between selected stations. Route information can include the journey's stops, transfers, and estimated travel duration.

Shared interchange stations need to be treated as the same physical station, even when they belong to multiple lines. This is important for producing meaningful routes rather than treating every line's station entry as an unrelated location.

### ⏱️ Delay simulation

TransitSync includes a delay simulator that demonstrates how a disruption can affect a planned journey.

Rather than presenting a simulated delay as a real incident, the feature allows users to explore the effect of additional delay on the journey estimate.

This is useful for demonstrating disruption-aware planning, but it is **not a live metro delay feed**.

### 🚌 Last-mile coordination

A metro station is not necessarily the commuter's final destination. TransitSync includes a last-mile section for exploring onward transport options such as:

- **AMTS:** Ahmedabad's city bus network.
- **Janmarg BRTS:** Ahmedabad's bus rapid transit system.
- **Auto-rickshaw / Rapido:** Options for arranging an onward ride.

The intended experience connects last-mile information to the selected destination metro station. The usefulness of the distance, walking-time, waiting-time, and fare estimates depends on the availability of reliable stop-level data.

Missing information should be shown as unavailable instead of being replaced with invented transport details.

### 🛵 Rapido handoff

TransitSync can provide a simple handoff to Rapido's official website.

The distinction matters: opening Rapido is not the same as booking a ride. TransitSync does not claim an official Rapido API integration, automatic booking, live vehicle availability, or verified prefilled ride links.

### 📶 Offline-first access

TransitSync is built as a Progressive Web App (PWA). Its production build includes a web app manifest and service worker, allowing the application shell and configured static assets to be cached.

Once the application has been loaded and the necessary assets have been cached, the core interface can remain accessible during a network interruption.

Offline access is particularly useful when a commuter needs to check locally bundled station data or explore the demo without relying on a live server for every interaction.

Offline does not mean that every external service works without internet access. Rapido's website, live transport feeds, and any future online integrations still require their respective services and connectivity.

---

## How it works

TransitSync uses a client-side application architecture rather than requiring a continuously running application server for its core demo.

At a high level, the flow is:

1. **Select stations:** The user chooses the boarding and destination stations from the available metro data.
2. **Calculate the route:** The application uses its station, line, and interchange relationships to determine a metro journey.
3. **Inspect the journey:** The interface presents the available route information and estimated duration.
4. **Explore disruptions:** The delay simulator demonstrates how an additional delay can affect the journey.
5. **Consider onward travel:** The last-mile section provides the interface for AMTS, BRTS, and ride-handoff options, subject to available data.
6. **Continue with the relevant service:** External services such as Rapido are opened separately when needed.

The important architectural decision is that the core journey-planning experience can operate from bundled application data. It does not need to fetch a new response from a remote backend every time a user interacts with the planner.

### A note on data accuracy

TransitSync is a hackathon prototype, not an official Ahmedabad transport information system.

- Station and route results depend on the bundled dataset.
- Timetable and frequency values used by the demo are approximate and should not be treated as verified departure times.
- Delay simulation is illustrative.
- AMTS/BRTS stop distances, waiting times, and fares should only be displayed when supported by configured data, with simulated values clearly labelled.
- Live vehicle tracking and live service status are not claimed.
- External ride services handle their own availability and booking processes.

These distinctions are deliberate. A transport planner should communicate uncertainty instead of making estimates look like facts.

---

## Offline support: what to expect

| Capability | Expected behavior |
|---|---|
| Open the application | Available online; offline reopening depends on previously cached assets |
| Load the application interface | Can work offline after the required assets have been cached |
| Use bundled station and route data | Can work offline when the relevant data is included in the application build |
| Use the delay simulator | Can work offline if its logic and required data are locally available |
| Fetch live metro, AMTS, or BRTS information | Not provided by the current demo |
| Open the Rapido website | Requires internet access |
| Install as a PWA | Supported by the PWA configuration in compatible browsers |

**First visit:** An initial visit generally requires internet access so the browser can download the application and its assets. Offline behavior should be tested after the first successful load; it should not be assumed merely because the project uses a service worker.

---

## Technology stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| TypeScript | Type-safe application logic and data structures |
| Vite | Development server and production build |
| Tailwind CSS v4 | Styling and responsive layouts |
| Lucide React | Interface icons |
| vite-plugin-pwa | PWA configuration and service-worker integration |
| Vitest | Automated tests for application logic |
| Netlify | Hosting and production deployment |
| Git and GitHub | Version control and source-code hosting |

The current architecture is intentionally lightweight: the core planner runs in the browser, while the station data and demo behavior are supplied by the application itself.

---

## Built for METRO HACKS

**Event:** METRO HACKS by GDG Gandhinagar  
**Track:** Track 2 — City Public Transport  
**Problem statement:** Problem 6 — Multi-Modal Coordination  
**Location focus:** Ahmedabad, Gujarat, India

TransitSync was developed to explore how multiple transport modes can be considered as parts of a single commuter journey.

The project starts with metro routing and a browser-based prototype, with a design that can accommodate better AMTS/BRTS stop data and more reliable transport integrations over time.

The broader goal is to make public transport easier to navigate without making the experience dependent on perfect connectivity.

---

## Run locally

### Prerequisites

- Node.js with npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/niyatijoshi707/metrohacks-transitsync.git
cd metrohacks-transitsync
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed in the terminal, usually `http://localhost:5173/`.

### 4. Run the tests

```bash
npm run test
```

### 5. Create a production build

```bash
npm run build
```

The production output is generated in the `dist/` directory.

To check the production build locally, use:

```bash
npm run preview
```

PWA caching and offline behavior should be tested against a production build or deployed HTTPS site, rather than inferred solely from the development server.

---

## Project status and limitations

TransitSync is an evolving prototype. The existing planner, station data, route calculation, delay simulation, and PWA setup form its foundation.

Some capabilities depend on further implementation and data verification:

- Complete, searchable station selection across all four lines.
- Consistent station identity and validation for shared interchanges.
- Destination-aware last-mile options.
- Verified AMTS and BRTS stop locations and distances.
- Reliable estimates for walking time, waiting time, and fares.
- Any future live transport integrations.

These are areas for continued development, not reasons to treat simulated data as live information.

Contributions should preserve the existing architecture, avoid duplicating station identities, and keep verified data separate from demo estimates.

---

## Contributing

Contributions that improve routing correctness, offline reliability, accessibility, test coverage, and transport-data quality are especially valuable.

A good contribution should:

1. Preserve existing functionality.
2. Use the existing station dataset where appropriate.
3. Avoid fabricating transport information.
4. Include tests for changes to routing or data behavior.
5. Keep offline capabilities and limitations explicit.

---

## License

Add the project's chosen license before distributing or reusing the code. Until a license is confirmed in the repository, do not assume that the project is open source under a particular license.

---

**TransitSync — because the journey doesn't end at the metro station.**
