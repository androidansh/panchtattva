# PanchTattva

## Geospatial Visualization and Analysis of Geo-Coded Images for Enhancing Watershed Development Outcomes

PanchTattva is a proposed GIS and remote-sensing based platform for watershed planning, monitoring, visualization, intervention assessment, and evidence-based decision support.

The project is developed for **Smart India Hackathon 2026 – Problem Statement 26015** and focuses on integrating geo-coded field images with satellite/GIS datasets to improve the interpretation and assessment of watershed development activities.

---

## SIH Problem Statement

**Problem Statement ID:** 26015  
**Problem Statement:** Application of Geospatial Techniques for Visualization and Analysis to Interpret Geo-Coded Images to Enhance Watershed Development Outcomes  
**Theme:** Agriculture, FoodTech & Rural Development  
**Category:** Software  
**Team:** PanchTattva

The project context, expected outcomes, and technical approach are based on the team's SIH presentation. fileciteturn1file1L144-L181

---

## Project Links

- **Live Deployment:** https://panchtattva-frontend-u9vy.onrender.com/

The deployed URL and repository URL are listed in the SIH project presentation. fileciteturn1file0L118-L134

---

## Problem

Watershed development requires continuous understanding of terrain, drainage, land use, vegetation, water resources, and implemented conservation measures.

Traditional monitoring can be difficult because:

- Field surveys and manual reporting are time-consuming.
- Geo-coded photographs are often treated mainly as documentation.
- Satellite data, GIS layers, field photographs, and watershed boundaries may exist separately.
- Spatial changes over time are difficult to interpret without an integrated workflow.
- Officials and planners need location-specific evidence to evaluate watershed conditions and interventions.

---

## Proposed Solution

PanchTattva brings field evidence and geospatial information into a single watershed-oriented workflow.

```text
Geo-Coded Images
       +
Satellite / SRISHTI-DRISHTI Data
       +
GIS & Thematic Layers
       ↓
Data Validation
       ↓
Spatial Analysis
       ↓
Watershed Prioritization
       ↓
Intervention Planning
       ↓
2D + 3D Visualization
       ↓
Change / Impact Assessment
       ↓
Evidence-Based Report
```

The SIH presentation describes the core concept as an integrated platform combining satellite, DEM, land-use data, watershed prioritization, intervention planning, and interactive 2D/3D visualization. fileciteturn1file1L166-L181

---

## Key Features

### 1. Geo-Coded Image Integration

Field photographs can be associated with geographic coordinates and watershed/intervention information.

This allows a photograph to be viewed together with its spatial context instead of being stored only as standalone documentation.

### 2. Satellite and GIS Data Integration

The platform is designed to work with relevant geospatial datasets such as:

- DEM / terrain
- Water bodies
- Land use / land cover
- Vegetation
- Drainage
- Watershed boundaries
- Other permitted thematic datasets

The SIH technical approach specifically identifies DEM/terrain, water bodies, land cover/vegetation, and related spatial datasets as inputs. fileciteturn1file0L10-L18

### 3. Watershed Prioritization

The system can identify areas that deserve higher attention based on selected environmental and terrain factors.

Potential factors include:

- Slope
- Drainage characteristics
- Land use / land cover
- Vegetation
- Water availability
- Erosion-related indicators

### 4. Watershed Intervention Planning

The platform can support identification of suitable locations for watershed interventions, subject to available data and domain rules.

Examples:

- Check dams
- Farm ponds
- Water harvesting structures
- Gully plugs
- Soil and water conservation measures

### 5. Thematic Mapping

Users can visualize multiple spatial layers on an interactive map.

Examples:

- Watershed boundary
- Drainage
- Land use / land cover
- Vegetation
- Water bodies
- Terrain
- Intervention locations
- Geo-coded photographs

### 6. 2D Visualization

The 2D interface provides a map-based view of watershed information and allows different spatial layers to be switched on/off and compared.

