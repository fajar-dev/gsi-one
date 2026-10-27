import {
  SurveyRequestEntity,
  SurveyRequestData,
} from '../../src/domain/entities/SurveyRequestEntity';

describe('SurveyRequestEntity', () => {
  const basePending: SurveyRequestData = {
    id: 'SRV-001',
    clientName: 'Budi Santoso',
    companyName: 'PT Maju Jaya',
    phone: '08123456789',
    email: 'budi@majujaya.co.id',
    structureType: 'Bridge Assessment',
    location: 'Samarinda, Kalimantan Timur',
    submittedDate: '24 Jul 2026',
    notes: 'Survey jembatan penyeberangan',
    status: 'pending',
  };

  const baseClaimed: SurveyRequestData = {
    ...basePending,
    id: 'SRV-002',
    status: 'claimed',
    claimedBy: 'Andi (Marketing)',
    claimedAt: '24 Jul',
  };

  describe('Getters', () => {
    it('should expose all properties via getters', () => {
      const entity = new SurveyRequestEntity(basePending);
      expect(entity.id).toBe('SRV-001');
      expect(entity.clientName).toBe('Budi Santoso');
      expect(entity.companyName).toBe('PT Maju Jaya');
      expect(entity.phone).toBe('08123456789');
      expect(entity.email).toBe('budi@majujaya.co.id');
      expect(entity.structureType).toBe('Bridge Assessment');
      expect(entity.location).toBe('Samarinda, Kalimantan Timur');
      expect(entity.submittedDate).toBe('24 Jul 2026');
      expect(entity.notes).toBe('Survey jembatan penyeberangan');
      expect(entity.status).toBe('pending');
    });

    it('should expose claimedBy and claimedAt for claimed entity', () => {
      const entity = new SurveyRequestEntity(baseClaimed);
      expect(entity.claimedBy).toBe('Andi (Marketing)');
      expect(entity.claimedAt).toBe('24 Jul');
    });

    it('should return undefined for claimedBy and claimedAt on pending entity', () => {
      const entity = new SurveyRequestEntity(basePending);
      expect(entity.claimedBy).toBeUndefined();
      expect(entity.claimedAt).toBeUndefined();
    });
  });

  describe('Status methods', () => {
    it('isPending should return true for pending entity', () => {
      const entity = new SurveyRequestEntity(basePending);
      expect(entity.isPending()).toBe(true);
      expect(entity.isClaimed()).toBe(false);
    });

    it('isClaimed should return true for claimed entity', () => {
      const entity = new SurveyRequestEntity(baseClaimed);
      expect(entity.isClaimed()).toBe(true);
      expect(entity.isPending()).toBe(false);
    });
  });

  describe('WhatsApp URL', () => {
    it('should generate correct WhatsApp URL with 62 prefix for 08xx numbers', () => {
      const entity = new SurveyRequestEntity(basePending);
      const url = entity.getWhatsAppUrl();
      expect(url).toContain('https://wa.me/628123456789');
      expect(url).toContain('text=');
      expect(url).toContain('Budi%20Santoso');
    });

    it('should not double-replace phone numbers already starting with 62', () => {
      const entity = new SurveyRequestEntity({
        ...basePending,
        phone: '6281234567890',
      });
      const url = entity.getWhatsAppUrl();
      expect(url).toContain('https://wa.me/6281234567890');
    });
  });

  describe('Phone URL', () => {
    it('should generate correct tel: URI', () => {
      const entity = new SurveyRequestEntity(basePending);
      expect(entity.getPhoneUrl()).toBe('tel:08123456789');
    });
  });
});
