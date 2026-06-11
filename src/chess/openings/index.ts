import type { Opening } from '../types';
// Black
import { caroKann } from './caroKann';
import { sicilianDefense } from './sicilianDefense';
import { frenchDefense } from './frenchDefense';
import { scandinavianDefense } from './scandinavianDefense';
import { pircDefense } from './pircDefense';
import { petroffDefense } from './petroffDefense';
import { alekhineDefense } from './alekhineDefense';
import { kingsIndianDefense } from './kingsIndianDefense';
import { nimzoIndian } from './nimzoIndian';
import { queensIndian } from './queensIndian';
import { queensGambitDeclined } from './queensGambitDeclined';
import { grunfeldDefense } from './grunfeldDefense';
import { dutchDefense } from './dutchDefense';
// White
import { italianGame } from './italianGame';
import { ruyLopez } from './ruyLopez';
import { scotchGame } from './scotchGame';
import { viennaGame } from './viennaGame';
import { kingsGambit } from './kingsGambit';
import { queensGambit } from './queensGambit';
import { catalan } from './catalan';
import { londonSystem } from './londonSystem';
import { englishOpening } from './englishOpening';

/**
 * The registry of trainable openings. To add a new opening, author it as a list
 * of SAN lines in its own file and append it here — the trainer, picker, and
 * progress tracking pick it up automatically. The first entry is the default.
 *
 * Grouped Black-then-White; the sidebar re-groups them by colour for display.
 */
export const OPENINGS: Opening[] = [
  // Black — vs 1.e4
  caroKann,
  sicilianDefense,
  frenchDefense,
  scandinavianDefense,
  pircDefense,
  petroffDefense,
  alekhineDefense,
  // Black — vs 1.d4
  kingsIndianDefense,
  nimzoIndian,
  queensIndian,
  queensGambitDeclined,
  grunfeldDefense,
  dutchDefense,
  // White
  italianGame,
  ruyLopez,
  scotchGame,
  viennaGame,
  kingsGambit,
  queensGambit,
  catalan,
  londonSystem,
  englishOpening,
];

export function getOpening(id: string): Opening | undefined {
  return OPENINGS.find((o) => o.id === id);
}

export {
  caroKann,
  sicilianDefense,
  frenchDefense,
  scandinavianDefense,
  pircDefense,
  petroffDefense,
  alekhineDefense,
  kingsIndianDefense,
  nimzoIndian,
  queensIndian,
  queensGambitDeclined,
  grunfeldDefense,
  dutchDefense,
  italianGame,
  ruyLopez,
  scotchGame,
  viennaGame,
  kingsGambit,
  queensGambit,
  catalan,
  londonSystem,
  englishOpening,
};
