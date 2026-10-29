<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0D1117,50:1F6FEB,100:58A6FF&height=140&section=header" width="100%" />

# Kush Agarwal

<h2>I build backend systems that scale horizontally.</h2>

<b>Redis Streams &nbsp;·&nbsp; FastAPI &nbsp;·&nbsp; PostgreSQL &nbsp;·&nbsp; Docker &nbsp;·&nbsp; AWS</b>

540+ DSA problems &nbsp;·&nbsp; LeetCode Knight (1938) &nbsp;·&nbsp; Open to Software Engineering internships

<br/>

<a href="https://www.linkedin.com/in/kushagarwal0805/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
<a href="https://leetcode.com/u/kush0809/"><img src="https://img.shields.io/badge/LeetCode_Knight_1938-FFA116?style=for-the-badge&logo=leetcode&logoColor=black" alt="LeetCode" /></a>
<a href="https://portfolio-seven-topaz-6oy3w9tofj.vercel.app/"><img src="https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio" /></a>
<a href="mailto:kushagarwal0805@gmail.com"><img src="https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>

<img src="https://komarev.com/ghpvc/?username=MARCIZOS&label=Profile%20views&color=58A6FF&style=flat-square" alt="Profile views" />

</div>

---

## About me

```python
class KushAgarwal:
    role       = "Backend Engineer (in training)"
    education  = "B.Tech CSE (AI) @ NIET Noida  ·  2023–2027  ·  CGPA 8.66"
    focus      = ["distributed systems", "REST API design", "data pipelines"]
    stack      = ["Python", "FastAPI", "Redis", "PostgreSQL", "Docker", "AWS"]
    dsa        = {"solved": "540+", "rank": "Knight", "rating": 1938}
    currently  = "Looking for a Software Engineering internship"
```

- Won the **Grand Prize at Contata NCR Hackathon 2026** for a DAG scheduling engine that propagates a schedule slip through 1,000 tasks in **under 1 ms**, at 94% test coverage across 600 property-based graph cases
- Engineered a **Redis Streams** log-ingestion pipeline that scales horizontally across consumer groups
- Cut simulated portfolio drawdown by **59%** with a FAISS-powered recommendation engine
- Hit **100% job completion at 6 jobs/sec** across 3 concurrent Dockerized workers
- **Top 10 of 120+ teams** at HackO'Clock, a national-level hackathon
- Previously **Python Developer @ LetsGrowMore** — automation with Pandas and Flask

---

## Tech stack

