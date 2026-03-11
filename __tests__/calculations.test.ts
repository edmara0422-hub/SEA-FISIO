import { describe, it, expect } from 'vitest'
import { calcDP, calcCest, calcRSBI, calcPF, calcROX } from '@/lib/vm-calcs'
import { calcPesoIdeal, calcGlasgow } from '@/lib/icu-calcs'
import { validateVentilation, validateGasometry } from '@/lib/schemas/clinical'

describe('VM Calculations', () => {
  describe('calcDP - Driving Pressure', () => {
    it('should calculate driving pressure correctly', () => {
      const dp = calcDP(25, 5)
      expect(dp).toBe(20)
    })

    it('should handle edge cases', () => {
      expect(calcDP(30, 30)).toBe(0)
      expect(calcDP(10, 0)).toBe(10)
    })

    it('should return null for invalid inputs', () => {
      expect(calcDP(NaN, 5)).toBeNull()
      expect(calcDP(25, NaN)).toBeNull()
    })
  })

  describe('calcCest - Static Compliance', () => {
    it('should calculate compliance correctly', () => {
      const cest = calcCest(500, 20)
      expect(cest).toBeCloseTo(25, 1)
    })

    it('should handle zero driving pressure', () => {
      expect(calcCest(500, 0)).toBeNull()
    })
  })

  describe('calcRSBI - Rapid Shallow Breathing Index', () => {
    it('should calculate RSBI correctly', () => {
      const rsbi = calcRSBI(30, 400)
      expect(rsbi).toBeCloseTo(0.075, 3)
    })

    it('should favor lower frequency and higher volume', () => {
      const rsbi1 = calcRSBI(30, 400)
      const rsbi2 = calcRSBI(40, 300)
      expect(rsbi1).toBeLessThan(rsbi2)
    })
  })

  describe('calcPF - P/F Ratio', () => {
    it('should calculate P/F ratio correctly', () => {
      const pf = calcPF(100, 50)
      expect(pf).toBe(200)
    })

    it('should handle different oxygen fractions', () => {
      expect(calcPF(100, 21)).toBe(476)
      expect(calcPF(100, 100)).toBe(100)
    })
  })

  describe('calcROX - ROX Index', () => {
    it('should calculate ROX index correctly', () => {
      const rox = calcROX(95, 40, 20)
      expect(rox).toBeGreaterThan(0)
    })

    it('should reflect high SpO2 and low FiO2', () => {
      const rox1 = calcROX(98, 30, 20)
      const rox2 = calcROX(90, 60, 30)
      expect(rox1).toBeGreaterThan(rox2)
    })
  })
})

describe('ICU Calculations', () => {
  describe('calcPesoIdeal - Ideal Body Weight', () => {
    it('should calculate IBW for male', () => {
      const pbw = calcPesoIdeal(170, 'M')
      expect(pbw).toBeCloseTo(72.5, 1)
    })

    it('should calculate IBW for female', () => {
      const pbw = calcPesoIdeal(160, 'F')
      expect(pbw).toBeCloseTo(58, 1)
    })

    it('should handle different heights', () => {
      const pbw1 = calcPesoIdeal(150, 'M')
      const pbw2 = calcPesoIdeal(180, 'M')
      expect(pbw2).toBeGreaterThan(pbw1)
    })
  })

  describe('calcGlasgow - Glasgow Coma Scale', () => {
    it('should calculate max Glasgow score', () => {
      const gcs = calcGlasgow(4, 5, 6)
      expect(gcs.total).toBe(15)
      expect(gcs.interp).toContain('Normal')
    })

    it('should classify severe coma', () => {
      const gcs = calcGlasgow(2, 1, 3)
      expect(gcs.total).toBe(6)
      expect(gcs.interp).toContain('Grave')
    })

    it('should handle intubated patients', () => {
      const gcs = calcGlasgow(4, 'T', 6)
      expect(gcs.total).toBeLessThanOrEqual(14)
    })
  })
})

describe('Schema Validation', () => {
  describe('Ventilation Schema', () => {
    it('should validate correct ventilation parameters', () => {
      const result = validateVentilation({
        fr: 16,
        peep: 5,
        peakPressure: 25,
        platoPressure: 20,
        tidalVolume: 500,
        fio2: 40,
        flowRate: 50,
      })

      expect(result.success).toBe(true)
    })

    it('should reject invalid FR', () => {
      const result = validateVentilation({
        fr: 50, // Invalid: max 40
        peep: 5,
        peakPressure: 25,
        platoPressure: 20,
        tidalVolume: 500,
        fio2: 40,
        flowRate: 50,
      })

      expect(result.success).toBe(false)
    })

    it('should reject negative PEEP', () => {
      const result = validateVentilation({
        fr: 16,
        peep: -5, // Invalid: min 0
        peakPressure: 25,
        platoPressure: 20,
        tidalVolume: 500,
        fio2: 40,
        flowRate: 50,
      })

      expect(result.success).toBe(false)
    })
  })

  describe('Gasometry Schema', () => {
    it('should validate correct gasometry', () => {
      const result = validateGasometry({
        pao2: 90,
        paco2: 40,
        pH: 7.35,
        spo2: 95,
      })

      expect(result.success).toBe(true)
    })

    it('should reject invalid pH', () => {
      const result = validateGasometry({
        pao2: 90,
        paco2: 40,
        pH: 8.5, // Invalid: max 7.8
        spo2: 95,
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('Integration Tests', () => {
  it('should perform complete VM assessment', () => {
    const vmParams = {
      fr: 16,
      peep: 5,
      peakPressure: 25,
      platoPressure: 20,
      tidalVolume: 500,
      fio2: 40,
      pao2: 90,
      spo2: 95,
      vc: 400,
      flow: 50,
    }

    expect(validateVentilation(vmParams).success).toBe(true)

    const dp = calcDP(vmParams.platoPressure, vmParams.peep)
    expect(dp).toBe(15)

    const cest = calcCest(vmParams.tidalVolume, dp)
    expect(cest).toBeCloseTo(33.33, 1)

    const rsbi = calcRSBI(vmParams.fr, vmParams.vc)
    expect(rsbi).toBeLessThan(1)

    const pf = calcPF(vmParams.pao2, vmParams.fio2)
    expect(pf).toBe(225)
  })
})
