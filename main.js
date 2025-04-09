// cesium-buellton-helioviews last updated 2025-03-27 12:30 
document.addEventListener("DOMContentLoaded", () => {
    // ----- Create Head Elements -----
    const head = document.head;

    // Meta charset
    const meta = document.createElement("meta");
    meta.setAttribute("charset", "utf-8");
    head.appendChild(meta);

    // Title
    const title = document.createElement("title");
    title.textContent = "HelioViews™ Buellton";
    head.appendChild(title);

    // Cesium CSS Link
    const cesiumCss = document.createElement("link");
    cesiumCss.rel = "stylesheet";
    cesiumCss.href =
        "https://cesium.com/downloads/cesiumjs/releases/1.125/Build/Cesium/Widgets/widgets.css";
    head.appendChild(cesiumCss);

    // Custom styles
    const style = document.createElement("style");
    style.textContent = `
      /* Cesium container fills the viewport */
      #cesiumContainer {
          width: 100%;
          height: 100vh;
          margin: 0;
          padding: 0;
          display: block;
      }
      /* Container for all UI controls, arranged in a single row */
      #controlsContainer {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 10;
          background: rgba(185, 232, 254, 0.5);
          padding: 10px;
          border-radius: 4px;
          font-family: sans-serif;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          align-items: flex-start;
          width: auto;
          max-width: 1200px;
      }
      /* Inline logo container */
      #logoContainer {
          width: 150px;
          height: 90px;
          background-color: transparent;
          background-image: url("images/HELIOVIEWS_LOGO_1200x630px.svg");
          background-repeat: no-repeat;
          background-position: center center;
          background-size: contain;
      }
      /* Each control section */
      #controlsContainer > div {
          min-width: 120px;
      }
      /* Analysis panel across bottom */
      #analysisPanel {
          position: absolute;
          bottom: 10px;
          left: 10px;
          right: 10px;
          z-index: 10;
          background: rgba(185, 232, 254, 0.5);
          padding: 10px;
          border-radius: 4px;
          font-family: sans-serif;
          display: flex;
          flex-direction: column;
      }
      /* Container for analysis content */
      #analysisResultsContainer {
          display: flex;
          flex-direction: column;
      }
      /* Top row of metrics and the HelioViews Score */
      #analysisResultsTop {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
      }
      #analysisResultsTop > div {
          white-space: nowrap;
      }
      /* Two-column layout for highlights/cautions */
      #analysisColumns {
          display: flex;
          gap: 2rem;
      }
      .analysis-col {
          flex: 1;
      }
      .highlights-col {
          order: 1;
      }
      .cautions-col {
          order: 2;
      }
      /* Style for disclaimer text */
      .disclaimer {
          color: red;
          font-size: 0.8em;
          margin-top: 10px;
      }
      /* Styling for dropdowns and slider */
      select, input[type="range"] {
          margin: 5px 0;
          padding: 4px;
          width: 120px;
      }
    `;
    head.appendChild(style);

    // ----- Create Body Structure -----
    document.body.innerHTML = `
      <div id="cesiumContainer"></div>
      <div id="controlsContainer">
          <div id="logoContainer"></div>
          <div id="seasonContainer">
              <strong>Select Season:</strong><br />
              <label><input type="radio" name="season" value="Winter"> Winter</label><br />
              <label><input type="radio" name="season" value="Spring" checked> Spring</label><br />
              <label><input type="radio" name="season" value="Summer"> Summer</label><br />
              <label><input type="radio" name="season" value="Fall"> Fall</label><br />
          </div>
          <div id="timeSliderContainer">
              <strong>Sun Hour (PST):</strong> <span id="hourDisplay">12</span><br />
              <input type="range" id="timeSlider" min="8" max="20" step="1" value="12" />
          </div>
          <div id="buildingSelectionContainer">
              <div id="buildingStatusContainer">
                  <strong>Select Building Status:</strong><br />
                  <select id="buildingStatusSelect">
                      <option value="All" selected>All</option>
                      <option value="Conceptual Review">Conceptual Review</option>
                      <option value="Applications in Process">Applications in Process</option>
                      <option value="Approved">Approved</option>
                      <option value="Construction Plans Review">Construction Plans Review</option>
                      <option value="Under Construction">Under Construction</option>
                  </select>
              </div>
              <div id="buildingDropdownContainer">
                  <strong>Select Building:</strong><br />
                  <select id="buildingSelect">
                      <!-- Options populated dynamically -->
                  </select>
              </div>
          </div>
          <div id="orientationContainer">
              <strong>Select Orientation:</strong><br />
              <select id="orientationSelect">
                  <option value="">--- Select Orientation ---</option>
                  <option value="NORTH">NORTH</option>
                  <option value="SOUTH">SOUTH</option>
                  <option value="EAST">EAST</option>
                  <option value="WEST">WEST</option>
                  <option value="BIRDSEYE">BIRDSEYE</option>
              </select>
          </div>
          <div id="buildingLevelContainer">
              <strong>Select Building Level:</strong><br />
              <select id="buildingLevelSelect">
                  <option value="">--- Select a Level ---</option>
                  <option value="Ground">Ground</option>
                  <option value="2nd Story">2nd Story</option>
                  <option value="4th Floor">4th Floor</option>
                  <option value="Birds_Eye">Birds Eye</option>
              </select>
          </div>
          <div id="districtZonesContainer">
              <strong>District Zones:</strong><br />
              <label>
                  <input type="checkbox" id="toggleDistrictZones" checked />
                  Show District Zones
              </label>
          </div>
      </div>
      <div id="analysisPanel">
          <div id="analysisResultsContainer">
              <div id="analysisResults">Loading...</div>
          </div>
          <div class="disclaimer">
              Disclaimer: HelioViews™ leverages real-time data from NREL, OpenWeatherMap, and OpenAI to generate a personalized solar analysis, thus results remain approximate, rely on user inputs, and require additional data points for a professional assessment.
          </div>
      </div>
    `;

    // ----- Load External Cesium Script and Run Main Code -----
    const cesiumScript = document.createElement("script");
    cesiumScript.src =
        "https://cesium.com/downloads/cesiumjs/releases/1.125/Build/Cesium/Cesium.js";
    cesiumScript.onload = () => {
        main();
    };
    head.appendChild(cesiumScript);

    // ----- Main Application Code -----
    async function main() {
        // Define season variables BEFORE they are used.
        const SEASON_DATES = {
            Winter: "2021-01-14",
            Spring: "2021-04-14",
            Summer: "2021-07-14",
            Fall: "2021-10-14",
        };

        let currentSeason = "Spring";
        let currentDateStr = SEASON_DATES[currentSeason];

        // Set Cesium Ion token and fetch API config
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MGM5NmY1Mi00OTcwLTQ2NDctYWYwOC0xNGM3YTFlZmQzZjgiLCJpZCI6MjMwMDE2LCJpYXQiOjE3MzY2MzU1ODZ9.zbfWIKXddKs4vm5an-xtwsli8fxIIEH0m0TA65S9b_k";
        fetch("/api/config")
            .then(response => response.json())
            .then(config => {
                window.NREL_API_KEY = config.NREL_API_KEY;
                window.OPENWEATHER_API_KEY = config.OPENWEATHER_API_KEY;
                updateAnalysisPanel();
            })
            .catch(error => console.error("Error fetching config:", error));

        // 1) Cesium Initialization
        const viewer = new Cesium.Viewer("cesiumContainer", {
            terrain: Cesium.Terrain.fromWorldTerrain(),
            shadows: true,
            timeline: false,
            animation: false,
            geocoder: false,
        });
        viewer.scene.globe.depthTestAgainstTerrain = true;
        viewer.scene.atmosphere.dynamicLighting = Cesium.DynamicAtmosphereLightingType.SUNLIGHT;

        // Adjust the color of the atmosphere effects.
        viewer.scene.atmosphere.hueShift = 0.4;          // Cycle 40% around the color wheel
        viewer.scene.atmosphere.brightnessShift = 0.25;    // Increase the brightness
        viewer.scene.atmosphere.saturationShift = -0.1;    // Desaturate the colors

        // Replace OSM Buildings with Google Photorealistic 3D Tiles
        try {
            const googleTileset = await Cesium.createGooglePhotorealistic3DTileset();
            viewer.scene.primitives.add(googleTileset);
        } catch (error) {
            console.error("Error loading Photorealistic 3D Tiles tileset.", error);
        }

        // Helper: Compute Centroid from an array of [lon, lat, ...]
        function computeCentroid(degreesArray) {
            let sumLon = 0, sumLat = 0;
            const numPoints = degreesArray.length / 2;
            for (let i = 0; i < degreesArray.length; i += 2) {
                sumLon += degreesArray[i];
                sumLat += degreesArray[i + 1];
            }
            return Cesium.Cartesian3.fromDegrees(sumLon / numPoints, sumLat / numPoints);
        }

        // 2) Load the Pea Soup Tileset (PeaSoup ALL)
        const PEA_SOUP_ASSET_ID = 3114933;
        let buildingTileset, buildingBoundingSphere;
        (async () => {
            buildingTileset = await Cesium.Cesium3DTileset.fromIonAssetId(PEA_SOUP_ASSET_ID);
            viewer.scene.primitives.add(buildingTileset);
            await buildingTileset.readyPromise;
            buildingBoundingSphere = Cesium.BoundingSphere.clone(buildingTileset.boundingSphere);
            createBuildingEntities();
            computeCityWideBoundingSphereAndFly();
        })();

        // 3) District Zones Setup
        const districtZones = [];

        // --- District 1, 2, 3 would be defined similarly; here is District 4 as an example:
        // District 1
        const district1Coords = [
            -120.20915, 34.61958,
            -120.20272, 34.61702,
            -120.20168, 34.61879,
            -120.19834, 34.61747,
            -120.19981, 34.61597,
            -120.19561, 34.61412,
            -120.19615, 34.61299,
            -120.19440, 34.61236,
            -120.19364, 34.60684,
            -120.20354, 34.60787,
            -120.21089, 34.61672,
        ];
        const districtZone1 = viewer.entities.add({
            name: "District 1",
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray(district1Coords),
                material: Cesium.Color.LIGHTPINK.withAlpha(0.5),
                clampToGround: true,
            },
            // Place label at computed centroid
            position: computeCentroid(district1Coords),
            label: {
                text: "District 1",
                font: "16pt monospace",
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -9),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
        });
        districtZones.push(districtZone1);

        // District 2
        const district2Coords = [
            -120.19180, 34.61862,
            -120.19331, 34.61630,
            -120.19834, 34.61747,
            -120.20168, 34.61879,
            -120.20272, 34.61702,
            -120.20915, 34.61958,
            -120.20665, 34.62410,
            -120.19287, 34.61991,
            -120.19349, 34.61876,
            -120.19180, 34.61862,
        ];
        const districtZone2 = viewer.entities.add({
            name: "District 2",
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray(district2Coords),
                material: Cesium.Color.LIGHTSKYBLUE.withAlpha(0.5),
                clampToGround: true,
            },
            position: computeCentroid(district2Coords),
            label: {
                text: "District 2",
                font: "16pt monospace",
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -9),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
        });
        districtZones.push(districtZone2);

        // District 3
        const district3Coords = [
            -120.19005, 34.62027,
            -120.19021, 34.61841,
            -120.19026, 34.61843,
            -120.19026, 34.60981,
            -120.19379, 34.60795,
            -120.19440, 34.61236,
            -120.19615, 34.61299,
            -120.19561, 34.61412,
            -120.19981, 34.61597,
            -120.19834, 34.61747,
            -120.19331, 34.61630,
            -120.19180, 34.61862,
        ];
        const districtZone3 = viewer.entities.add({
            name: "District 3",
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray(district3Coords),
                material: Cesium.Color.LIGHTGREEN.withAlpha(0.5),
                clampToGround: true,
            },
            position: computeCentroid(district3Coords),
            label: {
                text: "District 3",
                font: "16pt monospace",
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -9),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
        });
        districtZones.push(districtZone3);

        // District 4
        const district4Coords = [
            -120.18363, 34.62594,
            -120.18757, 34.61599,
            -120.17665, 34.61197,
            -120.18057, 34.60654,
            -120.19075, 34.60703,
            -120.19026, 34.60981,
            -120.19026, 34.61843,
            -120.19021, 34.61841,
            -120.19005, 34.62027,
            -120.19180, 34.61862,
            -120.19349, 34.61876,
            -120.19158, 34.62137,
            -120.19134, 34.63363,
        ];
        const districtZone4 = viewer.entities.add({
            name: "District 4",
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray(district4Coords),
                material: Cesium.Color.PLUM.withAlpha(0.5),
                clampToGround: true,
            },
            position: computeCentroid(district4Coords),
            label: {
                text: "District 4",
                font: "16pt monospace",
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -9),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
        });
        districtZones.push(districtZone4);

        function setDistrictZonesVisible(visible) {
            districtZones.forEach(zone => {
                zone.show = visible;
            });
        }

        // Since we statically included the districtZonesContainer in our HTML,
        // attach an event listener to its checkbox.
        const districtsCheckbox = document.getElementById("toggleDistrictZones");
        if (districtsCheckbox) {
            districtsCheckbox.addEventListener("change", function () {
                setDistrictZonesVisible(this.checked);
            });
        }

        // 4) Season & Time Setup
        function setClockBoundsForDate(dateStr) {
            const start = new Date(`${dateStr}T08:00:00-08:00`);
            const stop = new Date(`${dateStr}T20:00:00-08:00`);
            const startJulian = Cesium.JulianDate.fromDate(start);
            const stopJulian = Cesium.JulianDate.fromDate(stop);
            viewer.clock.startTime = startJulian.clone();
            viewer.clock.stopTime = stopJulian.clone();
            viewer.clock.currentTime = startJulian.clone();
            viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
            viewer.clock.shouldAnimate = false;
        }
        function setClockToPST(dateStr, hourPST) {
            const dateString = `${dateStr}T${hourPST.toString().padStart(2, "0")}:00:00-08:00`;
            const newDate = new Date(dateString);
            viewer.clock.currentTime = Cesium.JulianDate.fromDate(newDate);
        }

        // 5) Building Level & Orientation Setup
        const LEVEL_ALTITUDES_FEET = {
            "Ground": 0,
            "2nd Story": 27.0833,
            "4th Floor": 52.25,
            "Birds_Eye": 100,
        };
        function feetToMeters(ft) {
            return ft * 0.3048;
        }
        const ORIENTATION_HEADING = {
            "NORTH": Cesium.Math.toRadians(0),
            "SOUTH": Cesium.Math.toRadians(180),
            "EAST": Cesium.Math.toRadians(90),
            "WEST": Cesium.Math.toRadians(270),
            "BIRDSEYE": Cesium.Math.toRadians(0),
        };
        async function flyToOrientationAndLevel() {
            const orientation = orientationSelect.value;
            const heading = ORIENTATION_HEADING[orientation] || 0;
            let pitch = (orientation === "BIRDSEYE") ? Cesium.Math.toRadians(-90) : 0;
            const buildingLevel = buildingLevelSelect.value;
            const levelFeet = LEVEL_ALTITUDES_FEET[buildingLevel] || 0;
            const levelMeters = feetToMeters(levelFeet);
            let sphere, range;
            const selectedName = buildingSelect.value;
            const b = buildings.find(x => x.name === selectedName);
            if (b && !b.isTileset) {
                let pos = Cesium.Cartesian3.fromDegrees(b.coordinates.lon, b.coordinates.lat, 0);
                let carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pos);
                carto.height += levelMeters;
                pos = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);
                let radius = 50;
                if (b.dimensions) {
                    const diag = Cesium.Cartesian3.magnitude(b.dimensions);
                    radius = diag / 2;
                }
                sphere = new Cesium.BoundingSphere(pos, radius);
                range = radius * 3;
            } else {
                if (!buildingBoundingSphere) return;
                sphere = Cesium.BoundingSphere.clone(buildingBoundingSphere);
                const cartoCenter = Cesium.Ellipsoid.WGS84.cartesianToCartographic(sphere.center);
                cartoCenter.height += levelMeters;
                sphere.center = Cesium.Ellipsoid.WGS84.cartographicToCartesian(cartoCenter);
                range = sphere.radius * 1.4;
            }
            viewer.camera.flyToBoundingSphere(sphere, {
                offset: new Cesium.HeadingPitchRange(heading, pitch, range),
                duration: 2,
            });
        }

        // 6) Shading & Multipliers Setup
        const LEVEL_MULTIPLIERS = {
            "Ground": 1.0,
            "2nd Story": 1.05,
            "4th Floor": 1.10,
            "Birds_Eye": 1.20,
        };
        const LEVEL_ELEVATIONS = {
            "Ground": "3 ft",
            "2nd Story": "27 ft, 1 in",
            "4th Floor": "52 ft, 3 in",
            "Birds_Eye": "N/A",
        };
        const LEVEL_SHADE_MAPPING = {
            "Birds_Eye": "NONE",
            "4th Floor": "LIGHT",
            "2nd Story": "MEDIUM",
            "Ground": "HEAVY",
        };
        const SHADING_ADJUSTMENTS = {
            "NONE": 1.0,
            "LIGHT": 0.90,
            "MEDIUM": 0.80,
            "HEAVY": 0.50,
        };

        // 7) NREL + OpenWeatherMap Data
        async function fetchAnalysisData(season, hour, orientation) {
            const lat = 34.61346;
            const lon = -120.1918;
            const nrelUrl = `https://developer.nrel.gov/api/pvwatts/v6.json?api_key=${window.NREL_API_KEY}&lat=${lat}&lon=${lon}&system_capacity=4&azimuth=180&tilt=20&array_type=1&module_type=1&losses=10`;
            let nrelData;
            try {
                const nrelResponse = await fetch(nrelUrl);
                if (!nrelResponse.ok) {
                    console.error("NREL API request failed", nrelResponse.statusText);
                    return null;
                }
                nrelData = await nrelResponse.json();
            } catch (err) {
                console.error("Error fetching NREL data:", err);
                return null;
            }
            let monthIndex;
            switch (season) {
                case "Winter": monthIndex = 0; break;
                case "Spring": monthIndex = 3; break;
                case "Summer": monthIndex = 6; break;
                case "Fall": monthIndex = 9; break;
                default: monthIndex = 0;
            }
            const monthlyKwh = nrelData.outputs?.ac_monthly ? nrelData.outputs.ac_monthly[monthIndex] : 120;
            const solrad = nrelData.outputs?.solrad || 5.5;
            const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${window.OPENWEATHER_API_KEY}&units=metric`;
            let weatherData;
            try {
                const weatherResponse = await fetch(openWeatherUrl);
                if (!weatherResponse.ok) {
                    console.error("OpenWeatherMap API request failed", weatherResponse.statusText);
                    return null;
                }
                weatherData = await weatherResponse.json();
            } catch (err) {
                console.error("Error fetching OpenWeatherMap data:", err);
                return null;
            }
            const temperature = weatherData.main?.temp ?? 20;
            let climate = "MILD";
            if (temperature > 25) climate = "HOT";
            else if (temperature < 15) climate = "COLD";
            const energyCost = 0.1990;
            return { monthlyKwh, solrad, climate, energyCost };
        }

        // 8) LLM + Analysis Panel
        async function generateLLMText(prompt) {
            try {
                const response = await fetch("/api/generateLLMText", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt }),
                });
                const data = await response.json();
                if (data.text) {
                    return data.text;
                } else {
                    console.error("No choices returned from backend:", data);
                    return "No response from LLM.";
                }
            } catch (err) {
                console.error("LLM API error on client:", err);
                return "Error generating text.";
            }
        }

        async function updateAnalysisPanel() {
            const season = currentSeason;
            const hour = parseInt(timeSlider.value, 10);
            const orientation = orientationSelect.value;
            const buildingLevel = buildingLevelSelect.value;
            const shading = LEVEL_SHADE_MAPPING[buildingLevel];
            const levelElevation = LEVEL_ELEVATIONS[buildingLevel] || "";
            setClockBoundsForDate(currentDateStr);
            setClockToPST(currentDateStr, hour);
            hourDisplay.textContent = hour;
            const data = await fetchAnalysisData(season, hour, orientation);
            if (!data) return;
            let { solrad, climate, energyCost, monthlyKwh } = data;
            solrad *= SHADING_ADJUSTMENTS[shading] * LEVEL_MULTIPLIERS[buildingLevel];
            const helioViewsScore = solrad * 2;
            let address;
            if (buildingStatusSelect.value === "All" || buildingSelect.value === "") {
                address = "Buellton, CA (lat: 34.61346, lon: -120.1918)";
            } else {
                const selectedBuilding = buildings.find(b => b.name === buildingSelect.value);
                if (selectedBuilding) {
                    address = `${selectedBuilding.name} (lat: ${selectedBuilding.coordinates.lat}, lon: ${selectedBuilding.coordinates.lon})`;
                } else {
                    address = "Buellton, CA (lat: 34.61346, lon: -120.1918)";
                }
            }
            const summaryPrompt = `
PROPERTY DETAILS:
• Address: ${address}
• Orientation: ${orientation}
• Season: ${season}
• Time: ${hour}:00 PST
• Building Level: ${buildingLevel} (Elevation: ${levelElevation})
• Shade: ${shading}
• Climate: ${climate}
• Energy Cost: ${energyCost} USD/kWh
• Solar Potential: ${solrad.toFixed(2)} kWh/m²/day
• Est. HelioViews Score: ${helioViewsScore.toFixed(1)}

TASK:
1. Provide a "City Planner’s Highlights" section that outlines the key strengths of this property’s solar and permaculture potential.
2. Provide a "City Planner’s Cautions" section that identifies potential concerns or areas for further study.

Final Output Format:
<h3>Highlights</h3>
<ul>
  <li>Bullet points…</li>
</ul>
<h3>Cautions</h3>
<ul>
  <li>Bullet points…</li>
</ul>
            `;
            const llmText = await generateLLMText(summaryPrompt) || "";
            const highlightsRegex = /<h3>Highlights<\/h3>[\s\S]*?(?=<h3>Cautions<\/h3>)/;
            const cautionsRegex = /<h3>Cautions<\/h3>[\s\S]*/;
            let highlightsHTML = "";
            let cautionsHTML = "";
            const highlightsMatch = llmText.match(highlightsRegex);
            const cautionsMatch = llmText.match(cautionsRegex);
            if (highlightsMatch) highlightsHTML = highlightsMatch[0].trim();
            if (cautionsMatch) cautionsHTML = cautionsMatch[0].trim();
            analysisResults.innerHTML = `
      <div id="analysisResultsTop">
        <h3>Est. HelioViews Score: <b>${helioViewsScore.toFixed(1)}</b></h3>
        <div><strong>Base Solar Potential:</strong> ${solrad.toFixed(2)} kWh/m²/day</div>
        <div><strong>Climate Adjustment:</strong> ${climate}</div>
        <div><strong>Shade:</strong> ${shading}</div>
        <div><strong>Elevation Height:</strong> ${levelElevation}</div>
      </div>
      <div id="analysisColumns">
        <div class="analysis-col highlights-col">
          ${highlightsHTML}
        </div>
        <div class="analysis-col cautions-col">
          ${cautionsHTML}
        </div>
      </div>
            `;
        }

        // 9) Event Listeners for Existing Controls
        const seasonRadios = document.querySelectorAll('input[name="season"]');
        seasonRadios.forEach(radio => {
            radio.addEventListener("change", (e) => {
                if (e.target.checked) {
                    currentSeason = e.target.value;
                    currentDateStr = SEASON_DATES[currentSeason];
                    updateAnalysisPanel();
                }
            });
        });
        timeSlider.addEventListener("input", updateAnalysisPanel);
        orientationSelect.addEventListener("change", async () => {
            if (buildingSelect.value !== "") {
                await flyToOrientationAndLevel();
            }
            updateAnalysisPanel();
        });
        buildingLevelSelect.addEventListener("change", async () => {
            if (buildingSelect.value !== "") {
                await flyToOrientationAndLevel();
            }
            updateAnalysisPanel();
        });

        // 10) Building Array & Dropdown 
        const buildings = [
            {
                name: "PeaSoup",
                status: "Conceptual Review",
                color: "#0047AB",
                isTileset: true,
                coordinates: { lon: -120.1918, lat: 34.61346 },
            },
            {
                name: "Hwy 246 Commercial Center",
                status: "Applications in Process",
                color: "#FFD700",
                dimensions: new Cesium.Cartesian3(30, 30, 12),
                coordinates: { lon: -120.19338, lat: 34.613114 },
            },
            {
                name: "Arco AM-PM Gas Station",
                status: "Applications in Process",
                color: "#FFD700",
                dimensions: new Cesium.Cartesian3(26, 26, 4),
                coordinates: { lon: -120.19042, lat: 34.61970 },
            },
            {
                name: "BUE-17 Specific Plan (Campus 36)",
                status: "Applications in Process",
                color: "#FFD700",
                dimensions: new Cesium.Cartesian3(64, 64, 12),
                coordinates: { lon: -120.20182, lat: 34.60883 },
            },
            {
                name: "The 518",
                status: "Approved",
                color: "#50C878",
                dimensions: new Cesium.Cartesian3(27, 27, 12),
                coordinates: { lon: -120.19137, lat: 34.615883 },
            },
            {
                name: "Creekside Village",
                status: "Approved",
                color: "#50C878",
                dimensions: new Cesium.Cartesian3(23, 23, 12),
                coordinates: { lon: -120.19167, lat: 34.61513 },
            },
            {
                name: "Pacific Flips Gymnastics",
                status: "Construction Plans Review",
                color: "#DC143C",
                dimensions: new Cesium.Cartesian3(26, 26, 4),
                coordinates: { lon: -120.1970, lat: 34.61300 },
            },
            {
                name: "Chanin Wine Company",
                status: "Construction Plans Review",
                color: "#DC143C",
                dimensions: new Cesium.Cartesian3(12, 12, 8),
                coordinates: { lon: -120.1993, lat: 34.61521 },
            },
            {
                name: "Buellton Hub",
                status: "Construction Plans Review",
                color: "#DC143C",
                dimensions: new Cesium.Cartesian3(85, 85, 12),
                coordinates: { lon: -120.20334, lat: 34.60857 },
            },
            {
                name: "Central Ave Duplexes & ADUs",
                status: "Construction Plans Review",
                color: "#DC143C",
                dimensions: new Cesium.Cartesian3(13, 13, 4),
                coordinates: { lon: -120.19349, lat: 34.61542 },
            },
            {
                name: "The Waypoint (Live Oaks Bowling)",
                status: "Construction Plans Review",
                color: "#DC143C",
                dimensions: new Cesium.Cartesian3(61, 61, 17),
                coordinates: { lon: -120.1879, lat: 34.60831 },
            },
            {
                name: "Village Senior Apartments",
                status: "Under Construction",
                color: "#FFA500",
                dimensions: new Cesium.Cartesian3(10, 10, 8),
                coordinates: { lon: -120.18667, lat: 34.612887 },
            },
            {
                name: "Polo Village",
                status: "Under Construction",
                color: "#FFA500",
                dimensions: new Cesium.Cartesian3(28, 28, 12),
                coordinates: { lon: -120.18292, lat: 34.61510 },
            },
            {
                name: "Buellton Garden Apartments",
                status: "Under Construction",
                color: "#FFA500",
                dimensions: new Cesium.Cartesian3(26, 26, 12),
                coordinates: { lon: -120.18949, lat: 34.60897 },
            },
        ];

        const buildingStatusSelect = document.getElementById("buildingStatusSelect");
        const buildingSelect = document.getElementById("buildingSelect");

        function updateBuildingDropdown() {
            const status = buildingStatusSelect.value;
            buildingSelect.innerHTML = "";
            const blankOption = document.createElement("option");
            blankOption.value = "";
            blankOption.textContent = "--- Select a Building ---";
            buildingSelect.appendChild(blankOption);
            const filtered = status === "All" ? buildings : buildings.filter(b => b.status === status);
            filtered.forEach(b => {
                const opt = document.createElement("option");
                opt.value = b.name;
                opt.textContent = b.name;
                buildingSelect.appendChild(opt);
            });
        }

        function flyToSelectedBuilding() {
            const selectedName = buildingSelect.value;
            const b = buildings.find(x => x.name === selectedName);
            if (!b) return;
            let orientationValue = orientationSelect.value;
            let heading = 0;
            if (orientationValue && ORIENTATION_HEADING.hasOwnProperty(orientationValue)) {
                heading = ORIENTATION_HEADING[orientationValue];
            }
            let pitch = Cesium.Math.toRadians(-15);
            if (orientationValue === "BIRDSEYE") {
                pitch = Cesium.Math.toRadians(-90);
            }
            if (b.isTileset) {
                if (buildingBoundingSphere) {
                    const rangeFactor = 1.4;
                    const range = buildingBoundingSphere.radius * rangeFactor;
                    viewer.camera.flyToBoundingSphere(buildingBoundingSphere, {
                        offset: new Cesium.HeadingPitchRange(heading, pitch, range),
                        duration: 2,
                    });
                }
            } else {
                const position = Cesium.Cartesian3.fromDegrees(b.coordinates.lon, b.coordinates.lat, 0);
                let radius = 50;
                if (b.dimensions) {
                    const diag = Cesium.Cartesian3.magnitude(b.dimensions);
                    radius = diag / 2;
                }
                const sphere = new Cesium.BoundingSphere(position, radius);
                viewer.camera.flyToBoundingSphere(sphere, {
                    duration: 2,
                    offset: new Cesium.HeadingPitchRange(heading, pitch, radius * 3),
                });
            }
        }

        buildingStatusSelect.addEventListener("change", updateBuildingDropdown);
        buildingSelect.addEventListener("change", () => {
            if (buildingSelect.value !== "") {
                flyToSelectedBuilding();
            }
        });
        updateBuildingDropdown();

        function createBuildingEntities() {
            buildings.forEach(b => {
                if (b.isTileset) return;
                const position = Cesium.Cartesian3.fromDegrees(b.coordinates.lon, b.coordinates.lat);
                const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(25), 0, 0);
                const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
                viewer.entities.add({
                    name: b.name,
                    position: position,
                    orientation: orientation,
                    box: {
                        dimensions: b.dimensions,
                        material: Cesium.Color.fromCssColorString(b.color),
                        fill: true,
                        outline: true,
                        outlineColor: Cesium.Color.BLACK,
                        shadows: Cesium.ShadowMode.ENABLED,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    },
                });
            });
        }

        function computeCityWideBoundingSphereAndFly() {
            let cityBoundingSphere;
            if (buildingBoundingSphere) {
                cityBoundingSphere = buildingBoundingSphere.clone();
            }
            buildings.forEach(b => {
                if (b.isTileset) return;
                if (!b.dimensions) return;
                const pos = Cesium.Cartesian3.fromDegrees(b.coordinates.lon, b.coordinates.lat, 0);
                const diag = Cesium.Cartesian3.magnitude(b.dimensions);
                const sphere = new Cesium.BoundingSphere(pos, diag / 2);
                if (!cityBoundingSphere) {
                    cityBoundingSphere = sphere;
                } else {
                    cityBoundingSphere = Cesium.BoundingSphere.union(cityBoundingSphere, sphere, new Cesium.BoundingSphere());
                }
            });
            if (cityBoundingSphere) {
                viewer.camera.flyToBoundingSphere(cityBoundingSphere, {
                    offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90), cityBoundingSphere.radius * 2),
                    duration: 2,
                });
            }
        }

        setClockBoundsForDate(currentDateStr);
        setClockToPST(currentDateStr, parseInt(timeSlider.value, 10));
        updateAnalysisPanel();
    }
});
