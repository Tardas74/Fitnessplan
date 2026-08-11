/**
 * Rezept-Pools und Rotation nach ISO-Woche
 */

export function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  return 1 + Math.round((d - firstThursday) / (7 * 24 * 3600 * 1000));
}

export const BREAKFAST_POOL = [
  {
    title: 'Porridge-Bowl mit Beeren & Protein',
    zutaten: '70 g Haferflocken, 200 g Naturjoghurt (3,5%), 100 g TK-Beeren, 30 g Proteinpulver, 50 ml Milch',
    zubereitung: 'Haferflocken mit Milch/etwas Wasser kurz aufkochen oder über Nacht einweichen. Joghurt und Proteinpulver unterrühren, mit Beeren toppen.',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
    link: 'https://www.chefkoch.de/rezepte/search.html?q=porridge',
    kcal: 565,
    protein: 46,
    fett: 15,
    kohlenhydrate: 64,
  },
  {
    title: 'Rührei-Wrap mit Räucherlachs',
    zutaten: '3 Eier, 50 g Räucherlachs, 1 Vollkorn-Wrap, 1 EL Frischkäse light, Rucola',
    zubereitung: 'Eier verrühren und stocken lassen, mit Frischkäse, Lachs und Rucola im Wrap rollen.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
    link: 'https://www.chefkoch.de/rezepte/search.html?q=lachs+wrap',
    kcal: 490,
    protein: 38,
    fett: 24,
    kohlenhydrate: 28,
  },
  {
    title: 'Skyr-Bowl mit Nüssen & Apfel',
    zutaten: '250 g Skyr, 1 Apfel, 25 g Walnüsse, 1 TL Honig, Zimt',
    zubereitung: 'Skyr in eine Schale geben, Apfel würfeln, mit Nüssen, Honig und Zimt toppen.',
    image: 'https://images.unsplash.com/photo-1553530666-ba953a5c922f?w=400&h=300&fit=crop',
    link: 'https://www.chefkoch.de/rezepte/search.html?q=joghurt+bowl',
    kcal: 430,
    protein: 38,
    fett: 16,
    kohlenhydrate: 32,
  },
  {
    title: 'Vollkorntoast mit Avocado & Ei',
    zutaten: '2 Scheiben Vollkornbrot, ½ Avocado, 2 Eier, Kirschtomaten, Salz/Pfeffer/Chiliflocken',
    zubereitung: 'Brot toasten, Avocado zerdrücken und darauf verteilen, Eier und halbierte Tomaten obenauf.',
    image: 'https://images.unsplash.com/photo-1552332386-7d5a1d5e2b1f?w=400&h=300&fit=crop',
    link: 'https://www.chefkoch.de/rezepte/search.html?q=avocado+toast',
    kcal: 470,
    protein: 24,
    fett: 26,
    kohlenhydrate: 34,
  },
];

export const LUNCH_POOL = [
  {
    title: 'Hähnchen-Caesar-Salat + Ei',
    zutaten: '250 g Fertig-Hähnchensalat, 1 hartgekochtes Ei',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    link: 'https://www.chefkoch.de/rezepte/search.html?q=caesar+salat',
    kcal: 515,
    protein: 43,
    fett: 24,
    kohlenhydrate: 25,
  },
  {
    title: 'Vollkorn-Wrap mit Hähnchen',
    zutaten: '1 Vollkorn-Wrap, 120 g Hähnchenbrust, Salat/Tomate/Gurke, Joghurt-Dip, 20 g Mandeln',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cda1ec?w=400&h=300&fit=crop',
    link: 'https://www.chefkoch.de/rezepte/search.html?q=haehnchen+wrap',
    kcal: 520,
    protein: 44,
    fett: 20,
    kohlenhydrate: 42,
  },
  {
    title: 'Proteinshake + Obst + Nüsse',
    zutaten: '30 g Proteinpulver + Wasser, 1 Banane, 20 g Nüsse',
    image: 'https://images.unsplash.com/photo-1590080876591-cd94e41b3b8f?w=400&h=300&fit=crop',
    link: 'https://www.eatsmarter.de/rezepte/proteinshake',
    kcal: 375,
    protein: 29,
    fett: 12,
    kohlenhydrate: 33,
  },
  {
    title: 'Linsen-Salat mit Feta',
    zutaten: '150 g rote Linsen (gekocht), 50 g Feta, Gurke, Tomaten, Olivenöl, Zitrone',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    link: 'https://www.chefkoch.de/rezepte/search.html?q=linsen+salat',
    kcal: 480,
    protein: 26,
    fett: 20,
    kohlenhydrate: 48,
  },
  {
    title: 'Pute-Reis-Bowl',
    zutaten: '150 g Putenbrust, 100 g Reis (gekocht), gemischtes Gemüse, Sojasauce',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    link: 'https://www.chefkoch.de/rezepte/search.html?q=pute+reis+bowl',
    kcal: 520,
    protein: 42,
    fett: 10,
    kohlenhydrate: 60,
  },
  {
    title: 'Thunfisch-Nudelsalat',
    zutaten: '1 Dose Thunfisch, 80 g Vollkornnudeln, Mais, Joghurt-Dressing',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    link: 'https://www.chefkoch.de/rezepte/search.html?q=thunfisch+nudelsalat',
    kcal: 490,
    protein: 38,
    fett: 12,
    kohlenhydrate: 55,
  },
];