**Languages**

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![C++](https://img.shields.io/badge/C++-00599C?style=flat-square&logo=cplusplus&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-CC2927?style=flat-square&logo=databricks&logoColor=white)

**Backend & infrastructure**

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-FF4438?style=flat-square&logo=redis&logoColor=white)
![AWS](https://img.shields.io/badge/AWS_EC2_&_S3-FF9900?style=flat-square&logo=amazonwebservices&logoColor=white)

**Data**

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![FAISS](https://img.shields.io/badge/FAISS-0467DF?style=flat-square&logo=meta&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white)

**Frontend & tooling**

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=flat-square&logo=linux&logoColor=black)

---

## Featured work

<table>
<tr>
<td width="50%" valign="top">

### TaskFlow Pro — DAG Scheduling Engine
🏆 **Grand Prize — Contata NCR Hackathon 2026**
`Python` `FastAPI` `React` `TypeScript` `PostgreSQL` `Docker`

A Kanban board that understands dependencies. A pure graph engine, isolated from the web and database layers, derives Blocked/Ready state from the DAG on every read, rejects links that would create a cycle, and propagates schedule slips downstream without double-counting shared paths. Critical-path detection highlights the zero-slack chain. PostgreSQL advisory locks handle multi-process concurrency.

**→ Propagates a delay through 1,000 tasks in under 1 ms. 61 backend tests at 94% coverage, with 600 randomly generated graphs checked by property-based tests.**

[![View repo](https://img.shields.io/badge/View_repo-1F6FEB?style=flat-square&logo=github&logoColor=white)](https://github.com/MARCIZOS/taskflow-pro)

</td>
<td width="50%" valign="top">

### AI Log Analyzer & RCA Tool
`Python` `FastAPI` `Redis Streams` `PostgreSQL` `FAISS` `Docker`

A Dockerized log-ingestion pipeline built on Redis Streams that scales horizontally across consumer groups. Classifies root causes automatically through a unit-tested parsing pipeline and surfaces past incidents via FAISS similarity search, with live dashboards for infrastructure health.

**→ Cuts manual debugging time by surfacing the matching past incident instead of the raw log.**

[![View repo](https://img.shields.io/badge/View_repo-1F6FEB?style=flat-square&logo=github&logoColor=white)](https://github.com/MARCIZOS/log_analyzer)

</td>
</tr>
<tr>
<td width="50%" valign="top">

### ARAIA — Portfolio Diversification
`Python` `FastAPI` `React` `FAISS` `scikit-learn` `AWS`

A full-stack risk-analytics platform that stress-tests portfolios against macroeconomic scenarios. Versioned, unit-tested REST APIs in FastAPI, a React front end, and a FAISS recommendation engine for diversification under stress. Deployed on AWS EC2 + S3.

**→ Reduced simulated portfolio drawdown by 59%.**

[![Live demo](https://img.shields.io/badge/Live_demo-0D9488?style=flat-square&logo=vercel&logoColor=white)](https://d25kw1rc4w7fmu.cloudfront.net/) [![View repo](https://img.shields.io/badge/View_repo-1F6FEB?style=flat-square&logo=github&logoColor=white)](https://github.com/MARCIZOS/portfolio_diversification)

</td>
<td width="50%" valign="top">

### HealGrid — Telehealth Platform
`React` `TypeScript` `Firebase` `WebRTC` `Tailwind`

A telehealth app with Firebase auth and Firestore, peer-to-peer WebRTC video consultations, a multi-language interface, and a separate Node API service deployed on Render.

**→ Doctor and patient hold a live consultation in the browser — no plugin, no third-party call service.**

[![View repo](https://img.shields.io/badge/View_repo-1F6FEB?style=flat-square&logo=github&logoColor=white)](https://github.com/MARCIZOS/heal-grid)

</td>
</tr>
<tr>
<td width="50%" valign="top">

### FairFix — Service Bill Auditor
`Python` `Nemotron` `Nebius` `OCR`

Reads a vehicle service bill and estimate line by line, checks each item against the official service schedule, comparable part prices and recall data, and drafts a neutral question for the service advisor. Every result shows the rule and the evidence behind it.

**→ When it cannot verify a line, it says so instead of guessing.**

[![View repo](https://img.shields.io/badge/View_repo-1F6FEB?style=flat-square&logo=github&logoColor=white)](https://github.com/MARCIZOS/fairfix)

</td>
<td width="50%" valign="top">

### AI Exam Generator
`Node.js` `Express` `OCR` `Groq vision`

Generates and grades exam papers from uploaded source material. OCR pulls text out of scanned documents — including handwriting, via a vision model — an LLM service drafts the questions, and an evaluator scores submitted answers.

**→ Turns a scanned syllabus into a graded question paper end to end.**

[![Live demo](https://img.shields.io/badge/Live_demo-0D9488?style=flat-square&logo=vercel&logoColor=white)](https://ai-exam-generator-plum.vercel.app) [![View repo](https://img.shields.io/badge/View_repo-1F6FEB?style=flat-square&logo=github&logoColor=white)](https://github.com/MARCIZOS/ai_exam_generator)

</td>
</tr>
</table>

---

## How I think about systems

The architecture behind the log analyzer — a Redis Streams pipeline that scales by adding consumers, not by scaling up:

```mermaid
flowchart LR
    A[Services emit logs] --> B[(Redis Streams)]
    B --> C1[Worker 1]
    B --> C2[Worker 2]
    B --> C3[Worker N]
    C1 --> D[Parse and classify<br/>root cause]
    C2 --> D
    C3 --> D
    D --> E[(PostgreSQL<br/>incident store)]
    D --> F[FAISS<br/>vector index]
    F --> G{Seen this<br/>failure before?}
    G -->|yes| H[Surface the past fix]
    G -->|no| I[Flag as new anomaly]
    E --> J[Live health dashboard]
```

Add a consumer, throughput goes up. No coordinator to fall over, no single worker to bottleneck on.

---

## By the numbers

<div align="center">

<img src="https://img.shields.io/badge/LeetCode-540%2B_solved-FFA116?style=for-the-badge&labelColor=0D1117" alt="LeetCode solved" />
<img src="https://img.shields.io/badge/Contest_rating-1938_Knight-FF6B00?style=for-the-badge&labelColor=0D1117" alt="Contest rating" />
<img src="https://img.shields.io/badge/CGPA-8.66-58A6FF?style=for-the-badge&labelColor=0D1117" alt="CGPA" />
<img src="https://img.shields.io/badge/HackO'Clock-Top_10_of_120%2B-1F6FEB?style=for-the-badge&labelColor=0D1117" alt="Hackathon" />

</div>

| | |
|---|---|
| **59%** | reduction in simulated portfolio drawdown, via FAISS-based diversification |
| **6 jobs/sec** | sustained at 100% completion across 3 concurrent Dockerized workers |
| **540+** | DSA problems solved, LeetCode Knight at 1938 |
| **Grand Prize** | Contata NCR Hackathon 2026 (PS-01) — TaskFlow Pro |
| **Top 10** | of 120+ teams at HackO'Clock, a national-level hackathon |

## Let's talk

I'm looking for a **Software Engineering / Backend internship** where I can work on systems that have real load behind them. If that's something you're hiring for, I'd like to hear from you.

<div align="center">

<a href="mailto:kushagarwal0805@gmail.com"><img src="https://img.shields.io/badge/kushagarwal0805@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
<a href="https://www.linkedin.com/in/kushagarwal0805/"><img src="https://img.shields.io/badge/Connect_on_LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>

<br/><br/>

<i>"The best way to learn distributed systems is to break one at 6 jobs per second."</i>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:58A6FF,50:1F6FEB,100:0D1117&height=120&section=footer" width="100%" />

</div>
