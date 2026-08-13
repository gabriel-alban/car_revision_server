import mongoose from 'mongoose';
import { Revision } from './revisionModel.js';
import { RevisionType } from '../types/revision.js';

describe('Revision model', () => {
  const carId = new mongoose.Types.ObjectId();

  it('accepts a valid revision', () => {
    const revision = new Revision({
      revision_title: 'Oil change',
      revision_description: 'Replace engine oil and oil filter',
      current_km_number: 45000,
      next_km_number: 55000,
      revision_type: RevisionType.CONSUMABLE,
      date: new Date('2026-08-13'),
      sendAlert: true,
      car: carId
    });

    expect(revision.validateSync()).toBeUndefined();
  });

  it('applies default values', () => {
    const revision = new Revision({
      revision_title: 'Oil change',
      current_km_number: 45000
    });

    expect(revision.revision_type).toBe(RevisionType.CONSUMABLE);
    expect(revision.sendAlert).toBe(true);
    expect(revision.date).toBeInstanceOf(Date);
  });

  it('requires revision_title', () => {
    const revision = new Revision({
      current_km_number: 45000
    });

    const error = revision.validateSync();

    expect(error?.errors.revision_title).toBeDefined();
    expect(error?.errors.revision_title.message).toBe('Revision title is required');
  });

  it('requires current_km_number', () => {
    const revision = new Revision({
      revision_title: 'Oil change'
    });

    const error = revision.validateSync();

    expect(error?.errors.current_km_number).toBeDefined();
    expect(error?.errors.current_km_number.message).toBe('Current number of km');
  });

  it('rejects an invalid revision type', () => {
    const revision = new Revision({
      revision_title: 'Oil change',
      current_km_number: 45000,
      revision_type: 'inspection'
    });

    const error = revision.validateSync();

    expect(error?.errors.revision_type).toBeDefined();
  });

  it('rejects a non-numeric current kilometre value', () => {
    const revision = new Revision({
      revision_title: 'Oil change',
      current_km_number: 'invalid'
    });

    const error = revision.validateSync();

    expect(error?.errors.current_km_number).toBeDefined();
  });

  it('preserves sendAlert when set to false', () => {
    const revision = new Revision({
      revision_title: 'Oil change',
      current_km_number: 45000,
      sendAlert: false
    });

    expect(revision.sendAlert).toBe(false);
  });

  it('casts date strings to Date objects', () => {
    const revision = new Revision({
      revision_title: 'Oil change',
      current_km_number: 45000,
      date: '2026-08-13'
    });

    expect(revision.date).toBeInstanceOf(Date);
  });

  it('defines the car field as a Car reference', () => {
    const carPath = Revision.schema.path('car');

    expect(carPath.options.ref).toBe('Car');
  });
});