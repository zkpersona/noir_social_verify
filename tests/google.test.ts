import { beforeAll, describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  type ZKEmailProver,
  createProver,
  generateCircuitInputs,
} from '../src';

import circuit from '../target/google_example.json' assert { type: 'json' };

import type { CompiledCircuit } from '@noir-lang/noir_js';
import { skipHonkProving, skipPlonkProving } from './constants';

describe('Google Email Verification', () => {
  let prover: ZKEmailProver;

  beforeAll(() => {
    const threads = os.cpus().length;
    prover = createProver(circuit as CompiledCircuit, {
      type: 'all',
    });
  });

  it.skipIf(skipHonkProving)(
    'should verify a valid google email using honk backend',
    async () => {
      const emailContent = readFileSync(
        path.join(__dirname, '../data/google-valid.eml')
      );
      const inputs = await generateCircuitInputs(emailContent, 'google');

      const proof = await prover.fullProve(inputs, { type: 'honk' });
      const isVerified = await prover.verify(proof, { type: 'honk' });

      expect(isVerified).toBe(true);
    }
  );

  it.skipIf(skipPlonkProving)(
    'should verify a valid google email using plonk backend',
    async () => {
      const emailContent = readFileSync(
        path.join(__dirname, '../data/google-valid.eml')
      );
      const inputs = await generateCircuitInputs(emailContent, 'google');

      const proof = await prover.fullProve(inputs, { type: 'plonk' });
      const isVerified = await prover.verify(proof, { type: 'plonk' });

      expect(isVerified).toBe(true);
    }
  );
});
