import type { Opening } from '../types';
import { caroKann } from './caroKann';
import { sicilianDefense } from './sicilianDefense';
import { frenchDefense } from './frenchDefense';
import { scandinavianDefense } from './scandinavianDefense';
import { kingsIndianDefense } from './kingsIndianDefense';
import { italianGame } from './italianGame';
import { ruyLopez } from './ruyLopez';
import { queensGambit } from './queensGambit';
import { londonSystem } from './londonSystem';

/**
 * The registry of trainable openings. To add a new opening, author it as a list
 * of SAN lines in its own file and append it here — the trainer, picker, and
 * progress tracking pick it up automatically. The first entry is the default.
 *
 * Grouped Black-then-White for a tidy sidebar.
 */
export const OPENINGS: Opening[] = [
  // Black
  caroKann,
  sicilianDefense,
  frenchDefense,
  scandinavianDefense,
  kingsIndianDefense,
  // White
  italianGame,
  ruyLopez,
  queensGambit,
  londonSystem,
];

export function getOpening(id: string): Opening | undefined {
  return OPENINGS.find((o) => o.id === id);
}

export {
  caroKann,
  sicilianDefense,
  frenchDefense,
  scandinavianDefense,
  kingsIndianDefense,
  italianGame,
  ruyLopez,
  queensGambit,
  londonSystem,
};
