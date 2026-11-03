/**
 * Validasi dan format nomor WhatsApp Indonesia otomatis
 * Menjamin nomor yang tersimpan ke database Firestore rapi, valid, dan berstandar nasional (08xxxxxxxxxx)
 */

export interface WhatsAppValidationResult {
  isValid: boolean;
  rawDigits: string;
  normalizedPhone: string; // e.g. "081234567890"
  formattedDisplay: string; // e.g. "0812-3456-7890"
  providerName?: string;
  errorMessage?: string;
}

export function validateAndFormatWhatsApp(input: string): WhatsAppValidationResult {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      rawDigits: '',
      normalizedPhone: '',
      formattedDisplay: '',
      errorMessage: 'Nomor WhatsApp wajib diisi.',
    };
  }

  // 1. Ekstrak digit murni
  const digits = input.replace(/\D/g, '');

  if (!digits) {
    return {
      isValid: false,
      rawDigits: '',
      normalizedPhone: '',
      formattedDisplay: '',
      errorMessage: 'Hanya boleh berisi angka telepon.',
    };
  }

  // 2. Normalisasi awalan ke format lokal standar (08...)
  let normalized = digits;
  if (normalized.startsWith('62')) {
    normalized = '0' + normalized.slice(2);
  } else if (normalized.startsWith('8')) {
    normalized = '0' + normalized;
  }

  // 3. Format visual otomatis (08xx-xxxx-xxxx)
  let formatted = normalized;
  if (normalized.length > 4) {
    const p1 = normalized.slice(0, 4);
    const p2 = normalized.slice(4, 8);
    const p3 = normalized.slice(8, 13);
    formatted = [p1, p2, p3].filter(Boolean).join('-');
  }

  // 4. Validasi awalan 08 (seluler Indonesia)
  if (!normalized.startsWith('08')) {
    return {
      isValid: false,
      rawDigits: digits,
      normalizedPhone: normalized,
      formattedDisplay: formatted,
      errorMessage: 'Nomor harus dimulai dengan 08 atau +628 (nomor HP/WA Indonesia).',
    };
  }

  // 5. Validasi panjang digit (standar nomor seluler Indonesia 10 - 13 digit)
  if (normalized.length < 10) {
    return {
      isValid: false,
      rawDigits: digits,
      normalizedPhone: normalized,
      formattedDisplay: formatted,
      errorMessage: `Digit belum lengkap (${normalized.length}/10-13 digit).`,
    };
  }

  if (normalized.length > 13) {
    return {
      isValid: false,
      rawDigits: digits,
      normalizedPhone: normalized,
      formattedDisplay: formatted,
      errorMessage: `Digit terlalu panjang (${normalized.length} digit, maksimal 13 digit).`,
    };
  }

  // 6. Deteksi operator telekomunikasi Indonesia
  let providerName = 'Operator Seluler Indonesia';
  const prefix4 = normalized.slice(0, 4);

  if (['0811', '0812', '0813', '0821', '0822', '0823', '0851', '0852', '0853'].includes(prefix4)) {
    providerName = 'Telkomsel (SimPATI / By.U / AS)';
  } else if (['0814', '0815', '0816', '0855', '0856', '0857', '0858'].includes(prefix4)) {
    providerName = 'Indosat Ooredoo (IM3)';
  } else if (['0817', '0818', '0819', '0859', '0877', '0878', '0831', '0832', '0833', '0838'].includes(prefix4)) {
    providerName = 'XL Axiata / AXIS';
  } else if (['0895', '0896', '0897', '0898', '0899'].includes(prefix4)) {
    providerName = 'Tri (3) Indonesia';
  } else if (['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'].includes(prefix4)) {
    providerName = 'Smartfren';
  }

  return {
    isValid: true,
    rawDigits: digits,
    normalizedPhone: normalized,
    formattedDisplay: formatted,
    providerName,
  };
}
