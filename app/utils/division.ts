export type DivisionParticipant = {
    userId: string;
    value?: number;
  };
  
  export type DivisionMode = 'equal' | 'percentage' | 'custom';
  
  export function calculateDivisions(
    mode: DivisionMode,
    amount: number,
    participants?: DivisionParticipant[],
    participantIds?: string[]
  ): { userId: string; amountOwed: number }[] {
    if (mode === 'equal') {
      const ids = participantIds ?? participants?.map((p) => p.userId) ?? [];
      if (ids.length === 0) throw new Error('Se requieren participantes');
      const share = amount / ids.length;
      return ids.map((userId) => ({ userId, amountOwed: share }));
    }
  
    if (!participants || participants.length === 0) {
      throw new Error('Se requieren participantes con valores');
    }
  
    if (mode === 'percentage') {
      const total = participants.reduce((acc, p) => acc + (p.value ?? 0), 0);
      if (total !== 100) throw new Error('Los porcentajes deben sumar 100');
      return participants.map((p) => ({
        userId: p.userId,
        amountOwed: (amount * (p.value ?? 0)) / 100,
      }));
    }
  
    if (mode === 'custom') {
      const total = participants.reduce((acc, p) => acc + (p.value ?? 0), 0);
      if (total !== amount) throw new Error('Los valores deben sumar el total del gasto');
      return participants.map((p) => ({
        userId: p.userId,
        amountOwed: p.value ?? 0,
      }));
    }
  
    throw new Error(`Modo de división no válido: ${mode}`);
  }
  