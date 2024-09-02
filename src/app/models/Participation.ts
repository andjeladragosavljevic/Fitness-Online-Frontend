import { PaymentMethod } from './PaymentMethod';
import { Program } from './Program';

export interface Participation {
  userId: number;
  fitnessprogramId: number;
  fitnessprogram: Program;
  paymentMethodId: number;
  participationTime: string;
  paymentMethod: PaymentMethod;
}
