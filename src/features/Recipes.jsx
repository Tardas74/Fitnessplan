import React, { useMemo } from 'react';
import { getRecipesForWeek } from '../utils/recipes';
import { getWeekMonday } from '../utils/icsParser';
import './Recipes.css';

export function Recipes() {
  const monday = useMemo(() => getWeekMonday(new Date()), []);
  const { weekNum, breakfast, lunches, dinners } = useMemo(
    () => getRecipesForWeek(monday),
    [monday]
  );

  const RecipeCard = ({ recipe }) => (
    <div className="recipe-card">
      <h3 className="recipe-title">{recipe.title}</h3>
      {recipe.zutaten && (
        <p className="recipe-text">
          <strong>Zutaten:</strong> {recipe.zutaten}
        </p>
      )}
      {recipe.zubereitung && (
        <p className="recipe-text">
          <strong>Zubereitung:</strong> {recipe.zubereitung}
        </p>
      )}
      <div className="recipe-macros">
        <span className="macro kcal">{recipe.kcal} kcal</span>
        <span className="macro protein">{recipe.protein}g EW</span>
        <span className="macro fett">{recipe.fett}g F</span>
        <span className="macro kohlenhydrate">{recipe.kohlenhydrate}g KH</span>
      </div>
      {recipe.link && (
        <a href={recipe.link} target="_blank" rel="noopener noreferrer" className="recipe-link">
          Zum Rezept →
        </a>
      )}
    </div>
  );

  return (
    <div className="recipes-container">
      <div className="week-label">
        KW {weekNum} – Diese Woche
      </div>

      {/* Kalorienziel (oben) */}
      <div className="recipe-section">
        <h2 className="section-title">Kalorienziel</h2>
        <div className="kcal-grid">
          <div className="kcal-box">
            <div className="kcal-value">2.300–2.500</div>
            <div className="kcal-label">kcal/Tag · Basis</div>
          </div>
          <div className="kcal-box accent">
            <div className="kcal-value">2.500–2.700</div>
            <div className="kcal-label">kcal/Tag · Trainingstage</div>
          </div>
          <div className="kcal-box">
            <div className="kcal-value">150–170 g</div>
            <div className="kcal-label">Eiweiß/Tag</div>
          </div>
        </div>
        <p className="kcal-note">
          Berechnung (Mifflin-St-Jeor): Grundumsatz bei aktuell 90 kg ≈ 1.810
          kcal, bei Zielgewicht 84 kg ≈ 1.750 kcal. Mit Aktivitätsfaktor ≈1,6
          ergibt sich ein Gesamtumsatz von ca. 2.850–2.900 kcal/Tag. Zielkorridor
          bei moderatem Defizit: 2.300–2.500 kcal, an Trainingstagen etwas höher.
        </p>
      </div>

      {/* Breakfast */}
      <div className="recipe-section">
        <h2 className="section-title">Frühstück</h2>
        <RecipeCard recipe={breakfast} />
      </div>

      {/* Lunches */}
      <div className="recipe-section">
        <h2 className="section-title">Mittag – diese Woche</h2>
        <div className="recipe-grid">
          {lunches.map((recipe, idx) => (
            <RecipeCard key={idx} recipe={recipe} />
          ))}
        </div>
      </div>

      {/* Dinners */}
      <div className="recipe-section">
        <h2 className="section-title">Abend – wenig Kohlenhydrate</h2>
        <div className="recipe-grid">
          {dinners.map((recipe, idx) => (
            <RecipeCard key={idx} recipe={recipe} />
          ))}
        </div>
      </div>

      {/* Snacks */}
      <div className="recipe-section">
        <h2 className="section-title">Auffüll-Snacks (Trainingstage)</h2>
        <p className="snacks-text">
          Frühstück + Mittag + Abend ergeben zusammen ca. 1.550–1.700 kcal. Zum
          Auffüllen: Nüsse+Apfel (~250 kcal), zweiter Proteinshake (~150 kcal),
          Hüttenkäse mit Ananas (~200 kcal), Vollkornbrot mit Frischkäse (~180
          kcal).
        </p>
      </div>
    </div>
  );
}