### 7. 3D Visualization

The 3D interface is intended to show terrain and watershed features in a more intuitive spatial context.

Possible elements include:

- Terrain/elevation
- Drainage
- Water bodies
- Intervention locations
- Watershed boundaries
- Satellite imagery

### 8. Change Detection

Multi-date geospatial information can be compared to identify changes such as:

- Vegetation change
- Water-body extent
- Land-use / land-cover change
- Changes around intervention areas

### 9. Evidence-Based Reporting

The platform is designed to combine spatial observations and field evidence into a structured watershed assessment.

Potential report outputs include:

- Watershed overview
- Thematic maps
- Geo-coded field evidence
- Intervention inventory
- Spatial change indicators
- 2D/3D visualizations
- Key observations
- Supporting statistics

---

## System Architecture

```text
┌────────────────────────────────────────────────────────────┐
│                       DATA SOURCES                         │
│                                                            │
│ Geo-Coded Images | Satellite Data | GIS Layers | DEM       │
│ Government Data  | Other Permitted Geospatial Sources      │
└────────────────────────────┬───────────────────────────────┘
                             ↓
┌────────────────────────────────────────────────────────────┐
│                    DATA INGESTION                          │
│                                                            │
│ Upload → Validation → Metadata → Geo-Tagging → Processing  │
└────────────────────────────┬───────────────────────────────┘
                             ↓
┌────────────────────────────────────────────────────────────┐
│                    DATA STORAGE                            │
│                                                            │
│ Spatial Database | Image Storage | Metadata | GIS Layers   │
└────────────────────────────┬───────────────────────────────┘
                             ↓
┌────────────────────────────────────────────────────────────┐
│                 GEOSPATIAL ANALYTICS                       │
│                                                            │
│ Spatial Analysis | Prioritization | Change Detection       │
│ Intervention Planning | Image/Feature Interpretation       │
└────────────────────────────┬───────────────────────────────┘
                             ↓
┌────────────────────────────────────────────────────────────┐
│                    APPLICATION                             │
│                                                            │
│ Dashboard | 2D Maps | 3D Terrain | Charts | Reports        │
└────────────────────────────┬───────────────────────────────┘
                             ↓
┌────────────────────────────────────────────────────────────┐
│                       USERS                                │
│                                                            │
│ Government | Field Officers | Researchers | Communities    │
└────────────────────────────────────────────────────────────┘
```

---

## Technical Stack

The current SIH presentation specifies the following core approach:

### Frontend

- **React**
- Interactive 2D geospatial visualization
- Interactive 3D geospatial visualization

### Mapping

- **Leaflet** for interactive 2D maps
- **Cesium** for 3D terrain/globe visualization

### Backend

- **FastAPI**
- APIs for processing requests
- Spatial analysis
- Serving processed results

### Geospatial Processing

Potential supporting technologies:

- GDAL
- Rasterio
- GeoPandas
- Shapely
- PostGIS
- QGIS
- Google Earth Engine where permitted and appropriate

The team's SIH presentation identifies React, Leaflet, Cesium, FastAPI, and the geospatial workflow from location input through analysis and intervention identification. fileciteturn1file0L10-L18

---

## Data Flow

```text
1. Select watershed / location
             ↓
2. Obtain satellite and GIS layers
             ↓
3. Collect / load geo-coded images
             ↓
4. Validate spatial metadata
             ↓
5. Prepare thematic datasets
             ↓
6. Perform watershed analysis
             ↓
7. Prioritize areas
             ↓
8. Identify suitable interventions
             ↓
9. Visualize in 2D and 3D
             ↓
10. Generate assessment and report
```

This follows the workflow described in the SIH presentation: input location → obtain geospatial layers → watershed analysis → identify suitable interventions → visualize results. fileciteturn1file1L185-L193

---

## Expected Benefits