export const DINNER_POOL = [
  {
    title: 'Hähnchenbrust mit großem Salat',
    zutaten: '220 g Hähnchenbrust, großer Salat, Olivenöl-Dressing',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    link: 'https://www.chefkoch.de/rezepte/search.html?q=haehnchen+salat',
    kcal: 520,
    protein: 68,
    fett: 24,
    kohlenhydrate: 4,
  },
  {
    title: 'Lachs mit Ofengemüse',
    zutaten: '180 g Lachsfilet, 250 g Ofengemüse, Olivenöl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    link: 'https://www.chefkoch.de/rezepte/search.html?q=lachs+ofengemuese',
    kcal: 520,
    protein: 42,
    fett: 34,
    kohlenhydrate: 12,
  },
  {
    title: 'Omelett mit Gemüse & Feta',
    zutaten: '3 Eier, 150 g Gemüse, 50 g Feta, Salat',
    image: 'https://images.unsplash.com/photo-1585238341710-4b2e6b63b51d?w=400&h=300&fit=crop',
    link: 'https://www.chefkoch.de/rezepte/search.html?q=omelett',
    kcal: 495,
    protein: 29,
    fett: 27,
    kohlenhydrate: 9,
  },
  {
    title: 'Rührei mit Speck, Avocado & Tomaten',
    zutaten: '3 Eier, 40 g Speck, ½ Avocado, Tomaten',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    link: 'https://www.chefkoch.de/rezepte/search.html?q=ruehrei',
    kcal: 465,
    protein: 31,
    fett: 33,
    kohlenhydrate: 11,
  },
  {
    title: 'Hackfleischpfanne mit Kichererbsen',
    zutaten: '200 g Rinderhack, 100 g Kichererbsen, Salat',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    link: 'https://www.chefkoch.de/rezepte/search.html?q=hackfleisch',
    kcal: 570,
    protein: 46,
    fett: 25,
    kohlenhydrate: 20,
  },
  {
    title: 'Putenschnitzel mit Brokkoli',
    zutaten: '200 g Putenschnitzel, 300 g Brokkoli, Butter',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop',
    link: 'https://www.chefkoch.de/rezepte/search.html?q=putenschnitzel',
    kcal: 450,
    protein: 50,
    fett: 20,
    kohlenhydrate: 8,
  },
];

export function getRecipesForWeek(monday) {
  const weekNum = getISOWeek(monday);

  const breakfast = BREAKFAST_POOL[weekNum % BREAKFAST_POOL.length];

  // Lunch: 4 verschiedene Rezepte für die Woche
  const lunches = [];
  for (let i = 0; i < 4; i++) {
    lunches.push(LUNCH_POOL[(weekNum + i) % LUNCH_POOL.length]);
  }

  // Dinner: 6 verschiedene Rezepte für die Woche
  const dinners = [];
  for (let i = 0; i < 6; i++) {
    dinners.push(DINNER_POOL[(weekNum + i) % DINNER_POOL.length]);
  }

  return { weekNum, breakfast, lunches, dinners };
}
