import type { Skill } from '../../Framework/Skills/Skill';

const skill: Skill = {
  identifier: 'embase-research',
  name: 'Embase Research Assistant',
  description: 'Search biomedical literature from Embase with focus on drugs, pharmacology, and European research',
  version: '1.0.0',
  author: 'OpenClaw Community',
  capabilities: [
    'search_embase',
    'fetch_article',
    'drug_safety_search',
    'conference_proceedings',
    'systematic_review_search'
  ],
  functions: {
    // Search Embase database
    async searchEmbase(args: {
      query: string;
      filters?: {
        journal?: string;
        fromDate?: string;
        toDate?: string;
        articleType?: 'article' | 'review' | 'conference' | 'all';
        language?: string;
        ageGroup?: string;
      };
      maxResults?: number;
      format?: 'json' | 'xml' | 'summary';
    }) {
      const {
        query,
        filters = {},
        maxResults = 20,
        format = 'json'
      } = args;

      // Build Embase query
      // Note: Embase uses PICO framework and extensive field tags
      let searchQuery = query;
      
      // Add field tags if specified
      if (filters.articleType) {
        const typeMap: Record<string, string> = {
          article: '[article]',
          review: '[review]',
          conference: '[conference paper]'
        };
        searchQuery += ` ${typeMap[filters.articleType] || ''}`;
      }

      // Demo API URL (actual Embase requires subscription)
      const searchUrl = `https://www.embase.com/search?query=${encodeURIComponent(searchQuery)}`;

      // Return demo response
      return this.mockSearch(query, filters, maxResults);
    },

    // Mock search for demonstration
    mockSearch(query: string, filters: any, maxResults: number) {
      const mockArticles = [
        {
          pii: 'S0000000000000001',
          title: `${query}: A comprehensive review of current evidence`,
          authors: 'van der Berg J, Muller A, Schmidt K',
          journal: 'European Journal of Pharmacology',
          year: 2024,
          volume: 185,
          pages: '114234',
          doi: '10.1016/j.ejphar.2024.114234',
          abstract: `This comprehensive review examines ${query} based on recent evidence from clinical trials and observational studies.`,
          keywords: ['drug therapy', 'clinical trial', 'pharmacology'],
          emtreeTerms: ['Drug efficacy', 'Safety', 'Clinical trial'],
          articleType: 'Article',
          language: 'English',
          url: 'https://doi.org/10.1016/j.ejphar.2024.114234'
        },
        {
          pii: 'S0000000000000002',
          title: `Randomized controlled trial of ${query}: Results from multicenter study`,
          authors: 'Brown R, Garcia M, Lee S',
          journal: 'Lancet Regional Health - Europe',
          year: 2024,
          volume: 42,
          pages: '100890',
          doi: '10.1016/j.lanepe.2024.100890',
          abstract: `This multicenter randomized controlled trial evaluates the efficacy and safety of ${query}.`,
          keywords: ['randomized controlled trial', 'treatment outcome', 'safety'],
          emtreeTerms: ['Randomized controlled trial', 'Treatment response', 'Adverse drug reaction'],
          articleType: 'Article',
          language: 'English',
          url: 'https://doi.org/10.1016/j.lanepe.2024.100890'
        },
        {
          pii: 'S0000000000000003',
          title: `Long-term outcomes of ${query}: 5-year follow-up study`,
          authors: 'Wang X, Chen Y, Liu Z',
          journal: 'BMJ Open',
          year: 2024,
          volume: 14,
          issue: 3,
          pages: 'e078912',
          doi: '10.1136/bmjopen-2023-078912',
          abstract: `Five-year follow-up results from a prospective cohort study on ${query}.`,
          keywords: ['long-term care', 'cohort study', 'patient outcomes'],
          emtreeTerms: ['Prospective study', 'Follow-up', 'Long-term treatment'],
          articleType: 'Article',
          language: 'English',
          url: 'https://doi.org/10.1136/bmjopen-2023-078912'
        },
        {
          pii: 'C0000000000000001',
          title: `${query}: Emerging therapies and future directions`,
          authors: 'Johnson P, Williams T',
          journal: 'European Cardiology Review 2024',
          year: 2024,
          pages: '123-130',
          abstract: `Conference presentation on emerging therapeutic approaches for ${query}.`,
          keywords: ['conference', 'emerging therapy', 'future directions'],
          articleType: 'Conference Paper',
          language: 'English',
          url: 'https://doi.org/10.1016/conf.ecr.2024.123'
        }
      ];

      const filtered = mockArticles.filter(a => 
        filters.articleType === 'all' || !filters.articleType || 
        a.articleType.toLowerCase().includes(filters.articleType)
      );

      return {
        query,
        filters,
        totalResults: filtered.length,
        results: filtered.slice(0, maxResults),
        searchUrl,
        isMock: true,
        note: 'Demo mode - requires Embase subscription for live data'
      };
    },

    // Search for drug safety/adverse reactions
    async searchDrugSafety(args: {
      drugName: string;
      reaction?: string;
      maxResults?: number;
      fromDate?: string;
    }) {
      const { drugName, reaction, maxResults = 20, fromDate } = args;

      // Drug safety focused search
      const safetyData = {
        drug: drugName,
        searchDate: new Date().toISOString(),
        adverseReactions: [
          { reaction: 'Nausea', frequency: 'Common', severity: 'Mild' },
          { reaction: 'Headache', frequency: 'Common', severity: 'Mild' },
          { reaction: 'Fatigue', frequency: 'Common', severity: 'Mild' },
          { reaction: 'Dizziness', frequency: 'Uncommon', severity: 'Moderate' },
          { reaction: 'Rash', frequency: 'Uncommon', severity: 'Moderate' },
          { reaction: 'Hepatotoxicity', frequency: 'Rare', severity: 'Severe' }
        ],
        warnings: [
          'Monitor liver function regularly',
          'Contraindicated in severe renal impairment',
          'Avoid during pregnancy'
        ],
        interactions: [
          'Warfarin: Increased bleeding risk',
          'CYP3A4 inhibitors: Increased drug levels'
        ],
        articles: [
          {
            title: `Safety profile of ${drugName}: Post-marketing surveillance`,
            journal: 'Drug Safety',
            year: 2024,
            pii: 'S0000000000000004'
          },
          {
            title: `Adverse drug reactions of ${drugName}: A systematic review`,
            journal: 'Pharmacoepidemiology and Drug Safety',
            year: 2023,
            pii: 'S0000000000000005'
          }
        ]
      };

      return {
        ...safetyData,
        totalArticles: safetyData.articles.length,
        isMock: true,
        note: 'Verify with current prescribing information'
      };
    },

    // Search conference proceedings
    async searchConferenceProceedings(args: {
      topic: string;
      conference?: string;
      year?: number;
      maxResults?: number;
    }) {
      const { topic, conference, year = 2024, maxResults = 10 } = args;

      const proceedings = {
        topic,
        conference,
        year,
        results: [
          {
            title: `${topic}: Abstracts from the ${year} Annual Meeting`,
            conference: conference || 'European Medical Conference',
            date: `${year}-06-15`,
            pages: '1-200',
            abstracts: Math.floor(Math.random() * 500) + 100
          },
          {
            title: `${topic} - Oral Presentations`,
            conference: 'International Medical Congress',
            date: `${year}-09-20`,
            pages: '201-350',
            abstracts: Math.floor(Math.random() * 300) + 50
          }
        ]
      };

      return {
        ...proceedings,
        totalAbstracts: proceedings.results.reduce((sum, r) => sum + r.abstracts, 0),
        isMock: true
      };
    },

    // Systematic review search with filters
    async systematicReviewSearch(args: {
      question: string;
      pico?: {
        population?: string;
        intervention?: string;
        comparison?: string;
        outcome?: string;
      };
      maxResults?: number;
      fromDate?: string;
      studyDesign?: string[];
    }) {
      const { question, pico, maxResults = 50, fromDate, studyDesign } = args;

      // Generate systematic review ready search
      const search = {
        question,
        pico: pico || {},
        searchDate: new Date().toISOString(),
        strategies: {
          embaseQuery: this.buildEmbaseQuery(question, pico),
          pubmedQuery: this.buildPubMedQuery(question, pico),
          notes: 'Search both databases and remove duplicates'
        },
        filters: {
          studyDesign: studyDesign || ['randomized controlled trial', 'systematic review', 'meta-analysis'],
          dateRange: { from: fromDate || '2020-01-01', to: '2024-12-31' },
          language: ['English'],
          published: 'Peer-reviewed'
        },
        screening: {
          phase1: 'Title/Abstract screening',
          phase2: 'Full-text screening',
          tools: ['Rayyan', 'Covidence', 'Abstrackr']
        },
        expectedYield: {
          embase: Math.floor(Math.random() * 2000) + 500,
          pubmed: Math.floor(Math.random() * 1500) + 300,
          duplicates: '~30% overlap expected',
          afterScreening: Math.floor(Math.random() * 50) + 10
        },
        qualityAssessment: {
          tools: ['Cochrane Risk of Bias 2', 'AMSTAR 2', 'ROBINS-I'],
          recommend: 'Use appropriate tool for study design'
        }
      };

      return search;
    },

    // Helper to build Embase query
    buildEmbaseQuery(question: string, pico?: any): string {
      let query = question;
      if (pico?.population) query += ` AND ${pico.population}/exp`;
      if (pico?.intervention) query += ` AND ${pico.intervention}/exp`;
      if (pico?.outcome) query += ` AND ${pico.outcome}`;
      query += ':ti OR :ab';
      return query;
    },

    // Helper to build PubMed query
    buildPubMedQuery(question: string, pico?: any): string {
      let query = question;
      if (pico?.population) query += ` AND ${pico.population}[Mesh]`;
      if (pico?.intervention) query += ` AND ${pico.intervention}[Mesh]`;
      return query;
    }
  }
};

export default skill;
