import mongoose from 'mongoose';
import { Car } from './carModel.js';

describe('Car model', () => {
  const userId = new mongoose.Types.ObjectId();

  it('accepts a valid car', () => {
    const car = new Car({
      brand: 'Toyota',
      model: 'Corolla',
      km_range: 45000,
      user: userId
    });

    expect(car.validateSync()).toBeUndefined();
  });

  it('requires brand', () => {
    const car = new Car({
      model: 'Corolla',
      km_range: 45000
    });

    const error = car.validateSync();

    expect(error?.errors.brand).toBeDefined();
  });

  it('requires model', () => {
    const car = new Car({
      brand: 'Toyota',
      km_range: 45000
    });

    const error = car.validateSync();

    expect(error?.errors.model).toBeDefined();
  });

  it('requires km_range', () => {
    const car = new Car({
      brand: 'Toyota',
      model: 'Corolla'
    });

    const error = car.validateSync();

    expect(error?.errors.km_range).toBeDefined();
  });

  it('accepts a car without an optional user reference', () => {
    const car = new Car({
      brand: 'Toyota',
      model: 'Corolla',
      km_range: 45000
    });

    expect(car.validateSync()).toBeUndefined();
  });

  it('rejects a non-numeric km_range', () => {
    const car = new Car({
      brand: 'Toyota',
      model: 'Corolla',
      km_range: 'invalid'
    });

    const error = car.validateSync();

    expect(error?.errors.km_range).toBeDefined();
  });
});