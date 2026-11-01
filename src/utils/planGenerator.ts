import { MasterEventPlan, EventInput, CreativeConcept, BudgetCategory, TimelineMilestone, DayOfScheduleItem, VendorChecklistItem, LogisticsItem, CollaborationPrompt } from '../types';

export const SAMPLE_PRESETS: { label: string; description: string; input: EventInput }[] = [
  {
    label: 'Romantic Tuscan Vineyard Wedding',
    description: '130 guests, $48,000 budget, Napa/Sonoma outdoor estate with sunset golden-hour vows & alfresco dinner.',
    input: {
      eventType: 'wedding',
      title: 'Elena & Marcus: Tuscan Sunset Vineyard Wedding',
      guestCount: 130,
      location: 'Napa Valley Outdoor Vineyard Estate, CA',
      vibe: 'Rustic Italian elegance, warm candlelight, cascading olive branches, intimate golden-hour romance',
      totalBudget: 48000,
      eventDate: '2026-09-18',
      specialNotes: 'Require outdoor weather backup plan, gluten-free catering options, and acoustic strings into a live swing-jazz band.'
    }
  },
  {
    label: '50th Golden Jubilee Milestone Soirée',
    description: '85 guests, $22,000 budget, Chic metropolitan rooftop penthouse with retro-glam & craft cocktail bar.',
    input: {
      eventType: 'milestone-birthday',
      title: 'David’s 50th Golden Jubilee Penthouse Soirée',
      guestCount: 85,
      location: 'Downtown Chicago Rooftop Glass Conservatory',
      vibe: 'Mid-century modern glamour, speakeasy jazz club, deep amber & black tie, experiential oyster & whiskey bar',
      totalBudget: 22000,
      eventDate: '2026-10-24',
      specialNotes: 'Focus on top-shelf mixology, photo moments with retro Polaroid station, and a surprise tribute video roast.'
    }
  },
  {
    label: 'Community Waterfront Lantern & Folk Festival',
    description: '1,200 guests, $65,000 budget, Municipal waterfront park with local artisan food trucks & twilight floating lanterns.',
    input: {
      eventType: 'community-event',
      title: 'Harbor Mist Community Lantern & Arts Festival',
      guestCount: 1200,
      location: 'Riverside Waterfront Promenade & Civic Park',
      vibe: 'Warm bohemian community togetherness, eco-friendly floating lanterns, indie acoustic stage, family craft village',
      totalBudget: 65000,
      eventDate: '2026-08-15',
      specialNotes: 'Must coordinate municipal noise permits, crowd safety, volunteer zones, generator power grids, and zero-waste composting.'
    }
  },
  {
    label: 'Fairytale Botanical Quinceañera / Sweet 16',
    description: '150 guests, $32,000 budget, Historic glass greenhouse ballroom with ethereal pastels & choreographed waltz.',
    input: {
      eventType: 'milestone-birthday',
      title: 'Sophia’s Enchanted Garden Sweet 16 / Quinceañera',
      guestCount: 150,
      location: 'Historic Botanical Conservatory & Grand Pavilion',
      vibe: 'Whimsical fairytale florals, blush pink & gilded sage, dry-ice fog dancing, grand royal court entrance',
      totalBudget: 32000,
      eventDate: '2026-11-14',
      specialNotes: 'Court of honor choreography rehearsal, mocktail bar for teens alongside full adult bar, high-energy bilingual DJ.'
    }
  }
];

