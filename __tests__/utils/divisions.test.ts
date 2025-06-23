import { calculateDivisions, DivisionParticipant } from '../../app/utils/division';

describe('calculateDivisions', () => {
  const userIds = ['u1', 'u2', 'u3'];

  describe('equal mode', () => {
    it('distribuye equitativamente entre participantIds', () => {
      const result = calculateDivisions('equal', 90, undefined, userIds);
      expect(result).toEqual([
        { userId: 'u1', amountOwed: 30 },
        { userId: 'u2', amountOwed: 30 },
        { userId: 'u3', amountOwed: 30 },
      ]);
    });

    it('distribuye equitativamente usando participants sin valores', () => {
      const participants: DivisionParticipant[] = userIds.map((id) => ({ userId: id }));
      const result = calculateDivisions('equal', 60, participants);
      expect(result).toEqual([
        { userId: 'u1', amountOwed: 20 },
        { userId: 'u2', amountOwed: 20 },
        { userId: 'u3', amountOwed: 20 },
      ]);
    });

    it('lanza error si no hay participantes', () => {
      expect(() => calculateDivisions('equal', 50)).toThrow('Se requieren participantes');
    });
  });

  describe('percentage mode', () => {
    it('calcula correctamente con porcentajes válidos', () => {
      const participants = [
        { userId: 'u1', value: 50 },
        { userId: 'u2', value: 30 },
        { userId: 'u3', value: 20 },
      ];
      const result = calculateDivisions('percentage', 100, participants);
      expect(result).toEqual([
        { userId: 'u1', amountOwed: 50 },
        { userId: 'u2', amountOwed: 30 },
        { userId: 'u3', amountOwed: 20 },
      ]);
    });

    it('lanza error si los porcentajes no suman 100', () => {
      const invalid = [
        { userId: 'u1', value: 40 },
        { userId: 'u2', value: 30 },
      ];
      expect(() => calculateDivisions('percentage', 100, invalid)).toThrow('Los porcentajes deben sumar 100');
    });

    it('lanza error si no hay participantes', () => {
      expect(() => calculateDivisions('percentage', 100)).toThrow('Se requieren participantes con valores');
    });
  });

  describe('custom mode', () => {
    it('calcula correctamente si los valores suman el total', () => {
      const participants = [
        { userId: 'u1', value: 60 },
        { userId: 'u2', value: 40 },
      ];
      const result = calculateDivisions('custom', 100, participants);
      expect(result).toEqual([
        { userId: 'u1', amountOwed: 60 },
        { userId: 'u2', amountOwed: 40 },
      ]);
    });

    it('lanza error si los valores no suman el total', () => {
      const participants = [
        { userId: 'u1', value: 30 },
        { userId: 'u2', value: 40 },
      ];
      expect(() => calculateDivisions('custom', 100, participants)).toThrow('Los valores deben sumar el total del gasto');
    });

    it('lanza error si no hay participantes', () => {
      expect(() => calculateDivisions('custom', 100)).toThrow('Se requieren participantes con valores');
    });
  });

  it('lanza error con modo desconocido', () => {
    expect(() => calculateDivisions('invalid-mode' as any, 100)).toThrow('Modo de división no válido: invalid-mode');
  });
});
