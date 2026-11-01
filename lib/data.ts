// Single source of truth for every statistic shown on the site.
// Each value carries year, scope, source and a direct link.

export type SourceKind = "official" | "estimate" | "forecast" | "illustrative";

export const KIND_LABEL: Record<SourceKind, string> = {
  official: "Официальная статистика",
  estimate: "Оценка",
  forecast: "Прогноз",
  illustrative: "Иллюстративный расчёт",
};

export type Source = {
  id: string;
  publisher: string;
  title: string;
  url: string;
  kind: SourceKind;
};

export const SOURCES: Record<string, Source> = {
  wup2025: {
    id: "wup2025",
    publisher: "ООН, Департамент по экономическим и социальным вопросам (UN DESA)",
    title: "World Urbanization Prospects 2025 — пресс-релиз, 18 ноября 2025",
    url: "https://www.un.org/sustainabledevelopment/blog/2025/11/press-release-wup2025/",
    kind: "estimate",
  },
  wup2025data: {
    id: "wup2025data",
    publisher: "UN DESA, Population Division",
    title: "World Urbanization Prospects 2025 — данные и сводка результатов",
    url: "https://population.un.org/wup/",
    kind: "estimate",
  },
  wup2018: {
    id: "wup2018",
    publisher: "UN DESA, Population Division",
    title: "World Urbanization Prospects 2018: Highlights",
    url: "https://population.un.org/wup/Publications/Files/WUP2018-Highlights.pdf",
    kind: "forecast",
  },
  wbUrban: {
    id: "wbUrban",
    publisher: "Всемирный банк (World Development Indicators)",
    title: "Urban population (% of total population), SP.URB.TOTL.IN.ZS — обновлено 08.10.2026",
    url: "https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS?locations=1W-KZ",
    kind: "estimate",
  },
  bnsUrban: {
    id: "bnsUrban",
    publisher: "Бюро национальной статистики АСПиР РК",
    title: "Демографическая статистика: численность населения на начало 2025 года",
    url: "https://stat.gov.kz/ru/industries/social-statistics/demography/publications/281558/",
    kind: "official",
  },
  bnsWage: {
    id: "bnsWage",
    publisher: "Бюро национальной статистики АСПиР РК",
    title: "Заработная плата за IV квартал 2025 года",
    url: "https://stat.gov.kz/ru/news/zarabotnaya-plata-za-iv-kvartal-2025-goda/",
    kind: "official",
  },
  bnsWageYear: {
    id: "bnsWageYear",
    publisher: "Бюро национальной статистики АСПиР РК",
    title: "Статистика труда и доходов: среднемесячная номинальная заработная плата",
    url: "https://stat.gov.kz/ru/industries/labor-and-income/stat-wags/publications/509385/",
    kind: "official",
  },
  bnsHousing: {
    id: "bnsHousing",
    publisher: "Бюро национальной статистики РК (в изложении Tengrinews)",
    title: "Сколько стоит квартира в Казахстане в 2025 году? Данные по городам",
    url: "https://tengrinews.kz/kazakhstan_news/skolko-stoit-kvartira-kazahstane-2025-godu-dannyie-gorodam-564720/",
    kind: "official",
  },
  sdg2023: {
    id: "sdg2023",
    publisher: "ООН, Доклад о целях устойчивого развития 2023",
    title: "Goal 11: Sustainable cities and communities",
    url: "https://unstats.un.org/sdgs/report/2023/Goal-11/",
    kind: "estimate",
  },
  unCities: {
    id: "unCities",
    publisher: "ООН / UN-Habitat",
    title: "Cities and Pollution — Climate Action",
    url: "https://www.un.org/en/climatechange/climate-solutions/cities-pollution",
    kind: "estimate",
  },
  nasaLandsat: {
    id: "nasaLandsat",
    publisher: "NASA Scientific Visualization Studio",
    title: "50+ years of Landsat: Las Vegas (SVS 31195)",
    url: "https://svs.gsfc.nasa.gov/31195/",
    kind: "official",
  },
};

// ——— Chapter 02: world urbanization ———

// World Bank WDI, % of population living in urban areas (national definitions).
export const URBAN_SERIES: { year: number; world: number; kz: number }[] = [
  { year: 1960, world: 34.2, kz: 44.7 },
  { year: 1965, world: 35.4, kz: 47.9 },
  { year: 1970, world: 36.4, kz: 50.5 },
  { year: 1975, world: 37.7, kz: 52.3 },
  { year: 1980, world: 39.5, kz: 54.1 },
  { year: 1985, world: 41.4, kz: 56.5 },
  { year: 1990, world: 42.8, kz: 57.2 },
  { year: 1995, world: 44.3, kz: 56.8 },
  { year: 2000, world: 46.8, kz: 56.0 },
  { year: 2005, world: 49.4, kz: 54.6 },
  { year: 2010, world: 51.8, kz: 54.2 },
  { year: 2015, world: 54.4, kz: 56.1 },
  { year: 2020, world: 56.4, kz: 60.0 },
  { year: 2025, world: 57.8, kz: 62.4 },
];

// UN DESA WUP 2025 — ten largest urban agglomerations in 2025 (million).
export const MEGACITIES: { name: string; country: string; pop: number; lon: number; lat: number }[] = [
  { name: "Джакарта", country: "Индонезия", pop: 41.9, lon: 106.85, lat: -6.2 },
  { name: "Дакка", country: "Бангладеш", pop: 36.6, lon: 90.41, lat: 23.81 },
  { name: "Токио", country: "Япония", pop: 33.4, lon: 139.69, lat: 35.69 },
  { name: "Нью-Дели", country: "Индия", pop: 30.2, lon: 77.21, lat: 28.61 },
  { name: "Шанхай", country: "Китай", pop: 29.6, lon: 121.47, lat: 31.23 },
  { name: "Гуанчжоу", country: "Китай", pop: 27.6, lon: 113.26, lat: 23.13 },
  { name: "Каир", country: "Египет", pop: 25.6, lon: 31.24, lat: 30.04 },
  { name: "Манила", country: "Филиппины", pop: 24.7, lon: 120.98, lat: 14.6 },
  { name: "Калькутта", country: "Индия", pop: 22.5, lon: 88.36, lat: 22.57 },
  { name: "Сеул", country: "Республика Корея", pop: 22.5, lon: 126.98, lat: 37.57 },
];

// ——— Chapter 03: cost of living (Kazakhstan, tenge) ———
export const KZ_WAGE = {
  avg2025: 443_315, // annual average of monthly nominal wage, 2025
  q4avg: 473_158, // Q4 2025 average
  q4median: 339_912, // Q4 2025 median
  minWage: 85_000, // from 1 Jan 2025
};

// ——— Chapter 04: housing ———
export const KZ_HOUSING = {
  astanaResale: 659_092, // ₸ per m², resale market, January 2025
  almatyResale: 597_427,
};