export function generateDefaultPlan(input: EventInput): MasterEventPlan {
  const budget = Math.max(1000, input.totalBudget || 25000);
  const guests = Math.max(10, input.guestCount || 100);
  const perGuest = Math.round(budget / guests);
  const isWedding = input.eventType === 'wedding';
  const isMilestone = input.eventType === 'milestone-birthday';
  const isCommunity = input.eventType === 'community-event';

  // 1. BUDGET ALLOCATION MATRIX
  let categories: BudgetCategory[] = [];
  let tips: string[] = [];

  if (isWedding) {
    categories = [
      {
        category: 'Venue & Rental Infrastructure',
        percentage: 18,
        amount: Math.round(budget * 0.18),
        items: ['Ceremony & Reception site fee', 'Tables, high-end chairs & linens', 'Bridal suite access & setup/teardown hours'],
        tips: 'Ask venue coordinator if Sunday or Friday rates save 15-25% off peak Saturday pricing.'
      },
      {
        category: 'Catering, Bar & Service Staff',
        percentage: 36,
        amount: Math.round(budget * 0.36),
        items: ['Cocktail hour canapés', 'Plated or family-style dinner', 'Full open bar with 2 signature cocktails', 'Service gratuity & bar staff'],
        tips: 'Provide your own wine/spirits if venue corkage fee is reasonable, or opt for beer/wine + 2 signature spirits.'
      },
      {
        category: 'Florals, Lighting & Atmospheric Decor',
        percentage: 12,
        amount: Math.round(budget * 0.12),
        items: ['Ceremony arch / backdrop statement', 'Bridal party bouquets & boutonnieres', 'Centerpieces (mix of high and low)', 'Up-lighting and romantic candles'],
        tips: 'Repurpose ceremony aisle meadows and arch florals directly to the sweetheart table and bar after vows.'
      },
      {
        category: 'Photography & Cinematic Video',
        percentage: 11,
        amount: Math.round(budget * 0.11),
        items: ['8 hours coverage with primary shooter', 'Second shooter for ceremony/cocktails', 'Full resolution online gallery & print rights'],
        tips: 'Book engagement shoot bundled with wedding day coverage to save an average of $600-$1,000.'
      },
      {
        category: 'Music, Sound & Live Entertainment',
        percentage: 8,
        amount: Math.round(budget * 0.08),
        items: ['Ceremony sound system & lavalier mics', 'Cocktail hour acoustic duo or curated playlist', 'Reception DJ / Emcee with dance floor lighting'],
        tips: 'A versatile dynamic DJ who also provides ceremony sound can save thousands compared to separate multi-vendor audio teams.'
      },
      {
        category: 'Attire, Hair, Makeup & Rings',
        percentage: 5,
        amount: Math.round(budget * 0.05),
        items: ['Bridal hair & makeup trial + day-of', 'Attire tailoring & accessories', 'Boutique beauty prep'],
        tips: 'Book on-site bridal stylist team early to avoid rush travel fees; consider curated off-the-rack designer sample sales.'
      },
      {
        category: 'Stationery, Signage & Favors',
        percentage: 2,
        amount: Math.round(budget * 0.02),
        items: ['Digital save-the-dates + luxury invitations', 'Welcome sign, seating chart & menus', 'Edible guest favors (e.g. olive oil / artisan sweets)'],
        tips: 'Use digital RSVP tracking to cut paper/postage waste by 70%, investing instead in one stunning wooden or acrylic welcome statement.'
      },
      {
        category: 'Contingency & Emergency Reserve',
        percentage: 8,
        amount: Math.round(budget * 0.08),
        items: ['Last minute guest additions', 'Weather contingency umbrellas/heaters', 'Vendor overtime & tips buffer'],
        tips: 'Never commit this 8% buffer until 48 hours before the event. It is your shield against unexpected stress.'
      }
    ];
    tips = [
      'Repurpose Ceremony florals: Transfer aisle markers and floral arches to the sweetheart table and bar facade immediately after cocktail hour starts.',
      'Signature Cocktails: Rather than an unlimited open call bar with 20 liquors, offer a curated bar of 2 signature craft cocktails plus wine and beer to save 20-30% on liquor invoices.',
      'Off-Peak Elegance: A late Sunday afternoon wedding or shoulder-season date (April, October/November) often drops rental and vendor minimums by up to $4,000.',
      'Hybrid Invitations: Print gorgeous high-touch physical invitations with QR codes leading to an elegant digital RSVP portal, eliminating return postage and menu card reprints.'
    ];
  } else if (isMilestone) {
    categories = [
      {
        category: 'Experiential Venue & Lounge Styling',
        percentage: 22,
        amount: Math.round(budget * 0.22),
        items: ['Rooftop or boutique gallery rental', 'Velvet lounge furniture & high-tops', 'Ambient neon/architectural lighting'],
        tips: 'Seek venues with built-in chic aesthetics to drastically reduce standalone decor spend.'
      },
      {
        category: 'Gourmet Heavy Hors d’oeuvres & Interactive Stations',
        percentage: 38,
        amount: Math.round(budget * 0.38),
        items: ['Chef action stations (carving/sushi/sliders)', 'Passed gourmet tapas', 'Custom celebratory dessert/cake', 'Bespoke craft cocktail open bar'],
        tips: 'Cocktail-style reception with heavy passed tapas creates higher energy and costs 20% less than a formal sit-down 3-course dinner.'
      },
      {
        category: 'Entertainment, Live Music & DJ',
        percentage: 14,
        amount: Math.round(budget * 0.14),
        items: ['Live jazz trio or saxophone opener', 'Headliner party DJ & wireless mic setup', 'Surprise performance or roast emcee'],
        tips: 'Hire a solo acoustic or sax player to play alongside the DJ during peak sets for a luxury nightclub feel at half the band cost.'
      },
      {
        category: 'Photography, Retro Photobooth & Video Recap',
        percentage: 10,
        amount: Math.round(budget * 0.10),
        items: ['4-6 hours documentary event photographer', 'Glam retro 360 or open-air photo kiosk with instant SMS prints', 'Edited 90-sec highlight reel'],
        tips: 'The photo booth doubles as guest favors—they take home physical branded keepsake photos!'
      },
      {
        category: 'Custom Decor, Balloon Art & Signage',
        percentage: 6,
        amount: Math.round(budget * 0.06),
        items: ['Organic balloon or floral photo-wall', 'Custom marquee numbers or custom neon sign', 'Branded cocktail napkins and bar menus'],
        tips: 'Focus decor budget entirely on ONE jaw-dropping photo backdrop rather than diluting small items around the entire room.'
      },
      {
        category: 'Favors, Welcome Drinks & Champagne Toast',
        percentage: 3,
        amount: Math.round(budget * 0.03),
        items: ['Arrival glass of vintage champagne', 'Curated parting gift (mini spirit bottle, artisan macarons)'],
        tips: 'Pour welcome drinks as guests step off the elevator to immediately establish a VIP celebratory tone.'
      },
      {
        category: 'Contingency & Hospitality Buffer',
        percentage: 7,
        amount: Math.round(budget * 0.07),
        items: ['Late-night snack rush delivery', 'Vendor gratuities', 'Uber/Lyft voucher buffer for VIP guests'],
        tips: 'Keep a quick reserve for a surprise late-night fry or pizza drop at 10:30 PM to send everyone home raving.'
      }
    ];
    tips = [
      'Interactive Food Stations: Stagger food stations (e.g., street taco bar, gourmet slider bar) to keep guests mingling instead of seated.',
      'Neon Sign Reusability: Order a custom neon sign featuring the celebrant’s nickname or family motto—they can hang it in their home afterward!',
      'Digital Memory Wall: Stream crowd-sourced photos to a stylish vertical display using a dedicated event hashtag or live QR upload.',
      'Signature Toast: Consolidate the toasts to exactly two meaningful speeches under 3 minutes each to maintain party momentum.'
    ];
  } else {
    // Community event or general large-scale celebration
    categories = [
      {
        category: 'Site Infrastructure, Staging & Sanitation',
        percentage: 28,
        amount: Math.round(budget * 0.28),
        items: ['Covered main stage & trussing', 'Generators & electrical power distro', 'Portable luxury restroom trailers', 'Barricades, perimeter fencing & trash/recycling bins'],
        tips: 'Partner with municipal parks departments to leverage existing civic electrical boxes and permanent restrooms.'
      },
      {
        category: 'Sound, Audio/Visual & Stage Production',
        percentage: 20,
        amount: Math.round(budget * 0.20),
        items: ['High-capacity line array PA speakers', 'Stage lighting & follow spots', 'Certified sound engineer and stage manager', 'Broadcast/streaming capability'],
        tips: 'Contract an all-in-one AV production company rather than renting sound, lights, and staging from separate vendors.'
      },
      {
        category: 'Safety, Security, Permitting & Insurance',
        percentage: 14,
        amount: Math.round(budget * 0.14),
        items: ['City special event permit & street closures', '$2M general liability insurance policy', 'Licensed off-duty security & EMT station', 'Fire marshal inspection fees'],
        tips: 'Submit permit applications at least 120 days out to avoid expedited city processing surcharges.'
      },
      {
        category: 'Artistic Programming & Community Talent',
        percentage: 16,
        amount: Math.round(budget * 0.16),
        items: ['Headliner musical acts & local performers', 'Emcee & community hosts', 'Interactive art installations or workshop leaders'],
        tips: 'Invite popular local dance academies and school jazz ensembles for daytime slots—they bring large enthusiastic families of supporters!'
      },
      {
        category: 'Marketing, Signage & Wayfinding',
        percentage: 7,
        amount: Math.round(budget * 0.07),
        items: ['Large directional banners & festival maps', 'Community flyers & social ad boost', 'Staff/volunteer branded t-shirts'],
        tips: 'Digital maps via QR codes placed at entry gates reduce large physical signage print runs.'
      },
      {
        category: 'Eco-Waste Management & Volunteer Hospitality',
        percentage: 5,
        amount: Math.round(budget * 0.05),
        items: ['Volunteer meals & hydration station', 'Compost & recycling sorters', 'Post-event site green clean crew'],
        tips: 'Recruit local high school environmental clubs or scout troops for volunteer community service hours.'
      },
      {
        category: 'Contingency & Weather Mitigation',
        percentage: 10,
        amount: Math.round(budget * 0.10),
        items: ['Rain tarping & cable protectors', 'Emergency generator backup', 'Incidentals & weather delays'],
        tips: 'Always maintain a 10% reserve for public events to handle unexpected municipal mandates or sudden weather adaptations.'
      }
    ];
    tips = [
      'Food Truck Revenue Share: Instead of paying catering out of pocket, invite 6-10 vetted food trucks with a 10-15% concession fee returned to the event budget.',
      'Sponsorship Alignment: Sell naming rights for stages, water stations, and VIP lounges to local credit unions and businesses to offset production costs.',
      'BYO Seating: Encourage attendees to bring their own picnic blankets and lawn chairs to save thousands on chair rentals.',
      'Eco-Station Sorters: Provide clear 3-stream waste stations (Compost, Recyclables, Trash) to reduce commercial dumpster tipping fees.'
    ];
  }

  // 2. REVERSE TIMELINE & MILESTONES
  const milestones: TimelineMilestone[] = [
    {
      period: '9–12 Months Out',
      timingBadge: 'Foundation Phase',
      focusTitle: 'Vision, Budget Lock & Key Anchor Bookings',
      description: 'Solidify the non-negotiables: secure the dream venue, lock in core budget guardrails, and contract top-tier demand vendors.',
      bookingWindow: 'Critical Window: Venue, Planner/Producer, Primary Photographer/Videographer',
      tasks: [
        { id: 't1', task: `Lock total budget of $${budget.toLocaleString()} and establish dedicated event bank account/tracking sheet`, isUrgent: true },
        { id: 't2', task: `Site inspection and contract signing for venue in ${input.location}`, isUrgent: true, deadlineNote: 'Top dates book 1 year in advance' },
        { id: 't3', task: 'Draft initial guest list and group into Priority A and B tiers' },
        { id: 't4', task: 'Interview and contract lead Photographer/Cinematographer' },
        { id: 't5', task: 'Define aesthetic style guide and mood board (color palette, vibe, signature moments)' }
      ]
    },
    {
      period: '6 Months Out',
      timingBadge: 'Experience & Vendor Lock',
      focusTitle: 'Sensory Design, Catering Tastings & Entertainment',
      description: 'Design the guest experience: taste food & wine pairings, book musical entertainment, and send official date announcements.',
      bookingWindow: 'Critical Window: Caterer/Bar, DJ/Live Band, Floral/Decor Designer',
      tasks: [
        { id: 't6', task: 'Attend menu tasting and finalize course formats and bar package', isUrgent: true },
        { id: 't7', task: 'Send out Save-the-Dates (digital or print with direct website links)' },
        { id: 't8', task: 'Book DJ / Live Band and review audio/power rider with venue' },
        { id: 't9', task: 'Floral design walkthrough: choose focal arrangements and candle quantities' },
        { id: 't10', task: 'Reserve room blocks at nearby hotels for out-of-town guests' }
      ]
    },
    {
      period: '1 Month Out',
      timingBadge: 'Logistics Crunch',
      focusTitle: 'Headcounts, Run of Show & Production Schematics',
      description: 'Iron out all logistics: gather final RSVPs, lock dietary counts with caterer, build detailed load-in/out schedules.',
      bookingWindow: 'Critical Window: Final Rental Quantities, Floor Plan Signoff, Vendor Timelines',
      tasks: [
        { id: 't11', task: `Finalize RSVP headcount (target: ${guests} guests) and submit dietary counts to kitchen`, isUrgent: true },
        { id: 't12', task: 'Generate precise floor plan with seating charts, fire exits, and power drops' },
        { id: 't13', task: 'Send comprehensive vendor timeline and load-in dock assignments' },
        { id: 't14', task: 'Finalize music playlists: Do-Not-Play list, grand entrance track, key toast cues' },
        { id: 't15', task: 'Confirm event insurance certificate of insurance (COI) sent to venue manager' }
      ]
    },
    {
      period: 'Week-of',
      timingBadge: 'Final Rehearsal & Staging',
      focusTitle: 'Vendor Confirmations, Packing & Mental Peace',
      description: 'Confirm every single detail, assemble day-of emergency kits, distribute final balance payments and tips.',
      bookingWindow: 'Critical Window: Rehearsal, Final Payments, Emergency Prep',
      tasks: [
        { id: 't16', task: 'Pack Master Emergency Kit (steamer, sewing kit, stain remover, meds, tape, zip-ties)', isUrgent: true },
        { id: 't17', task: 'Prepare labeled tip envelopes for staff, delivery drivers, and service captains' },
        { id: 't18', task: 'Conduct rehearsal walkthrough and verify speech times under 3 minutes each' },
        { id: 't19', task: 'Confirm weather forecast; trigger heating or tent sidewall plan if precipitation > 30%' },
        { id: 't20', task: 'Hand off day-of vendor contact sheet to appointed on-site coordinator' }
      ]
    },
    {
      period: 'Day-of',
      timingBadge: 'Execution & Celebration',
      focusTitle: 'Master Run of Show & Flawless Flow',
      description: 'Step into host mode. The production timeline runs like clockwork while you savor every unforgettable moment.',
      bookingWindow: 'Live Execution',
      tasks: [
        { id: 't21', task: 'Lead coordinator verifies room temperature, floral placement, and AV audio check' },
        { id: 't22', task: 'VIP photos completed prior to main guest arrival' },
        { id: 't23', task: 'Doors open, ambient background audio begins, welcome refreshments served' },
        { id: 't24', task: 'Execute signature moment with high energy and designated photo capture' }
      ]
    }
  ];

  const dayOfSchedule: DayOfScheduleItem[] = isWedding ? [
    { id: 'd1', time: '08:30 AM', activity: 'Hair, Makeup & VIP Getting Ready', leadPerson: 'Lead Stylist & Wedding Party', notes: 'Hydration and breakfast delivered to bridal suite. Steaming attire.' },
    { id: 'd2', time: '11:00 AM', activity: 'Vendor Load-In & Floral Installation', leadPerson: 'Event Coordinator & Florist', notes: 'Ceremony arch installation, table setup, sound check.' },
    { id: 'd3', time: '01:30 PM', activity: 'First Look & Intimate Couple Portraits', leadPerson: 'Lead Photographer', notes: 'Quiet garden location; bridal bouquet delivered fresh.' },
    { id: 'd4', time: '03:30 PM', activity: 'Guest Arrival & Welcome Refreshment', leadPerson: 'Host Team & Usheers', notes: 'Infused citrus water and prosecco served; live acoustic prelude music.' },
    { id: 'd5', time: '04:00 PM', activity: 'Ceremony Commences', leadPerson: 'Officiant & Wedding Party', notes: 'Lavalier mic check, processional cues, emotional vows exchange.' },
    { id: 'd6', time: '04:45 PM', activity: 'Cocktail Hour & Passed Hors d’oeuvres', leadPerson: 'Catering Lead & Acoustic Duo', notes: 'Signature drinks flowing; family formal photos wrapped within 35 mins.' },
    { id: 'd7', time: '06:00 PM', activity: 'Grand Entrance & Welcome Toast', leadPerson: 'DJ / Emcee & Hosts', notes: 'Guests seated, high-energy entrance, heartfelt welcome by host.' },
    { id: 'd8', time: '06:30 PM', activity: 'Dinner Service & Curated Speeches', leadPerson: 'Catering Captain & Speakers', notes: '3 scheduled toasts given between courses (strict 3 min cap each).' },
    { id: 'd9', time: '08:00 PM', activity: 'First Dance & Dance Floor Ignition', leadPerson: 'DJ & Lighting Lead', notes: 'Special dance transitions directly into high-energy dance set.' },
    { id: 'd10', time: '09:45 PM', activity: 'Late-Night Bites & Signature Experience', leadPerson: 'Catering Team', notes: 'Artisan sliders, dessert station, sparkler/glow finale prep.' },
    { id: 'd11', time: '11:00 PM', activity: 'Grand Farewell Send-off & Packdown', leadPerson: 'Coordinator & Clean-up Crew', notes: 'Send-off tunnel, shuttle departure for guests, breakdown begins.' }
  ] : [
    { id: 'd1', time: '12:00 PM', activity: 'Venue Access & AV/Lighting Setup', leadPerson: 'Production Lead & Sound Tech', notes: 'Speaker tuning, backdrop mounting, power line routing.' },
    { id: 'd2', time: '03:00 PM', activity: 'Catering & Bar Delivery / Ice Stocking', leadPerson: 'Bar Captain & Kitchen Lead', notes: 'Chilling glassware, prepping garnish boards, tasting station setup.' },
    { id: 'd3', time: '05:30 PM', activity: 'Celebrant / Host Soundcheck & Final Walk', leadPerson: 'Host & Lead Planner', notes: 'Review mic controls, test slideshow/video projection.' },
    { id: 'd4', time: '06:30 PM', activity: 'Doors Open, Welcome Cocktail & Live Music', leadPerson: 'Greeters & Jazz Trio', notes: 'Passed signature drinks, photographer captures candid arrivals.' },
    { id: 'd5', time: '07:30 PM', activity: 'Chef Action Stations Open & Social Mingling', leadPerson: 'Catering Staff', notes: 'Food stations active; lounge seating keeps energy buzzing.' },
    { id: 'd6', time: '08:45 PM', activity: 'The Main Tribute & Signature Celebration Moment', leadPerson: 'Emcee & Key Honoree', notes: 'Champagne poured, tribute video/speeches, celebratory toast.' },
    { id: 'd7', time: '09:15 PM', activity: 'DJ Dance Set & Dessert Bar Reveal', leadPerson: 'DJ & Dessert Team', notes: 'Decadent sweets & espresso bar; lights dimmed for dancing.' },
    { id: 'd8', time: '11:00 PM', activity: 'Event Concludes & Safe Rides Departure', leadPerson: 'Valet / Ride Coordinator', notes: 'Parting favors handed out; overnight breakdown completed.' }
  ];

  // 3. VENDOR & LOGISTICS CHECKLIST
  const venueBudgetNumber = Math.round(budget * 0.20);
  const cateringBudgetNumber = Math.round(budget * 0.35);
  const photoBudgetNumber = Math.round(budget * 0.11);
  const entertainmentBudgetNumber = Math.round(budget * 0.09);
  const floralBudgetNumber = Math.round(budget * 0.11);

  const vendors: VendorChecklistItem[] = [
    {
      role: 'Venue & Facility Management',
      category: 'Venue & Space',
      priority: 'Essential',
      budgetEstimate: `$${venueBudgetNumber.toLocaleString()}`,
      allocatedBudgetNumber: venueBudgetNumber,
      quotes: [
        {
          id: 'v_quote_1',
          vendorName: 'Villa Bellisima Vineyard Estate',
          contactPerson: 'Marcella Bianchi (Events Director)',
          emailOrPhone: 'marcella@villabellisima.com | (707) 555-0192',
          quoteAmount: Math.round(venueBudgetNumber * 0.95),
          depositRequired: Math.round(venueBudgetNumber * 0.25),
          cancellationPolicy: 'Deposit refundable up to 90 days before event date minus $300 fee.',
          inclusions: [
            '12-hour exclusive site access (10 AM to 10 PM)',
            'Ceremony lawn, covered courtyard, and olive grove terrace',
            'Solid oak harvest tables and 150 fruitwood cross-back chairs',
            'Private bridal & groom preparation suites with champagne bar'
          ],
          exclusionsOrExtraFees: [
            'Overtime fee: $400/hour past 10 PM (strict county curfew)',
            'Mandatory day-of venue event coordinator fee ($500)'
          ],
          pros: [
            '5% under allocated venue budget',
            'Tables and chairs included, saving $2,200 on separate rentals',
            'Spectacular sunset golden-hour views'
          ],
          cons: [
            'Strict 10:00 PM amplified music curfew',
            'Outside caterers must be from approved licensed roster'
          ],
          rating: 5,
          status: 'Selected',
          notes: 'Top venue choice. Matches our Tuscan rustic romance vision flawlessly.'
        },
        {
          id: 'v_quote_2',
          vendorName: 'The Historic Conservatory & Glass Pavilion',
          contactPerson: 'Devon Hughes',
          emailOrPhone: 'events@historicconservatory.org | (707) 555-0140',
          quoteAmount: Math.round(venueBudgetNumber * 1.06),
          depositRequired: Math.round(venueBudgetNumber * 0.30),
          cancellationPolicy: 'Non-refundable 30% deposit upon contract execution.',
          inclusions: [
            'Climate-controlled historic glass greenhouse architecture',
            'Built-in warm architectural uplighting & ambient dimmers',
            'Commercial catering prep kitchen with walk-in refrigeration',
            'Permits amplified sound indoors until midnight'
          ],
          exclusionsOrExtraFees: [
            'Chairs and tables not included (must rent externally)',
            'Mandatory security guard fee ($350)'
          ],
          pros: [
            'Weather-proof rain contingency built directly into space',
            'Later music curfew (midnight)'
          ],
          cons: [
            '6% over category allocation ($' + Math.round(venueBudgetNumber * 0.06).toLocaleString() + ' premium)',
            'Requires sourcing separate rental furniture'
          ],
          rating: 4.7,
          status: 'Shortlisted',
          notes: 'Great indoor alternative if weather risk is significant.'
        }
      ],
      criticalQuestions: [
        'What is the exact contracted curfew for amplified sound, and what are the strict teardown departure times?',
        'Are we locked into an exclusive vendor list, or can we bring outside licensed and insured vendors?',
        'What is your rain/inclement weather contingency protocol, and how late can we make the call?',
        'Does the facility have sufficient electrical breaker amperage dedicated to the DJ/band and catering equipment?'
      ],
      redFlags: [
        'Hidden overtime penalty fees exceeding $500/half hour',
        'Strict volume limits below 85dB without prior disclosure',
        'No designated freight elevator or loading dock access'
      ]
    },
    {
      role: 'Caterer & Bar Mixology Service',
      category: 'Food & Beverage',
      priority: 'Essential',
      budgetEstimate: `$${cateringBudgetNumber.toLocaleString()}`,
      allocatedBudgetNumber: cateringBudgetNumber,
      quotes: [
        {
          id: 'c_quote_1',
          vendorName: 'Sonoma Harvest Plate & Craft Mixology',
          contactPerson: 'Chef Andre Mercier',
          emailOrPhone: 'andre@sonomaharvestplate.com | (707) 555-0211',
          quoteAmount: Math.round(cateringBudgetNumber * 0.96),
          depositRequired: Math.round(cateringBudgetNumber * 0.20),
          cancellationPolicy: 'Full refund minus $500 fee up to 45 days prior.',
          inclusions: [
            '3-course farm-to-table plated dinner with local seasonal ingredients',
            '4 passed cocktail hour canapés',
            'Full open bar package featuring 2 custom craft signature cocktails',
            '1 server per 10 guests + 2 dedicated certified mixologists',
            'Late night artisan flatbread pizza oven station'
          ],
          exclusionsOrExtraFees: [
            '20% service fee and local food tax added to final invoice',
            'Corkage fee ($15/bottle) if providing own vintage wines'
          ],
          pros: [
            '4% under allocated catering budget ($' + Math.round(cateringBudgetNumber * 0.04).toLocaleString() + ' savings)',
            'Exceptional staff-to-guest ratio ensures zero drink lines',
            'Free tasting for 4 guests included'
          ],
          cons: [
            'Requires final dietary headcount 14 days in advance'
          ],
          rating: 5,
          status: 'Selected',
          notes: 'Menu tasting was phenomenal; guests will rave about the braised short rib and truffle risotto.'
        },
        {
          id: 'c_quote_2',
          vendorName: 'Bella Tavola Family-Style Hospitality',
          contactPerson: 'Gianna Rinaldi',
          emailOrPhone: 'gianna@bellatavolaevents.com | (707) 555-0189',
          quoteAmount: Math.round(cateringBudgetNumber * 1.04),
          depositRequired: Math.round(cateringBudgetNumber * 0.25),
          cancellationPolicy: '25% deposit non-refundable; reschedule allowed with 30-day notice.',
          inclusions: [
            'Authentic Italian family-style continuous feasts with antipasto boards',
            'House-made artisan pastas and wood-fired mains',
            'Prosecco welcome toast + wine/beer open bar',
            'All white ceramic dinnerware, linens, and silver cutlery'
          ],
          exclusionsOrExtraFees: [
            'Liquor license surcharge for hard spirits ($450)',
            'Overtime staffing rate ($65/hour per server)'
          ],
          pros: [
            'Highly interactive dining format encourages conversation',
            'Includes all dinnerware and linen rentals'
          ],
          cons: [
            '4% over allocated target budget',
            'Hard spirits require separate bar add-on'
          ],
          rating: 4.8,
          status: 'Shortlisted',
          notes: 'Very warm family-style experience; fits Tuscan concept beautifully.'
        }
      ],
      criticalQuestions: [
        'What is the staff-to-guest ratio for food service and bartenders (industry gold standard: 1 server per 10-12 guests, 1 bartender per 50 guests)?',
        'How do you accommodate severe allergies, gluten-free, vegan, and kosher-style dietary requirements?',
        'Are service charges, admin fees, and bartender tips included in your quote, or added as line items at the end?',
        'What happens to leftover food at the end of the evening?'
      ],
      redFlags: [
        'Unclear breakdown of gratuity vs. administrative fees',
        'Inability to provide a comprehensive dietary sheet',
        'Understaffing (e.g., only 1 bartender for 100+ drinking guests)'
      ]
    },
    {
      role: 'Photographer & Cinematic Storyteller',
      category: 'Visual Memories',
      priority: 'Essential',
      budgetEstimate: `$${photoBudgetNumber.toLocaleString()}`,
      allocatedBudgetNumber: photoBudgetNumber,
      quotes: [
        {
          id: 'p_quote_1',
          vendorName: 'Lumière Fine Art Wedding Studio',
          contactPerson: 'Chloe St. Claire',
          emailOrPhone: 'chloe@lumiereweddings.com | (415) 555-0322',
          quoteAmount: Math.round(photoBudgetNumber * 0.92),
          depositRequired: Math.round(photoBudgetNumber * 0.20),
          cancellationPolicy: 'Deposit transferable to any new date within 12 months.',
          inclusions: [
            '8 hours full event coverage with 2 lead shooters',
            'High-resolution online gallery with full personal print rights',
            '48-hour sneak peek delivery (50 edited images)',
            'Complimentary golden-hour engagement portrait session'
          ],
          exclusionsOrExtraFees: [
            'Fine art leather-bound heirloom album billed separately ($800)'
          ],
          pros: [
            '8% under budget ($' + Math.round(photoBudgetNumber * 0.08).toLocaleString() + ' savings)',
            'Shoots on dual-slot camera systems with cloud backups',
            '48-hour sneak peek turnaround'
          ],
          cons: [
            'Travel fee for locations beyond 40 miles ($150)'
          ],
          rating: 5,
          status: 'Selected',
          notes: 'Master of natural golden-hour lighting. Very unobtrusive documentary style.'
        },
        {
          id: 'p_quote_2',
          vendorName: 'Cinema & Light Collaborative',
          contactPerson: 'David Ross & Maya Patel',
          emailOrPhone: 'team@cinemalight.co | (415) 555-0398',
          quoteAmount: Math.round(photoBudgetNumber * 1.12),
          depositRequired: Math.round(photoBudgetNumber * 0.30),
          cancellationPolicy: '50% refund up to 60 days before event date.',
          inclusions: [
            'Photo & 4K Cinema Video bundled package (10 hours)',
            'Drone aerial footage of vineyard and estate',
            '3-5 minute cinematic teaser film + 15 min documentary edit',
            'Hard drive with all raw footage'
          ],
          exclusionsOrExtraFees: [
            'Drone permit fees if municipal clearance is required'
          ],
          pros: [
            'Includes both high-end photo AND cinematic video',
            'Drone aerial footage included'
          ],
          cons: [
            '12% over photo-only allocation (though saves hiring separate videographer)'
          ],
          rating: 4.9,
          status: 'Shortlisted',
          notes: 'Incredible video work. If we choose this, we can reallocate from the entertainment/decor buffer.'
        }
      ],
      criticalQuestions: [
        'Can we view 2 complete full-day galleries of real events (not just highlight reels) shot in lighting conditions similar to our venue?',
        'What is your emergency backup protocol if you fall ill on the event date?',
        'What is the exact delivery timeline for sneak-peeks and the final edited high-res digital gallery?',
        'Do you bring backup camera bodies, lenses, and redundant dual-slot SD card writing?'
      ],
      redFlags: [
        'Shoots only on single-card slot cameras (catastrophic data loss risk)',
        'Delivery turnaround exceeding 12 weeks with no sneak peek',
        'Refuses to provide full gallery examples'
      ]
    },
    {
      role: 'Live Entertainment & Sound Specialist',
      category: 'Audio & Music',
      priority: 'High',
      budgetEstimate: `$${entertainmentBudgetNumber.toLocaleString()}`,
      allocatedBudgetNumber: entertainmentBudgetNumber,
      quotes: [],
      criticalQuestions: [
        'Do you provide an all-inclusive audio setup (wireless hand-held + lapel mics, secondary speaker for cocktails, dance floor wash lighting)?',
        'How do you handle guest song requests while strictly respecting our Do-Not-Play list?',
        'How do you read the room to maintain momentum when the dance floor begins to thin?',
        'Do you act as a polished, unobtrusive emcee to guide guests through transitions?'
      ],
      redFlags: [
        'Cheesy high-pressure radio DJ personality rather than refined emcee',
        'No backup laptop, mixer, or secondary audio source on site',
        'Requires customer to rent additional microphones'
      ]
    },
    {
      role: 'Floral & Event Scenic Stylist',
      category: 'Decor & Design',
      priority: 'High',
      budgetEstimate: `$${floralBudgetNumber.toLocaleString()}`,
      allocatedBudgetNumber: floralBudgetNumber,
      quotes: [],
      criticalQuestions: [
        'Can you create a mock-up centerpiece or detailed 3D/photo rendering prior to our final order?',
        'How will you handle floral transfers (e.g. moving ceremony installations to reception bars)?',
        'Does your quote cover complete late-night strike and breakdown, or just daytime drop-off?',
        'Which seasonal blooms can we substitute to achieve our color palette without paying out-of-season import surcharges?'
      ],
      redFlags: [
        'Drop-off only with no strike crew, leaving clean-up to hosts',
        'Vague stem count descriptions with no flower species guarantees'
      ]
    }
  ];

  const logistics: LogisticsItem[] = [
    {
      category: 'Permits & Licensing',
      requirement: isCommunity ? 'Municipal Park Special Event & Noise Amplification Permit' : 'Sound Curfew & Alcohol Service Compliance',
      criticalDetails: `Jurisdiction in ${input.location} enforces sound decibel restrictions after 10:00 PM. Confirm if separate liquor licensing is required if venue is not commercially licensed.`,
      actionItem: 'File permit paperwork at least 90 days out and verify certified TIPS/LEAD bartender credentials.'
    },
    {
      category: 'Event Insurance & Safety',
      requirement: '$1M - $2M Commercial General Liability Policy with Host Liquor Rider',
      criticalDetails: '95% of reputable venues require a Certificate of Insurance (COI) naming the property owner as additionally insured 30 days prior.',
      actionItem: 'Obtain instant quote through specialized event insurance providers (average cost: $125 - $220).'
    },
    {
      category: 'Power & AV Specs',
      requirement: 'Dedicated 20-Amp Circuits for Catering Warmers, DJ Sound & Lighting',
      criticalDetails: 'Plugging high-draw food warmers and sound subwoofers into the same residential outlet circuit will trip breakers during peak service.',
      actionItem: 'Conduct power map audit with venue electrician: allocate minimum 2 separate dedicated 20A breakers for DJ and 2 for catering.'
    },
    {
      category: 'Guest Flow & Accessibility',
      requirement: 'ADA Compliant Entry, Sightlines & Bar Bottleneck Mitigation',
      criticalDetails: `Accommodating ${guests} guests requires minimum 2 bar service points to keep drink wait times under 3 minutes upon entry.`,
      actionItem: 'Place coat check and welcome drink station at least 25 feet past the doorway to avoid entryway jams.'
    },
    {
      category: 'Sanitation & Facilities',
      requirement: 'Restroom Ratio & Waste Stream Management',
      criticalDetails: `For ${guests} attendees, a minimum of ${Math.max(2, Math.ceil(guests / 45))} dedicated restrooms/stalls are required for smooth comfort.`,
      actionItem: 'Schedule venue cleaning crew for continuous mid-event restock of paper goods, soaps, and trash disposal.'
    }
  ];

  // 4. PERSONALIZED THEME & CREATIVE CONCEPTS (3 Distinct Concepts)
  let concepts: CreativeConcept[] = [];

  if (isWedding) {
    concepts = [
      {
        id: 'c1',
        themeName: 'Tuscan Sunset Heirloom',
        tagline: 'Warm terracotta, aged limestone, and sun-drenched Italian romance',
        narrativeVibe: 'Inspired by alfresco dinners under Italian pergolas. Think warm hand-torn stationery, olive branch garlands, raw linen runners, and the glow of hundreds of amber taper candles as the sun sets over the vineyard.',
        palette: [
          { name: 'Warm Terracotta', hex: '#C06C4E', role: 'Hero Accent' },
          { name: 'Olive Grove Sage', hex: '#6B7A60', role: 'Foliage & Texture' },
          { name: 'Aged Limestone', hex: '#EBE5D8', role: 'Base Linen' },
          { name: 'Antique Florentine Gold', hex: '#D4AF37', role: 'Cutlery & Hardware' },
          { name: 'Chianti Reserve', hex: '#5E1929', role: 'Contrast Depth' }
        ],
        signatureExperience: 'Interactive Olive Oil & Balsamic Tasting Bar during cocktail hour featuring fresh focaccia wheels, followed by an alfresco family-style feast with personalized calligraphy terracotta tiles for each guest.',
        diyElements: [
          'Hand-tied rosemary sprigs with raw silk ribbon for napkin dressings',
          'Vintage brass candleholders collected from local estate markets',
          'Framed handwritten Italian cocktail recipe cards for the bar'
        ],
        professionalElements: [
          'Floating overhead greenery chandelier woven with twinkle fairy lights',
          'Professional sommelier-guided wine pairing for the main course',
          'Ceremony statement arch made of wild olive branches and garden roses'
        ],
        tablescapeAndDecor: 'Long wooden farm tables left unclad with textured natural oatmeal linen runners, ceramic pottery centerpieces, and custom etched wine glasses.',
        audioVisualAtmosphere: 'Acoustic nylon-string guitar and accordion duo during arrival; warm 2400K Edison string lights glowing as twilight settles.'
      },
      {
        id: 'c2',
        themeName: 'Modern Ethereal Monochrome',
        tagline: 'Architectural minimalism, crisp ivory silhouettes, and clean modern luxury',
        narrativeVibe: 'A contemporary museum-inspired vision for design-conscious couples. Dramatic negative space, sleek smoked black accents, ghost seating, and monochromatic clouds of baby’s breath and white calla lilies.',
        palette: [
          { name: 'Crisp Alabaster', hex: '#FDFBF7', role: 'Main Architecture' },
          { name: 'Smoked Matte Black', hex: '#1C1C1E', role: 'Structural Lines' },
          { name: 'Champagne Shimmer', hex: '#E8D8C3', role: 'Subtle Sheen' },
          { name: 'Platinum Slate', hex: '#8E9AA0', role: 'Modern Neutral' },
          { name: 'Smoky Charcoal', hex: '#343A40', role: 'Anchor Accent' }
        ],
        signatureExperience: 'A 5-tier sculptural crystal champagne coupe tower pour at the start of dancing, surrounded by cold-spark fireworks that create an unforgettable photo moment with zero smoke.',
        diyElements: [
          'Curated black-and-white family gallery wall with clean black gallery frames',
          'Minimalist acrylic drink menus with vinyl typography',
          'Custom black matches and velvet-bound guest prompt books'
        ],
        professionalElements: [
          'Architectural monochrome floral pillars (delphiniums, callas, and white roses)',
          'Custom glossy white vinyl dance floor wrap with monogrammed initials',
          'Cold-spark indoor pyrotechnics machine operation with licensed safety technician'
        ],
        tablescapeAndDecor: 'High-gloss acrylic tables with black matte flatware, smoked crystal water goblets, and low sculptural floral trough arrangements.',
        audioVisualAtmosphere: 'Chill deep-house lounge saxophone set transitioning into a high-energy European club DJ mix under kinetic moving-head lighting.'
      },
      {
        id: 'c3',
        themeName: 'Secret Garden Celestial Enchantment',
        tagline: 'Deep midnight velvet, twinkling starry canopies, and whimsical botanicals',
        narrativeVibe: 'Step into a whimsical midnight fairytale. Rich jewel-toned velvets, cascading wisteria, constellation chart seating charts, and thousands of pin-point fiber-optic fairy lights that mimic the night sky.',
        palette: [
          { name: 'Midnight Celestial Navy', hex: '#0F1C3F', role: 'Dramatic Canopy' },
          { name: 'Gilded Stardust Gold', hex: '#E5C158', role: 'Metallic Glow' },
          { name: 'Enchanted Plum Rose', hex: '#7D2E68', role: 'Romantic Floral' },
          { name: 'Misty Moonstone Grey', hex: '#A8B0BA', role: 'Ethereal Accent' },
          { name: 'Forest Emerald', hex: '#1B3B2B', role: 'Botanical Grounding' }
        ],
        signatureExperience: 'Midnight Astrologer & Tarot Lounge tucked inside an intimate velvet draped alcove, where guests receive mini 3-minute readings, paired with a smoking dry-ice elderflower cocktail.',
        diyElements: [
          'Hand-painted constellation table numbers on midnight blue watercolor cards',
          'Celestial wax seal stamps on escort card envelopes',
          'Hanging glass baubles with battery LED tea-lights in outdoor trees'
        ],
        professionalElements: [
          'Ceiling fiber-optic starlight projector installation mapping constellations',
          'Suspended lush botanical floral chandelier hanging directly over the dance floor',
          'Specialty mixologist crafting colour-shifting butterfly pea flower welcome gin drinks'
        ],
        tablescapeAndDecor: 'Plush midnight navy velvet table drapes, hammered gold chargers, plum ranunculus and thistle florals, and brass star lanterns.',
        audioVisualAtmosphere: 'Indie-folk acoustic strings performing modern love ballads (Florence + The Machine, Coldplay, Taylor Swift) into an upbeat indie dance party.'
      }
    ];
  } else if (isMilestone) {
    concepts = [
      {
        id: 'c1',
        themeName: 'Studio 54 Liquid Gold Disco Glam',
        tagline: 'High-octane 70s luxury, mirror ball explosions, and velvet decadence',
        narrativeVibe: 'Celebrate half a century or a vibrant milestone with unabashed glamour. Glittering disco balls clustered at varying heights, mirrored cocktail bars, retro typography, and a dance floor that never stops.',
        palette: [
          { name: 'Liquid Champagne Gold', hex: '#E3C16F', role: 'Hero Metallic' },
          { name: 'Onyx Midnight', hex: '#121214', role: 'Velvet Base' },
          { name: 'Burnished Bronze', hex: '#9E6A38', role: 'Warm Depth' },
          { name: 'Mirror Ball Silver', hex: '#D6DADC', role: 'Reflective Pop' },
          { name: 'Crimson Velvet', hex: '#871626', role: 'Opulent Accent' }
        ],
        signatureExperience: 'Surprise Disco Brass Flash Mob! At 9:15 PM, a 4-piece horn section wearing metallic tuxedos bursts onto the dance floor, blasting earth-shattering funk anthems.',
        diyElements: [
          'Vintage vinyl records transformed into custom table signs featuring songs from the celebrant’s youth',
          'Polaroid guestbook table with metallic sharpies and gold washi tape',
          'Retro disco ball drink swizzle sticks'
        ],
        professionalElements: [
          'High-density 15-cluster disco ball rigging with pin-spot tracking motors',
          'Professional 360-degree slow-motion video glam booth with custom gold backdrop',
          'Customized illuminated marquee numbers of the celebrant’s milestone age'
        ],
        tablescapeAndDecor: 'Black matte linens with gold chain runners, smoked mirror chargers, single-stem dark red calla lilies in chrome flutes.',
        audioVisualAtmosphere: 'Classic 70s/80s disco funk infused with modern nu-disco remixes; pulsing floor-level warm beam lighting.'
      },
      {
        id: 'c2',
        themeName: 'The Speakeasy Vault & Bourbon Lounge',
        tagline: 'Prohibition mood, rich leather, jazz melodies, and bespoke mixology',
        narrativeVibe: 'An ultra-exclusive private members club vibe. Dark mahogany wood, chesterfield leather couches, low amber lighting, and an interactive whiskey tasting journey celebrating milestones.',
        palette: [
          { name: 'Aged Bourbon Amber', hex: '#B86B26', role: 'Hero Glow' },
          { name: 'Tobacco Leather', hex: '#4A2E18', role: 'Warm Furniture' },
          { name: 'Forest Chesterfield Green', hex: '#1C3325', role: 'Velvet Accent' },
          { name: 'Antique Brushed Brass', hex: '#CBA135', role: 'Hardware' },
          { name: 'Charcoal Slate', hex: '#2B2B2B', role: 'Deep Contrast' }
        ],
        signatureExperience: 'Secret Password Entrance behind a faux vintage bookcase or velvet phone booth, greeted by a master mixologist crafting smoked Old Fashioneds branded with ice stamps.',
        diyElements: [
          'Custom newspaper front pages ("The Milestone Gazette") with humorous headlines about the celebrant’s life',
          'Repurposed vintage liquor decanters holding floral stems',
          'Wax-sealed secret password invitation cards'
        ],
        professionalElements: [
          'Live 4-piece vintage jazz/swing quintet complete with upright double bass',
          'Custom laser-cut ice cubes stamped with the celebrant’s monogram',
          'On-site artisan cigar roller or gourmet chocolate pairing master'
        ],
        tablescapeAndDecor: 'Tufted leather chesterfield vignettes, low walnut coffee tables with heavy crystal ashtrays used as votive candleholders.',
        audioVisualAtmosphere: 'Live acoustic jazz, blues, and Sinatra standards transitioning to upbeat soul and Motown classics.'
      },
      {
        id: 'c3',
        themeName: 'Miami Tropics & Neon Palms',
        tagline: 'Vibrant palms, art-deco pastels, upbeat rhythms, and poolside chic',
        narrativeVibe: 'Sun-kissed luxury meets South Beach chic. Oversized monstera fronds, neon typography, pastel coral hues, frozen craft palomas, and an energetic tropical-house sunset soundtrack.',
        palette: [
          { name: 'Sunset Coral', hex: '#F06553', role: 'Vibrant Accent' },
          { name: 'Art Deco Mint', hex: '#7ACBB5', role: 'Cool Balance' },
          { name: 'Sunken Canary Gold', hex: '#F4CA42', role: 'Sunny Pop' },
          { name: 'Crisp Cabana White', hex: '#FFFFFF', role: 'Base Linen' },
          { name: 'Lush Jungle Emerald', hex: '#1E432A', role: 'Palm Foliage' }
        ],
        signatureExperience: 'Liquid Nitrogen Sorbet Cocktail Station: A chef flashes artisan passionfruit and mango sorbet live with liquid nitrogen vapors, topping with mezcal or sparkling prosecco.',
        diyElements: [
          'Spray-painted gold monstera and palm leaves for bar and photo backdrops',
          'Custom pastel matches and printed cocktail umbrellas',
          'Framed travel snapshots of the celebrant’s favorite destinations'
        ],
        professionalElements: [
          'Custom neon sign mounted on an 8-foot living boxwood wall',
          'Live percussionist performing live bongo and timbales alongside the DJ',
          'Luxury poolside / patio cabana draping with weather-resistant velvet'
        ],
        tablescapeAndDecor: 'Crisp white tables with striped pastel napkins, tropical anthurium and bird of paradise flower arrangements in ribbed ceramic vessels.',
        audioVisualAtmosphere: 'Tropical house, Kygo-style beats, vibrant Latin rhythms, and colorful LED up-lights illuminating palm trees.'
      }
    ];
  } else {
    // Community event or festival concepts
    concepts = [
      {
        id: 'c1',
        themeName: 'Illuminated Riverwalk Lantern Solstice',
        tagline: 'Waterfront glowing lanterns, ambient indie music, and artisan night markets',
        narrativeVibe: 'A mesmerizing gathering of light and togetherness. Water-safe floating eco-lanterns, fairy-lit trees, local food artisans, and collaborative community art walls.',
        palette: [
          { name: 'Twilight Deep Indigo', hex: '#1A2A44', role: 'Night Sky Canvas' },
          { name: 'Lantern Warm Amber', hex: '#FFA726', role: 'Glow Point' },
          { name: 'River Water Teal', hex: '#26A69A', role: 'Water Reflection' },
          { name: 'Eco Kraft Sand', hex: '#D7CCC8', role: 'Artisan Materials' },
          { name: 'Festival Sunburst Yellow', hex: '#FFCA28', role: 'Joyful Accent' }
        ],
        signatureExperience: 'Synchronized Twilight Floating Lantern Release: 500 biodegradable paper water lanterns with LED tea-lights released onto the water accompanied by a live community choir performance.',
        diyElements: [
          'Community lantern decorating craft workshops with stencils and non-toxic markers',
          'Cardboard upcycled directional arrow signs painted by local youth volunteers',
          'Mason jar luminaries lining walking pathways'
        ],
        professionalElements: [
          'Certified marine safety water retrieval team for 100% eco-lantern recovery',
          'Concert-grade outdoor line-array speaker system with waterproof weather covers',
          'High-power architectural laser projection mapping onto nearby bridge or trees'
        ],
        tablescapeAndDecor: 'Long picnic community tables covered in biodegradable butcher paper with pots of native wildflowers.',
        audioVisualAtmosphere: 'Daytime indie folk and acoustic singer-songwriters building into an atmospheric ambient synth and world rhythm showcase.'
      },
      {
        id: 'c2',
        themeName: 'Harvest & Heritage Bohemian Bazaar',
        tagline: 'Farm-to-fork culinary trucks, bluegrass stomp, and rustic craftsman pavilion',
        narrativeVibe: 'Rooted, vibrant, and welcoming to all generations. Hay bale lounge clusters, macramé pavilions, craft cider tasting lanes, and energetic foot-stomping live music.',
        palette: [
          { name: 'Autumn Ochre Rust', hex: '#B25329', role: 'Warm Earth' },
          { name: 'Sage Prairie Grass', hex: '#879782', role: 'Soft Nature' },
          { name: 'Heritage Cider Gold', hex: '#DF9B38', role: 'Festive Bright' },
          { name: 'Woven Jute Khaki', hex: '#C2B69D', role: 'Organic Base' },
          { name: 'Barn Wood Chestnut', hex: '#533B27', role: 'Anchor Tone' }
        ],
        signatureExperience: 'Community Farm-to-Table Longest Lunch: A continuous 200-foot communal table where 300 neighbors break artisan sourdough bread together, curated with local agricultural vendors.',
        diyElements: [
          'Repurposed wooden pallets turned into vertical herb planters and signage',
          'Chalkboard schedule of events updated live by volunteers',
          'Burlap bunting banners sewn by community quilting groups'
        ],
        professionalElements: [
          'Covered hydraulic stage trailer with professional DMX lighting truss',
          'Heavy-duty industrial generator system with cable ramps and ADA rubber matting',
          'Inspected multi-stall luxury ADA restroom trailers with running hot water'
        ],
        tablescapeAndDecor: 'Wine barrel cocktail tables, cedar benches, burlap runners, and galvanized buckets with sunflowers and wheat sheaves.',
        audioVisualAtmosphere: 'Fiddle, banjo, and stompbox Americana during midday; upbeat brass funk band for the evening block party.'
      },
      {
        id: 'c3',
        themeName: 'Kaleidoscope Neon Urban Street Carnival',
        tagline: 'Bold graffiti murals, food truck row, breakdance battles, and LED laser spectacle',
        narrativeVibe: 'High-energy celebration of modern urban culture. Interactive live mural painting, skate exhibitions, multicultural street eats, and infectious dance rhythms.',
        palette: [
          { name: 'Electric Cyan', hex: '#00D2D3', role: 'Vibrant Neon' },
          { name: 'Hyper Magenta', hex: '#FF2A7A', role: 'Dynamic Spark' },
          { name: 'Ultra Lime', hex: '#10AC84', role: 'High Energy' },
          { name: 'Asphalt Charcoal', hex: '#222F3E', role: 'Urban Ground' },
          { name: 'Pure Solar White', hex: '#F8F9FA', role: 'Graphic Contrast' }
        ],
        signatureExperience: 'Live 40-foot Community Mural by renowned street artists where attendees of all ages can paint their handprint or message into the permanent neighborhood legacy artwork.',
        diyElements: [
          'Chalk art zone on designated paved lots for kids and families',
          'Spray-painted stencil directional ground markings',
          'Volunteer wristband and badge station created with eco-cotton lanyards'
        ],
        professionalElements: [
          'Modular outdoor pump track / skate ramp setup with certified marshals',
          'LED concert video wall displaying live audience social feeds and sponsor reels',
          'Comprehensive perimeter security checkpoint with walk-through metal detectors'
        ],
        tablescapeAndDecor: 'Repurposed steel oil drums painted in bright graffiti graphics, colorful bean bags, and high-top industrial wire tables.',
        audioVisualAtmosphere: 'Hip-hop DJs, live battle emcees, Latin percussion, and high-energy electronic dance beats.'
      }
    ];
  }

  // 5. INTERACTIVE COLLABORATION PROMPTS
  const collaborationPrompts: CollaborationPrompt[] = [
    {
      id: 'p1',
      question: 'Dietary & Mixology Nuances: Are there signature culinary traditions, cultural dietary restrictions, or mocktail-first requirements you want emphasized?',
      contextWhyItMatters: 'Food & Beverage constitutes up to 38% of your overall spend and is the #1 touchpoint guests remember. Dialing in special bar signatures and inclusive allergy-safe menus prevents day-of kitchen bottlenecks.',
      sampleOptions: [
        'Curate 2 signature craft cocktails + 1 artisanal zero-proof mocktail',
        'Incorporate heritage/cultural comfort food for late-night service',
        '100% nut-free and separate dedicated gluten-free prep station',
        'Full open bar with premium whiskey and local vineyard wines'
      ]
    },
    {
      id: 'p2',
      question: 'Weather & Contingency Plan B: What is your exact threshold and timeline for pivoting outdoors vs. indoors or ordering tent sidewalls?',
      contextWhyItMatters: `Your chosen venue (${input.location}) requires clear weather trigger criteria. Tenting and space heaters require 48-72 hours advance notice before suppliers reserve inventory for other events.`,
      sampleOptions: [
        'Venue has built-in indoor ballroom with seamless 2-hour flip',
        'Require a clear-top marquee tent on standby with 72-hr weather check',
        'Outdoor event is rain-or-shine; arrange umbrellas and covered pavilion',
        'Need EventGenie to compute exact heater & sidewall rental costs'
      ]
    },
    {
      id: 'p3',
      question: 'Key Milestone Moments & Speeches: What family traditions, emotional toasts, or surprise reveals must be given prime real estate on the schedule?',
      contextWhyItMatters: 'Events lose energy when speeches drag over 15 minutes or occur when dinner is served cold. Structuring micro-speeches between courses protects the event’s emotional momentum.',
      sampleOptions: [
        'Strict 3-minute cap on 3 keynote speeches between courses',
        'Surprise tribute video / multimedia slideshow during dessert',
        'Cultural dance / ceremonial ritual immediately following grand entrance',
        'Keep formal speeches minimal; maximize open dance floor time'
      ]
    }
  ];

  // Compose Pristine Markdown version
  const fullMarkdown = `# EVENTGENIE MASTER EVENT PLAN
**Event:** ${input.title}
**Event Type:** ${input.eventType.toUpperCase()}
**Location:** ${input.location}
**Guest Count:** ${guests} Guests | **Total Budget:** $${budget.toLocaleString()} ($${perGuest}/guest)
**Aesthetic & Vibe:** ${input.vibe}

---

## 1. BUDGET ALLOCATION MATRIX

Total Budget: **$${budget.toLocaleString()}** (Estimated **$${perGuest}** per guest across ${guests} attendees)
Contingency Buffer: **$${Math.round(budget * 0.08).toLocaleString()} (8%)** reserved for emergency adaptations.

| Category | Allocation (%) | Dollar Amount | Core Inclusions |
| :--- | :---: | :---: | :--- |
${categories.map(c => `| **${c.category}** | ${c.percentage}% | $${c.amount.toLocaleString()} | ${c.items.join(', ')} |`).join('\n')}

### Cost-Saving Tips Tailored to Your Theme & Budget:
${tips.map(t => `- **${t.split(':')[0]}:** ${t.split(':')[1] || t}`).join('\n')}

---

## 2. REVERSE TIMELINE & MILESTONES

${milestones.map(m => `### ${m.period} — ${m.focusTitle}
*${m.description}*  
**${m.bookingWindow}**
${m.tasks.map(t => `- [ ] ${t.task}${t.deadlineNote ? ` *(Note: ${t.deadlineNote})*` : ''}`).join('\n')}
`).join('\n')}

### Day-Of Master Run of Show:
${dayOfSchedule.map(s => `- **${s.time}** | **${s.activity}** (Lead: *${s.leadPerson}*)\n  *Details:* ${s.notes}`).join('\n')}

---

## 3. VENDOR & LOGISTICS CHECKLIST

### Essential Vendors & Critical Interview Inquiries:
${vendors.map(v => `#### ${v.role} (${v.category}) — Est. ${v.budgetEstimate}
**Critical Questions to Ask Before Signing:**
${v.criticalQuestions.map(q => `- "${q}"`).join('\n')}
**Red Flags to Watch Out For:**
${v.redFlags.map(rf => `- ⚠️ ${rf}`).join('\n')}
`).join('\n')}

### Essential Logistics Checklist:
${logistics.map(l => `- **${l.category} (${l.requirement}):** ${l.criticalDetails}\n  *Action Item:* ${l.actionItem}`).join('\n')}

---

## 4. PERSONALIZED THEME & CREATIVE CONCEPTS

${concepts.map((c, i) => `### Concept ${i + 1}: ${c.themeName}
*"${c.tagline}"*
- **Vibe & Narrative:** ${c.narrativeVibe}
- **Curated Color Palette:**
${c.palette.map(p => `  - **${p.name}** (\`${p.hex}\`): ${p.role}`).join('\n')}
- **Signature Experience / Wow Moment:** ${c.signatureExperience}
- **DIY Elements (Smart Savings):**
${c.diyElements.map(diy => `  - ${diy}`).join('\n')}
- **Professional Splurges (High Impact):**
${c.professionalElements.map(pro => `  - ${pro}`).join('\n')}
- **Tablescape & Atmosphere:** ${c.tablescapeAndDecor} | ${c.audioVisualAtmosphere}
`).join('\n')}

---

## 5. INTERACTIVE COLLABORATION PROMPTS

Refine your master plan further by considering these strategic questions:
${collaborationPrompts.map((p, idx) => `${idx + 1}. **${p.question}**
   - *Why It Matters:* ${p.contextWhyItMatters}
   - *Recommended Approaches:* ${p.sampleOptions.join(' | ')}
`).join('\n')}

*Generated by EventGenie — Elite AI Event Master Planner.*
`;

  return {
    id: 'plan_' + Date.now(),
    createdAt: new Date().toISOString(),
    eventInput: input,
    budgetMatrix: {
      totalBudget: budget,
      perGuestCost: perGuest,
      contingencyBufferAmount: Math.round(budget * 0.08),
      contingencyBufferPercent: 8,
      categories,
      themeSpecificSavingsTips: tips
    },
    timeline: {
      milestones,
      dayOfSchedule
    },
    vendorAndLogistics: {
      vendors,
      logistics
    },
    creativeConcepts: concepts,
    collaborationPrompts,
    executiveSummary: `Master event strategy for "${input.title}". Cohesive execution plan designed for ${guests} guests in ${input.location} with a calibrated $${budget.toLocaleString()} budget, featuring 3 signature design concepts and reverse operational timelines.`,
    fullMarkdown
  };
}
