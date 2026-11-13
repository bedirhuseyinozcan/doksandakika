import { Schema, model, Document } from 'mongoose';

export interface ISupportTicket extends Document {
  companyOrUserName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'Açık' | 'İnceleniyor' | 'Çözüldü';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    companyOrUserName: {
      type: String,
      required: true,
      default: 'Doksan Dakika Oyuncusu',
    },
    userEmail: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'open',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const formatTicketForKora = (doc: ISupportTicket) => ({
  id: doc._id.toString(),
  company_or_user_name: doc.companyOrUserName,
  user_email: doc.userEmail,
  subject: doc.subject,
  message: doc.message,
  status: doc.status,
  admin_notes: doc.adminNotes || null,
  created_at: (doc.createdAt || new Date()).toISOString(),
});

export const SupportTicketModel = model<ISupportTicket>('SupportTicket', SupportTicketSchema);