- Faster watershed monitoring
- Evidence-based decision making
- Better intervention tracking
- Integrated geo-coded image and satellite/GIS analysis
- Interactive 2D and 3D watershed visualization
- Spatial and temporal change assessment
- More structured watershed reporting
- Scalable workflow for different regions

The SIH presentation specifically identifies faster monitoring, evidence-based decisions, intervention tracking, 2D/3D visualization, and change/impact assessment as target benefits. fileciteturn1file0L80-L96

---

## Differentiation

PanchTattva should not be presented as a replacement for Bhuvan, NRSC resources, Google Earth Engine, QGIS, or other existing geospatial platforms.

The differentiation is the **watershed-focused integration workflow**:

```text
Field Evidence
      +
Satellite Observation
      +
GIS / Terrain Context
      +
Watershed Analysis
      +
Intervention Planning
      +
Temporal Comparison
      ↓
Integrated Watershed Assessment
```

The goal is to connect existing geospatial capabilities into a workflow focused specifically on watershed monitoring and development decisions.

---

# Research Foundation

The project is supported by research showing that GIS and remote sensing can be used for watershed prioritization, land-use/land-cover analysis, change detection, and natural-resource planning.

## 1. Watershed Prioritization Using Remote Sensing and GIS

**Khan, M.A., Gupta, V.P., & Moharana, P.C. (2001).**  
*Watershed prioritization using remote sensing and geographical information system: A case study from Guhiya, India.*  
Journal of Arid Environments, 49(3), 465–475.  
DOI: 10.1006/jare.2001.0797

The study used terrain information, satellite data, thematic maps, GIS, and sediment-yield indicators to classify watersheds according to priority for soil and water conservation. citeturn0search1

**Relevance to PanchTattva:** supports the use of GIS/remote sensing for watershed prioritization and intervention planning.

Reference: https://doi.org/10.1006/jare.2001.0797

---

## 2. Land Use / Land Cover Change Detection in Murredu Watershed

**Shekar, P.R. & Mathew, A. (2023).**  
*Detection of land use/land cover changes in a watershed: A case study of the Murredu watershed in Telangana state, India.*  
Watershed Ecology and the Environment, 5, 46–55.  
DOI: 10.1016/j.wsee.2022.12.003

The research applied GIS and remote sensing to map and compare land-use/land-cover conditions between 1996 and 2019. It demonstrates how multi-date satellite information can be used for watershed change analysis. citeturn0search0turn0search9

**Relevance to PanchTattva:** supports the project's change-detection and temporal watershed assessment component.

Reference: https://doi.org/10.1016/j.wsee.2022.12.003

---

# Data and Platform References

## 3. Bhuvan — ISRO / NRSC

Bhuvan is the Indian Geo Platform of ISRO and provides access to Indian Earth observation-related geospatial content, including imagery, map/terrain information, administrative boundaries, soils and other datasets. Its services can also provide thematic datasets through geospatial web services where permitted. citeturn1search10turn1search17

Official source:

https://bhuvan.nrsc.gov.in/

**Important:** Bhuvan data is subject to its terms of service and applicable ownership/licensing restrictions. citeturn1search13

---

## 4. NRSC / ISRO — River Basin Atlas of India

The River Basin Atlas of India was prepared through a joint project involving the Central Water Commission and ISRO and provides basin-level information for major river basins in India. citeturn1search0

Official source:

https://www.nrsc.gov.in/nrscnew/resources_atlas.php?lang_code=en

---

## 5. NRSC / ISRO — Land Use and Land Cover Atlas

NRSC has conducted annual land-use/land-cover assessment for India under the Natural Resources Census programme since 2005. The atlas contains multi-temporal LULC information and associated statistics. citeturn1search1

Official source:

https://www.nrsc.gov.in/nrscnew/resources_atlas_LULC.php

---

## 6. ICRISAT — Geospatial and Big Data Sciences

ICRISAT's Geospatial and Big Data Sciences work demonstrates the application of remote sensing, GPS, GIS, and spatial/non-spatial data integration for agricultural and natural-resource decision making. citeturn0search8turn0search13

Official source:

https://www.icrisat.org/research/geo-spatial-and-big-data-sciences/about

---

## 7. Google Earth Engine

Google Earth Engine provides large-scale geospatial processing and access to a large catalog of satellite imagery and geospatial datasets. It can be useful for large-scale change detection and spatial analysis where its use and licensing conditions are appropriate. citeturn0search6turn0search15

Official source:

https://earthengine.google.com/

---

## 8. QGIS 3D Map View

QGIS provides native 3D map visualization, terrain rendering, 3D vector layers, navigation, measurement, and related capabilities. citeturn0search4

Official documentation:

https://docs.qgis.org/4.2/en/docs/user_manual/map_views/3d_map_view.html

---

# SRISHTI-DRISHTI

The SIH problem statement identifies the SRISHTI-DRISHTI platform as a source of satellite-based spatial information relevant to the proposed watershed analysis.

PanchTattva is designed to integrate the permitted data/services made available through the platform into the broader watershed analysis workflow.

**Data availability, API access, formats, resolution, authentication, and usage permissions should be verified against the official SRISHTI-DRISHTI interface before production deployment.**

---

# Project Modules

```text
Module 1  → User / Access Management
Module 2  → Watershed Selection
Module 3  → Geo-Coded Image Management
Module 4  → Satellite / GIS Data Integration
Module 5  → Thematic Layer Management
Module 6  → Watershed Prioritization
Module 7  → Intervention Planning
Module 8  → Spatial & Temporal Analysis
Module 9  → 2D / 3D Visualization
Module 10 → Assessment & Reporting
```

---

# Development Roadmap

### Phase 1 — Data Foundation

- Define watershed data model
- Integrate available geospatial datasets
- Set up spatial database
- Implement geo-coded image storage
- Validate spatial metadata

### Phase 2 — GIS Platform

- Watershed boundary visualization
- Satellite layer integration
- Thematic layer visualization
- Geo-coded image markers
- Intervention mapping

### Phase 3 — Analysis

- Spatial analysis
- Watershed prioritization
- Temporal comparison
- Change detection
- Basic indicators and statistics

### Phase 4 — Visualization

- Interactive 2D maps
- 3D terrain visualization
- Charts and dashboards
- Image-to-map interaction

### Phase 5 — Assessment

- Evidence aggregation
- Watershed assessment dashboard
- Report generation
- Exportable maps and reports

### Phase 6 — Advanced Extensions

- AI-assisted image interpretation
- Automated intervention identification
- Predictive watershed indicators
- Mobile/offline field collection
- Automated anomaly detection

---

# Implementation Status and Scope

PanchTattva contains both implemented/prototype functionality and proposed capabilities.

The repository should clearly distinguish:

- **Implemented:** functionality currently working in the deployed prototype.
- **Prototype:** functionality demonstrated but still under refinement.
- **Planned:** capabilities intended for future development.

In particular:

- Automatic image interpretation requires a suitable computer-vision model and validated training data.
- Change detection requires comparable multi-date datasets.
- SRISHTI-DRISHTI integration depends on officially available interfaces and permissions.
- 3D visualization requires suitable elevation/terrain data.
- Intervention recommendations should be treated as decision support, not as an automatic replacement for field engineering assessment.

---

# Team

**PanchTattva**

Smart India Hackathon 2026

---

# License

Add the project's selected open-source or proprietary license here when the repository is finalized.

---

# Acknowledgements

- Smart India Hackathon
- ISRO / NRSC
- SRISHTI-DRISHTI platform
- Bhuvan
- Central Water Commission
- ICRISAT
- Google Earth Engine
- QGIS
- Researchers and institutions whose work informed the watershed GIS/remote-sensing methodology
